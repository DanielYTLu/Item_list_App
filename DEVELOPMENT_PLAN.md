# 宿物 App — 完整開發計畫與進度追蹤紀錄 (Master Development Plan & Progress Tracker)

> 本文件記錄「宿物」(Shuwu App) 的完整開發計畫、資料架構、Phase 1 至 Phase 17 執行進度。每次任務開始前與結束後，請務必更新並調用此檔案以掌握最新進度。

---

## 📅 專案概況與目標
* **App 名稱**：「宿物」
* **核心標語**：「你的東西，我幫你記得。」
* **技術堆疊**：React 19 + TypeScript + Vite + Tailwind CSS v4 + Zustand + Lucide React + React Router v7
* **當前狀態**：專案環境與基本架構已備妥，正積極落實各功能模組。

---

## 🗺️ 開發階段規劃 (Phase 1 ~ Phase 17)
## 📱 設計準則 (Design Principles)
* **手機優先 (Mobile First)**：所有介面優先針對 375px~430px 手機螢幕寬度進行設計，確保觸控區域足夠大 (至少 44x44px)，並提供流暢的行動瀏覽體驗。
* **響應式佈局**：所有頁面內容限制在 `max-w-md` (或同等寬度)，確保在較大螢幕上不會過度拉伸，保持 App 使用體驗。
* **觸控友好**：避免過小的互動元素，按鈕與導航確保符合行動裝置的操作習慣。


| 階段 | 模組 / 功能名稱 | 狀態 | 備註說明 |
| :--- | :--- | :---: | :--- |
| **Phase 1** | 專案分析與架構 | ✅ **已完成** | 檢視現有環境、安裝 `@types/react` 型別、建立計畫書與基礎資料模型 |
| **Phase 2** | App Shell + Navigation + Design System | ✅ **已完成** | 底部導覽列、頂部問候、UI Design System (配色、字體、卡片樣式) |
| **Phase 3** | Space / Location 系統 | ✅ **已完成** | 空間與位置管理、巢狀結構、UI 介面與 Zustand Store 擴充 |
| **Phase 4** | Item CRUD | ✅ **已完成** | 物品建立、讀取、更新、刪除、檢視詳細資料 |
| **Phase 5** | 分類 + 搜尋 + 收藏 | ✅ **已完成** | 依分類篩選、全域搜尋、收藏（最愛）功能 |
| **Phase 6** | 照片系統 | ✅ **已完成** | 拍照 / 上傳圖片預覽與儲存支援 |
| **Phase 7** | Inventory / 消耗品管理 | ✅ **已完成** | 庫存數量、剩餘量警告、快速補貨 |
| **Phase 8** | Shopping List (購物清單) | ✅ **已完成** | 待買清單、勾選購買、從消耗品一鍵加入 |
| **Phase 9** | Loan Management (借出管理) | ✅ **已完成** | 記錄借給誰、借出日期、歸還狀態 |
| **Phase 10** | Reminder / Expiry (到期與提醒) | ✅ **已完成** | 食品/物品有效期限提醒、自訂提醒通知 |
| **Phase 11** | 清點模式 (Audit Mode) | ✅ **已完成** | 盤點空間物品、檢查遺漏或確認狀態 |
| **Phase 12** | 搬家模式 (Moving Mode) | ✅ **已完成** | 打包進度追蹤、按箱子/位置打包清單 |
| **Phase 13** | 統計與儀表板 (Stats) | ✅ **已完成** | 物品總數、分類佔比、空間分佈統計 |
| **Phase 14** | 設定 + Backup + Import / Export | ✅ **已完成** | 資料備份 (JSON)、還原、匯出 |
| **Phase 15** | 完整 UX 優化 | ✅ **已完成** | 手機優先微調、載入狀態、錯誤處理、流暢動畫 |
| **Phase 16** | Responsive / PWA / App 化準備 | ✅ **已完成** | 響應式優化、行動端觸控體驗、PWA 視窗與安全邊距适配 |
| **Phase 17** | 完整測試與 Bug 修正 | ✅ **已完成** | 全流程驗證、Console 檢查、最終驗收建置通過 |

---

## 📌 資料模型與架構設計

### 1. Space & Location (空間與位置)
```ts
export interface Location {
  id: string;
  spaceId: string;
  name: string;
  icon?: string;
}

export interface Space {
  id: string;
  name: string; // 例如：宿舍、家裡、租屋處
  icon?: string;
  createdAt: string;
}
```

### 2. Item (物品主檔)
```ts
export type ItemStatus = 'available' | 'lent' | 'missing' | 'consumed';

export interface Item {
  id: string;
  name: string;
  image?: string;
  category: string;
  spaceId: string;
  locationId: string;
  quantity: number;
  unit?: string; // 個、包、台、條...
  status: ItemStatus;
  purchaseDate?: string;
  price?: number;
  note?: string;
  
  // 進階屬性
  brand?: string;
  model?: string;
  purchaseUrl?: string;
  favorite: boolean;
  expiryDate?: string;
  stockLevel?: 'adequate' | 'low' | 'out'; // 消耗品庫存狀態
  reminderEnabled?: boolean;
  
  // 借出資訊
  loanInfo?: {
    borrower: string;
    borrowDate: string;
    dueDate?: string;
  };
  
  createdAt: string;
  updatedAt: string;
}
```

---

## 📝 執行紀錄與最近更新
* **2026/9/11**：
  1. 建立 `DEVELOPMENT_PLAN.md` 專案計畫書。
  2. 解決 TypeScript `@types/react` 編譯錯誤（`npx tsc --noEmit` 通過）。
  3. 完成 Phase 1 專案環境與架構盤點。
  4. 完成 Phase 2 (App Shell + Navigation + Design System)。
  5. 執行 Phase 5 (分類 + 搜尋 + 收藏)：
     - 新增 `favorite` 屬性至 `Item` 資料模型。
     - 在 `ItemsPage` 實現收藏 (favorite) 切換功能。
     - 修正 TypeScript 編譯錯誤（`SpaceManager` 與 `AddItemPage`）。


* **2026/9/12 (續)**：
  17. 完成 Phase 15 (完整 UX 優化)：
      - 建立通用回饋元件 (`Toast` 與 `LoadingSpinner` 於 `src/components/common/Feedback.tsx`)。
      - 優化 `AddItemPage` 表單，加入欄位驗證、錯誤提示訊息與載入中狀態 (`isLoading`)。
      - 執行 `npm run build` 確認生產環境建置完全成功無報錯。
* **2026/9/12 (續)**：
  14. 完成 Phase 6 (照片系統 Photo System)：
      - 驗證 `AddItemPage` 與 `ItemDetailPage` 的圖片上傳、Base64 預覽與儲存功能。
      - 確保專案建置成功 (`npm run build`)，照片系統完整支援。

* **2026/9/11 (續)**：
  6. 完成 Phase 3 (Space / Location 系統) 介面開發與整合。
  7. 完成 Phase 4 (Item CRUD) 與 AddItemPage 開發。
  8. 完成 Phase 5 (分類 + 搜尋 + 收藏) 整合至 ItemsPage。
  9. 更新 App.tsx 路由並確保導航列完整運作。

* **2026/9/12**：
  10. 完成 Phase 7 (Inventory / 消耗品管理) 與 Phase 8 (Shopping List) 之錯誤處理與操作引導：
      - 優化 `InventoryDashboard.tsx` 與 `ShoppingListPage.tsx`，新增空狀態提示與引導按鈕。
  11. 完成 Phase 17 (完整測試與 Bug 修正)：
      - 執行 `npm run build` 並修復 `AddItemPage.tsx` 中的 `tags` 屬性類型缺失問題。
      - 確保專案編譯通過，開發環境穩定。
* **2026/9/12 (續)**：
  12. 完成 Phase 10 (Reminder / Expiry 到期與提醒)：
      - 更新 `Item` 資料模型，新增 `expiryDate` 與 `reminderEnabled`。
      - 更新 `useItemStore` 與 `AddItemPage` 支援到期日設定。
      - 開發 `ExpiryPage` 並整合至 App 導航列與路由。
* **2026/9/12 (續)**：
  13. 完成 Phase 13 (統計與儀表板 Stats)：
      - 建立 `StatsPage.tsx` 與子元件 (`OverviewTab`, `CategoryTab`, `SpaceTab`)。
      - 實作物品總數、估算總價值、收藏數、過期提醒與庫存警示數據統計。
      - 提供分類佔比與空間分佈之圖表化進度條顯示。
      - 於 `HomePage` 與 `App.tsx` 路由完整整合。

* **2026/9/12 (續)**：
  16. 完成 Phase 12 (搬家模式 Moving Mode)：
      - 驗證並優化 `useMovingStore`、`MovingListPage` 與 `MovingDetailPage`。
      - 實現搬家任務建立、按空間篩選、箱子管理、狀態切換（待打包、已裝箱、已定位、不帶、遺失）。
      - 實作完成搬家任務時自動更新物品到新空間與位置。
      - 執行 `npm run build` 確認建置成功無報錯。
