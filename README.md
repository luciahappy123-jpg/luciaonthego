# Lucia On The Go

這是一個為「Lucia On The Go」打造的全球旅遊日誌網站。

## 資料整理位置

正式 GitHub 專案為 [luciahappy123-jpg/luciaonthego](https://github.com/luciahappy123-jpg/luciaonthego)。依 Lucia 於 2026 年 10 月 2 日的指定，未來本網站的遊記、圖片、內容與程式都統一整理到此儲存庫。文章存於 `src/content/posts/`，圖片存於 `public/images/`；更新前先核對既有文章，避免同一旅程產生重複版本。

本專案的特色亮點在於首頁具備全螢幕、緩慢平移的互動式世界地圖，使用 **React-Leaflet** 搭配 **OpenStreetMap** 標準底圖，並以溫暖的大地色系呈現。

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

圖磚使用 `https://tile.openstreetmap.org/{z}/{x}/{y}.png`，保留 OpenStreetMap 署名並遵守其[圖磚使用政策](https://operations.osmfoundation.org/policies/tiles/)。原 CARTO 來源已回傳「API KEY REQUIRED」錯誤圖片，因此改用此來源。

## 網站檢查

啟動本地網站後，執行 `npm run check:site`，會檢查首頁、旅誌列表、關於頁、所有文章、找不到的文章與一張首頁底圖圖磚。這項檢查會辨識供應商回傳 HTTP 200 卻實際為金鑰錯誤圖片的情況。可用 `LUCIA_SITE_URL` 指定其他本地網址。
