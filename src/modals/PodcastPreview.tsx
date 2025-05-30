import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaHeart, FaRegHeart, FaPlay } from "react-icons/fa";

import usePlayerStore from "../stores/playerStore";
import useFavouritesStore from "../stores/favouriteStore";

interface Episode {
  id: string;
  episode: number;
  title: string;
  description: string;
  file: string;
}

interface Season {
  season: number;
  image?: string;
  episodes: Episode[];
}

interface Podcast {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  updated?: string;
  genres?: string[];
  seasons?: Season[];
}

interface PodcastPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  podcast: Podcast | null;
}

export default function PodcastPreviewModal({ isOpen, onClose, podcast }: PodcastPreviewModalProps) {
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [detailedPodcast, setDetailedPodcast] = useState<Podcast | null>(null);

  const { setEpisode } = usePlayerStore();
  const { toggleFavourite, isFavourite } = useFavouritesStore();

  useEffect(() => {
    if (!podcast?.id) return;
    setSelectedSeason(0);

    const fetchDetailedPodcast = async () => {
      try {
        const res = await fetch(`https://podcast-api.netlify.app/id/${podcast.id}`);
        const data = await res.json();

        const safeData: Podcast = {
          id: data?.id ?? "",
          title: data?.title ?? "Untitled Podcast",
          description: data?.description ?? "No description available.",
          image: data?.image ?? "/placeholder.png",
          updated: data?.updated ?? "N/A",
          genres: Array.isArray(data?.genres) ? data.genres : ["Unknown"],
          seasons: Array.isArray(data?.seasons)
            ? data.seasons.map((season: {
  season: number;
  image?: string;
  episodes: {
    id?: string;
    episode?: number;
    title?: string;
    description?: string;
    file?: string;
  }[];
}) => ({
                ...season,
                episodes: Array.isArray(season.episodes)
                  ? season.episodes.map(( ep: {
      id?: string;
      episode?: number;
      title?: string;
      description?: string;
      file?: string;
    }, i: number) => ({
                      id: ep?.id ?? `${season.season}-${i}`,
                      episode: ep?.episode ?? i + 1,
                      title: ep?.title ?? "Untitled Episode",
                      description: ep?.description ?? "No description.",
                      file: ep?.file ?? "https://podcast-api.netlify.app/placeholder-audio.mp3",
                    }))
                  : [],
              }))
            : [],
        };

        setDetailedPodcast(safeData);
      } catch (err) {
        console.error("Fetch error:", err);
        setDetailedPodcast(null);
      }
    };

    fetchDetailedPodcast();
  }, [podcast]);

  const { image: podcastImage = "/placeholder.png", seasons = [] } = detailedPodcast ?? {};
  const [seasonImage, setSeasonImage] = useState(podcastImage);

  useEffect(() => {
    if (!detailedPodcast) return;
    const newImage = seasons[selectedSeason]?.image ?? podcastImage;
    setSeasonImage(newImage);
  }, [selectedSeason, detailedPodcast, seasons, podcastImage]);

  if (!isOpen) return null;

  if (!detailedPodcast) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center px-4">
        <div className="text-white text-xl">Loading podcast...</div>
      </div>
    );
  }

  const { title, description, updated, genres } = detailedPodcast;
  const episodesForSeason = seasons[selectedSeason]?.episodes ?? [];

  const handleEpisodeClick = (ep: Episode) => {
    const uid = `${podcast!.id}-${ep.id}`;

    const playlist = episodesForSeason.map((episode) => ({
      id: `${podcast!.id}-${episode.id}`,
      title: episode.title,
      file: episode.file,
      image: seasonImage,
      podcastId: podcast!.id,
      podcastTitle: title!,
      season: selectedSeason + 1,
      episode: episode.episode,
    }));

    const episodeToPlay = playlist.find((e) => e.id === uid);

    if (episodeToPlay) {
      setEpisode(episodeToPlay, playlist);
    }
  };

  const handleFavouriteClick = (ep: Episode) => {
    const uid = `${podcast!.id}-${ep.id}`;
    toggleFavourite({
      uid,
      id: ep.id,
      title: ep.title,
      image: seasonImage,
      podcastId: podcast!.id,
      file: ep.file,
    });
  };

  function truncateAt(str: string, char: string) {
    const index = str.indexOf(char);
    if (index === -1) return str;
    return str.slice(0, index);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="podcast-title"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          aria-label="Close Modal"
          className="absolute top-4 right-4 text-3xl text-gray-700 hover:text-[#89AC46]"
        >
          <IoClose />
        </button>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <img
            src={seasonImage}
            alt={`${title} Season ${selectedSeason + 1} Cover`}
            className="rounded-2xl shadow-xl w-48 h-48 object-cover"
          />
          <div className="flex-1 space-y-3">
            <h2 id="podcast-title" className="text-4xl font-extrabold text-gray-800">
              {title}
            </h2>
            <p className="text-gray-600 text-sm line-clamp-4">{description}</p>
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
              <span>📅 <strong>Updated:</strong> {truncateAt(updated!, "T")}</span>
              <span>🎙 <strong>Genre:</strong> {genres!.join(", ")}</span>
              <span>🎞 <strong>Seasons:</strong> {seasons.length}</span>
            </div>

            <div className="mt-4">
              <label
                htmlFor="season-select"
                className="text-sm font-medium text-gray-700 mr-2"
              >
                Select Season:
              </label>
              <select
                id="season-select"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#89AC46]"
              >
                {seasons.map((_, index) => (
                  <option key={index} value={index}>
                    Season {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {episodesForSeason.length === 0 ? (
            <div className="text-center text-gray-500 py-12 text-lg">
              No episodes available for this season.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {episodesForSeason.map((ep) => {
                const uid = `${podcast!.id}-${ep.id}`;
                return (
                  <div
                    key={uid}
                    className="bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-2xl p-4 flex flex-col justify-between transition-all"
                  >
                    <div>
                      <h3
                        className="text-lg font-semibold text-gray-800 mb-1"
                        title={ep.title}
                      >
                        {ep.title}
                      </h3>
                      <p
                        className="text-sm text-gray-600 line-clamp-3"
                        title={ep.description}
                      >
                        {ep.description}
                      </p>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <button
                        onClick={() => handleEpisodeClick(ep)}
                        className="text-sm text-gray-500 hover:text-[#89AC46] flex items-center gap-2"
                      >
                        <FaPlay className="text-lg" /> Play Episode
                      </button>

                      <button
                        onClick={() => handleFavouriteClick(ep)}
                        className="text-xl hover:scale-110 transition"
                        aria-label={
                          isFavourite(uid)
                            ? "Remove from favourites"
                            : "Add to favourites"
                        }
                      >
                        {isFavourite(uid) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className="text-gray-400 hover:text-red-400" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
