'use client';

import { HomeIcon, CircleDollarSign, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export default function BottomNav() {
  const pathname = usePathname();
  const { session } = useFirebaseAuth();

  if (pathname?.startsWith('/earn/') && pathname !== '/earn') {
    return null;
  }

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: HomeIcon,
    },
    {
      name: 'Earn',
      href: '/earn',
      icon: CircleDollarSign,
    },
    {
      name: 'Profile',
      href: session?.user?.name ? `/profile/${session.user.name}` : '/profile',
      icon: UserCircle,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/75 border-t border-zinc-800 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.name === 'Profile' && pathname?.startsWith('/profile/'));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-300 transition-colors duration-200'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
