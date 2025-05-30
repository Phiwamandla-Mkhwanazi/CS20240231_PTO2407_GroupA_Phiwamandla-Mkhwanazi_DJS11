import { SlArrowLeft } from "react-icons/sl";   // Import back arrow icon from react-icons library
import { NavLink, Outlet } from 'react-router-dom'; // Import navigation and layout components from React Router

export default function Privacy() {
  return (
    <div className="relative h-[40rem] max-w-1xl mx-auto overflow-y-auto">
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

      {/* Header */}
      <div className="text-center text-[#595959]">
        <h1 className="text-3xl font-bold mt-8">Privacy Policy</h1>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto mt-16 px-6 text-justify space-y-6 text-[#595959]  text-base">
        <p>
          The platform encourages the use of strong, unique passwords that are separate from those used on other services, enhancing your account security. This reduces the risk of credential reuse, which is a common vulnerability exploited in cyber attacks.
        </p>

        <p>
          The platform itself does not track or collect any personal data beyond essential podcast interaction logs and authentication credentials. These are securely stored through Firebase, a trusted third-party backend service that ensures data protection with robust security protocols.
        </p>

        <p>
          Privacy considerations mainly pertain to Firebase’s handling of your data. The platform strives to minimize data collection and does not share your information with third parties outside of Firebase’s infrastructure. Firebase’s privacy policies apply, and users are encouraged to review their terms for detailed information.
        </p>

        <p>
          A core principle of the platform is to foster a space for free speech without censorship or government interference. However, to maintain a respectful community, the platform prohibits the use of vulgar or abusive language that targets users in a harmful or excessive manner.
        </p>

        <p>
          Your email address is collected only for essential functions: to provide important updates about the platform, and to facilitate password resets without requiring additional personal information such as phone numbers. This approach balances security with user convenience, helping maintain account access securely.
        </p>

        <p>
          The platform does not sell, rent, or trade your personal information with advertisers or other third parties. User data is treated with respect and used solely to support platform functionality and enhance the user experience.
        </p>

        <p>
          While the platform encourages users to exercise caution and protect their privacy, it also provides tools and features that promote safe and responsible use. Users are urged to avoid sharing sensitive personal information publicly and to report any violations of community guidelines promptly.
        </p>

        <p>
          In summary, privacy and security are foundational values of the platform. By combining secure authentication practices, limited data collection, and respect for free speech, the platform aims to create an open, safe, and user-focused environment.
        </p>
      </div>

      <Outlet />
    </section>
    </div>
   
  );
}
