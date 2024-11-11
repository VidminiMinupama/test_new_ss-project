import React, { useState } from 'react';
import './home.css';



function Home() {
    const [isPlaying, setIsPlaying] = useState(false);
  
    // Toggle play/pause
    const togglePlayPause = () => {
      const audio = document.getElementById('mySong');
      if (audio.paused) {
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      } else {
        audio.pause();
      }
      setIsPlaying(!isPlaying);
    };
  
    return (
      <div className="container">
        <div className="navbar">
          <img src="logo.png" alt="Logo" className="logo" />
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Specification</a></li>
            <li><a href="#">Products</a></li>
            <li><a href="#">Connect</a></li>
          </ul>
        </div>
  
        <div className="content">
          <div className="left-col">
            <h1>THE<br /> REAL<br /> SOUND</h1>
          </div>
          <div className="right-col">
            <p>Click Here To Listen</p>
            <img 
              src={isPlaying ? "pause.png" : "play.png"} 
              alt="Play/Pause Icon" 
              id="icon" 
              onClick={togglePlayPause} 
            />
          </div>
        </div>
  
        <audio id="mySong">
          <source src="Alan Walker, Sabrina Carpenter & Farruko - On My Way.mp3" type="audio/mp3" />
        </audio>
      </div>
    );
  }
  
  export default Home;
  