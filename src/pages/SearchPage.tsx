import { useSearchParams } from 'react-router-dom';

import Search from '../components/Search';


function SearchPage() {

  const [params] = useSearchParams();
  const term = params.get('term') || '';
  const category = params.get('category') || 'All Departments';

  return (
            <Search term={term} category={category}/>
  );
}

export default SearchPage;