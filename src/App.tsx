// App.jsx
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import About from "./pages/About";
import Privacy from './pages/Privacy';
import Guide from './pages/Guide';
import NotFound from "./pages/NotFound"; 



function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="about" element={<About />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="guide" element={<Guide />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
