"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Using <Link> instead of router.push() for instant client-side navigation.
// Link pre-fetches the page in the background, so tapping a nav item
// shows the new page almost instantly instead of waiting for a full navigation cycle.
export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { 
      label: 'Home', 
      icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />, 
      path: '/dashboard' 
    },
    { 
      label: 'Tenants', 
      icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>, 
      path: '/tenants' 
    },
    { 
      label: 'Rooms', 
      icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>, 
      path: '/rooms' 
    },
    { 
      label: 'Rent', 
      icon: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>, 
      path: '/rent' 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-23 py-3 flex justify-between items-center z-50 safe-bottom">
      {navItems.map((item, i) => {
        const isActive = pathname.startsWith(item.path);
        return (
          <Link 
            key={i} 
            href={item.path}
            prefetch={true}
            className="flex flex-col items-center gap-0.5 cursor-pointer transition-all duration-300 relative group active:scale-90"
          >
            {/* Active Highlight (Shadow) */}
            {isActive && (
              <div className="absolute -top-1 w-10 h-10 bg-[#00685F]/5 rounded-full blur-md -z-10 animate-pulse" />
            )}
            
            <div className={`p-0.5 rounded-xl transition-all duration-300 ${isActive ? 'text-[#00685F]' : 'text-[#94A3B8]'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {item.icon}
              </svg>
            </div>
            <span className={`text-[10.5px] font-semibold tracking-tight transition-colors ${isActive ? 'text-[#00685F]' : 'text-[#94A3B8] opacity-60'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
