'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
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
    },
    {
        id: 4,
        name: '2024年 11月 日本九州七星列車之旅',
        position: [33.5902, 130.4017] as [number, number],
        description: '「夢幻鐵道之旅」搭乘日本九州七星豪華臥鋪列車，親身感受其極致服務與非凡魅力！',
        slug: 'kyushu-seven-stars-2024'
    },
    {
        id: 5,
        name: '2024年 9月 歐洲之旅：英國、荷蘭、比利時、盧森堡',
        position: [50.8503, 4.3517] as [number, number], // Brussels, Belgium
        description: '為期三週的歐洲行，從陪同女兒到劍橋大學報到開始，接續遊歷阿姆斯特丹的運河、布魯日的中世紀古城，以及小而美的盧森堡。',
        slug: 'benelux-2024'
    },
    {
        id: 7,
        name: '2024年 9月 歐洲之旅：第一站 英國劍橋',
        position: [52.2053, 0.1218] as [number, number], // Cambridge, UK
        description: '歐洲之旅的第一站，陪同女兒到劍橋大學報到，開啟這趟充滿感動與美麗的歐洲行。',
        slug: 'benelux-2024'
    },
    {
        id: 6,
        name: '2024年 9月 回到倫敦與女兒會合',
        position: [51.5074, -0.1278] as [number, number], // London, UK
        description: '第四站回到倫敦與女兒合體，週末快閃利物浦觀賞足球賽，並以美味的北京烤鴨為這趟歐洲行劃下完美句點。',
        slug: 'london-2024'
    },
    {
        id: 8,
        name: '2025年 6月 夏遊記｜東北海道釧路健行',
        position: [42.9848, 144.3816] as [number, number], // Kushiro, Hokkaido
        description: '飛向東北海道釧路，展開悠閒的市區散策，與各國健行團員相見歡，為一週的健行挑戰揭開序幕！',
        slug: 'hokkaido-kushiro-2025'
    },
    {
        id: 9,
        name: '2024年 5月 土耳其卡帕多奇亞與伊斯坦堡雙城遊記',
        position: [41.0082, 28.9784] as [number, number], // Istanbul, Turkey
        description: '橫跨歐亞大陸的國際級城市，超過 2,500 年歷史的文化薰陶，伊斯坦堡擁有融合歐亞特色的人文風情與無敵美景！',
        slug: 'turkey-istanbul-2024'
    },
    {
        id: 10,
        name: '2025年 1月 東京新春遊記',
        position: [35.6266, 139.7766] as [number, number], // Odaiba, Tokyo
        description: '東京新春旅遊記：為慶祝外甥考上名校，暢遊秋葉原、台場、富士電視台，與箱根溫泉小旅行，體驗溫馨滿滿的親情相聚。',
        slug: 'tokyo-2025'
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
                <MarkerClusterGroup chunkedLoading maxClusterRadius={30} showCoverageOnHover={false}>
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
                </MarkerClusterGroup>

            </MapContainer>

            {/* 覆蓋層避免干擾滑鼠點擊 */}
            <div className="absolute inset-0 bg-earth-ocean mix-blend-multiply opacity-50 pointer-events-none" />
        </div>
    );
}
