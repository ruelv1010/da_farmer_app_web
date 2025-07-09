"use client";

import React, { useState, useRef, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import { LogoutConfirmationDialog } from "./LogoutConfirmationDialog";

const Logo = React.memo(() => (
  <img src="/assets/logo_da.png" className="h-15 w-15" alt="Logo" />
));

const MemoizedNav = React.memo(function NavMenu() {
  return <nav className="flex gap-1">{/* Nav items here */}</nav>;
});

export default function Header() {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setShowLogoutConfirmation(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirmation(false);
    // perform actual logout here
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="w-full bg-[#15803D] shadow py-4 px-6 flex items-center justify-between border-b border-b-[var(--border)]">
        <div className="flex gap-3 items-center">
          <Logo />
          <span className="text-3xl font-bold text-white">MAO LALA </span>
          <MemoizedNav />
        </div>

        <div className="relative" ref={dropdownRef}>
          <img
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKeGutL0mRPw0NfKqjb5-NdQOsno6TAtZKsYA6Lu3w2d5efiQnKJFXEY0J2L7tGHE77UuyaZ7xmLFULq4XipO5fvUnJwXztXBGfYmoHA"
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover border border-gray-300 cursor-pointer"
          />

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  // Navigate to profile page if needed
                  alert("Go to Profile");
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
              >
                <User className="w-4 h-4" /> Profile
              </button>
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <LogoutConfirmationDialog
        isOpen={showLogoutConfirmation}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        isLoading={false}
      />
    </>
  );
}
