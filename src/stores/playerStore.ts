import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Episode {
  id: string;
  title: string;
  file: string;
  image: string;
  podcastId: string;
  podcastTitle: string;
  season: number;
  episode: number;
}

interface PlayerStore {
  currentEpisode: Episode | null;
  playlist: Episode[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;

  setEpisode: (episode: Episode, playlist?: Episode[]) => void;
  setPlaylist: (episodes: Episode[], startIndex?: number) => void;
  play: (episode: Episode) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  stop: () => void;

  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;

  setCurrentTime: (time: number) => void;
}

const timeStorageKey = (episodeId: string) => `player-currentTime-${episodeId}`;

const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      currentEpisode: null,
      playlist: [],
      currentIndex: -1,
      isPlaying: false,
      volume: 0.75,
      muted: false,
      currentTime: 0,

      setEpisode: (episode, playlist) => {
        const newPlaylist = playlist ?? get().playlist;
        const index = newPlaylist.findIndex((ep) => ep.id === episode.id);

        let savedTime = 0;
        try {
          const saved = localStorage.getItem(timeStorageKey(episode.id));
          if (saved) {
            const parsed = parseFloat(saved);
            if (!isNaN(parsed)) savedTime = parsed;
          }
        } catch (error) {
  console.error('Failed to get saved time:', error);
}

        set({
          currentEpisode: episode,
          playlist: newPlaylist,
          currentIndex: index >= 0 ? index : -1,
          isPlaying: true,
          currentTime: savedTime,
        });
      },

      setPlaylist: (episodes, startIndex = 0) => {
        const startEpisode = episodes[startIndex] ?? null;

        let savedTime = 0;
        if (startEpisode) {
          try {
            const saved = localStorage.getItem(timeStorageKey(startEpisode.id));
            if (saved) {
              const parsed = parseFloat(saved);
              if (!isNaN(parsed)) savedTime = parsed;
            }
          } catch (error) {
  console.error('Failed to get saved time:', error);
}
        }

        set({
          playlist: episodes,
          currentEpisode: startEpisode,
          currentIndex: startIndex,
          isPlaying: !!startEpisode,
          currentTime: savedTime,
        });
      },

      play: (episode) => {
        get().setEpisode(episode);
      },

      playNext: () => {
        const { playlist, currentIndex } = get();
        const nextIndex = currentIndex + 1;
        if (nextIndex < playlist.length) {
          const nextEpisode = playlist[nextIndex];

          let savedTime = 0;
          try {
            const saved = localStorage.getItem(timeStorageKey(nextEpisode.id));
            if (saved) {
              const parsed = parseFloat(saved);
              if (!isNaN(parsed)) savedTime = parsed;
            }
          } catch (error) {
  console.error('Failed to get saved time:', error);
}

          set({
            currentEpisode: nextEpisode,
            currentIndex: nextIndex,
            isPlaying: true,
            currentTime: savedTime,
          });
        }
      },

      playPrevious: () => {
        const { playlist, currentIndex } = get();
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          const prevEpisode = playlist[prevIndex];

          let savedTime = 0;
          try {
            const saved = localStorage.getItem(timeStorageKey(prevEpisode.id));
            if (saved) {
              const parsed = parseFloat(saved);
              if (!isNaN(parsed)) savedTime = parsed;
            }
          } catch (error) {
  console.error('Failed to get saved time:', error);
}
          set({
            currentEpisode: prevEpisode,
            currentIndex: prevIndex,
            isPlaying: true,
            currentTime: savedTime,
          });
        }
      },

      togglePlay: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
      },

      stop: () => {
        set({ isPlaying: false });
      },

      setVolume: (volume) => {
        set({ volume, muted: volume === 0 });
      },

      setMuted: (muted) => {
        set({ muted });
      },

      toggleMute: () => {
        const { muted, volume } = get();
        if (muted) {
          set({ muted: false, volume: volume || 0.75 });
        } else {
          set({ muted: true, volume: 0 });
        }
      },

      setCurrentTime: (time) => {
        const episodeId = get().currentEpisode?.id;
        if (episodeId) {
          try {
            localStorage.setItem(timeStorageKey(episodeId), time.toString());
          } catch (error) {
  console.error('Failed to get saved time:', error);
}
        }

        set({ currentTime: time });
      },
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        volume: state.volume,
        muted: state.muted,
        currentEpisode: state.currentEpisode,
        playlist: state.playlist,
        currentIndex: state.currentIndex,
        isPlaying: state.isPlaying,
        currentTime: state.currentTime,
      }),
    }
  )
);

export default usePlayerStore;
