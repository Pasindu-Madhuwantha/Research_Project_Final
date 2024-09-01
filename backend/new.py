import sys
import io
import os
import requests
import subprocess
import datetime
import uuid
from pydub import AudioSegment
from dotenv import load_dotenv

load_dotenv()
# Function to load audio from URL
def load_audio_from_url(url):
    response = requests.get(url)
    if response.status_code == 200:
        audio_data = io.BytesIO(response.content)
        audio = AudioSegment.from_file(audio_data)
        return audio
    else:
        return None

def main():
    try:
        # Retrieve command line arguments
        filePath = sys.argv[1]
        weatherSound = sys.argv[2]
        drumsSound = sys.argv[3]
        vinylSound = sys.argv[4]

        # Use the received arguments as needed
        print("Received filePath:", filePath)
        print("Received weatherSound:", weatherSound)
        print("Received drumsSound:", drumsSound)
        print("Received vinylSound:", vinylSound)

        # Load the audio files from URLs
        weather_sound = load_audio_from_url(weatherSound)
        drums_sound = load_audio_from_url(drumsSound)
        vinyl_sound = load_audio_from_url(vinylSound)

        if not all([weather_sound, drums_sound, vinyl_sound]):
            print("Failed to load audio from one or more URLs.")
            return

        # Download the SoundFont file
        
        soundfont_path = os.getenv("SOUNDFONT_PATH")
        output_wav_folder = os.getenv("OUTPUT_WAV_FOLDER")
        fluidsynth_path = os.getenv("FLUIDSYNTH_PATH")
        output_mp3_folder = os.getenv("OUTPUT_MP3_FOLDER")

        # Generate timestamp and unique ID for the output file
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        unique_id = uuid.uuid4().hex[:8]  # Using the first 8 characters of a UUID as an ID

        # Construct the output file path with timestamp and unique ID
        # Construct the output WAV file path
        output_wav_file = os.path.join(output_wav_folder, f"generated_lofi_music_{timestamp}_{unique_id}.wav")


        midi_file = filePath

        subprocess.run([fluidsynth_path, "-ni", soundfont_path, midi_file, "-F", output_wav_file])

        # Load the generated WAV file
        generated_music = AudioSegment.from_wav(output_wav_file)

        # Get the duration of the generated music
        generated_duration = len(generated_music)

        # Loop the additional sounds to match the duration of the generated music
        weather_sound = weather_sound * (generated_duration // len(weather_sound) + 1)
        drums_sound = drums_sound * (generated_duration // len(drums_sound) + 1)
        vinyl_sound = vinyl_sound * (generated_duration // len(vinyl_sound) + 1)

        # Trim the additional sounds to match the duration of the generated music exactly
        weather_sound = weather_sound[:generated_duration]
        drums_sound = drums_sound[:generated_duration]
        vinyl_sound = vinyl_sound[:generated_duration]

        # Adjust the volume of additional sounds or the main WAV file (adjust the dB value as needed)
        generated_music = generated_music + 10  # Increase main audio volume by 10 dB
        weather_sound = weather_sound - 5  # Decrease weather sound volume by 5 dB
        drums_sound = drums_sound - 10  # Decrease drums sound volume by 10 dB

        # Find the starting point of the drumbeat audio to align with the start of the generated music
        # Calculate the difference in duration between the drums_sound and generated_music
        duration_difference = len(generated_music) - len(drums_sound)

        # If there's a difference, adjust the starting point of the drums_sound to align it
        if duration_difference > 0:
            drums_sound = AudioSegment.silent(duration=duration_difference) + drums_sound
        elif duration_difference < 0:
            drums_sound = drums_sound[-duration_difference:]

        # Concatenate the first 5 seconds of vinyl sound at the beginning
        combined = vinyl_sound[:5000] + generated_music.overlay(weather_sound)
        combined = combined.overlay(drums_sound)

        # Export the combined audio as an MP3 file
        output_mp3_file = os.path.join(output_mp3_folder, f"generated_lofi_track_{timestamp}_{unique_id}.mp3")
        combined.export(output_mp3_file, format="mp3")
        print("Final mp3 path:", output_mp3_file)
        
        # Sending path back to the server
        server_url = 'http://localhost:5000/receive-final-path'
        data = {'filePath2': output_mp3_file}

        try:
            response = requests.post(server_url, json=data)  # Send data as JSON in a POST request
            response_data = response.json()
            
            if response.status_code == 200 and response_data.get('success'):
                print('Lo-fi mp3 file sent to the server successfully!')
            else:
                print('Failed to send the lo-fi mp3 file to the server. Server response:', response.text)
        except requests.RequestException as e:
            print('Error:', e)

    except Exception as ex:
        print('An exception occurred before reaching the main logic:', ex)

if __name__ == "__main__":
    main()
