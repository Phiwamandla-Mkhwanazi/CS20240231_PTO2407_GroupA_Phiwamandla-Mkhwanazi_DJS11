import { Outlet} from "react-router-dom"; // Import Outlet for rendering nested routes from react-router-dom

// Import layout components: Header, Footer, and ExitWarning modal
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExitWarning from '../components/ExitWarning'; 

// Layout component acts as the main page wrapper with common UI elements
export default function Layout()
{
  return (
      // Container that uses flexbox to arrange header, main content, and footer vertically
     <div className="flex flex-col h-screen overflow-hidden bg-zinc-100">
      
      {/* ExitWarning component to alert users before leaving the page */}
      <ExitWarning />

      {/* Header component with navigation and branding */}
      <Header />

      {/* Main content area where nested routes render */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Footer component displayed at the bottom of the page */}
      <Footer />
      
    </div>
  );
}