import { useEffect, useRef, useState, useCallback } from 'react';
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeDownIcon,
  VolumeUpIcon,
} from '../components/Icons';
import usePlayerStore from '../stores/playerStore';
import podImage from '../assets/img/podcast-neon-sign-glowing-studio-microphone-icon-vector-31076255.jpg';

function formatTime(seconds: number): string {
  if (!seconds || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function Footer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentEpisode,
    isPlaying,
    togglePlay,
    stop,
    volume,
    muted,
    setVolume,
    toggleMute,
    setCurrentTime,
  } = usePlayerStore();

  const seasonEpisode = currentEpisode?.id?.split('-') || ['0', '0', '0'];

  const {
    file = currentEpisode?.file,
    title = currentEpisode?.title,
    description = `S${seasonEpisode[1]} - E${1 + Number(seasonEpisode[2])}`,
    image = currentEpisode?.image || podImage,
  } = currentEpisode || {};

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value) / 100;
      setVolume(newVolume);
      if (newVolume > 0 && muted) {
        toggleMute();
      }
    },
    [setVolume, muted, toggleMute]
  );

  const handleProgressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    setSeeking(true);
  }, []);

  const handleSeekEnd = useCallback(() => {
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = (progress / 100) * duration;
    }
    setSeeking(false);
  }, [progress, duration]);

  const skip = useCallback(
    (seconds: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = Math.min(
          Math.max(0, audioRef.current.currentTime + seconds),
          duration
        );
      }
    },
    [duration]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!seeking && audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => stop();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [seeking, stop, setCurrentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !file || !currentEpisode) return;

    audio.src = file;
    audio.load();
    audio.currentTime = usePlayerStore.getState().currentTime || 0;
    setProgress((audio.currentTime / audio.duration) * 100 || 0);
  }, [file, currentEpisode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode) return;

    if (isPlaying) {
      audio
        .play()
        .catch((err) => {
          console.warn('Autoplay blocked or error:', err);
          stop();
        });
    } else {
      audio.pause();
    }
  }, [isPlaying, stop, currentEpisode]);

  return (
    <footer className="w-full bg-zinc-200 text-white border-t border-white/10 px-4 sm:px-6 py-2  
      flex flex-col sm:grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-1 items-center text-sm">

      <audio ref={audioRef} preload="metadata" />

      {/* Left - Episode Info */}
      <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
        <img
          src={image}
          alt={title}
          className="w-12 h-12 rounded-md object-cover flex-shrink-0"
          loading="lazy"
        />
        <div className="overflow-hidden">
          <h1 className="text-base truncate max-w-[160px] sm:max-w-[200px] text-[#595959]">{title}</h1>
          <p className="opacity-70 text-xs sm:text-sm truncate max-w-[250px] sm:max-w-[250px] text-[#595959]">
            {description}
          </p>
        </div>
      </div>

      {/* Center - Controls and Progress */}
      <div className="flex flex-col gap-2 w-full max-w-xl mx-auto px-2">
        {/* Controls */}
        <div className="flex justify-center gap-16 items-center">
          <button
            title="Skip Back 10s"
            className="hover:text-[#89AC46] text-[#595959]"
            onClick={() => skip(-10)}
          >
            <SkipBackIcon />
          </button>

          <button
            title={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
            className="hover:text-[#89AC46] text-[#595959]"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            title="Skip Forward 10s"
            className="hover:text-[#89AC46] text-[#595959]"
            onClick={() => skip(10)}
          >
            <SkipForwardIcon />
          </button>
        </div>

        {/* Time and Seek */}
        <div className="flex items-center gap-2 sm:gap-3 mt-1">
          <span className="text-xs sm:text-sm text-[#595959] w-10 sm:w-12 tabular-nums flex-shrink-0">
            {formatTime((progress / 100) * duration)}
          </span>

          <input
            aria-label="Seek"
            type="range"
            min={0}
            max={100}
            step={0.01}
            value={progress}
            onChange={handleProgressChange}
            onMouseUp={handleSeekEnd}
            onTouchEnd={handleSeekEnd}
            className="flex-grow h-2 sm:h-[3px] accent-[#89AC46] bg-gray-600 rounded-full cursor-pointer"
          />

          <span className="text-xs sm:text-sm text-[#595959] w-10 sm:w-12 tabular-nums ml-1 sm:ml-2 flex-shrink-0">
            -{formatTime(duration - (progress / 100) * duration)}
          </span>
        </div>
      </div>

      {/* Right - Volume */}
      <div className="hidden md:flex items-center gap-4 justify-end min-w-[120px]">
        <button
          title={muted ? 'Unmute' : 'Mute'}
          onClick={toggleMute}
          className="hover:text-[#89AC46] text-[#595959]"
        >
          {muted || volume === 0 ? <VolumeDownIcon /> : <VolumeUpIcon />}
        </button>
        <input
          aria-label="Volume"
          type="range"
          min={0}
          max={100}
          step={1}
          value={muted ? 0 : volume * 100}
          onChange={handleVolumeChange}
          className="w-16 sm:w-20 h-[3px] accent-[#89AC46] bg-gray-600 rounded-full cursor-pointer"
        />
      </div>
    </footer>
  );
}
