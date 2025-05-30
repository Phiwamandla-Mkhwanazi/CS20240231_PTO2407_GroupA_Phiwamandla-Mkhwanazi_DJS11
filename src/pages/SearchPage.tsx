import { useSearchParams } from 'react-router-dom';

import Search from '../components/Search';


function SearchPage() {

  const [params] = useSearchParams();
  const term = params.get('term') || '';
  const category = params.get('category') || 'All Departments';

  const handleCloseSearch = () => {
  // logic to hide or reset the Search component
  console.log("Closing search");
};
  return (
            <Search term={term} category={category} onClose={handleCloseSearch}/>
  );
}

export default SearchPage;