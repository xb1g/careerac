"use client";

import { signout } from "@/app/auth/actions";
import ThemeToggle from "@/components/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  userEmail: string | null;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plan/new", label: "New Plan" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/settings", label: "My Courses" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  // For /plan/new, match /plan/new exactly and /plan/[id]
  if (href === "/plan/new") {
    return pathname === "/plan/new";
  }
  if (href === "/playbooks") {
    return pathname === "/playbooks" || pathname.startsWith("/playbooks/");
  }
  if (href === "/settings") {
    return pathname === "/settings";
  }
  return pathname === href;
}

export default function Header({ userEmail }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and desktop nav */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-zinc-900 dark:text-white">
              CareerAC
            </Link>
            <nav className="hidden sm:flex items-center gap-6" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[14px] font-semibold tracking-wide transition-all duration-200 px-3 py-1.5 rounded-full ${
                    isActive(link.href, pathname)
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side: user info, sign out, mobile menu button */}
          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400 hidden sm:inline mr-2">
                {userEmail}
              </span>
            )}
            <ThemeToggle />
            <form action={signout}>
              <button
                type="submit"
                className="text-[14px] font-semibold tracking-wide text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200"
              >
                Sign Out
              </button>
            </form>

            {/* Mobile menu button */}
            <button
              type="button"
              className="sm:hidden p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-zinc-200 dark:border-zinc-800 py-3">
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href, pathname)
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {userEmail && (
                <span className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 sm:hidden">
                  {userEmail}
                </span>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
