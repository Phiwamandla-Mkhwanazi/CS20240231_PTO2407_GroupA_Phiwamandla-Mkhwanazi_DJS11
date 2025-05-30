import { NavLink, Outlet } from "react-router-dom";
import { useState, useMemo } from "react";
import useFavouritesStore from "../stores/favouriteStore";
import usePlayerStore from "../stores/playerStore";
import { AscendingIcon, DescendingIcon } from "./Icons";

// Define the type for a favourite item
type FavouriteItem = {
  uid: string;
  id: string;
  podcastId: string;
  title?: string;
  image?: string;
  file?: string;
  description?: string;
  savedAt?: number;
};

export default function Favourite() {
  const favourites = useFavouritesStore((state) => state.favourites);
  const removeFavourite = useFavouritesStore((state) => state.removeFavourite);
  const setEpisode = usePlayerStore((state) => state.setEpisode);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortByTitle, setSortByTitle] = useState(false);
  const [sortByDate, setSortByDate] = useState(true);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handlePlay = (fav: FavouriteItem) => {
    setEpisode({
      id: fav.uid,
    podcastId: fav.podcastId,
    title: fav.title ?? "Unknown Title",
    file: fav.file ?? "",
    image: fav.image ?? "",
    podcastTitle: "Unknown Podcast",
    season:  0,
    episode:  0,
      description: fav.description,
    });
  };

  const handleRemove = (fav: FavouriteItem) => {
    removeFavourite(fav.uid);
  };

  const filteredFavourites = useMemo(() => {
    let filtered = favourites.filter((fav) =>
      fav.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortByTitle) {
      filtered = [...filtered].sort((a, b) =>
        sortDirection === "asc"
          ? (a.title || "").localeCompare(b.title || "")
          : (b.title || "").localeCompare(a.title || "")
      );
    } else if (sortByDate) {
      filtered = [...filtered].sort((a, b) =>
        sortDirection === "asc"
          ? (a.savedAt || 0) - (b.savedAt || 0)
          : (b.savedAt || 0) - (a.savedAt || 0)
      );
    }

    return filtered;
  }, [favourites, searchTerm, sortByTitle, sortByDate, sortDirection]);

  const collectionImages = useMemo(() => {
    const shuffled = [...favourites].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4).map((f) => f.image);
  }, [favourites]);

  const defaultImages = [
    "https://content.production.cdn.art19.com/images/19/f4/f9/af/19f4f9af-4a18-44e1-a622-726f43feb79d/539a50f79529628dbde7aa116778056619b802bfa0247cb739db907085e0b595a5521efc78faa831ebddc235d69beb27e1e36fd51f825bc888f0c11cccbd9cd8.png",
    "https://content.production.cdn.art19.com/images/d4/06/1f/5b/d4061f5b-c6d1-4304-b9d7-5e793455243a/4668ed2834f6117f83f68b2659a413f9ebad11c32f4ba8e8c6b68c9c1f36917a7a348171298899e1bbe7c8732a4397a5ef31699bca6be8347e12c361aa04827e.jpeg",
    "https://content.production.cdn.art19.com/images/19/f4/f9/af/19f4f9af-4a18-44e1-a622-726f43feb79d/539a50f79529628dbde7aa116778056619b802bfa0247cb739db907085e0b595a5521efc78faa831ebddc235d69beb27e1e36fd51f825bc888f0c11cccbd9cd8.png",
    "https://content.production.cdn.art19.com/images/41/65/a8/83/4165a883-b520-48d0-a804-df3b8a974309/ef5c453f44657ebc21d6045b9ea41c089f8e3872c630d8afc69eae308611bc99ba34965e627db83de9025ce8ecbf30804fc740a281b6e30afdd0ebac58ec9a06.png",
  ];

  const showSeasonToEpisode = (str: string) => {
    const parts = str?.split("-");
    if (parts?.length !== 2) return str;
    const season = parts[0];
    const episode = 1 + Number(parts[1]);
    return `S${season} - E${episode}`;
  };

  return (
    <section className="hidden md:flex flex-col h-[calc(100vh-7.9rem)] px-2 relative bg-zinc-300">
      <div className="flex flex-col text-center px-7 py-2 overflow-hidden">
        <ul className="mb-2 text-lg text-[#595959] font-semibold">
          <li>Favourites</li>
        </ul>
        <div className="relative w-full item-center overflow-hidden">
          <div className="flex items-center justify-center w-max">
            {(collectionImages.length > 0 ? collectionImages : defaultImages).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Podcast ${i + 1}`}
                className={`w-[80px] h-[80px] object-cover border-2 border-[#595959] rounded-[14px] shadow-md ${
                  i !== 0 ? "-ml-6" : ""
                }`}
                style={{ zIndex: 10 - i }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center py-2 gap-4 border-t-2 border-[#89AC46] text-[#595959]">
        <input
          type="search"
          placeholder="Search favourites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-[#89AC46] rounded px-3 py-1 text-sm w-1/2 focus:outline-none  focus:border-[#89AC46] transition-all duration-170"
        />
  <div className="flex gap-2">
  <button
    className="text-sm underline hover:text-[#595959]"
    onClick={() => {
      if (sortByTitle) {
        // Toggle direction if already sorting by title
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortByTitle(true);
        setSortByDate(false);
      }
    }}
  >
    Title{" "}
    {sortByTitle &&
      (sortDirection === "asc" ? <AscendingIcon /> : <DescendingIcon />)}
  </button>

<button
  className="text-sm underline hover:text-[#595959] border-l-2 border-[#89AC46] px-2"
  onClick={() => {
    if (sortByDate) {
      // Toggle direction if already sorting by date
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortByDate(true);
      setSortByTitle(false);
      // Reset direction to 'asc' or whatever default you prefer when switching
      setSortDirection("asc");
    }
  }}
>
  Date{" "}
  {sortByDate &&
    (sortDirection === "asc" ? <AscendingIcon /> : <DescendingIcon />)}
</button>

</div>

      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border-t-2 border-[#89AC46] py-2">
        {filteredFavourites.length > 0 ? (
          filteredFavourites.map((fav, idx) => (
            <div
              key={fav.uid}
              className="group flex items-center justify-between gap-4 p-2 mb-2 bg-[#d4d0d0] rounded-lg shadow-sm border border-[#89AC46] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <img
                  src={fav.image || defaultImages[idx % defaultImages.length]}
                  alt="Podcast Thumbnail"
                  className="w-10 h-10 rounded object-cover shadow"
                />
                <div className="flex flex-col">
                  <p className="text-[#595959] text-base font-semibold  max-w-[150px] truncate">
                    {fav.title || `Title #${idx + 1}`}
                  </p>
                  <p className="text-[#595959] text-sm">
                    {showSeasonToEpisode(fav.id)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ActionButton
                  icon="play"
                  onClick={() => handlePlay(fav)}
                  iconClass="text-[#595959] p-1 hover:bg-[#89AC46] rounded transition"
                />
                <ActionButton
                  icon="heart"
                  onClick={() => handleRemove(fav)}
                  iconClass="text-[#595959] p-1 hover:bg-[#89AC46] rounded transition"
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-[#595959]">No favourites yet.</p>
        )}
      </div>

     <div className="flex justify-center py-2 border-t-2 border-[#89AC46]">
  <button
    onClick={() => {
      if (confirm("Are you sure you want to clear all favourites?")) {
        useFavouritesStore.getState().clearFavourites();
        localStorage.removeItem("favourites-storage"); // optional: clears persisted data
      }
    }}
    className="text-sm underline text-[#595959] hover:text-red-600 transition"
  >
    Clear Favourites
  </button>
</div>
        
      <footer className="pt-3 border-t-2 border-[#89AC46] text-sm text-[#89AC46]">
        <ul className="flex justify-around mb-2 font-medium">
          {[
            { to: "/about", label: "About" },
            { to: "/privacy", label: "Privacy" },
            { to: "/guide", label: "Guide" },
          ].map(({ to, label }) => (
            <li key={label} className="hover:text-[#6c8f38] cursor-pointer">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? "text-[#6c8f38] font-semibold" : "text-[#595959]"
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </footer>

      <Outlet />
    </section>
  );
}

function ActionButton({
  icon,
  onClick,
  iconClass = "",
}: {
  icon: "play" | "heart";
  onClick: () => void;
  iconClass?: string;
}) {
  const icons = {
    play: (
      <svg
        className={`w-6 h-6 transform transition-transform duration-200 hover:scale-110 ${iconClass}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <polygon points="6 3 20 12 6 21 6 3" />
      </svg>
    ),
    heart: (
      <svg
        className={`w-6 h-6 transform transition-transform duration-200 hover:scale-110 ${iconClass}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
      </svg>
    ),
  };
  return <button onClick={onClick}>{icons[icon]}</button>;
}
