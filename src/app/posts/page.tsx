import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import { Menu, Search } from 'lucide-react';

export default function PostsPage() {
    const posts = getSortedPostsData();

    return (
        <main className="min-h-screen bg-earth-ocean py-24 px-6 md:px-12 text-earth-text selection:bg-earth-accent/30 selection:text-earth-text relative">
            {/* 頂部導覽列 */}
            <header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 md:px-12 py-6 text-earth-text">
                <Link href="/" className="font-serif font-bold text-xl tracking-widest hover:opacity-70 transition-opacity">
                    LUCIA.
                </Link>
                <nav className="hidden md:flex gap-8 text-sm font-sans tracking-widest uppercase items-center">
                    <Link href="/" className="hover:text-earth-accent transition-colors">地圖探索</Link>
                    <Link href="/posts" className="text-earth-accent font-semibold transition-colors border-b border-earth-accent">旅誌列表</Link>
                    <Link href="#" className="hover:text-earth-accent transition-colors">系列故事</Link>
                    <Link href="#" className="hover:text-earth-accent transition-colors">關於</Link>
                    <button aria-label="搜尋" className="ml-4 hover:text-earth-accent transition-colors">
                        <Search size={18} />
                    </button>
                </nav>
                <button className="md:hidden">
                    <Menu className="w-6 h-6 hover:text-earth-accent transition-colors" />
                </button>
            </header>

            <div className="max-w-5xl mx-auto mt-12 md:mt-20">
                <header className="mb-16 md:mb-24 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-wide drop-shadow-sm">所有旅誌</h1>
                    <p className="font-sans text-earth-text/80 tracking-widest uppercase text-sm font-light">
                        探尋世界各個角落的足跡與隨筆
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <Link href={`/posts/${post.slug}`} key={post.slug} className="group flex flex-col pt-8 pb-10 px-8 bg-white/50 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                            <p className="text-earth-accent font-sans text-[11px] tracking-[0.15em] font-bold uppercase mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                                {post.location || '未知地點'} ‧ {post.date}
                            </p>
                            <h2 className="text-xl md:text-2xl font-serif font-bold mb-4 group-hover:text-earth-accent transition-colors leading-snug">
                                {post.title}
                            </h2>
                            {post.description && (
                                <p className="text-earth-text/70 font-sans font-light leading-relaxed text-sm mb-6 flex-grow line-clamp-3">
                                    {post.description}
                                </p>
                            )}
                            <div className="mt-auto pt-6 border-t border-earth-text/10 flex items-center justify-between text-xs font-sans tracking-widest font-semibold text-earth-text/50 group-hover:text-earth-accent transition-colors uppercase">
                                <span>Read Story</span>
                                <span className="text-lg leading-none transform group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
