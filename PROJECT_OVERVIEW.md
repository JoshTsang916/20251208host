# 讀書會破冰行動 (Book Club Icebreaker) - 專案概覽

## 1. 專案簡介
這是一個專為讀書會設計的即時互動破冰網頁應用。參與者透過手機掃碼加入，輸入問題；主持人透過大螢幕進行「串連式」抽題遊戲。

## 2. 目前功能
### 📱 參加者端 (Mobile)
- **掃碼加入**：輸入暱稱與想問的問題。
- **UUID 驗證**：自動修正無效的 ID，確保資料庫寫入順利。
- **狀態顯示**：加入成功後顯示等待畫面。
- **視覺風格**：科技感介面，帶有打字機效果與動態回饋。

### 🖥️ 主持人端 (Desktop/Projector)
- **大廳 (Lobby)**：
    - 顯示活動 QR Code (連結至參加者頁面)。
    - **動態視覺**：即時顯示加入人數，並有「數據包裹 (Floating Packets)」懸浮動畫，代表每一位加入的參加者。
- **遊戲流程 (Game Loop)**：
    1.  **初始提問**：由主持人（系統預設）提出第一題（例如：「大家今天最期待分享的一本書是什麼？」）。
    2.  **抽取回答者**：使用拉霸機 (Slot Machine) 特效抽出某位參加者。
    3.  **回答與提問**：該參加者回答後，系統顯示他的問題。
    4.  **循環**：再抽出下一位回答者，直到所有人完成。
    5.  **閉環 (Closing)**：最後一題由主持人回答，完成活動閉環。
- **氛圍營造**：
    - **背景音樂**：內建 Lo-Fi 音樂播放器 (右下角控制)。
    - **科技感視覺**：深色背景 (#1A1A1D)、琥珀色 (#FFB703) 與亮藍色 (#38BDF8) 霓虹風格、數據流動感。

## 3. 技術架構
- **前端**：React 19 + Vite
- **樣式**：Tailwind CSS (v3.4) + Custom Animations (Float, Pulse, Glow)
- **後端/資料庫**：Supabase (PostgreSQL)
    - 使用 `supabase-js` 的 Realtime 訂閱功能實現即時更新。
- **部署**：支援 Vercel 部署 (需設定環境變數)。

## 4. 資料庫設計
**Table**: `participants`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary Key (由前端生成 v4 UUID) |
| `name` | text | 參加者暱稱 |
| `question` | text | 參加者提問 |
| `is_active` | boolean | 是否在線 (預設 true) |
| `created_at` | timestamp | 建立時間 |

## 5. 關鍵檔案結構
- `src/`
    - `App.jsx`: 路由入口 (判斷 `/host` 路徑)。
    - `components/`
        - `HostView.jsx`: 主持人主控台（包含完整遊戲狀態機邏輯）。
        - `ParticipantView.jsx`: 參加者登入頁（包含 UUID 驗證邏輯）。
        - `SlotMachine.jsx`: 抽籤動畫元件（支援垂直置中與發光特效）。
        - `MusicPlayer.jsx`: 懸浮音樂播放器。
    - `lib/supabase.js`: Supabase Client 初始化。
    - `utils.js`: 工具函式 (UUID 生成)。
    - `index.css`: 全域樣式、字體匯入、自定義動畫 (@keyframes float)。

## 6. 待辦與後續更新建議
- [ ] **題目審核**：增加主持人審核題目的功能，防止不雅內容。
- [ ] **多輪模式**：支援重置遊戲進行第二輪，或清除資料庫功能。
- [ ] **自定義題目**：允許主持人在前端介面直接輸入第一題的題目。
- [ ] **防呆機制**：防止參加者重複送出或輸入空白。

---
*最後更新時間: 2025-12-01*
