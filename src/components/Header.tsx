import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchResults from "../components/Search";
import Logo from '../assets/img/ImgIcon.png';
import useSearchStore from "../stores/searchStore";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Departments");
  const [showResults, setShowResults] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const setSearch = useSearchStore((s) => s.setSearch);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearch(searchTerm, category);
      navigate(`/search?term=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}`);
      setMenuOpen(false);
    }
  };

  const handleCloseResults = () => setShowResults(false);

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 px-4 py-2.5 bg-white/10 backdrop-blur-md shadow-sm border-b border-white/10 max-w-screen-3xl w-full">
        
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img src={Logo} className="h-10" alt="PodSeekers Logo" />
          <h1 className="text-xl font-bold tracking-wide text-gray-900 dark:text-[#595959]">
            PodSeekers
          </h1>
        </div>

        {/* Burger menu (small screens only) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-gray-700 dark:text-gray-300 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop search + auth */}
        <div className="hidden md:flex items-center gap-4 flex-1">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-3 bg-white/90 px-4 py-1 rounded-full shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-[#89AC46] transition-all duration-200 w-full md:w-auto md:max-w-3xl 2xl:max-w-6xl flex-1"
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

          <button
            className="items-center gap-2 bg-[#89AC46] hover:bg-[#76a13e] text-white font-medium px-4 py-1 rounded-full shadow hover:shadow-md transition"
            title="Login/Register"
          >
            <i className="material-icons text-base" aria-hidden="true">lock_open</i>
            Sign in
          </button>
        </div>
      </header>

      {/* Mobile menu: shown only if menuOpen is true */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-2 bg-white/90 px-4 py-3 rounded-xl shadow border border-gray-200 focus-within:ring-2 focus-within:ring-[#89AC46] transition-all duration-200"
          >
            <select
              name="categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent border border-gray-300 text-[#595959] text-sm font-medium px-2 py-2 rounded-md focus:outline-none"
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
              className="bg-transparent border border-gray-300 text-sm text-[#595959] placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none"
              aria-label="Search podcasts"
            />

            <button
              type="submit"
              className="bg-[#89AC46] hover:bg-[#76a13e] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition"
            >
              Search
            </button>
          </form>

          <button
            className="w-full bg-[#89AC46] hover:bg-[#76a13e] text-white font-medium px-4 py-2 rounded-full shadow hover:shadow-md transition flex items-center justify-center gap-2"
            title="Login/Register"
          >
            <i className="material-icons text-base" aria-hidden="true">lock_open</i>
            Sign in
          </button>
        </div>
      )}

      {/* Optional search results */}
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
