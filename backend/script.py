import json
import subprocess
import datetime
import requests
import sys
import numpy as np
import os
from keras.models import load_model
from music21 import converter, stream, note, chord, instrument
from dotenv import load_dotenv

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
load_dotenv()
model_path = os.getenv("MODEL_PATH")
generated_lofi_midi_folder = os.getenv("GENERATED_LOFI_MIDI_FOLDER")

try:
    print("Loading the model...")
    model = load_model(model_path)
    print("Model loaded successfully")

    midi_file_path = sys.argv[1] if len(sys.argv) > 1 else None
    print(f"Received MIDI file path: {midi_file_path}")

    if midi_file_path:
        print("Parsing the MIDI file...")
        midi_stream = converter.parse(midi_file_path)

        print("Extracting notes and chords...")
        notes = []
        for element in midi_stream.flat:
            if isinstance(element, note.Note):
                notes.append(str(element.pitch))
            elif isinstance(element, chord.Chord):
                notes.append('.'.join(str(n) for n in element.normalOrder))

        print("Generating lo-fi music...")

        # Mapping unique notes and chords to integers from the input notes
        unique_notes = sorted(set(notes))
        note_to_int = {note: i for i, note in enumerate(unique_notes)}
        int_to_note = {i: note for i, note in enumerate(unique_notes)}

        sequence_length = 50
        generated_length = 500  # Reduced generated length

        # Generate lo-fi music sequence
        start_index = np.random.randint(0, max(1, len(notes) - sequence_length))  # Ensure start_index is at least 0
        generated_notes = notes[start_index:start_index + sequence_length]

        # Check if generated_notes is shorter than sequence_length and pad if necessary
        if len(generated_notes) < sequence_length:
            pad_length = sequence_length - len(generated_notes)
            generated_notes = notes[:pad_length] + generated_notes

        for i in range(generated_length):
            input_sequence = [note_to_int[note] for note in generated_notes]
            input_sequence = np.array(input_sequence) / float(len(unique_notes))
            input_sequence = np.reshape(input_sequence, (1, sequence_length, 1))

            # Predict the next note
            predicted_note = model.predict(input_sequence, verbose=0)

            # Ensure the predicted integer is within the valid range
            predicted_index = np.argmax(predicted_note)
            if predicted_index < 0 or predicted_index >= len(int_to_note):
                continue  # Skip this prediction if it's out of range

            # Convert the predicted note to a string note/chord
            next_note = int_to_note[predicted_index]

            # Append the next note to the generated sequence
            generated_notes.append(next_note)

            # Remove the first note to keep the sequence length constant
            generated_notes = generated_notes[1:]

        print("Saving the generated lo-fi music...")
        generated_lofi_stream = stream.Stream()

        for _ in range(5):
            for element in generated_notes:
                if '.' in element:
                    notes_in_chord = element.split('.')
                    chord_notes = []
                    for current_note in notes_in_chord:
                        new_note = note.Note(int(current_note))
                        new_note.storedInstrument = instrument.Piano()
                        chord_notes.append(new_note)
                    new_chord = chord.Chord(chord_notes)
                    generated_lofi_stream.append(new_chord)
                else:
                    new_note = note.Note(element)
                    new_note.storedInstrument = instrument.Piano()
                    generated_lofi_stream.append(new_note)

        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")  # Get current timestamp
        generated_lofi_midi_filename = os.path.join(generated_lofi_midi_folder, f"generated_lofi_music_{timestamp}.mid")

        generated_lofi_stream.write("midi", fp=generated_lofi_midi_filename)

        print(f"Generated lo-fi music saved as {generated_lofi_midi_filename}")

        # Send the generated lo-fi MIDI file to the server
        url = 'http://localhost:5000/receive-data'
        data = {'filePath': generated_lofi_midi_filename}
        
        try:
            response = requests.post(url, json=data)  # Send data as JSON in a POST request
            response_data = response.json()
    
            if response.status_code == 200 and response_data.get('success'):
                print('Lo-fi MIDI file sent to the server successfully!')
            else:
                print('Failed to send the lo-fi MIDI file to the server.')
        except requests.RequestException as e:
            print('Error:', e)

    else:
        print("Error: No MIDI file path received.")

except FileNotFoundError as fnf_error:
    print(f"File not found error: {fnf_error}")
except IndexError as index_error:
    print(f"Index error: {index_error}")
except Exception as e:
    print(f"Error: {e}")
