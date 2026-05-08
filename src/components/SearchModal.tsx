'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Search } from 'lucide-react';

interface PostData {
    slug: string;
    title: string;
    date: string;
    description: string;
    location?: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [posts, setPosts] = useState<PostData[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // ESC 關閉
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    // 載入資料與聚焦
    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setFilteredPosts([]);
            // Wait for transition to finish before focusing to prevent jumping
            setTimeout(() => inputRef.current?.focus(), 100);

            if (posts.length === 0) {
                setIsLoading(true);
                fetch('/api/posts')
                    .then(res => res.json())
                    .then(data => {
                        setPosts(data);
                        setIsLoading(false);
                    })
                    .catch(() => setIsLoading(false));
            }
        }
    }, [isOpen, posts.length]);

    // 搜尋邏輯
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredPosts([]);
            return;
        }

        const lowerCaseTerm = searchTerm.toLowerCase();
        const results = posts.filter(post => {
            return (
                post.title.toLowerCase().includes(lowerCaseTerm) ||
                (post.location && post.location.toLowerCase().includes(lowerCaseTerm)) ||
                (post.description && post.description.toLowerCase().includes(lowerCaseTerm))
            );
        });
        setFilteredPosts(results);
    }, [searchTerm, posts]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center pt-[10vh] px-4 sm:px-6">
            {/* 背景遮罩 */}
            <div 
                className="absolute inset-0 bg-earth-ocean/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* 搜尋框與結果 */}
            <div className="relative w-full max-w-2xl bg-[#F4F1EA] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center px-6 py-4 border-b border-earth-text/10">
                    <Search className="w-5 h-5 text-earth-text/50 mr-4" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="搜尋遊記標題、地點或關鍵字..."
                        className="flex-1 bg-transparent border-none outline-none text-earth-text placeholder:text-earth-text/40 font-sans text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                        onClick={onClose}
                        className="p-2 text-earth-text/50 hover:text-earth-accent transition-colors rounded-full hover:bg-earth-text/5"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
                    {isLoading ? (
                        <div className="p-8 text-center text-earth-text/50 font-sans text-sm">載入中...</div>
                    ) : searchTerm.trim() && filteredPosts.length === 0 ? (
                        <div className="p-8 text-center text-earth-text/50 font-sans text-sm">找不到符合條件的遊記。</div>
                    ) : (
                        <div className="py-2">
                            {filteredPosts.map(post => (
                                <Link 
                                    href={`/posts/${post.slug}`} 
                                    key={post.slug}
                                    onClick={onClose}
                                    className="block px-6 py-4 hover:bg-white/60 transition-colors border-l-2 border-transparent hover:border-earth-accent"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-serif font-bold text-earth-text text-lg">{post.title}</h3>
                                        <span className="text-xs font-sans tracking-wider text-earth-text/50">{post.date}</span>
                                    </div>
                                    <p className="text-sm font-sans text-earth-text/70 line-clamp-1">
                                        {post.location && <span className="font-semibold text-earth-accent mr-2">{post.location}</span>}
                                        {post.description}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
