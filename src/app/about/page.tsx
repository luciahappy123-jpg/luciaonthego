import Header from '@/components/Header';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-earth-ocean py-24 px-6 md:px-12 text-earth-text selection:bg-earth-accent/30 selection:text-earth-text relative overflow-hidden">
            <Header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 md:px-12 py-6 text-earth-text" />

            <div className="max-w-4xl mx-auto mt-12 md:mt-20">
                <div className="bg-[#F4F1EA] rounded-3xl p-8 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-earth-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    
                    <header className="mb-12 relative z-10">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-wide text-earth-text">關於我</h1>
                        <p className="font-sans text-earth-accent tracking-[0.2em] uppercase text-sm font-semibold">About Lucia</p>
                    </header>

                    <div className="prose prose-lg md:prose-xl prose-stone max-w-none font-sans font-light text-earth-text/90 leading-relaxed relative z-10">
                        <p>你好，我是 Lucia。</p>
                        
                        <p>當孩子們如羽翼豐滿的鳥兒，飛向各自的天空、選擇在他鄉發展她們的人生時，我和先生正式迎來了人生的「空巢期」。但對我們而言，這不是停滯，而是全新探索的開始。有了更多的時間與空間，以及還算不錯的體力，我們給了自己最正當的藉口——去看看這個遼闊的世界。</p>

                        <p>這幾年來，我的足跡遍佈了各地。從歐洲中世紀古城的文化洗禮（英國、荷蘭、比利時、盧森堡、東歐四國與克羅埃西亞），到日本的大自然與溫泉探秘（北海道的森林健行、長野的野澤溫泉、九州的七星豪華列車），再到土耳其卡帕多奇亞的熱氣球與東南亞的慢活時光。我喜歡在城市裡隨性漫步，品味當地的咖啡與美食；也熱愛充滿挑戰的自然健行，在深山秘湖旁與大自然重新連線，甚至偶爾還要在北海道的森林裡經歷與棕熊擦肩而過的驚魂記！</p>

                        <p>除了欣賞世界各地的絕美風景，旅行對我來說，更是與所愛之人相聚的珍貴時光。無論是飛往倫敦與劍橋陪伴女兒，還是與先生在海外度過特別的情人節，抑或是與多年好友在異國的相見歡，這些人情與溫度，才是每一趟旅程中最無法取代的風景。</p>

                        <p>「Lucia On The Go」這個網站，是我記錄足跡的專屬空間。這裡沒有華麗的旅遊攻略，只有最真實的所見所聞、汗水與感動。希望這些用腳步寫下的旅行日記，也能帶給你一絲對世界的嚮往。</p>

                        <p className="text-xl font-serif italic font-medium mt-12 text-earth-text">
                            探索世界，紀錄足跡。<br/>
                            我是 Lucia，我一直在路上。
                        </p>
                    </div>
                    
                    <div className="mt-16 text-center relative z-10">
                        <Link href="/" className="inline-block text-sm font-sans tracking-widest uppercase border border-earth-text/20 rounded-full px-8 py-3 hover:bg-earth-text hover:text-earth-ocean transition-all duration-300">
                            ← 返回地圖探索
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
