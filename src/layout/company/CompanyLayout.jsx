import React from "react";

import AppLayout from "../AppLayout";
import { assets } from "../../assets/assets";
import { useMain } from "../../context/MainContext";


// ── 1. AdminLayout.jsx ────────────────────────────────────────
const CompanyLayout = () => {
  const { user, logout, changePassword } = useMain();
  const menuItems = [
    { name: "Dashboard", path: "/company/dashboard", icon: assets.dash_i },
    { name: 'Jobs', path: '/company/jobs/job', icon: assets.jobs_i },
    { name: 'Internship', path: '/company/jobs/internship', icon: assets.internship },
    { name: 'Projects', path: '/company/jobs/freelance', icon: assets.project },
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


