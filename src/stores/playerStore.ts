import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Defines the structure of a podcast episode object
export interface Episode {
  id: string;
  title: string;
  file: string;
  image: string;
  podcastId: string;
  podcastTitle: string;
  season: number;
  episode: number;
  description?: string; 
}

// Interface describing the player store state and actions
interface PlayerStore {
  currentEpisode: Episode | null;   // Currently playing episode or null if none
  playlist: Episode[];              // List of episodes in the current playlist
  currentIndex: number;             // Index of the current episode in the playlist
  isPlaying: boolean;               // Whether the player is currently playing
  volume: number;                   // Volume level (0 to 1)   
  muted: boolean;                   // Whether the player is muted
  currentTime: number;              // Playback position (seconds) in current episode

    // Actions to control playback and state
  setEpisode: (episode: Episode, playlist?: Episode[]) => void; // Set current episode (optionally with a playlist)
  setPlaylist: (episodes: Episode[], startIndex?: number) => void;  // Set current episode (optionally with a playlist) 
  play: (episode: Episode) => void; // Play a specific episode (adds to playlist if needed)
  playNext: () => void;             // Play next episode in playlist
  playPrevious: () => void;         // Play previous episode in playlist
  togglePlay: () => void;           // Toggle play/pause
  stop: () => void;                 // Stop playback

  setVolume: (volume: number) => void;  // Set volume level
  toggleMute: () => void;               // Toggle mute state
  setMuted: (muted: boolean) => void;   // Explicitly set muted state

  setCurrentTime: (time: number) => void;   // Set playback time (in seconds)
}

// Helper function to create localStorage key for saving current playback time per episode
const timeStorageKey = (episodeId: string) => `player-currentTime-${episodeId}`;

// Zustand store for player state with persistence
const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
    // Initial/default state values
      currentEpisode: null,
      playlist: [],
      currentIndex: -1,
      isPlaying: false,
      volume: 0.75,
      muted: false,
      currentTime: 0,

    // Set current episode and optionally update playlist, restore saved playback time
      setEpisode: (episode, playlist) => {
        const newPlaylist = playlist ?? get().playlist;
        const index = newPlaylist.findIndex((ep) => ep.id === episode.id);

    // Try to load saved playback time for this episode from localStorage
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

        // Update store state with episode, playlist, index, play status, and restored time
        set({
          currentEpisode: episode,
          playlist: newPlaylist,
          currentIndex: index >= 0 ? index : -1,
          isPlaying: true,
          currentTime: savedTime,
        });
      },

     // Set the entire playlist and optionally start playback from a specific index
      setPlaylist: (episodes, startIndex = 0) => {
        const startEpisode = episodes[startIndex] ?? null;

        // Attempt to restore playback time for the starting episode
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

        // Update store state with new playlist and playback info
        set({
          playlist: episodes,
          currentEpisode: startEpisode,
          currentIndex: startIndex,
          isPlaying: !!startEpisode,
          currentTime: savedTime,
        });
      },

        // Play a specific episode by setting it as current
      play: (episode) => {
        get().setEpisode(episode);
      },

        // Play next episode in the playlist, restore saved playback time if available
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

      // Play previous episode in the playlist, restore saved playback time if available
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

      // Toggle playback (play/pause)
      togglePlay: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
      },

      // Stop playback
      stop: () => {
        set({ isPlaying: false });
      },

      // Set volume and automatically mute if volume is 0
      setVolume: (volume) => {
        set({ volume, muted: volume === 0 });
      },

      // Explicitly set muted state
      setMuted: (muted) => {
        set({ muted });
      },

        // Toggle mute; if muted, restore volume or set default 0.75; else mute and set volume 0
      toggleMute: () => {
        const { muted, volume } = get();
        if (muted) {
          set({ muted: false, volume: volume || 0.75 });
        } else {
          set({ muted: true, volume: 0 });
        }
      },

        // Set playback current time and persist it to localStorage for resume functionality
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
    {  // Configuration for persistence: store key and what parts of state to persist
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
