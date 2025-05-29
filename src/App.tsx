// App.jsx
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from './pages/HomePage';



function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
