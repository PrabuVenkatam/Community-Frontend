import React from "react";
import AppLayout from "../AppLayout";
import { assets } from "../../assets/assets";
import { useMain } from "../../context/MainContext";

const InfluencerLayout = () => {
  const { user, logout, changePassword } = useMain();

  const menuItems = [
    { name: "Dashboard", path: "/influencer/dashboard", icon: assets.dash_i },
    { name: "Referral List", path: "/influencer/referral-list", icon: assets.user },
    { name: "Subscription List", path: "/influencer/subscription-list", icon: assets.subscription },
    { name: "Profile", path: "/influencer/profile", icon: assets.partners },
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

export default InfluencerLayout;
