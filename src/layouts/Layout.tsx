import { Outlet} from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExitWarning from '../components/ExitWarning'; 

export default function Layout()
{
  return (
     <div className="flex flex-col h-screen overflow-hidden">
      <ExitWarning /> 
      <Header />
           <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}