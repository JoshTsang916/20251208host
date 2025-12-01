import React, { useState, useRef } from 'react';

export default function MusicPlayer() {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);

    // Using a royalty-free Lo-Fi track (Example)
    const trackUrl = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112762.mp3";

    const togglePlay = () => {
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <audio ref={audioRef} src={trackUrl} loop />
            <button
                onClick={togglePlay}
                className={`p-3 rounded-full shadow-lg transition-all ${playing ? 'bg-purple-600 text-white animate-pulse' : 'bg-white text-gray-800'}`}
            >
                {playing ? '🎵 Playing Lo-Fi' : '▶️ Play Music'}
            </button>
        </div>
    );
}
