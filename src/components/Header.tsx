import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchResults from "../components/Search";
import Logo from '../assets/img/ImgIcon.png';
import useSearchStore from "../stores/searchStore";  

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Departments");
  const [showResults, setShowResults] = useState(false);

  const setSearch = useSearchStore((s) => s.setSearch); 
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearch(searchTerm, category); 
      navigate(`/search?term=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}`);
    }
  };

  const handleCloseResults = () => setShowResults(false);

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 px-4 py-2.5 bg-white/10 backdrop-blur-md shadow-sm border-b border-white/10 max-w-screen-3xl">
        
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img src={Logo} className="h-10" alt="PodSeekers Logo" />
          <h1 className="text-xl font-bold tracking-wide text-gray-900 dark:text-[#595959]">
            PodSeekers
          </h1>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-3 bg-white/90 px-4 py-1 rounded-full shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-[#89AC46] transition-all duration-200 w-full md:w-auto md:max-w-3xl 2xl:max-w-6xl flex-1"
        >
          <select
            name="categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent text-[#595959] text-sm font-medium px-2 py-1 rounded-md focus:outline-none"
          >
            {[
              "All Departments", "Personal Growth", "Investigative Journalism",
              "History", "Comedy", "Entertainment", "Business",
              "Fiction", "News", "Kids and Family"
            ].map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <input
            type="search"
            placeholder="Search for podcasts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[8rem] bg-transparent text-sm text-[#595959] placeholder-gray-400 px-2 py-1 border-l border-gray-300 focus:outline-none"
            aria-label="Search podcasts"
          />

          <button
            type="submit"
            className="bg-[#89AC46] hover:bg-[#76a13e] text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md hover:shadow-lg transition"
          >
            Search
          </button>
        </form>

        {/* Auth Button */}
        <button
          className="sm:flex md:hidden xl:flex items-center gap-2 bg-[#89AC46] hover:bg-[#76a13e] text-white font-medium px-4 py-1 rounded-full shadow hover:shadow-md transition"
          title="Login/Register"
        >
          <i className="material-icons text-base" aria-hidden="true">lock_open</i>
          Sign in
        </button>

      </header>

      {/* Conditional Search Results */}
      {showResults && (
        <SearchResults
          term={searchTerm}
          category={category}
          onClose={handleCloseResults}
        />
      )}
    </>
  );
}
