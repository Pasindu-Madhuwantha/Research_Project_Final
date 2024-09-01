import React, { useState, useEffect } from 'react';
import './LoFiMusicCustomizer.css';

const LoFiMusicCustomizer = () => {
  const [vinyls, setVinyls] = useState([]);
  const [drums, setDrums] = useState([]);
  const [weather, setWeather] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [isMidiFileSelected, setIsMidiFileSelected] = useState(false);
  const [fileTypeError, setFileTypeError] = useState(false);

  const fetchPaths = async () => {
    try {
      const vinylsResponse = await fetch('/api/vinyls');
      const vinylsData = await vinylsResponse.json();
      setVinyls(vinylsData.paths);

      const drumsResponse = await fetch('/api/drums');
      const drumsData = await drumsResponse.json();
      setDrums(drumsData.paths);

      const weatherResponse = await fetch('/api/weather');
      const weatherData = await weatherResponse.json();
      setWeather(weatherData.paths);
    } catch (error) {
      console.error('Error fetching paths:', error);
    }
  };

  useEffect(() => {
    fetchPaths();
  }, []);

  const defaultWeatherSound = weather.length > 0 ? weather[0] : "";
  const defaultDrumsSound = drums.length > 0 ? drums[0] : "";
  const defaultVinylSound = vinyls.length > 0 ? vinyls[0] : "";

  const [weatherSound, setWeatherSound] = useState(defaultWeatherSound);
  const [drumsSound, setDrumsSound] = useState(defaultDrumsSound);
  const [vinylSound, setVinylSound] = useState(defaultVinylSound);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== 'audio/mid') {
      setFileTypeError(true);
      setIsMidiFileSelected(false);
    } else {
      setFileTypeError(false);
      setIsMidiFileSelected(!!file);
      // Handle file upload logic if needed
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    setShowMessage(true);
  
    // Set default values for sounds if they are not selected
    const updatedWeatherSound = weatherSound || defaultWeatherSound;
    const updatedDrumsSound = drumsSound || defaultDrumsSound;
    const updatedVinylSound = vinylSound || defaultVinylSound;
  
    const formData = new FormData();
    formData.append('midiFile', event.target.elements.midiFile.files[0]);
    formData.append('weatherSound', updatedWeatherSound);
    formData.append('drumsSound', updatedDrumsSound);
    formData.append('vinylSound', updatedVinylSound);
  
    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Handle success if needed
    } catch (error) {
      console.error('Error:', error);
      // Handle errors
    } finally {
      setTimeout(() => {
        setShowMessage(false);
      }, 15000);
    }
  };

  useEffect(() => {
    let timeoutId;

    if (showMessage) {
      timeoutId = setTimeout(() => {
        setShowMessage(false);
      }, 15000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showMessage]);

  return (
    <div className="lofi-music-customizer-container">
      <h1>Customize Lo-Fi Music</h1>

      {fileTypeError && (
        <div className="error-message">
          Please select a MIDI file.
        </div>
      )}

      <form className="upload-form" onSubmit={handleFormSubmit} encType="multipart/form-data">
        <input type="file" name="midiFile" accept=".mid" onChange={handleFileChange} />
        {isMidiFileSelected && <button type="submit">Upload MIDI File</button>}
        <input type="hidden" name="weatherSound" value={weatherSound} />
        <input type="hidden" name="drumsSound" value={drumsSound} />
        <input type="hidden" name="vinylSound" value={vinylSound} />
      </form>

      {showMessage && (
        <div className="message-box highlight">
          <p>Lofi is generating, please check the playlist after 2-3 minutes</p>
        </div>
      )}

      <label htmlFor="weatherSelect">Select Weather Sound:</label>
      <select id="weatherSelect" value={weatherSound} onChange={(e) => setWeatherSound(e.target.value)}>
        {weather.map((path, index) => (
          <option key={index} value={path}>{`Weather Sound ${index + 1}`}</option>
        ))}
      </select>

      <label htmlFor="drumsSelect">Select Drums Sound:</label>
      <select id="drumsSelect" value={drumsSound} onChange={(e) => setDrumsSound(e.target.value)}>
        {drums.map((path, index) => (
          <option key={index} value={path}>{`Drums Sound ${index + 1}`}</option>
        ))}
      </select>

      <label htmlFor="vinylSelect">Select Vinyl Sound:</label>
      <select id="vinylSelect" value={vinylSound} onChange={(e) => setVinylSound(e.target.value)}>
        {vinyls.map((path, index) => (
          <option key={index} value={path}>{`Vinyl Sound ${index + 1}`}</option>
        ))}
      </select>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.37/Tone.js"></script>
    </div>
  );
};

export default LoFiMusicCustomizer;
