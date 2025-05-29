import { create } from 'zustand';

type SearchStore = {
  term: string;
  category: string;
  setSearch: (term: string, category: string) => void;
  listener: ((term: string, category: string) => void) | null;
  setListener: (cb: (term: string, category: string) => void) => void;
};

const useSearchStore = create<SearchStore>((set) => ({
  term: '',
  category: '',
  setSearch: (term, category) => {
    set({ term, category });
    const listener = useSearchStore.getState().listener;
    if (listener) listener(term, category);
  },
  listener: null,
  setListener: (cb) => set({ listener: cb }),
}));

export default useSearchStore;
