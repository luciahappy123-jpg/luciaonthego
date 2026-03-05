# Lucia On The Go

這是一個為「Lucia On The Go」打造的全球旅遊日誌網站。
本專案的特色亮點在於首頁具備全螢幕、緩慢旋轉探險感的互動式世界地圖，且地圖使用的是開源免費、免註冊 API 金鑰的 **React-Leaflet** 搭配 **OpenStreetMap / CartoDB** 方案，並以溫暖的大地色系呈現。

## 技術堆疊

*   **前端框架**：[Next.js](https://nextjs.org) (App Router)
*   **語言**：TypeScript
*   **樣式**：Tailwind CSS (客製化大地色系 Earth Tones)
*   **地圖套件**：[Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
*   **字型**：Playfair Display (標題) 與 Inter (內文)

## 如何開始

請先在本地端啟動開發伺服器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

接著在瀏覽器中開啟 [http://localhost:3000](http://localhost:3000) 即可查看首頁的互動地圖效果。

您可以透過修改 `app/page.tsx` 或 `components/MapBackground.tsx` 來開始編輯頁面內容或調整地圖設定。頁面會在您存檔時自動更新。

## 關於地圖元件

本專案使用 `next/dynamic` 動態載入 `MapBackground.tsx` 元件並關閉 SSR (`ssr: false`)，以解決 Leaflet 依賴瀏覽器 `window` 物件而在伺服器端渲染時發生錯誤的問題。

圖磚預設使用 `CartoDB` 的乾淨底圖，若有需要也可以隨時替換為一般的 `OpenStreetMap` 圖磚網址。
