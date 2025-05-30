import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPlayCircleFilled } from 'react-icons/md';
import LandingImage from '../assets/img/kali-mr-robot-augmented-reality-game-1.jpg';
import PodcastPreview from '../modals/PodcastPreview';
import { BackArrowIcon, ForwardArrowIcon } from './Icons';

const API_URL = 'https://podcast-api.netlify.app/shows';

type Podcast = {
  id: string;
  image: string;
  updated: string;
  key: string; 
};

type PodcastThumbnailProps = {
  image: string;
  onClick: () => void;
};

const PodcastThumbnail = ({ image, onClick }: PodcastThumbnailProps) => (
  <div
    onClick={onClick}
    className="relative group h-[100px] w-[100px] rounded-[20px] overflow-hidden shadow-xl cursor-pointer transition-transform duration-300 hover:scale-105"
  >
    <img
      src={image}
      alt="thumbnail"
      className="w-full h-full object-cover rounded-[20px]"
      loading="lazy"
    />
    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
      <MdPlayCircleFilled className="text-white text-4xl drop-shadow-lg" />
    </div>
  </div>
);

export function Default() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  const [recommendedStart, setRecommendedStart] = useState(0);
  const [trendingStart, setTrendingStart] = useState(0);
  const [latestStart, setLatestStart] = useState(0);

  const limit = 6;
  const maxShifts = 4;

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setPodcasts)
      .catch((err) => console.error('Failed to fetch podcasts:', err));
  }, []);

  const openPodcast = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    setShowModal(true);
  };

  // Sort podcasts by updated date descending
  const sortedByUpdated = [...podcasts].sort(
    (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
  );

  const handleShift =
    (currentStart: number, setStart: React.Dispatch<React.SetStateAction<number>>) =>
    ({ type }: { type: 'next' | 'prev' }) => {
      setStart((prev) => {
        const maxOffset = maxShifts;
        const newStart = type === 'next' ? prev + 1 : prev - 1;
        return Math.max(0, Math.min(newStart, maxOffset));
      });
    };

  return (
    <section className="md:w-full h-[calc(100vh-8.7em)] px-2 mt-3 space-y-8 overflow-y-auto">
      {/* 🎧 Hero */}
      <div
        className="relative group flex justify-end items-end min-h-[300px] bg-cover bg-center bg-no-repeat rounded-lg py-8 px-4"
        style={{ backgroundImage: `url(${LandingImage})` }}
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg" />
        <button className="relative z-10 m-4 px-6 py-3 text-2xl font-semibold text-white bg-[#d4d0d0] opacity-40 transition-all duration-200 hover:text-[#89AC46] hover:opacity-100 hover:scale-105 shadow-xl flex items-center">
          <i className="material-icons mr-2">play_arrow</i>
          Play
        </button>
      </div>

      {/* 🎙 Recommended */}
      <Section
        title="Recommended Podcasts"
        onNext={handleShift(recommendedStart, setRecommendedStart).bind(null, { type: 'next' })}
        onPrev={handleShift(recommendedStart, setRecommendedStart).bind(null, { type: 'prev' })}
        disablePrev={recommendedStart === 0}
        disableNext={recommendedStart >= maxShifts}
      >
        {sortedByUpdated
          .slice(20 + recommendedStart, 20 + recommendedStart + limit)
          .map((podcast) => (
            <PodcastThumbnail
              key={`recommended-${podcast.id}`}
              image={podcast.image}
              onClick={() => openPodcast(podcast)}
            />
          ))}
      </Section>

      {/* 🔥 Trending */}
      <Section
        title="Trending Podcasts"
        onNext={handleShift(trendingStart, setTrendingStart).bind(null, { type: 'next' })}
        onPrev={handleShift(trendingStart, setTrendingStart).bind(null, { type: 'prev' })}
        disablePrev={trendingStart === 0}
        disableNext={trendingStart >= maxShifts}
      >
        {sortedByUpdated
          .slice(9 + trendingStart, 9 + trendingStart + limit)
          .map((podcast) => (
            <PodcastThumbnail
              key={`trending-${podcast.id}`}
              image={podcast.image}
              onClick={() => openPodcast(podcast)}
            />
          ))}
      </Section>

      {/* 🕒 Latest */}
      <Section
        title="Latest Podcasts"
        onNext={handleShift(latestStart, setLatestStart).bind(null, { type: 'next' })}
        onPrev={handleShift(latestStart, setLatestStart).bind(null, { type: 'prev' })}
        disablePrev={latestStart === 0}
        disableNext={latestStart >= maxShifts}
      >
        {sortedByUpdated
          .slice(0 + latestStart, 0 + latestStart + limit)
          .map((podcast) => (
            <PodcastThumbnail
              key={`latest-${podcast.id}`}
              image={podcast.image}
              onClick={() => openPodcast(podcast)}
            />
          ))}
      </Section>

      {/* 🧭 Explore */}
      <ExploreTags />

      {/* Modal */}
      <PodcastPreview
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        podcast={selectedPodcast}
      />
    </section>
  );
}

// 🧩 Section Container
type SectionProps = {
  title: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  disableNext?: boolean;
  disablePrev?: boolean;
};

const Section = ({ title, children, onNext, onPrev, disableNext, disablePrev }: SectionProps) => (
  <>
    <div className="flex justify-between items-center px-4">
      <h2 className="text-xl font-bold text-[#595959]">{title}</h2>
      {onNext && onPrev && (
        <div className="flex items-center gap-2 text-[#595959]">
          <button
            onClick={onPrev}
            disabled={disablePrev}
            className={`hover:text-[#89AC46] ${disablePrev ? 'opacity-30 cursor-not-allowed' : ''}`}
            aria-label={`Previous ${title}`}
          >
            <BackArrowIcon />
          </button>
          <button
            onClick={onNext}
            disabled={disableNext}
            className={`hover:text-[#89AC46] ${disableNext ? 'opacity-30 cursor-not-allowed' : ''}`}
            aria-label={`Next ${title}`}
          >
            <ForwardArrowIcon />
          </button>
        </div>
      )}
    </div>
    <div className="flex flex-wrap gap-4 justify-evenly px-2">{children}</div>
  </>
);

// 🧭 Explore Category Tags
const ExploreTags = () => {
  const navigate = useNavigate();

  const categories = [
    'Personal Growth',
    'Comedy',
    'History',
    'Business',
    'Fiction',
    'Kids and Family',
  ];

  const handleClick = (category: string) => {
    navigate(`/search?term=&category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="px-4">
      <h2 className="py-2 text-xl font-semibold text-[#595959]">Explore More</h2>
      <div className="flex flex-wrap justify-around gap-4 py-2 mb-2">
        {categories.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(item)}
            className="px-6 py-3 font-bold text-[#595959] bg-[#d4d0d0] border-2 border-[#89AC46] rounded-full cursor-pointer hover:opacity-90 transition-opacity"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
