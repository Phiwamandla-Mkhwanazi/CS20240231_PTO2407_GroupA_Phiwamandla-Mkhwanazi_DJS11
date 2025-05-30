// pages/NotFound.jsx

// Import Link from React Router for navigation
import { Link } from "react-router-dom";

// NotFound component displays a user-friendly 404 error page
export default function NotFound() {
  return (
    // Container with center alignment and full screen height
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      
      {/* Large 404 error code */}
      <h1 className="text-6xl font-extrabold mb-6 text-[#89AC46]">404</h1>
      
      {/* Secondary heading */}
      <h2 className="text-2xl font-semibold mb-4 text-[#595959]">
        Page Not Found
      </h2>
      
      {/* Informational message for the user */}
      <p className="mb-8 text-center text-[#595959] max-w-md">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      
      {/* Button to navigate back to the homepage */}
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-[#89AC46] text-white font-semibold rounded-md hover:bg-[#758f2d] transition"
      >
        Go back home
      </Link>
    </div>
  );
}
