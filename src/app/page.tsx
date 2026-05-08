'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Header from '@/components/Header';

// 使用 next/dynamic 並關閉 ssr，確保 Leaflet 只在瀏覽器端載入
const MapBackground = dynamic(() => import('@/components/MapBackground'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-earth-ocean">

      {/* 頂部導覽列 */}
      <Header className="absolute top-0 w-full z-20 flex justify-between items-center px-6 md:px-12 py-6 text-earth-text pointer-events-auto drop-shadow-sm" />

      {/* 互動地圖背景 */}
      <MapBackground />

      {/* 前景內容 */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center slide-up-fade-in pointer-events-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-wider text-earth-text mb-4 drop-shadow-sm">
            Lucia
            <span className="block text-2xl md:text-4xl font-sans font-light mt-4 tracking-[0.3em] text-earth-accent drop-shadow-sm">
              ON THE GO
            </span>
          </h1>
          <p className="mt-8 font-sans text-sm tracking-widest text-earth-text/90 uppercase drop-shadow-sm font-medium">
            探索世界 ‧ 紀錄足跡
          </p>
        </div>
      </div>

    </main>
  );
}
