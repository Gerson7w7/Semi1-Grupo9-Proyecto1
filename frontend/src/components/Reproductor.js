import React, { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "../assets/styles/Reproductor.css";

const AudioPlayer = () => {
  const playerRef = useRef(null);
  const { audioTracks } = ["URL", "URL"]

  useEffect(() => {
    // Inicializa el reproductor cuando el componente esté montado
    playerRef.current = new Plyr("#audio-player", {
      controls: ["play", "progress", "current-time", "mute", "volume"],
    });
  }, []);

  const handlePlayNext = () => {
    
  };

  const handlePlayPrev = () => {
    
  };

  useEffect(() => {
  }, []);

  return (
    <div className="audio-player-container">
      <button className="prev-button" onClick={handlePlayPrev}>
        <img
          class="bi pe-none me-2"
          src="https://www.pngall.com/wp-content/uploads/12/Previous-Button-No-Background.png"
          alt=""
          width="48"
          height="48"
        />
      </button>
      <div className="centered-audio-container">
        <audio id="audio-player" controls>
          <source src={audioTracks} type="audio/mp3" />
        </audio>
      </div>
      <button className="next-button" onClick={handlePlayNext}>
        <img
          class="bi pe-none me-2"
          src="https://www.pngarts.com/files/3/Next-Button-PNG-Free-Download.png"
          alt=""
          width="48"
          height="48"
        />
      </button>
    </div>
  );
};

export default AudioPlayer;