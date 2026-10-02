'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, X } from 'lucide-react';
import SearchModal from './SearchModal';

interface HeaderProps {
    className?: string;
}

export default function Header({ className = "absolute top-0 w-full z-20 flex justify-between items-center px-6 md:px-12 py-6 text-earth-text pointer-events-auto" }: HeaderProps) {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isHome = pathname === '/';
    const isPosts = pathname === '/posts';
    const isAbout = pathname === '/about';

    return (
        <>
            <header className={className}>
                <Link href="/" className="font-serif font-bold text-xl tracking-widest hover:opacity-70 transition-opacity">
                    LUCIA.
                </Link>
                <nav className="hidden md:flex gap-8 text-sm font-sans tracking-widest uppercase items-center">
                    <Link href="/" className={`${isHome ? 'text-earth-accent font-semibold border-b border-earth-accent pb-1' : 'hover:text-earth-accent transition-colors'}`}>地圖探索</Link>
                    <Link href="/posts" className={`${isPosts ? 'text-earth-accent font-semibold border-b border-earth-accent pb-1' : 'hover:text-earth-accent transition-colors'}`}>旅誌列表</Link>
                    <Link href="#" className="hover:text-earth-accent transition-colors">系列故事</Link>
                    <Link href="/about" className={`${isAbout ? 'text-earth-accent font-semibold border-b border-earth-accent pb-1' : 'hover:text-earth-accent transition-colors'}`}>關於</Link>
                    <button 
                        aria-label="搜尋" 
                        className="ml-4 hover:text-earth-accent transition-colors"
                        onClick={() => setIsSearchOpen(true)}
                    >
                        <Search size={18} />
                    </button>
                </nav>
                <div className="flex md:hidden gap-5 items-center">
                    <button aria-label="搜尋" onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }}>
                        <Search className="w-5 h-5 hover:text-earth-accent transition-colors" />
                    </button>
                    <button
                        aria-label={isMenuOpen ? '關閉選單' : '選單'}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-navigation"
                        onClick={() => setIsMenuOpen(open => !open)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 hover:text-earth-accent transition-colors" />}
                    </button>
                </div>
                {isMenuOpen && (
                    <nav id="mobile-navigation" aria-label="手機導覽" className="absolute top-full left-4 right-4 md:hidden flex flex-col gap-1 rounded-2xl bg-earth-ocean p-4 shadow-lg border border-earth-text/10">
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:text-earth-accent">地圖探索</Link>
                        <Link href="/posts" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:text-earth-accent">旅誌列表</Link>
                        <Link href="/about" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 hover:text-earth-accent">關於</Link>
                    </nav>
                )}
            </header>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
