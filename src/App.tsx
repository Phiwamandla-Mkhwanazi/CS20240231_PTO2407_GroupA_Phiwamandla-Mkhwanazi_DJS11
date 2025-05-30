// App.jsx

// Importing React Router components
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importing layout and pages
import Layout from "./layouts/Layout";
import Home from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import About from "./pages/About";
import Privacy from './pages/Privacy';
import Guide from './pages/Guide';
import NotFound from "./pages/NotFound";

function App() {
  return (
    // BrowserRouter enables routing using the HTML5 history API
    <BrowserRouter>
      <Routes>
        {/* Main layout wrapper for all nested routes */}
        <Route path="/" element={<Layout />}>
          {/* Index route (i.e., homepage) */}
          <Route index element={<Home />} />

          {/* Route for search page */}
          <Route path="search" element={<SearchPage />} />

          {/* Route for about page */}
          <Route path="about" element={<About />} />

          {/* Route for privacy policy page */}
          <Route path="privacy" element={<Privacy />} />

          {/* Route for usage guide or instructions */}
          <Route path="guide" element={<Guide />} />

          {/* Catch-all route for any undefined paths */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
