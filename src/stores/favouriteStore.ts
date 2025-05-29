import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FavouriteItem {
  uid: string;            
  id: string;             
  title: string;
  image: string;
  podcastId: string;
  seasonTitle?: string;
  file: string;
  savedAt?: number ;
}

interface FavouritesState {
  favourites: FavouriteItem[];
  toggleFavourite: (item: FavouriteItem) => void;
  isFavourite: (uid: string) => boolean;
  removeFavourite: (uid: string) => void;
  clearFavourites: () => void;}

const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      favourites: [],
      toggleFavourite: (item) => {
  const { favourites } = get();
  const exists = favourites.some((fav) => fav.uid === item.uid);

  if (exists) {
    set({
      favourites: favourites.filter((fav) => fav.uid !== item.uid),
    });
  } else {
    set({
      favourites: [...favourites, { ...item, savedAt: Date.now() }],
    });
  }
},
      isFavourite: (uid) => get().favourites.some((fav) => fav.uid === uid),
      removeFavourite: (uid) =>
        set((state) => ({
          favourites: state.favourites.filter((fav) => fav.uid !== uid),
        })),
        clearFavourites: () => set({ favourites: [] }),
    }),
    {
      name: "favourites-storage",
    }
  )
);

export default useFavouritesStore;
