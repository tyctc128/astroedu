# AstroEdu 0.3.0 · 資料與實作範圍

## 星圖資料
- 5,044 顆恆星：XHIP: An Extended Hipparcos Compilation, Anderson E. & Francis C. (2012), VizieR V/137D。由 Olaf Frohn 的 d3-celestial 專案轉換為 J2000 GeoJSON；保留 HIP ID、座標、視星等及 B-V 色指數。
- 88 個星座連線：d3-celestial / IAU constellation resources，由 Olaf Frohn 整理。
- 銀河輪廓：Milky Way Outline Catalog, José R. Vieira；取自 d3-celestial mw.json，為輪廓示意而非巡天照片。本版保留約每三個座標點之一以降低負載。
- 原始來源：https://github.com/ofrohn/d3-celestial ，2026-09-10 下載。
- 專案 BSD-3-Clause 授權全文：vendor/CELESTIAL-LICENSE.txt。保留上游天文資料作者的獨立署名；不將星表事實宣稱為本專案原創。

## 天文計算
- Astronomy Engine, Don Cross：https://github.com/cosinekitty/astronomy 。2026-09-10 下載 browser build 並隨專案保存，不依賴線上 CDN。
- MIT 授權全文：vendor/ASTRONOMY-LICENSE.txt。
- 恆星從 J2000 赤道座標轉換至所選時間與位置的地平座標。日月行星使用 topocentric Equator/Horizon；未模擬折射、大氣消光或恆星自行。
- 星點及天體圓盤為辨識用途，非真實角直徑；月相圖為北方朝上的照明示意。
- 程式接受 2000–2050，但整體日期區間未完成精密數值驗證，勿用於精密排程。

## 相同功能
A、B、C 包含相同的搜尋、拖曳／縮放、時間播放／倒轉、地點、圖層、選取／追蹤、四個教學活動、本機筆記、JSON 匯入匯出、情境連結、星圖截圖與說明。

此版時間顯示固定 UTC+08:00。筆記以 localStorage 保存並依 A/B/C 分開。未加入 AI、帳號、即時教室同步、Service Worker。PRD／SSD 中的後續規劃仍保留為未完成事項。

## 視覺
以使用者確認的三張 ImageGen 概念為方向重新製作 HTML/CSS。沒有將概念截图當成星圖或互動介面。中文文案為本專案撰寫。

## 0.3.0 新增來源與限制
- DSO 3,311 筆：d3-celestial/data/dsos.6.json；此檔按星等或角大小篩選，並非全為六等以內。mag=999 表示未提供。
- 邊界：d3-celestial/data/constellations.bounds.json，J2000 邊界，89 分區／88 星座。
- 天鵝、天鷹、天琴、獵戶線描為本專案原創教學圖形，不是古典圖譜。
- 地景照片由使用者提供；未附他人照片。僅繪製地平線以下，沒有高山遮擋資料。
- 七實驗單元與 AR 為新功能，實體裝置、指南針精度與鏡頭對位尚待驗收。
- 星圖未含大氣折射，升落採引擎標準折射；三維模型比例放大，日食角尺度圖及月食本影為幾何近似。
- API 參考：https://github.com/cosinekitty/astronomy/blob/master/source/js/README.md
- 感測權限：https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static
- 相機：https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

## 0.3.4 觀測修正
預設隱藏密集 DSO／銀河輪廓；定位回报誤差。Safari 相對姿態需已知地標方位校正，未校正不顯示 AR 星體／方位；不把 webkitCompassHeading 當成 Euler alpha。太陽數據用於方向參考，勿直視太陽校正。新版仍待實體 iPad 重測。


## 0.3.12 磁北換算真北
- geomagnetism 0.2.0，Natural Atlas & contributors，Apache-2.0；授權見 vendor/GEOMAGNETISM-LICENSE.txt。來源：https://github.com/naturalatlas/geomagnetism
- WMM2025 地磁模型由 NOAA NCEI／BGS 提供：https://www.ncei.noaa.gov/products/world-magnetic-model
- 本版修改：瀏覽器離線封裝、UTC 閏年分數、2025–2029 有效日期與弱磁場判斷。採海平面估计，不修正當地磁場干擾。
