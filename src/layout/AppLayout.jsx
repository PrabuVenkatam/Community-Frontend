import React, { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { ChevronRight, KeyRound, LogOut, X, Menu, ChevronDown, EyeOff, Eye } from "lucide-react";
import { changePassword } from "../services/auth/authServices";
import { toast } from "react-toastify";
import { useTitle } from "../context/AdminTitle";
// ─────────────────────────────────────────────
// ProfileMenu (inline – no separate file needed)
// ─────────────────────────────────────────────
const ProfileMenu = ({ user, onLogout, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // ── NEW: visibility state for each password field ──
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetPasswordForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFormError("");
    // ── reset visibility on form reset ──
    setShowOld(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleLogoutConfirm = async () => {
    await onLogout?.();
    setIsLogoutModalOpen(false);
  };

  const handleChangePasswordSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setFormError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("New password and confirm password do not match");
      return;
    }
    try {
      setFormError("");
      setLoading(true);
      const res = await changePassword({ currentPassword: oldPassword, newPassword, confirmPassword });
      if (res?.status) {
        toast.success(res.message || "Password changed successfully");
        setIsChangePasswordModalOpen(false);
        resetPasswordForm();
      } else {
        toast.error(res?.message || "Failed to change password");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const dropdownPositionClass = isMobile
    ? "-left-[200px] top-full mt-2"
    : "right-0 top-full mt-2";

  // ── NEW: password field config with per-field show/toggle ──
  const passwordFields = [
    { label: "Old Password",     value: oldPassword,     setter: setOldPassword,     show: showOld,     toggle: () => setShowOld((p) => !p) },
    { label: "New Password",     value: newPassword,     setter: setNewPassword,     show: showNew,     toggle: () => setShowNew((p) => !p) },
    { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm((p) => !p) },
  ];

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen((p) => !p)}
          className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
        >
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
            <span className="text-base font-semibold text-orange-600">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          {!isMobile && (
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || "User"}</p>
              <p className="text-[12px] text-blue-600 font-medium capitalize">{user?.role || "User"}</p>
            </div>
          )}
        </button>

        {isOpen && (
          <div className={`absolute w-[240px] rounded-2xl border border-[#E5E7EB] bg-white shadow-xl z-50 ${dropdownPositionClass}`}>
            <div className="px-4 py-3 border-b border-[#E5E7EB]">
              <p className="text-sm font-semibold text-gray-900">{user?.name || "User"}</p>
              <p className="text-xs text-blue-600 capitalize">{user?.role || "User"}</p>
            </div>
            <button
              type="button"
              onClick={() => { setIsOpen(false); resetPasswordForm(); setIsChangePasswordModalOpen(true); }}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
            >
              <span className="flex items-center gap-3 text-[15px] text-gray-800">
                <KeyRound size={16} />
                Change Password
              </span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            <button
              type="button"
              onClick={() => { setIsOpen(false); setIsLogoutModalOpen(true); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left border-t border-[#E5E7EB] hover:bg-gray-50 text-[15px] text-gray-800 rounded-b-2xl"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* ── Logout Modal ── */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-[470px] rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-end p-4 pb-0">
              <button type="button" onClick={() => setIsLogoutModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={22} />
              </button>
            </div>
            <div className="px-8 pb-8 text-center">
              <h3 className="text-[20px] font-bold text-gray-900">Ready to head out?</h3>
              <p className="mt-2 text-[15px] text-gray-500">You&apos;re about to log out. See you next time!</p>
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="flex-1 rounded-xl border border-gray-300 px-2 py-3 text-[15px] font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 rounded-xl bg-[#0091D5] px-2 py-3 text-[15px] font-semibold text-white hover:bg-[#007fb8]"
                >
                  Stay Logged In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Change Password Modal ── */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-end p-4 pb-0">
              <button
                type="button"
                onClick={() => { setIsChangePasswordModalOpen(false); resetPasswordForm(); }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={22} />
              </button>
            </div>
            <div className="space-y-4 px-8 pb-8">
              <h3 className="text-[20px] font-bold text-gray-900">Change Password</h3>

              {/* ── UPDATED: password fields with show/hide toggle ── */}
              {passwordFields.map(({ label, value, setter, show, toggle }) => (
                <div key={label}>
                  <label className="mb-2 block text-[14px] font-semibold text-gray-800">{label}</label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-base outline-none focus:border-[#0091D5]"
                    />
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {show ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>
              ))}

              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <div className="pt-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => { setIsChangePasswordModalOpen(false); resetPasswordForm(); }}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-base font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleChangePasswordSave}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#0091D5] px-4 py-2 text-base font-semibold text-white hover:bg-[#007fb8] disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─────────────────────────────────────────────
// AppLayout — the single reusable layout
//
// Props:
//   menuItems        : [{ name, path, icon }]  — nav links (only thing that changes)
//   logo             : string                  — logo src
//   user             : { name, role }          — from useMain()
//   onLogout         : async fn               — from useMain()
//   onChangePassword : async fn({ oldPassword, newPassword, confirmPassword })
//
// Title is derived automatically from the current route segment,
// matching exactly what your original AdminLayout did:
//   /admin/company  →  "Company"
//   /college/events →  "Events"
// ─────────────────────────────────────────────
const AppLayout = ({
  menuItems = [],
  logo,
  user,
  onLogout,
  onChangePassword,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const {title}=useTitle()
  // Auto-derive title from last path segment — same logic as your AdminLayout
  const pageTitle = location.pathname.split("/").filter(Boolean).pop() || "Dashboard";

  const mainRef = useRef(null);

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
      mainRef.current.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location.pathname, location.search]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  // Track which sub-menus are expanded — auto-open if current path is inside that group
  const [expandedMenus, setExpandedMenus] = useState(() => {
    const initial = {};
    menuItems.forEach((item) => {
      if (item.subItems) {
        initial[item.name] = item.subItems.some((s) =>
          location.pathname.startsWith(s.path)
        );
      }
    });
    return initial;
  });

  const toggleMenu = (name) =>
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));

  const renderIcon = (icon, name) => {
    if (!icon) return null;
    return typeof icon === "string"
      ? <img src={icon} alt={name} className="w-5 h-5 object-contain flex-shrink-0" />
      : React.createElement(icon, { size: 20, className: "flex-shrink-0" });
  };

  const NavItems = ({ onLinkClick }) => (
    <nav className="flex-1 space-y-1 px-3">
      {menuItems.map((item) => {
        const hasSubItems = !!item.subItems;
        const isExpanded = expandedMenus[item.name];
        const isCategoryActive =
          hasSubItems &&
          item.subItems.some((s) => location.pathname.startsWith(s.path));

        return (
          <div key={item.name}>
            {hasSubItems ? (
              /* ── Parent toggle button ── */
              <>
                <button
                  type="button"
                  onClick={() => toggleMenu(item.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200 relative
                    ${isCategoryActive ? "bg-blue-50 text-[#0091D5]" : "text-gray-700 hover:bg-gray-50 hover:text-[#0091D5]"}`}
                >
                  <div className="flex items-center gap-3">
                    {renderIcon(item.icon, item.name)}
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                    {/* Blue right-side indicator when a child is active */}
                    {isCategoryActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[4px] h-8 bg-[#0091D5] rounded-l-full" />
                    )}
                  </div>
                </button>

                {/* ── Sub-items with curved connector ── */}
                {isExpanded && (
                  <div className="ml-9 mt-1 space-y-1 border-l border-gray-200 relative">
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        onClick={onLinkClick}
                        className={({ isActive }) =>
                          `flex items-center px-6 py-2.5 text-[14px] font-medium transition-colors relative
                          ${isActive ? "text-[#0091D5]" : "text-gray-600 hover:text-[#0091D5]"}`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {/* Curved connector line */}
                            <div className={`absolute -left-[1px] top-0 bottom-0 w-[1px] ${isActive ? "bg-[#0091D5]" : "bg-transparent"}`}>
                              <div className="absolute rounded top-1/2 left-0 w-3 h-[1px] bg-gray-200" />
                            </div>
                            <span>{sub.name}</span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* ── Standard NavLink ── */
              <NavLink
                to={item.path}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200
                  ${isActive ? "bg-blue-50 text-[#0091D5]" : "text-gray-700 hover:bg-gray-50 hover:text-[#0091D5]"}`
                }
              >
                {({ isActive }) => (
                  <>
                    {renderIcon(item.icon, item.name)}
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">

      {/* ════════════ DESKTOP SIDEBAR ════════════ */}
      <aside className="hidden md:flex w-[260px] h-screen sticky top-0 bg-white border-r-2 border-[#E5E7EB] flex-col py-6 overflow-y-auto flex-shrink-0">
        <div className="px-6 mb-10 flex justify-center">
          {logo && <img src={logo} alt="Logo" className="h-11 w-auto object-contain" />}
        </div>
        <NavItems />
      </aside>

      {/* ════════════ MOBILE DRAWER OVERLAY ════════════ */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ════════════ MOBILE DRAWER ════════════ */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-white border-r-2 border-[#E5E7EB] flex flex-col py-6 overflow-y-auto transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="px-6 mb-10 flex items-center justify-between">
          {logo && <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <NavItems onLinkClick={() => setSidebarOpen(false)} />
      </aside>

      {/* ════════════ MAIN CONTENT AREA ════════════ */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">

        {/* ── Header ── */}
        <header className="flex items-center justify-between px-4 sm:px-8 py-3 bg-white border-b-2 border-[#E5E7EB] flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <Menu size={22} />
            </button>
            {/* Logo in header — mobile only (when drawer is closed) */}
            {logo && (
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-auto object-contain md:hidden"
              />
            )}
            <h1 className="text-lg font-bold text-gray-800 capitalize hidden sm:block">{title}</h1>
          </div>

          {/* Desktop ProfileMenu */}
          <div className="hidden md:block">
            <ProfileMenu
              user={user}
              onLogout={onLogout}
              onChangePassword={onChangePassword}
              isMobile={false}
            />
          </div>

          {/* Mobile: title center + avatar right */}
          <h1 className="text-base font-bold text-gray-800 capitalize sm:hidden absolute left-1/2 -translate-x-1/2">
            {title}
          </h1>
          <div className="md:hidden">
            <ProfileMenu
              user={user}
              onLogout={onLogout}
              onChangePassword={onChangePassword}
              isMobile={true}
            />
          </div>
        </header>

        {/* ── Page Content ── */}
        <main ref={mainRef} className="scroll-reset-target flex-1 overflow-y-auto p-3">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AppLayout;