import React, { useEffect, useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import music2 from '../../images/music3.gif';
import './style.css';

const MP3Playlist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [audioFile, setAudioFile] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const fetchPlaylist = async () => {
    try {
      const response = await fetch('/api/playlist',{
        headers: {
          'ngrok-skip-browser-warning': '34'
        }
      });
      const data = await response.json();
      setPlaylist(data.playlist);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchPlaylist();

    const refreshInterval = setInterval(() => {
      fetchPlaylist();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(refreshInterval); // Clear interval on component unmount
  }, []);

  const fetchAudioBlob = async (mp3File) => {
    const response = await fetch(`/api/play?file=${encodeURIComponent(mp3File)}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  const playAudio = async (mp3File, index) => {
    const audioBlobUrl = await fetchAudioBlob(mp3File);
    setAudioFile(audioBlobUrl);
    setIsPlaying(true);
    setCurrentTrackIndex(index);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="mp3-container">
      <div className="playlist-container">
        <div className="playlist">
          {playlist.map((mp3File, index) => (
            <div key={index} className="playlist-item" onClick={() => playAudio(mp3File, index)}>
              <img src={music2} alt={`Track ${index + 1}`} />
              <span>{`Track ${index + 1}: ${mp3File}`}</span>
              <button className="download-button" onClick={(e) => { e.preventDefault(); window.location.href = `/api/download?file=${encodeURIComponent(mp3File)}`; }}>
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <AudioPlayer
        src={audioFile || ''}
        autoPlayAfterSrcChange={false}
        customAdditionalControls={[
          <div>
            {isPlaying && currentTrackIndex !== null && (
              <div className="now-playing">
                Now Playing: Track {currentTrackIndex + 1}
              </div>
            )}
          </div>
        ]}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeking={(e) => setCurrentTime(e.target.currentTime)}
        currentTime={currentTime}
        style={{
          width: '50%',
          margin: '0 auto',
          marginTop: '22%',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          color: 'white',
          borderRadius: '10px',
        }}
      />
    </div>
  );
};

export default MP3Playlist;
