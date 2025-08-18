import { Outlet } from "react-router";
import HomeNav from "../components/HomeNav";
import PublicFooter from "./PublicFooter";

const PublicLayout = () => {
 

  return (   
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
    {/* Navigation Bar */}
      <HomeNav/>
      <Outlet/>
      <PublicFooter/>
    </div>
  );
};

export default PublicLayout;
