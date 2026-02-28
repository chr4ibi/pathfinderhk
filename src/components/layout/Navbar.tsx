"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/chat", label: "Chat" },
];

// Pages that manage their own full-screen layout
const HIDDEN_ON = ["/", "/auth", "/onboard"];

export default function Navbar() {
  const pathname = usePathname();

  const hidden = HIDDEN_ON.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (hidden) return null;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm select-none">
            P
          </div>
          <span className="font-semibold text-white">PathfinderHK</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Start over */}
        <Link
          href="/onboard"
          className="text-sm text-slate-400 hover:text-white transition-colors shrink-0"
        >
          Start over →
        </Link>
      </div>
    </nav>
  );
}
