import { useEffect } from 'react';
import {Favourite} from './Favourite';
import {Default} from './Default';
import  useSearchStore  from '../stores/searchStore';

export default function Main() {
  const setListener = useSearchStore(state => state.setListener);

  useEffect(() => {
    // Register a global listener for search from Header
    setListener((term, category) => {
      // You could pass this search term to children via props,
      // or store it in another Zustand store if multiple components need it.
      console.log('Search triggered:', term, category);

      // Optional: store search results or term in another state/store
      // or call an effect here to fetch search results
    });
  }, [setListener]);

  return (
    <main className="flex-1 sm:flex md:grid grid-cols-[1fr_4.0fr] shadow-[8px_8px_20px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,0.05)]">
      {/* Left Sidebar */}
      <Favourite />
      <Default />
    </main>
  );
}
