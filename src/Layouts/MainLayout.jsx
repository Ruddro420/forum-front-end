import { useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../components/ScrollToTop";
import { useAuth } from "../Auth/context/AuthContext";
import Loader from "../components/Loader";


const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { loading } = useAuth();

  return (
    <div className="w-full max-w-full min-w-0">
      {loading ? <div className="w-screen h-screen flex justify-center items-center"><Loader /> </div>: <>
        <ScrollToTop />

        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isMenuOpen={isSidebarOpen}
        />
        <div className="flex w-full min-w-0">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 lg:ml-0 min-w-0">
            <Outlet />
          </main>
        </div>
        <Toaster position='top-center' />
      </>}
    </div>
  );
};

export default MainLayout;
