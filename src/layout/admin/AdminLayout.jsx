// import React from 'react'
// import { Outlet, useLocation } from 'react-router-dom'
// import Sidebar from './Sidebar'
// import { useMain } from '../../context/MainContext'
// import ProfileMenu from '../../components/ProfileMenu'

// const AdminLayout = () => {
//   const location = useLocation();
//   const { user, logout } = useMain()

//   // Logic to capitalize the current route name for the header title
//   // e.g., /admin/company -> Company
//   const pageTitle = location.pathname.split('/').pop() || 'Dashboard';

//   return (
//     <div className='flex h-screen overflow-hidden bg-[#F9FAFB]'>
      
//       {/* 1. Fixed Sidebar */}
//       <div className='flex-shrink-0'>
//         <Sidebar />
//       </div>

//       {/* 2. Main Content Wrapper */}
//       <div className='flex-1 flex flex-col min-w-0 h-screen'>
        
//         {/* Top Header Section */}
//         <header className='flex items-center justify-between px-8 py-4 bg-white border-b-2 border-[#E5E7EB]'>
//           <h1 className='text-xl font-bold text-gray-800 capitalize'>
//             {pageTitle}
//           </h1>
          
//           {/* User Profile Section */}
//           <ProfileMenu
//             user={user}
//             onLogout={logout}
//           />
//         </header>

//         {/* 3. Dynamic Page Content (Table, etc.) */}
//         <main className='scroll-reset-target flex-1 overflow-y-auto p-3'>
//           <Outlet />
//         </main>

//       </div>
//     </div>
//   )
// }

// export default AdminLayout






// // import React from 'react'
// // import { Outlet } from 'react-router-dom'
// // import Sidebar from '../components/Sidebar' // Import your CUSTOM component, not the icon

// // const AdminLayout = () => {
// //   return (
// //     // "flex" puts sidebar and main content side-by-side
// //     // "min-h-screen" ensures the background covers the full height
// //     <div className="flex min-h-screen bg-[#F9FAFB]">
      
// //       {/* Sidebar - Width is handled inside the Sidebar component or here */}
// //       <div className="flex-shrink-0">
// //         <Sidebar />
// //       </div>

// //       {/* Main Content Area */}
// //       <div className="flex-1 flex flex-col overflow-hidden">
// //         {/* You can add a Top Header component here later */}
        
// //         <main className="flex-1 overflow-y-auto p-8">
// //           <Outlet />
// //         </main>
// //       </div>

// //     </div>
// //   )
// // }

// // export default AdminLayout




// ─────────────────────────────────────────────────────────────
// USAGE EXAMPLES — AdminLayout, CollegeLayout, CompanyLayout
// All three use the single <AppLayout> component.
// Only menuItems (and optionally logo/title) differ.
// ─────────────────────────────────────────────────────────────
 
// ─────────────────────────────────────────────────────────────
// USAGE — AdminLayout, CollegeLayout, CompanyLayout
//
// Each layout file is now just ~15 lines.
// Title is auto-derived from the URL: /admin/company → "Company"
// No useTitle() or title prop needed.
// ─────────────────────────────────────────────────────────────
 
import React from "react";

import AppLayout from "../AppLayout";
import { assets } from "../../assets/assets";
import { useMain } from "../../context/MainContext";
 
 
// ── 1. AdminLayout.jsx ────────────────────────────────────────
const AdminLayout = () => {
  const { user, logout, changePassword } = useMain();
 
  const menuItems = [
    { name: "Dashboard",   path: "/admin/dashboard",   icon: assets.dash_i },
    { name: "Company",     path: "/admin/company",     icon: assets.comp_i },
    { name: "College",     path: "/admin/college",     icon: assets.book_i },
    { name: "Competition", path: "/admin/competition", icon: assets.competition_i },
    { name: "Conference",  path: "/admin/conference",  icon: assets.conf_i },
    { name: "Events",      path: "/admin/events",      icon: assets.event_i },
    { name: "Seminar",     path: "/admin/seminar",     icon: assets.sem_i },
    { name: "Influencers",   path: "/admin/influencer",    icon: assets.user },
    {
      name: "Jobs",
      icon: assets.jobs_i,
      // No `path` — just subItems. AppLayout renders the expand/collapse toggle.
      subItems: [
        { name: "Internship", path: "/admin/jobs/internship" },
        { name: "Projects",  path: "/admin/jobs/freelance" },
      ],
    },
    { name: "Users",         path: "/admin/users",         icon: assets.user },
    { name: "Subscriptions", path: "/admin/subscriptions", icon: assets.subscription },
    //  { name: "Settings",     path: "/admin/profile",     icon: assets.sem_i },
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
 
export default  AdminLayout

 