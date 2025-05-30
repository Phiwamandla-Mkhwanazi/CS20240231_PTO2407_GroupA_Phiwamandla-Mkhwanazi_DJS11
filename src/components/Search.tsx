import { useEffect, useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { MdPlayCircleFilled } from 'react-icons/md';
import Fuse from 'fuse.js';
import titleImage from '../assets/img/podcast-neon-sign-glowing-studio-microphone-icon-vector-31076255.jpg';
import PodcastPreview from '../modals/PodcastPreview';

// --- Types ---
interface Podcast {
  id: string;
  title: string;
  description: string;
  image?: string;
  key: string;
}

interface SearchProps {
  term?: string;
  category?: string;
    onClose: () => void; 
}

interface SectionHeaderProps {
  title: string;
  count: number;
}

interface PodcastThumbnailProps {
  podcast: Podcast;
  onClick: () => void;
  highlight?: string;
}

// --- Constants ---
const API_SHOWS = 'https://podcast-api.netlify.app/';
const API_GENRE = 'https://podcast-api.netlify.app/genre/';

const GENRE_MAP: Record<number, string> = {
  1: 'Personal Growth',
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family',
};

// --- Components ---
function BackHomeButton() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return isHome ? (
    <button
      onClick={() => window.location.reload()}
      aria-label="Reload Home Page"
      className="px-4 flex items-center gap-2 text-[#595959] hover:text-[#89AC46] font-semibold transition-colors duration-200"
    >
      <MdPlayCircleFilled /> Reload Home
    </button>
  ) : (
    <NavLink
      to="/"
      aria-label="Go back to Home"
      className={({ isActive }) =>
        `px-4 flex items-center gap-2 transition-colors duration-200 ${
          isActive ? 'text-[#89AC46]' : 'text-[#595959] hover:text-[#89AC46] font-semibold'
        }`
      }
    >
      <MdPlayCircleFilled /> Go back to home
    </NavLink>
  );
}

function SectionHeader({ title, count }: SectionHeaderProps) {
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm flex justify-between items-center px-4 py-3 shadow-sm border-b border-gray-200">
      <BackHomeButton />
      <h2 className="text-xl font-bold text-[#595959]">
        {title} <span className="text-gray-500 font-medium">({count})</span>
      </h2>
    </div>
  );
}

function PodcastThumbnail({ podcast, onClick }: PodcastThumbnailProps) {
  const imgSrc = podcast.image || titleImage;

  return (
    <div
      className="relative group h-[100px] w-[100px] rounded-2xl overflow-hidden shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={onClick}
    >
      <img
        src={imgSrc}
        alt={`${podcast.title} thumbnail`}
        className="w-full h-full object-cover rounded-2xl"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
        <MdPlayCircleFilled className="text-white text-4xl drop-shadow-lg" />
      </div>
    </div>
  );
}

// --- Main Component ---
export default function Search({ term = '', category = 'All Departments' }: SearchProps) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [visibleCount, setVisibleCount] = useState(40);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          let shows: Podcast[] = [];

          const res = await fetch(API_SHOWS);
          if (!res.ok) throw new Error('Failed to fetch shows');
          const allShows: Podcast[] = await res.json();

          if (category === 'All Departments') {
            shows = allShows;
          } else {
            const genreId = Object.entries(GENRE_MAP).find(([, name]) => name === category)?.[0];
            if (!genreId) {
              setPodcasts([]);
              setLoading(false);
              return;
            }
            const genreRes = await fetch(`${API_GENRE}${genreId}`);
            if (!genreRes.ok) throw new Error('Failed to fetch genre data');
            const genreData: { shows: string[] } = await genreRes.json();
            shows = allShows.filter((show) => genreData.shows.includes(String(show.id)));
          }

          const fuse = new Fuse(shows, {
            keys: ['title', 'description'],
            threshold: 0.3,
            includeMatches: true,
          });

          const results = term ? fuse.search(term).map((r) => r.item) : shows;
          setPodcasts(results);
      } catch (err) {
  const error = err instanceof Error ? err : new Error('Unknown error');
  console.error(error);
  setError(error.message);
  setPodcasts([]);
} finally {
          setLoading(false);
        }
      };

      fetchData();
    }, 300);

    return () => clearTimeout(handler);
  }, [term, category]);

  const openPodcast = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    setShowModal(true);
  };

  const visiblePodcasts = podcasts.slice(0, visibleCount);

  return (
    <section className="w-full h-full px-4 py-4 overflow-y-auto space-y-6 ">
      <SectionHeader
        title={`Results for "${term}" in "${category}"`}
        count={podcasts.length}
      />

      {loading ? (
        <p className="text-gray-500 italic px-2">Loading podcasts...</p>
      ) : error ? (
        <p className="text-red-500 italic px-2">{error}</p>
      ) : podcasts.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-4 justify-evenly">
            {visiblePodcasts.map((podcast) => (
              <PodcastThumbnail
                key={podcast.id}
                podcast={podcast}
                onClick={() => openPodcast(podcast)}
              />
            ))}
          </div>

          {visibleCount < podcasts.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 20)}
                className="px-4 py-2 rounded-lg bg-[#595959] text-white text-sm hover:bg-[#333] transition"
              >
                See More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 italic px-2">
          No results found for "{term}" in "{category}".
        </p>
      )}

      <PodcastPreview
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        podcast={selectedPodcast}
      />
    </section>
  );
}
