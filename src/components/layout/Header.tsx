"use client";

import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { LogoutConfirmationDialog } from "./LogoutConfirmationDialog";

// Navigation items list
const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/borrower-dashboard", label: "Borrower Dashboard" },
  {
    to: "/lending/salary-loan-processing",
    label: "Lending",
    matchPath: "/lending",
  },
  {
    to: "/accounting/reports/daily-check-encashment-summary",
    label: "Accounting",
    matchPath: "/accounting",
  },
  {
    to: "/maintenance-and-security/general-setup/branch-setup",
    label: "Maintenance & Security",
    matchPath: "/maintenance-and-security",
  },
];

// Memoized logo to prevent flickering
const Logo = React.memo(() => (
  <img src="/assets/logo_da.png" className="h-20 w-20" alt="Logo" />
));

// Memoized nav menu
const MemoizedNav = React.memo(function NavMenu() {
  const location = useLocation();

  return (
    <nav className="flex gap-1">
      {navItems.map(({ to, label, matchPath }) => {
        const isActive = matchPath
          ? location.pathname.startsWith(matchPath)
          : location.pathname === to;

        return (
          <NavLink
            key={to}
            to={to}
            className={`text-[var(--foreground)] hover:bg-[var(--secondary)] rounded-lg px-4 py-2.5 ${
              isActive ? "bg-[var(--secondary)] font-semibold" : ""
            }`}
          >
            {label}
          </NavLink>
        );
      })}
    </nav>
  );
});

export default function Header() {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // Logout mutation

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <>
      <header className="bg-white shadow py-4 px-6 flex items-center justify-between border-b border-b-[var(--border)]">
        <div className="flex gap-8 items-center">
          <Logo />
          <MemoizedNav />
        </div>
        <div className="flex gap-6 items-center">
          <button
            onClick={handleLogoutClick}
            className="p-1 text-left text-sm text-red-600 hover:bg-gray-100 flex align-middle gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut width={20} height={20} />
          </button>
        </div>
      </header>

      <LogoutConfirmationDialog
        isOpen={showLogoutConfirmation}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        isLoading={true}
      />
    </>
  );
}
