import { useEffect } from 'react';
import usePlayerStore from '../stores/playerStore';

export default function ExitWarning() {
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPlaying) {
        e.returnValue = 'You have playback in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isPlaying]);

  return null;
}
