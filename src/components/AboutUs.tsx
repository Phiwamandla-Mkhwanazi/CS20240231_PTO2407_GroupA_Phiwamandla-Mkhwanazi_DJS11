import aboutImage from '../assets/img/logo.jpg';
import { SlArrowLeft } from "react-icons/sl";
import { NavLink} from 'react-router-dom';

export default function AboutUs() {
  return (
    <section className="flex flex-col h-full ">
      {/* Back Navigation */}
      <NavLink
        to="/"
        aria-label="Go back to Home"
        className={({ isActive }) =>
          `sticky top-12 px-10 flex items-center gap-2 transition-colors duration-200
           ${isActive ? 'text-[#89AC46] ' : 'text-[#595959] hover:text-[#89AC46] font-semibold'}`
        }
      >
        <SlArrowLeft /> Go back to home
      </NavLink>

      {/* Header Image */}
      <div className="text-center text-[#595959]">
        <h1 className="text-3xl font-bold mb-8">About Page</h1>
        <img
          src={aboutImage}
          alt="Neon podcast sign"
          className="mx-auto rounded-lg max-w-md w-80"
        />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto mt-10 px-6 text-justify space-y-6 text-[#595959]">
        <h2 className="text-xl font-semibold">Hi, I’m Phiwamandla Mkhwanazi.</h2>

        <p>
          This podcast platform was born from a single belief: Ideas deserve more than silence.
          Here, users can explore a curated collection of thought-provoking podcasts that stretch beyond
          the boundaries of everyday conversation — from social insights to the edges of theoretical possibility.
          But the real essence isn’t just listening. It’s connection.
          That’s why I’m building in a real-time chat system — so that discussions can continue after the mic turns off, and minds can meet in the digital commons.
          It’s free to use, open-source, and openly accessible to anyone curious enough to dive in.
        </p>

        <p>
          While the code is available on GitHub, this isn’t a community-managed project.
          I’m a solo builder — and proud of it. The focus is on clarity, stability, and learning by building.
          If you’re someone who loves peeking under the hood of working software, feel free to explore the repo, test the features, or even fork it for your own spin.
          This app is here to serve, inspire, and spark curiosity.
        </p>

        <p>
          CodeSpace Academy has been the most transformative education experience I’ve had.
          Before joining, my approach to building was: “As long as it works, it’s fine.”
          That mindset changed fast. I learned how design, architecture, and UX thinking aren’t optional extras — they’re the soul of quality software.
          To Chad — thank you for turning one of my greatest weaknesses (UI/UX) into a strength I now carry with pride.
          From raw sketches to polished front-ends, your guidance helped elevate my approach to a professional standard.
          And to Chemonique — thank you for teaching me the importance of structure, process, and readability.
          You helped me realize that “just getting it working” is a rookie mindset — and that true craftsmanship lives in maintainable, scalable, and thoughtful code.
          To Naheem, CJ, and the rest of the CodeSpace team — I owe you more than just technical skills. You helped reshape how I think.
        </p>

        <p>
          The next chapter is a bold one:
          I'm building a real-time chat app, a sandbox that explores how platforms like WhatsApp, Instagram, Facebook, and X work behind the scenes.
          The vision?
          To expose the architecture and systems thinking that power real-world communication tools.
          If time allows, I’d also like to explore Electron, giving this project the legs to run on the desktop — similar to tools like Microsoft Teams or Zoom.
          This journey is as much about learning as it is about building. And every step is another node in a growing network of knowledge.
        </p>
        <p>
                    <ul className="flex justify-center gap-6 text-3xl ">
          <li><a href="https://www.linkedin.com/in/phiwamandla-mkhwanazi-09734934b/" className="hover:text-[#89AC46]" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a></li>
          <li><a href="https://medium.com/@pm20pm45/about" className="hover:text-[#89AC46]" target="_blank" rel="noopener noreferrer"><i className="fab fa-medium"></i></a></li>
          <li><a href="https://github.com/phiwamandla-mkhwanazi/" className="hover:text-[#89AC46]" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a></li>
          <li><a href="https://www.salesforce.com/trailblazer/s5yf8bztu39v0hdc48" className="hover:text-[#89AC46]" target="_blank" rel="noopener noreferrer"><i className="fab fa-salesforce"></i></a></li>
        </ul>
        </p>
      </div>
    </section>
  );
}
