import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer/Footer";
import { Navbar } from "../components/Navbar/Navbar";
import { ScrollToTop } from "../routes/components/ScrollToTop";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0b0b10] text-white">
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};
