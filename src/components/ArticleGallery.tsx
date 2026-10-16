'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export type GalleryPhoto = {
    src: string;
    thumbnail: string;
    alt: string;
    width: number;
    height: number;
};

export type GalleryVideo = {
    src: string;
    poster: string;
    caption: string;
    duration: number;
};

export type GalleryData = {
    title: string;
    photos: GalleryPhoto[];
    videos: GalleryVideo[];
    previewCount?: number;
};

export default function ArticleGallery({ title, photos, videos, previewCount = 6 }: GalleryData) {
    const [expanded, setExpanded] = useState(false);
    const [active, setActive] = useState<number | null>(null);
    const dialog = useRef<HTMLDialogElement>(null);
    const touchStart = useRef<number | null>(null);
    const titleId = useId();
    const gridId = useId();
    const isOpen = active !== null;
    const currentPhoto = active === null ? null : photos[active];
    const visiblePhotos = expanded ? photos : photos.slice(0, previewCount);

    useEffect(() => {
        if (!isOpen) {
            dialog.current?.close();
            return;
        }
        dialog.current?.showModal();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previousOverflow; };
    }, [isOpen]);

    const move = (direction: number) => setActive(index => index === null ? null : (index + direction + photos.length) % photos.length);

    return (
        <section aria-label={title} className="not-prose my-10 border-t border-earth-text/15 pt-5">
            <p className="mb-4 flex items-center gap-2 text-sm tracking-wide text-earth-text/65">
                <span>{photos.length} 張照片{videos.length > 0 ? ` · ${videos.length} 段影片` : ''}</span>
                <span className="ml-auto text-xs">點照片放大看</span>
            </p>
            <div id={gridId} className="grid auto-rows-[110px] grid-cols-2 gap-2 sm:auto-rows-[145px] sm:grid-cols-3 sm:gap-3">
                {visiblePhotos.map((photo, index) => (
                    <button key={photo.src} type="button" onClick={() => setActive(index)}
                        aria-label={`放大照片：${photo.alt}（${index + 1}/${photos.length}）`}
                        className={`group relative overflow-hidden rounded-lg bg-earth-land/25 outline-offset-4 focus-visible:outline-2 focus-visible:outline-earth-accent ${index === 0 ? 'col-span-2 row-span-2' : ''} ${index === 5 && !expanded ? 'col-span-2 sm:col-span-1' : ''}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.thumbnail} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async"
                            className="h-full w-full object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.03]" />
                        <span aria-hidden="true" className="absolute bottom-2 right-2 rounded-full bg-black/40 p-1.5 text-white"><Maximize2 size={14} /></span>
                    </button>
                ))}
            </div>
            {photos.length > previewCount && (
                <button type="button" aria-expanded={expanded} aria-controls={gridId} onClick={() => setExpanded(value => !value)}
                    className="mt-4 w-full rounded-lg border border-earth-text/20 px-4 py-3 text-sm text-earth-text hover:bg-earth-land/20 focus-visible:outline-earth-accent">
                    {expanded ? '收起照片' : `展開其餘 ${photos.length - previewCount} 張照片`}
                </button>
            )}
            {videos.length > 0 && (
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    {videos.map(video => (
                        <figure key={video.src} className="m-0 overflow-hidden rounded-lg border border-earth-text/10 bg-white/40">
                            <video controls playsInline preload="none" poster={video.poster} aria-label={video.caption}
                                className="aspect-[4/3] w-full bg-black object-contain">
                                <source src={video.src} type="video/mp4" />
                                <a href={video.src}>下載影片</a>
                            </video>
                            <figcaption className="flex justify-between gap-3 px-3 py-2.5 text-xs leading-relaxed text-earth-text/75">
                                <span>{video.caption}</span><span className="shrink-0 tabular-nums">{Math.floor(video.duration / 60)}:{String(Math.round(video.duration % 60)).padStart(2, '0')}</span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            )}
            <dialog ref={dialog} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); setActive(null); }}
                onClick={event => { if (event.target === event.currentTarget) setActive(null); }}
                onKeyDown={event => {
                    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
                }}
                className="fixed inset-0 m-auto h-[100dvh] max-h-none w-screen max-w-none border-0 bg-[#18211cf7] p-4 text-white backdrop:bg-black/80 sm:p-8">
                {currentPhoto && (
                    <div className="mx-auto flex h-full max-w-6xl flex-col">
                        <div className="flex items-center justify-between gap-4 pb-4">
                            <p id={titleId} className="text-sm">{title} · {(active ?? 0) + 1} / {photos.length}</p>
                            <button type="button" autoFocus onClick={() => setActive(null)} aria-label="關閉照片" className="rounded-full p-2 hover:bg-white/15"><X /></button>
                        </div>
                        <div className="relative flex min-h-0 flex-1 items-center justify-center"
                            onTouchStart={event => { touchStart.current = event.touches[0].clientX; }}
                            onTouchEnd={event => {
                                if (touchStart.current !== null) {
                                    const difference = event.changedTouches[0].clientX - touchStart.current;
                                    if (Math.abs(difference) > 50) move(difference < 0 ? 1 : -1);
                                    touchStart.current = null;
                                }
                            }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={currentPhoto.src} alt={currentPhoto.alt} width={currentPhoto.width} height={currentPhoto.height} className="h-full max-h-full w-full object-contain" />
                            <button type="button" onClick={() => move(-1)} aria-label="上一張照片" className="absolute left-0 rounded-full bg-black/50 p-2 hover:bg-black/80"><ChevronLeft /></button>
                            <button type="button" onClick={() => move(1)} aria-label="下一張照片" className="absolute right-0 rounded-full bg-black/50 p-2 hover:bg-black/80"><ChevronRight /></button>
                        </div>
                        <p className="pt-4 text-center text-sm text-white/85">{currentPhoto.alt}</p>
                    </div>
                )}
            </dialog>
        </section>
    );
}
