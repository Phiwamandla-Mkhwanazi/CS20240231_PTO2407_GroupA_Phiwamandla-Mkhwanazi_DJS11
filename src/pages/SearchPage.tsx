// Import hook for reading URL query parameters from React Router
import { useSearchParams } from 'react-router-dom';

// Import the Search component which displays search results
import Search from '../components/Search';

function SearchPage() {
  // useSearchParams returns a stateful URLSearchParams object
  const [params] = useSearchParams();

  // Extract 'term' and 'category' query parameters from the URL
  const term = params.get('term') || '';                     // Default to empty string if not present
  const category = params.get('category') || 'All Departments'; // Default to 'All Departments' if not present

  // Handler for closing the search view — currently just logs to console
  const handleCloseSearch = () => {
    // logic to hide or reset the Search component
    console.log("Closing search");
  };

  return (
    // Render Search component with parsed query parameters and close handler
    <Search term={term} category={category} onClose={handleCloseSearch} />
  );
}

export default SearchPage;
