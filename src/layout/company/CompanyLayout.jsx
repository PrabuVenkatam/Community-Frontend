// import React from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import { useMain } from "../../context/MainContext";
// import ProfileMenu from "../../components/ProfileMenu";


// const CompanyLayout = () => {
//   const { user, logout } = useMain();

//   const location = useLocation();
//   const pageTitle = location.pathname.split("/").pop() || "Dashboard";

//   return (
//     <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
//       <div className="flex-shrink-0">
//         <Sidebar />
//       </div>

//       <div className="flex-1 flex flex-col min-w-0 h-screen">
//         <header className="flex items-center justify-between px-8 py-4 bg-white border-b-2 border-[#E5E7EB]">
//           <h1 className="text-xl font-bold text-gray-800 capitalize">{pageTitle}</h1>

//           <ProfileMenu
//             user={user}
//             onLogout={logout}
//           />
//         </header>

//         <main className="scroll-reset-target flex-1 overflow-y-auto p-3">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default CompanyLayout;



import React from "react";

import AppLayout from "../AppLayout";
import { assets } from "../../assets/assets";
import { useMain } from "../../context/MainContext";
 
 
// ── 1. AdminLayout.jsx ────────────────────────────────────────
const CompanyLayout = () => {
  const { user, logout, changePassword } = useMain();
   const menuItems = [
     { name: "Dashboard", path: "/company/dashboard", icon: assets.dash_i },
     { name: 'Internship', path: '/company/jobs/internship', icon: assets.jobs_i },
     { name: 'Projects', path: '/company/jobs/freelance', icon: assets.jobs_i },
     { name: 'Partners', path: '/company/partners', icon: assets.partners },
     { name: 'Profile', path: '/company/company', icon: assets.comp_i },
   ];
 
 
 
  return (
    <AppLayout
      menuItems={menuItems}
      logo={assets.gradEnvyLogo}
      user={user}
      onLogout={logout}
      onChangePassword={changePassword}
    />
  );
};
 
export default  CompanyLayout

 
