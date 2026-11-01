# 一柱論命

六十甲子日柱專冊之公開閱讀版：輸入生日求四柱，進入日柱專頁（性格、事業、男女命、各月份、逐時細化）。

- 網址：https://regulusab.github.io/yizhu/
- 曆法：lunar-javascript（MIT，見 assets/lunar-LICENSE.txt）；夏令時依 IANA tzdata。
- 搜尋：Pagefind。
- 本站內容為命理文化研究整理，非醫療、法律、投資或婚姻決策之依據。

## 三命通會對照（/sanming/）

《三命通會》卷八、卷九「六某日某時斷」依六十日 × 十二時分為 720 格，兩本逐字對照：

- 文淵閣四庫全書本：Kanripo KR3g0042，WYG 分支（https://github.com/kanripo/KR3g0042/blob/WYG/KR3g0042_008.txt 、 _009.txt）
- 通行本：維基文庫《三命通會》卷八、卷九（簡體排印本，底本未註明，來源待核）
- 覆核：維基文庫《三命通會（四庫全書本）》卷08、卷09

產生程式在建置環境 `yizhu_build/smth/`（parse.py → model.py → sm_gen.py；sm_link.py 於既有頁面加入連結）。涉及死亡、刑獄、疾病、宗教之句兩本同步改作〔細節不錄〕。
