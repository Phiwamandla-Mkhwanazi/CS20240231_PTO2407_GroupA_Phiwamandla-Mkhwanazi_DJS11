import { create } from 'zustand';

// Define the shape of the store's state and actions
type SearchStore = {
  term: string; // The current search term
  category: string; // The current selected category
  setSearch: (term: string, category: string) => void; // Updates search term and category, notifies listener
  listener: ((term: string, category: string) => void) | null; // Optional callback that runs on search change
  setListener: (cb: (term: string, category: string) => void) => void; // Set the callback listener
};

// Create the Zustand store
const useSearchStore = create<SearchStore>((set) => ({
  term: '', // Initial search term
  category: '', // Initial category
  // Function to update the search term and category
  setSearch: (term, category) => {
    set({ term, category });
    const listener = useSearchStore.getState().listener;
    if (listener) listener(term, category);
  },
  listener: null, // No listener by default
  // Function to set the listener callback
  setListener: (cb) => set({ listener: cb }),
}));

export default useSearchStore;
