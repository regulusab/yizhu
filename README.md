# 一柱論命

六十甲子日柱專冊之公開閱讀版：輸入生日求四柱，進入日柱專頁（性格、事業、男女命、各月份、逐時細化）。

- 網址：https://regulusab.github.io/yizhu/
- 曆法：lunar-javascript（MIT，見 assets/lunar-LICENSE.txt）；夏令時依 IANA tzdata。
- 搜尋：Pagefind。
- 本站內容為命理文化研究整理，非醫療、法律、投資或婚姻決策之依據。

## 三命通會對照（/sanming/）

《三命通會》卷八、卷九「六某日某時斷」依六十日 × 十二時分為 720 格；文淵閣本與通行本逐字對照，並以現代標點整理本為可展開之第三見證：

- 文淵閣四庫全書本：Kanripo KR3g0042，WYG 分支（https://github.com/kanripo/KR3g0042/blob/WYG/KR3g0042_008.txt 、 _009.txt）
- 通行本：維基文庫《三命通會》卷八、卷九（簡體排印本，底本未註明，來源待核）
- 覆核：維基文庫《三命通會（四庫全書本）》卷08、卷09
- 現代標點整理本（DejaVu）：udn 部落格「情深不壽　強極則辱」2010 年公開帖（20 篇）。【】與整理者按已剔除；多出詩句／引文標「來源待核」。近人一柱論命全文不轉載。

產生程式在建置環境 `yizhu_build/smth/`（parse.py → model.py → parse_dj.py → compare_dj.py → sm_gen.py；sm_link.py 於既有頁面加入連結）。涉及死亡、刑獄、疾病、宗教之句兩本同步改作〔細節不錄〕。

## 下載與分享（Word／PDF）

各日柱頁與《三命通會》對照日頁設「下載 Word」「下載 PDF」「分享」三鈕（`assets/export.js`）。檔案在瀏覽器內由頁面所顯示之公開版文字產生，不經伺服器；自「求日柱」帶入時，含訪客四柱並以 ★ 標出所屬時辰與月份段落。PDF 以 `assets/tbx.js`（移植自 shishen 站）嵌入 `assets/fonts/yz-serif-tc.woff` 字型子集（Noto Serif TC／SC，SIL OFL 1.1，見 `assets/fonts/OFL.txt`）；Word 為純前端打包之 .docx。分享在 iPhone Safari 以系統分享面板分享檔案（不支援時改分享網址），再不支援則複製連結。
