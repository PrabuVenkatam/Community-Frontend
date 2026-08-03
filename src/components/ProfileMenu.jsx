import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, KeyRound, LogOut, X } from "lucide-react";

const ProfileMenu = ({ user, onChangePassword, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    setFormError("");
    await onChangePassword?.({
      oldPassword,
      newPassword,
      confirmPassword,
    });
    setIsChangePasswordModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
        >
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border border-gray-100">
            <span className="text-lg">{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || "User"}</p>
            <p className="text-[12px] text-blue-600 font-medium capitalize">{user?.role || "User"}</p>
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-[260px] rounded-2xl border border-[#E5E7EB] bg-white shadow-xl z-50">
            <div className="px-4 py-3 border-b border-[#E5E7EB]">
              <p className="text-base font-semibold text-gray-900">{user?.name || "User"}</p>
              <p className="text-sm text-blue-600 capitalize">{user?.role || "User"}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setFormError("");
                setIsChangePasswordModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
            >
              <span className="flex items-center gap-3 text-[17px] text-gray-800">
                <KeyRound size={18} />
                Change Password
              </span>
              <ChevronRight size={18} className="text-gray-500" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsLogoutModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left border-t border-[#E5E7EB] hover:bg-gray-50 text-[17px] text-gray-800 rounded-b-2xl"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-[470px] rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-end p-4 pb-0">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="px-8 pb-8 text-center">
              <h3 className="text-[20px] font-bold text-gray-900">Ready to head out?</h3>
              <p className="mt-2 text-[16px] text-gray-500">You&apos;re about to log out. See you next time!</p>
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="flex-1 rounded-xl border border-gray-300 px-2 py-3 text-[16px] font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 rounded-xl bg-[#171717] px-2 py-3 text-[16px] font-semibold text-white hover:bg-[#171717]"
                >
                  Stay Logged In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-end p-4 pb-0">
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4 px-8 pb-8">
              <h3 className="text-[20px] font-bold text-gray-900">Change Password</h3>
              <div>
                <label className="mb-2 block text-[15px] font-semibold text-gray-800">Old Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-[#171717]"
                />
              </div>
              <div>
                <label className="mb-2 block text-[15px] font-semibold text-gray-800">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-[#171717]"
                />
              </div>
              <div>
                <label className="mb-2 block text-[15px] font-semibold text-gray-800">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-[#171717]"
                />
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <div className="pt-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleChangePasswordSave}
                  className="flex-1 rounded-xl bg-[#171717] px-4 py-2 text-lg font-semibold text-white hover:bg-[#171717]"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileMenu;
