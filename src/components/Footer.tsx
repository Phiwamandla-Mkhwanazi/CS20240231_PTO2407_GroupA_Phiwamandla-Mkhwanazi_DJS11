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
    setCurrentTime,          // <<< added this
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

  // Sync audio volume/mute with store
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

        // <<< SAVE playback position here!
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

  // Load new episode audio and reset progress + seek to stored currentTime
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !file || !currentEpisode) return;

    audio.src = file;
    audio.load();

    // On new episode, seek audio to saved currentTime from store
    audio.currentTime = usePlayerStore.getState().currentTime || 0;

    setProgress((audio.currentTime / audio.duration) * 100 || 0);
  }, [file, currentEpisode]);

  // Play/pause audio on isPlaying changes
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
    <footer className="w-full bg-[#595959] text-white border-t border-white/10 px-6 py-2 sm:grid grid-cols-1 md:grid-cols-[1fr_3fr_1fr] gap-4 items-center text-sm">
      <audio ref={audioRef} preload="metadata" />

      {/* Left - Podcast image and title */}
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={title}
          className="w-12 h-12 rounded-md object-cover"
          loading="lazy"
        />
        <div>
          <h1 className="text-base truncate max-w-[200px] ">{title}</h1>
          <p className="opacity-70">{description}</p>
        </div>
      </div>

   {/* Center - Playback controls + progress */}
<div className="flex flex-col gap-1">
  <div className="flex justify-center gap-6 items-center">
    <button
      title="Skip Back 10s"
      className="hover:text-[#89AC46] text-[#d4d0d0]"
      onClick={() => skip(-10)}
    >
      <SkipBackIcon />
    </button>

    <button
      title={isPlaying ? 'Pause' : 'Play'}
      onClick={togglePlay}
      className="hover:text-[#89AC46] text-[#d4d0d0]"
    >
      {isPlaying ? <PauseIcon  /> : <PlayIcon  />}
    </button>

    <button
      title="Skip Forward 10s"
      className="hover:text-[#89AC46] text-[#d4d0d0]"
      onClick={() => skip(10)}
    >
      <SkipForwardIcon  />
    </button>
  </div>

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
    className="w-full h-[3px] accent-[#89AC46] bg-gray-600 rounded-full cursor-pointer"
  />
</div>


      {/* Right - Volume */}
<div className="flex items-center gap-4 justify-end">
  <button
    title={muted ? 'Unmute' : 'Mute'}
    onClick={toggleMute}
    className="hover:text-[#89AC46] text-[#d4d0d0]"
  >
    {muted || volume === 0 ? (
      <VolumeDownIcon />
    ) : (
      <VolumeUpIcon  />
    )}
  </button>
  <input
    aria-label="Volume"
    type="range"
    min={0}
    max={100}
    step={1}
    value={muted ? 0 : volume * 100}
    onChange={handleVolumeChange}
    className="w-20 h-[3px] accent-[#89AC46] bg-gray-600 rounded-full cursor-pointer"
  />
</div>

    </footer>
  );
}
