import { create } from "zustand";
import { persist } from "zustand/middleware";

// Defines the structure of a favourite item stored in the favourites list
export interface FavouriteItem {
  uid: string;          // Unique identifier for this favourite item            
  id: string;           // Original item ID (e.g., episode or podcast ID)             
  title: string;        // Title of the favourite item
  image: string;        // Image URL for the item
  podcastId: string;    // Associated podcast ID
  seasonTitle?: string; // Optional season title if applicable
  file: string;         // Media file URL or identifier
  savedAt?: number ;    // Timestamp when item was saved as favourite
}

// Interface defining the state and actions for favourites management
interface FavouritesState {
  favourites: FavouriteItem[];                      // Array of favourite items
  toggleFavourite: (item: FavouriteItem) => void;   // Add or remove item from favourites
  isFavourite: (uid: string) => boolean;            // Check if an item is favourited by UID
  removeFavourite: (uid: string) => void;           // Remove an item by UID
  clearFavourites: () => void;}                     // Clear all favourites

// Create Zustand store with persistence for favourites
const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      favourites: [], // Initial empty favourites list
      
      // Toggles an item in favourites: adds if not present, removes if already favourited
      toggleFavourite: (item) => {
  const { favourites } = get();
  const exists = favourites.some((fav) => fav.uid === item.uid);

  if (exists) {// Remove the item if it exists
    set({
      favourites: favourites.filter((fav) => fav.uid !== item.uid),
    });
  } else {// Add the item with a saved timestamp if it does not exist
    set({
      favourites: [...favourites, { ...item, savedAt: Date.now() }],
    });
  }
},
      // Returns true if an item with the given UID is in favourites
      isFavourite: (uid) => get().favourites.some((fav) => fav.uid === uid),
      // Removes a specific favourite item by UID
      removeFavourite: (uid) =>
        set((state) => ({
          favourites: state.favourites.filter((fav) => fav.uid !== uid),
        })),
        // Clears the entire favourites list
        clearFavourites: () => set({ favourites: [] }),
    }),
    {
      name: "favourites-storage", // Key for persisted storage in localStorage
    }
  )
);

export default useFavouritesStore;
