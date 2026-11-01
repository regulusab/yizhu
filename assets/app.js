(function(){
  var JZ=[];var G='甲乙丙丁戊己庚辛壬癸',Z='子丑寅卯辰巳午未申酉戌亥';for(var i=0;i<60;i++)JZ.push(G[i%10]+Z[i%12]);
  var C=YZCalc, $=function(id){return document.getElementById(id)};
  var mode='solar', status={};
  fetch('assets/pillars.json').then(function(r){return r.json()}).then(function(a){a.forEach(function(e){status[e.gz]=e.status})}).catch(function(){});
  function opts(sel,a,b,suf,def){var h='';for(var i=a;i<=b;i++)h+='<option value="'+i+'"'+(i===def?' selected':'')+'>'+i+suf+'</option>';sel.innerHTML=h}
  opts($('mon'),1,12,' 月',1);opts($('day'),1,31,' 日',1);opts($('hh'),0,23,' 時',12);
  var mh='';for(var m=0;m<60;m++)mh+='<option value="'+m+'">'+(m<10?'0':'')+m+' 分</option>';$('mi').innerHTML=mh;
  document.querySelectorAll('.tabs button').forEach(function(b){b.onclick=function(){mode=b.dataset.m;document.querySelectorAll('.tabs button').forEach(function(x){x.classList.toggle('on',x===b)});$('leapw').hidden=mode!=='lunar';$('mon').innerHTML='';opts($('mon'),1,12,mode==='lunar'?' 月（農）':' 月',1);opts($('day'),1,mode==='lunar'?30:31,mode==='lunar'?' 日（農）':' 日',1);}});
  $('tu').onchange=function(){$('hh').disabled=$('mi').disabled=this.checked};
  $('zone').onchange=function(){$('fixw').hidden=this.value!=='fixed'};
  $('sol').onchange=function(){$('solw').hidden=!this.checked};
  $('city').onchange=function(){if(this.value)$('lon').value=this.value};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function link(day,hz,mz,p){var i=JZ.indexOf(day)+1;var u='pillars/'+(i<10?'0':'')+i+'/?';var q=[];if(hz)q.push('h='+encodeURIComponent(hz));if(mz)q.push('m='+encodeURIComponent(mz));q.push('p='+encodeURIComponent(p));return u+q.join('&')+(hz?'#hour-'+encodeURIComponent(hz):'')}
  $('f').onsubmit=function(e){
    e.preventDefault();
    var y=parseInt($('yr').value,10),m=+$('mon').value,d=+$('day').value;
    var out=$('out');
    if(!(y>=1800&&y<=2100)){out.innerHTML='<div class="warn">請輸入 1800–2100 年之間的年份。</div>';return}
    try{
      if(mode==='lunar'){var s=C.lunarToSolar(y,m,$('leap').checked,d);y=s.y;m=s.m;d=s.d}
      else{var dt=new Date(Date.UTC(y,m-1,d));if(dt.getUTCDate()!==d)throw new Error('此月無此日')}
    }catch(err){out.innerHTML='<div class="warn">日期有誤：'+esc(err.message||err)+'（農曆請確認該年是否有此月／閏月／三十日）</div>';return}
    var tk=!$('tu').checked;
    var r=C.compute({y:y,m:m,d:d,hh:+$('hh').value,mi:+$('mi').value,timeKnown:tk,zone:$('zone').value,fixed:+$('fix').value,solar:$('sol').checked,lon:parseFloat($('lon').value),zi:$('z23').checked?23:0});
    var p=[r.year,r.month,r.day,r.time||'？？'].join(' ');
    var h='<section class="card res"><h2>四柱</h2><p class="note">公曆 '+y+'-'+m+'-'+d+(mode==='lunar'?'（由農曆換算）':'')+(tk?'；計算用時間 '+esc(r.app)+(r.solarNote?'（真太陽時）':'（UTC+8 標準時）'):'；時間不詳，時柱不排')+'</p>';
    h+='<div class="four"><div><small>時柱</small><b>'+(r.time||'？')+'</b></div><div class="day"><small>日柱</small><b>'+r.day+'</b></div><div><small>月柱</small><b>'+r.month+'</b></div><div><small>年柱</small><b>'+r.year+'</b></div></div>';
    h+='<p class="note">右起年、月、日、時（傳統直書順序）。年柱以立春為界，月柱以節為界。</p>';
    h+='<div class="big"><a href="'+link(r.day,r.hourZhi,r.monthZhi,p)+'">看 '+r.day+' 日柱'+(r.hourZhi?'・'+r.hourZhi+'時':'')+(status[r.day]==='wip'?'（整理中）':'')+' →</a></div>';
    if(r.ziAlt&&r.ziAlt.r0!==r.ziAlt.r23){var alt=$('z23').checked?r.ziAlt.r0:r.ziAlt.r23;
      h+='<div class="warn">生於 23:00–23:59（子時前半）。依「0 時換日」日柱為 <b>'+r.ziAlt.r0+'</b>；依「23 時換日（子初換日）」為 <b>'+r.ziAlt.r23+'</b>。兩說並存，請兩柱合看。依 0 時換日，此時之時柱依次日日干起（夜子時），與專冊所列該柱「子時」之時柱天干不同，宜並參：<a href="'+link(alt,'子',r.monthZhi,p)+'">另看 '+alt+' 日柱子時</a></div>'}
    (r.alts||[]).forEach(function(a){h+='<div class="warn">若出生時間'+(a.dm<0?'早':'晚')+' 15 分鐘，四柱變為 '+a.pillars.join(' ')+'：本例接近時辰、日或節氣交界，請核對出生時間。</div>'});
    r.notes.forEach(function(n){h+='<div class="notice">'+esc(n)+'</div>'});
    if(r.solarNote)h+='<p class="note">'+esc(r.solarNote)+'。年、月柱仍依 UTC+8 標準時判定節氣。</p>';
    h+='</section>';out.innerHTML=h;out.scrollIntoView({behavior:'smooth',block:'start'});
  };
})();
