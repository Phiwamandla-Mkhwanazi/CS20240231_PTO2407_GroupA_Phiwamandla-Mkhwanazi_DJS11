import { useEffect } from 'react';
import usePlayerStore from '../stores/playerStore';

export default function ExitWarning() {
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome to show confirmation dialog
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPlaying]);

  return null; // This component does not render anything
}
