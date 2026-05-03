"use client";

import { signout } from "@/app/auth/actions";
import ThemeToggle from "@/components/theme-toggle";
import Inbox from "@/components/inbox";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CareerAcLogo from "@/components/careerac-logo";

interface HeaderProps {
  userEmail: string | null;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plan/new", label: "New Plan" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/courses", label: "Browse Courses" },
  { href: "/settings", label: "My Courses" },
];

function navLinkClass(active: boolean) {
  return cn(
    "group relative inline-flex h-9 items-center justify-center rounded-lg border px-3 text-[13px] font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-white/20 dark:focus-visible:ring-offset-zinc-950",
    active
      ? "border-zinc-200 bg-white text-zinc-900 shadow-[0_1px_2px_rgba(24,24,27,0.06)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
      : "border-transparent text-zinc-500 hover:-translate-y-px hover:border-zinc-200/80 hover:bg-white/90 hover:text-zinc-900 hover:shadow-[0_8px_18px_rgba(24,24,27,0.07)] dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/90 dark:hover:text-white",
  );
}

function mobileNavLinkClass(active: boolean) {
  return cn(
    "flex h-10 items-center rounded-lg border px-3 text-sm font-medium transition-[background-color,border-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 dark:focus-visible:ring-white/20",
    active
      ? "border-zinc-200 bg-white text-zinc-900 shadow-[0_1px_2px_rgba(24,24,27,0.06)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
      : "border-transparent text-zinc-500 hover:border-zinc-200 hover:bg-white hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-white",
  );
}

function isActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false;

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
  if (href === "/courses") {
    return pathname === "/courses";
  }
  if (href === "/settings") {
    return pathname === "/settings";
  }
  return pathname === href;
}

export default function Header({ userEmail }: HeaderProps) {
  const pathname = usePathname() ?? "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 bg-white/85 backdrop-blur-xl transition-all duration-300 dark:border-zinc-800/70 dark:bg-zinc-950/85">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and desktop nav */}
          <div className="flex items-center gap-5">
            <Link href="/dashboard" className="flex shrink-0 items-center">
              <CareerAcLogo width={168} height={34} className="h-7 max-w-[8.5rem] sm:h-8 sm:max-w-none" priority />
            </Link>
            <nav
              className="hidden items-center gap-1 rounded-xl border border-zinc-200/70 bg-zinc-50/70 p-1 dark:border-zinc-800/70 dark:bg-zinc-900/40 lg:flex"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href, pathname) ? "page" : undefined}
                  className={navLinkClass(isActive(link.href, pathname))}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side: user info, sign out, mobile menu button */}
          <div className="flex shrink-0 items-center gap-2">
            {userEmail && (
              <span className="mr-1 hidden max-w-48 truncate rounded-lg border border-transparent px-2 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 xl:inline">
                {userEmail}
              </span>
            )}
            <Inbox />
            <ThemeToggle />
            <form action={signout} className="hidden lg:block">
              <button
                type="submit"
                style={{ fontSize: 12, lineHeight: "16px" }}
                className="inline-flex h-8 cursor-pointer items-center rounded-lg border border-transparent px-2.5 text-[12px] font-medium text-zinc-500 transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:border-zinc-200 hover:bg-white hover:text-zinc-900 hover:shadow-[0_6px_14px_rgba(24,24,27,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-white dark:focus-visible:ring-white/20 dark:focus-visible:ring-offset-zinc-950"
              >
                Sign Out
              </button>
            </form>

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 shadow-[0_1px_2px_rgba(24,24,27,0.05)] transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-zinc-300 hover:text-zinc-900 hover:shadow-[0_8px_18px_rgba(24,24,27,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-white lg:hidden cursor-pointer"
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
          <div className="border-t border-zinc-200 py-3 dark:border-zinc-800 lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href, pathname) ? "page" : undefined}
                  className={mobileNavLinkClass(isActive(link.href, pathname))}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {userEmail && (
                <span className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 lg:hidden break-all">
                  {userEmail}
                </span>
              )}
              <form action={signout} className="mt-1 border-t border-zinc-100 pt-2 dark:border-zinc-800">
                <button
                  type="submit"
                  style={{ fontSize: 12, lineHeight: "16px" }}
                  className="flex h-9 w-full cursor-pointer items-center rounded-lg border border-transparent px-3 text-left text-[12px] font-medium text-zinc-500 transition-[background-color,border-color,color] hover:border-zinc-200 hover:bg-white hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-white"
                >
                  Sign Out
                </button>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
