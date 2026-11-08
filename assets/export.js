/* 一柱論命：Word／PDF 下載與分享。PDF 與 Word 產生程式改自 shishen 站（app.js、tbx.js），在瀏覽器內產生，不上傳。 */
(function(){
var BASE=(document.currentScript&&document.currentScript.src||'').replace(/assets\/export\.js.*$/,'');
var box=document.getElementById('exp');if(!box)return;
box.innerHTML='<button type="button" id="dW">下載 Word</button><button type="button" id="dP">下載 PDF</button><button type="button" id="shr">分享</button><span id="emsg" class="note" aria-live="polite"></span>';
function $(i){return document.getElementById(i);}
function em(t){$('emsg').textContent=t;}
var MAIN=document.querySelector('main');
var SKIP=/(^|\s)(toc|chips|smlink|pn|anc|exp|phead)(\s|$)/;
/* ---- 取頁面文字（即頁面所顯示之公開版內容） ---- */
function runsOf(el,st,out){st=st||{};out=out||[];
 for(var n=el.firstChild;n;n=n.nextSibling){
  if(n.nodeType===3){var t=n.nodeValue.replace(/\s+/g,' ');if(t)out.push({t:t,b:st.b,hl:st.hl,sm:st.sm,c:st.c});continue;}
  if(n.nodeType!==1)continue;var tg=n.tagName,cl=n.className||'';
  if(tg==='BR'){out.push({t:'\n'});continue;}
  if(el.tagName==='SUMMARY'&&out.length&&!/\s$/.test(out[out.length-1].t))out.push({t:'　'});
  if(tg==='SCRIPT'||tg==='STYLE')continue;
  var s2={b:st.b||tg==='B'||tg==='STRONG',hl:st.hl||tg==='MARK',sm:st.sm||tg==='SMALL'||/\bzn\b/.test(cl),c:st.c};
  if(/\bcg\b/.test(cl)){if(out.length&&/\S$/.test(out[out.length-1].t)&&!/：$/.test(out[out.length-1].t))out.push({t:'、'});out.push({t:n.firstChild?n.firstChild.nodeValue||'':'',b:st.b});var sm0=n.querySelector('small');if(sm0)out.push({t:'（'+sm0.textContent+'）',sm:1});continue;}
  if(tg==='SUP'){out.push({t:'〔'+n.textContent+'〕',sm:1,c:'b0331f'});continue;}
  if(/\bzn\b/.test(cl)){out.push({t:'（'+n.textContent+'）',sm:1,c:'7a6a55'});continue;}
  if(/\brm\b/.test(cl)){out.push({t:n.textContent,c:'888888'});continue;}
  runsOf(n,s2,out);}
 return out;}
function plain(r){return r.map(function(x){return x.t;}).join('').replace(/^ +| +$/g,'');}
function blocks(){var out=[];
 var you=$('you');if(you&&!you.hidden&&you.textContent)out.push({k:'you',runs:[{t:you.textContent}]});
 function P(k,el,extra){var r=runsOf(el);if(extra)r.unshift(extra);if(plain(r))out.push({k:k,runs:r});}
 function walk(el,ctx){ctx=ctx||{};
  for(var c=el.firstElementChild;c;c=c.nextElementSibling){var t=c.tagName,cl=c.className||'';
   if(/\blqcs-tools\b/.test(cl)||(c.id==='lqcs-panel'&&c.hidden))continue;
   if(SKIP.test(cl)||c.id==='you'||t==='NAV'||t==='SCRIPT')continue;
   if(t==='H1')continue;
   if(/\bnote\b/.test(cl)&&c.parentNode&&/\bdata\b/.test(c.parentNode.className||''))continue;
   if(/^H[2-4]$/.test(t)){var hit=ctx.hit&&!ctx.hitDone;if(hit)ctx.hitDone=1;P('h'+t[1],c,hit?{t:'★ ',c:'b0331f'}:null);continue;}
   if(/\b(warn|notice|sub)\b/.test(cl)){P('s',c);continue;}
   if(t==='TABLE'){var rows=[],cellRuns=[],fills=[],isLq=/\blqcs-table\b/.test(cl),tr=c.querySelectorAll('tr');for(var r=0;r<tr.length;r++){var a=[],rr=[],ff=[],cs=tr[r].children;for(var j=0;j<cs.length;j++){var cr=runsOf(cs[j]);a.push(plain(cr));rr.push(cr);var fill=(cs[j].getAttribute('style')||'').match(/background-color:\s*#([0-9a-f]{6})/i);ff.push(fill?fill[1]:null);}rows.push(a);cellRuns.push(rr);fills.push(ff);}if(rows.length)out.push({k:'table',rows:rows,cellRuns:isLq?cellRuns:null,fills:isLq?fills:null});continue;}
   if(t==='DETAILS'){var sm=c.querySelector('summary'),me=/\byou-hit\b/.test(cl);
     if(sm){var lv=/\bhour\b|\bsmc\b/.test(cl)?'h4':'h5';if(/\bvl\b/.test(cl))lv='s';P(lv,sm,me?{t:'★ 您的時辰　',c:'b0331f'}:null);}
     walk(c,{q:ctx.q});continue;}
   if(t==='SUMMARY')continue;
   if(/\bkv\b/.test(cl)){var sp=c.querySelector('span'),bb=c.querySelector('b');if(sp&&bb){var rr=[{t:sp.textContent+'：',b:1}].concat(runsOf(bb));out.push({k:'p',runs:rr});}continue;}
   if(/\bed\b/.test(cl)){var lab=c.querySelector('.lab'),p=c.querySelector('p');if(p){var r2=runsOf(p);r2.unshift({t:'【'+(lab?lab.textContent:'')+'】',b:1});out.push({k:'p',runs:r2});}continue;}
   if(t==='P'||t==='LI'||/\bpoem\b/.test(cl)){var k=ctx.q?'q':(/\b(note|smhd|lab)\b/.test(cl)?'s':(/\bwarn\b/.test(cl)?'s':'p'));P(k,c,t==='LI'?{t:'・'}:null);continue;}
   if(t==='BLOCKQUOTE'){walk(c,{q:1});continue;}

   if(t==='DIV'&&!c.querySelector('p,div,table,h2,h3,h4,ul,ol,section,details,blockquote')){P(ctx.q?'q':'p',c);continue;}
   if(t==='SECTION'||t==='DIV'||t==='OL'||t==='UL'){walk(c,{q:ctx.q,hit:/\byou-hit\b/.test(cl)});continue;}
   if(c.textContent.trim())P(ctx.q?'q':'p',c);}}
 walk(MAIN,{});
 out.push({k:'s',runs:[{t:'出處：'+location.href.split('#')[0]+'（一柱論命公開閱讀版；'+new Date().toLocaleDateString('zh-TW')+' 下載）。本文件為命理文化研究整理，非醫療、法律、投資或婚姻決策之依據。'}]});
 return out;}
var SM=!/\bpillar\b/.test(MAIN.className);
function h1(){var h=MAIN.querySelector('h1');if(!h)return document.title;h=h.cloneNode(true);var x=h.querySelectorAll('.badge');for(var i=0;i<x.length;i++)x[i].parentNode.removeChild(x[i]);return h.textContent.replace(/\s+/g,' ').trim();}
function title(){return h1()+(SM?'｜一柱論命':'｜一柱論命');}
function fname(ext){var t=h1(),m;if(SM){m=t.match(/[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]日/);t='三命通會對照_'+(m?m[0]:t);}else t='一柱論命_'+t;return t.replace(/[｜|\/\\:*?"<>\s]+/g,'_')+'.'+ext;}
function dl(blob,name){var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.rel='noopener';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(u);},60000);}
/* ---- PDF ---- */
function rasterGlyph(cp){try{var ch=String.fromCodePoint(cp),N=96,font=N+'px "PingFang TC","Noto Serif CJK TC","Noto Sans TC","PMingLiU",serif';var c=document.createElement('canvas'),g=c.getContext('2d');g.font=font;var adv=Math.max(0.25,Math.min(1.6,g.measureText(ch).width/N)),W=Math.ceil(adv*N),Hh=Math.ceil(1.2*N);c.width=W;c.height=Hh;g=c.getContext('2d');g.font=font;g.fillStyle='#000';g.textBaseline='alphabetic';g.fillText(ch,0,N);var px=g.getImageData(0,0,W,Hh).data,rb=Math.ceil(W/8),bits=new Uint8Array(rb*Hh),ink=0;for(var y=0;y<Hh;y++)for(var x=0;x<W;x++)if(px[(y*W+x)*4+3]>110){bits[y*rb+(x>>3)]|=0x80>>(x&7);ink++;}return ink?{w:W,h:Hh,bits:bits,adv:adv}:null;}catch(e){return null;}}
var FONTP=null;
function font(){if(!FONTP){FONTP=fetch(BASE+'assets/fonts/yz-serif-tc.woff?v=1').then(function(r){if(!r.ok)throw new Error('字型載入失敗');return r.arrayBuffer();}).then(function(b){return TBX.loadFont(b);});FONTP['catch'](function(){FONTP=null;});}return FONTP;}
var SZ={h2:15,h3:13,h4:12,h5:11,p:10.5,q:10,s:8.5,you:11};
function pruns(b,base){var s=SZ[b.k]||10.5;return b.runs.map(function(r){return{t:r.t,s:r.sm?s*0.85:s,b:(base||r.b)?1:0,c:r.hl?'b0331f':(r.c||(b.k==='q'?'4a4038':b.k==='s'?'8a6d3b':/^h/.test(b.k)?'22344f':null))};});}
function buildPdf(F,B,ttl){var d=new TBX.Doc(F,{raster:rasterGlyph}),ML=46,CW=d.pw-92,BOT=d.ph-50,y=50;d.newPage();
 function para(runs,lf,ind){ind=ind||0;var L=d.lay(runs,CW-ind,lf||1.6);for(var i=0;i<L.lines.length;i++){var ln=L.lines[i];if(y+ln.lh>BOT){d.newPage();y=50;}y=d.draw({lines:[ln],runs:L.runs},ML+ind,y,CW-ind);}}
 para([{t:ttl,s:18,b:1,c:'22344f'}]);y+=6;
 B.forEach(function(b){
  if(b.k==='table'){var n=b.rows[0].length||1,cw=CW/n;b.rows.forEach(function(r,ri){var Ls=r.map(function(t,j){var runs=b.cellRuns?b.cellRuns[ri][j].map(function(x){return{t:x.t,s:n>4?8:9,b:x.b?1:0};}):[{t:t,s:n>4?8:9,b:ri===0?1:0}];return d.lay(runs,cw-6,1.45);}),h=0;Ls.forEach(function(L){h=Math.max(h,L.h);});h+=6;if(y+h>BOT){d.newPage();y=50;}
   Ls.forEach(function(L,j){d.rect(ML+j*cw,y,cw,h,b.fills?b.fills[ri][j]:(ri===0?'efe9df':null),'ccc4b8',0.5);d.draw(L,ML+j*cw+3,y+3,cw-6);});y+=h;});y+=5;return;}
  if(b.k==='you'){var L=d.lay(pruns(b,1),CW-16,1.5);if(y+L.h+10>BOT){d.newPage();y=50;}d.rect(ML,y,CW,L.h+10,'fff6e8','efcf98',0.6);d.draw(L,ML+8,y+5,CW-16);y+=L.h+16;return;}
  if(/^h/.test(b.k)){y+=b.k==='h2'?10:5;if(y+40>BOT){d.newPage();y=50;}para(pruns(b,1),1.45);if(b.k==='h2'){d.line(ML,y+1,ML+CW,y+1,'e3dbcf',0.8);y+=4;}return;}
  para(pruns(b),b.k==='s'?1.45:1.65,b.k==='q'?14:0);y+=b.k==='s'?2:3;});
 return d.finish({title:ttl,now:new Date()});}
function pdfBlob(){return font().then(function(F){return buildPdf(F,blocks(),title());}).then(function(by){return new Blob([by],{type:'application/pdf'});});}
/* ---- Word（docx，純前端打包） ---- */
function crc(a){var c,t=[],x=-1,n,k;for(n=0;n<256;n++){c=n;for(k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}for(n=0;n<a.length;n++)x=(x>>>8)^t[(x^a[n])&255];return(x^-1)>>>0;}
function u8(s){return new TextEncoder().encode(s);}
function zip(files){var parts=[],cd=[],off=0;function w16(v){return[v&255,v>>8&255];}function w32(v){return[v&255,v>>8&255,v>>16&255,v>>>24&255];}
 files.forEach(function(f){var nm=u8(f.name),d=f.data,c=crc(d),h=[0x50,0x4b,3,4].concat(w16(20),w16(0x0800),w16(0),w16(0),w16(0x21),w32(c),w32(d.length),w32(d.length),w16(nm.length),w16(0));
  parts.push(new Uint8Array(h),nm,d);cd.push(new Uint8Array([0x50,0x4b,1,2].concat(w16(20),w16(20),w16(0x0800),w16(0),w16(0),w16(0x21),w32(c),w32(d.length),w32(d.length),w16(nm.length),w16(0),w16(0),w16(0),w16(0),w32(0),w32(off))),nm);off+=h.length+nm.length+d.length;});
 var l=0;cd.forEach(function(a){l+=a.length;});return parts.concat(cd,[new Uint8Array([0x50,0x4b,5,6].concat(w16(0),w16(0),w16(files.length),w16(files.length),w32(l),w32(off),w16(0)))]);}
function xe(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var FNT='<w:rFonts w:ascii="PMingLiU" w:hAnsi="PMingLiU" w:eastAsia="PMingLiU"/>';
function wr(r,sz,o){var p=r.t.split('\n'),x='';p.forEach(function(seg,i){if(i)x+='<w:r><w:br/></w:r>';if(seg)x+='<w:r><w:rPr>'+FNT+((o.b||r.b)?'<w:b/>':'')+(r.c||o.c?'<w:color w:val="'+(r.c||o.c)+'"/>':'')+(r.hl?'<w:highlight w:val="yellow"/>':'')+'<w:sz w:val="'+(r.sm?Math.round(sz*0.85):sz)+'"/></w:rPr><w:t xml:space="preserve">'+xe(seg)+'</w:t></w:r>';});return x;}
var WSZ={h2:30,h3:26,h4:24,h5:22,p:22,q:21,s:17,you:22};
function wpara(b){var sz=WSZ[b.k]||22,o={b:/^h/.test(b.k)||b.k==='you',c:/^h/.test(b.k)?'22344F':b.k==='s'?'8A6D3B':b.k==='q'?'4A4038':null},pp='';
 if(b.k==='q')pp='<w:ind w:left="480"/>';if(b.k==='you')pp='<w:shd w:val="clear" w:color="auto" w:fill="FFF6E8"/>';if(/^h/.test(b.k))pp='<w:keepNext/><w:spacing w:before="'+(b.k==='h2'?240:120)+'"/>';
 return '<w:p>'+(pp?'<w:pPr>'+pp+'</w:pPr>':'')+b.runs.map(function(r){return wr(r,sz,o);}).join('')+'</w:p>';}
function buildDocx(B,ttl){var x=[wpara({k:'h2',runs:[{t:ttl}]})];
 B.forEach(function(b){if(b.k==='table'){var t='<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>';
   b.rows.forEach(function(r,ri){t+='<w:tr>'+r.map(function(c,j){var fill=b.fills&&b.fills[ri][j],runs=b.cellRuns?b.cellRuns[ri][j]:[{t:c}],body=runs.map(function(x){return wr(x,18,{b:!b.cellRuns&&ri===0});}).join('');return '<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/>'+(fill?'<w:shd w:val="clear" w:fill="'+fill+'"/>':'')+'</w:tcPr><w:p>'+body+'</w:p></w:tc>';}).join('')+'</w:tr>';});x.push(t+'</w:tbl>','<w:p/>');}
  else x.push(wpara(b));});
 var doc='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+x.join('')+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>';
 var ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
 var rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
 return new Blob(zip([{name:'[Content_Types].xml',data:u8(ct)},{name:'_rels/.rels',data:u8(rels)},{name:'word/document.xml',data:u8(doc)}]),{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});}
/* ---- 按鈕 ---- */
var LASTPDF=null;
$('dW').onclick=function(){try{dl(buildDocx(blocks(),title()),fname('docx'));em('Word 已產生');}catch(e){em('Word 產生失敗：'+(e&&e.message||e));}};
$('dP').onclick=function(){var b=this;b.disabled=true;em('產生 PDF 中…（首次需載入字型約 1MB）');pdfBlob().then(function(x){LASTPDF=x;dl(x,fname('pdf'));em('PDF 已產生');b.disabled=false;},function(e){b.disabled=false;em('PDF 失敗：'+(e&&e.message||e)+'。可改下載 Word，或用瀏覽器「分享 → 列印」另存 PDF。');});};
$('shr').onclick=function(){var url=location.href,f=null,ttl=title();
 try{f=LASTPDF?new File([LASTPDF],fname('pdf'),{type:'application/pdf'}):new File([buildDocx(blocks(),ttl)],fname('docx'),{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});}catch(e){f=null;}
 if(f&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:ttl,text:ttl+'\n'+url}).catch(function(e){if(e&&e.name!=='AbortError')shareUrl(url,ttl);});return;}
 shareUrl(url,ttl);};
function shareUrl(url,ttl){if(navigator.share){navigator.share({title:ttl,url:url}).catch(function(){});return;}
 var done=function(){em('連結已複製：'+url);};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(done,function(){fallbackCopy(url);});else fallbackCopy(url);}
function fallbackCopy(url){var ta=document.createElement('textarea');ta.value=url;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,url.length);var ok=false;try{ok=document.execCommand('copy');}catch(e){}document.body.removeChild(ta);em(ok?'連結已複製：'+url:'請複製此連結：'+url);}
window.__YZX={blocks:blocks,buildDocx:buildDocx,pdfBlob:pdfBlob,title:title,fname:fname};
})();
