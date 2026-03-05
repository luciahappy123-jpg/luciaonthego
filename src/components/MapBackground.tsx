'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// 建立取得客製化圖示的函式，確保在客戶端才實例化
const getEarthToneIcon = () => {
    return L.divIcon({
        className: 'bg-transparent border-none',
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#C86F52" stroke="#2F3E35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 32px; height: 32px; filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.4)); transform: translate(-4px, -8px);"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#F4F1EA"></circle></svg>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

// 地標資料，我們將「東京」、「摩洛哥」與「加拿大」作為展示點
const travelSpots = [
    {
        id: 1,
        name: '2026年 2月 東京近郊小旅行',
        position: [35.6895, 139.6917] as [number, number],
        description: '穿梭在下北澤的古著街與箱根的溫泉鄉，感受冬末初春的微寒與美好。',
        slug: 'tokyo-kanazawa-sawara-2026'
    },
    {
        id: 2,
        name: '2025年 9月 加拿大洛磯山脈',
        position: [52.8734, -118.0825] as [number, number], // 賈斯珀國家公園附近
        description: '搭乘觀光火車，在360度玻璃圓頂看盡湖光山色，體驗一場世界最佳旅程。',
        slug: 'canada-rocky-mountaineer-2025'
    },
    {
        id: 3,
        name: '2026年 3月 摩洛哥之旅',
        position: [31.7917, -7.0926] as [number, number],
        description: '從馬拉喀什的紅城迷宮到撒哈拉沙漠的星空，一場色彩斑斕的北非探險。',
        slug: '#' // 尚未撰寫的文章
    }
];

// 處理地圖緩慢平移邏輯的子元件
function AnimatedMap() {
    const map = useMap();
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        map.attributionControl.setPrefix(false);

        let isInteracting = false;
        map.on('mousedown', () => { isInteracting = true; });
        map.on('touchstart', () => { isInteracting = true; });
        map.on('mouseup', () => { isInteracting = false; });
        map.on('touchend', () => { isInteracting = false; });

        const animateMap = () => {
            if (!isInteracting) {
                map.panBy([0.15, 0], { animate: false });
            }
            requestRef.current = requestAnimationFrame(animateMap);
        };

        requestRef.current = requestAnimationFrame(animateMap);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            map.off('mousedown');
            map.off('touchstart');
            map.off('mouseup');
            map.off('touchend');
        };
    }, [map]);

    return null;
}

export default function MapBackground() {
    return (
        <div className="absolute inset-0 z-0 bg-earth-ocean">
            <MapContainer
                center={[25, 65]}
                zoom={3}
                zoomControl={false}
                scrollWheelZoom={true}
                dragging={true}
                doubleClickZoom={true}
                className="h-full w-full cursor-grab active:cursor-grabbing"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <AnimatedMap />

                {/* 渲染旅行地標 */}
                {travelSpots.map(spot => (
                    <Marker key={spot.id} position={spot.position} icon={getEarthToneIcon()}>
                        <Popup className="font-sans">
                            <div className="text-earth-text">
                                <h3 className="font-serif font-bold text-lg mb-1 leading-snug">{spot.name}</h3>
                                <p className="text-sm opacity-80 mt-2 leading-relaxed">{spot.description}</p>
                                <div className="mt-4 text-right">
                                    {spot.slug !== '#' ? (
                                        <a href={`/posts/${spot.slug}`} className="inline-block text-xs bg-earth-accent text-earth-ocean px-4 py-2 rounded-full hover:bg-earth-text transition-colors duration-300 tracking-wider">
                                            閱讀旅誌
                                        </a>
                                    ) : (
                                        <span className="inline-block text-xs bg-gray-300 text-gray-500 px-4 py-2 rounded-full tracking-wider cursor-not-allowed">
                                            即將推出
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

            </MapContainer>

            {/* 覆蓋層避免干擾滑鼠點擊 */}
            <div className="absolute inset-0 bg-earth-ocean mix-blend-multiply opacity-50 pointer-events-none" />
        </div>
    );
}
