import { FaDownload, FaGithub } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { SlArrowLeft } from "react-icons/sl";

export default function Guide() {

  return (
    <section className=" text-[#595959] h-full flex flex-col px-6 py-12">
      {/* Top Navigation */}
      <NavLink
        to="/"
        aria-label="Go back to Home"
        className={({ isActive }) =>
          `px-4 flex items-center gap-2 transition-colors duration-200
           ${isActive ? 'text-[#89AC46]' : 'text-[#595959] hover:text-[#89AC46] font-semibold'}`
        }
      >
        <SlArrowLeft /> Go back to home
      </NavLink>

      {/* Main Content */}
      <div className="flex flex-col flex-1 items-center justify-center space-y-6 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold">Developer Guide</h1>
        <p className="text-base">
          Build, run, and customize the project to your liking. Download the full project and guide
          (README file included in the ZIP) to get started locally, explore the architecture, and fork your own version.
        </p>

        {/* Download Button */}
        <a
          href="/dev_guide.zip"
          download
          className="flex items-center gap-3 bg-[#89AC46] hover:bg-[#76a13e] transition-colors px-6 py-3 rounded-xl font-semibold text-white text-base shadow-md"
        >
          <FaDownload />
          Download Dev Guide (ZIP)
        </a>

        {/* GitHub Repo Link */}
        <a
          href="https://github.com/Phiwamandla-Mkhwanazi/CS20240231_PTO2407_GroupA_Phiwamandla-Mkhwanazi_DJS11"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-base text-gray-400 hover:text-[#89AC46] transition"
        >
          <FaGithub />
          Explore on GitHub
        </a>
      </div>
    </section>
  );
}
