import React, { useState } from "react";
import Modal from "react-modal";
import Nav from "./components/Nav";
import MP3Playlist from "./components/MusicPlaylist/Mp3Playlist";
import LoFiMusicCustomizer from "./components/MusicCustomizer/Customizer";
import "./custom.css"; // Import the CSS file

Modal.setAppElement("#root"); // Set the root element for the modal

function App() {
  const [showCustomizer, setShowCustomizer] = useState(false);

  const openCustomizer = () => {
    setShowCustomizer(true);
  };

  const closeCustomizer = () => {
    setShowCustomizer(false);
  };

  return (
    <div>
      <Nav />
      <marquee className="custom-marquee">Chill out with our lo-fi beats and relax your mind 🎶</marquee>
      <div className="customizer-btn-container">
      <button className="customizer-btn" onClick={openCustomizer}>
  <i className="fas fa-cogs"></i> {/* Font Awesome gear icon */}
  Open Customizer
</button>

      </div>
      <MP3Playlist />

      <Modal
        isOpen={showCustomizer}
        onRequestClose={closeCustomizer}
        contentLabel="Customizer Modal"
        className="customizer-modal"
        overlayClassName="customizer-overlay"
      >
        <LoFiMusicCustomizer />
        <button onClick={closeCustomizer}>Close Customizer</button>
      </Modal>
    </div>
  );
}

export default App;
