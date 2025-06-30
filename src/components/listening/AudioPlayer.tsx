// src/components/listening/AudioPlayer.tsx
import { useRef, useState, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Set duration once metadata is loaded
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration);
    const onTimeUpdate = () => setProgress(audio.currentTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    const audio = audioRef.current;
    if (audio) audio.currentTime = time;
    setProgress(time);
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rate = Number(e.target.value);
    const audio = audioRef.current;
    if (audio) audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (sec: number) =>
    `${Math.floor(sec/60)}:${String(Math.floor(sec%60)).padStart(2,'0')}`;

  return (
    <div className="w-full bg-gray-100 p-4 rounded space-y-2">
      <audio ref={audioRef} src={src} />
      <div className="flex items-center space-x-3">
        <button
          onClick={togglePlay}
          className="px-3 py-1 bg-primary text-white rounded"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min={0}
          max={duration}
          value={progress}
          onChange={handleSeek}
          className="flex-1"
        />
        <span className="text-sm">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
        <select
          value={playbackRate}
          onChange={handleRateChange}
          className="border px-2 py-1 rounded text-sm"
        >
          {[0.5,0.75,1,1.25,1.5,2].map((r) => (
            <option key={r} value={r}>{r}×</option>
          ))}
        </select>
      </div>
    </div>
  );
}
