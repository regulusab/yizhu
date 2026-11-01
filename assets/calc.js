/* 一柱論命 曆法換算：鐘錶時間 → 扣除夏令時／戰時時間 → UTC+8 標準時 →（選）真太陽時 → 四柱。曆法核心：lunar-javascript（6tail）。 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory;
  else root.YZCalc = factory(root.Solar, root.Lunar, root.YZ_TZ);
})(this, function (Solar, Lunar, TZ) {
  var ZHI = '子丑寅卯辰巳午未申酉戌亥';
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function offsetAtUTC(zone, ms) {
    var t = TZ[zone], o = 480;
    if (!t) return 480;
    for (var i = 0; i < t.length; i++) { if (t[i][0] * 1000 <= ms) o = t[i][1]; else break; }
    return o;
  }
  // 由當地鐘錶時間求 UTC 毫秒與所用偏移
  function wallToUTC(zone, fixed, y, m, d, hh, mi) {
    var base = Date.UTC(y, m - 1, d, hh, mi);
    if (zone === 'fixed') return { ms: base - fixed * 60000, off: fixed, cands: [fixed] };
    var cands = [];
    var offs = [480, 540, 600, 420];
    for (var k = 0; k < offs.length; k++) {
      var ms = base - offs[k] * 60000;
      if (offsetAtUTC(zone, ms) === offs[k]) cands.push(offs[k]);
    }
    if (!cands.length) { // 撥快之空隙時段（不存在之鐘錶時間），依撥快前偏移
      var o = offsetAtUTC(zone, base - 480 * 60000); return { ms: base - o * 60000, off: o, cands: [], gap: true };
    }
    cands.sort(function (a, b) { return b - a; }); // 重複時段：取夏令時（較大偏移）為預設
    return { ms: base - cands[0] * 60000, off: cands[0], cands: cands };
  }
  function parts(ms) { var t = new Date(ms); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), hh: t.getUTCHours(), mi: t.getUTCMinutes(), s: t.getUTCSeconds() }; }
  function eot(ms) { // 均時差（分）
    var t = new Date(ms), start = Date.UTC(t.getUTCFullYear(), 0, 0), N = Math.floor((ms - start) / 86400000);
    var B = 2 * Math.PI * (N - 81) / 364; return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  }
  function ec(p, sect) {
    var e = Solar.fromYmdHms(p.y, p.m, p.d, p.hh, p.mi, p.s || 0).getLunar().getEightChar(); e.setSect(sect); return e;
  }
  function fmt(p) { return p.y + '-' + pad(p.m) + '-' + pad(p.d) + ' ' + pad(p.hh) + ':' + pad(p.mi); }
  /* opt: {y,m,d,hh,mi,timeKnown,zone,fixed,solar,lon,zi:0|23} */
  function compute(opt) {
    var hh = opt.timeKnown ? opt.hh : 12, mi = opt.timeKnown ? opt.mi : 0;
    var w = wallToUTC(opt.zone, opt.fixed || 480, opt.y, opt.m, opt.d, hh, mi);
    var stdOff = opt.zone === 'fixed' ? (opt.fixed || 480) : 480;
    var std = parts(w.ms + stdOff * 60000);
    var apparentMs = w.ms + stdOff * 60000, solarNote = '';
    if (opt.solar && typeof opt.lon === 'number' && !isNaN(opt.lon)) {
      var e = eot(w.ms);
      apparentMs = w.ms + (opt.lon * 4 + e) * 60000;
      solarNote = '真太陽時＝UTC＋經度×4分（' + (opt.lon * 4).toFixed(1) + ' 分）＋均時差（' + e.toFixed(1) + ' 分）';
    }
    var app = parts(apparentMs);
    var sect = opt.zi === 23 ? 1 : 2;
    var eStd = ec(std, sect), eApp = ec(app, sect);
    var res = {
      wall: opt.y + '-' + pad(opt.m) + '-' + pad(opt.d) + (opt.timeKnown ? ' ' + pad(opt.hh) + ':' + pad(opt.mi) : '（時間不詳）'),
      offset: w.off, gap: !!w.gap, ambiguous: w.cands && w.cands.length > 1,
      std: fmt(std), app: fmt(app), solarNote: solarNote,
      year: eStd.getYear(), month: eStd.getMonth(), day: eApp.getDay(), time: opt.timeKnown ? eApp.getTime() : null,
      hourZhi: opt.timeKnown ? eApp.getTimeZhi() : null, monthZhi: eStd.getMonthZhi(), notes: []
    };
    if (opt.timeKnown && app.hh === 23) {
      var e1 = ec(app, 1), e2 = ec(app, 2);
      res.ziAlt = { r23: e1.getDay(), r0: e2.getDay() };
    }
    // 邊界：±15 分鐘
    if (opt.timeKnown) {
      var alts = [];
      [-15, 15].forEach(function (dm) {
        var s2 = parts(w.ms + stdOff * 60000 + dm * 60000), a2 = parts(apparentMs + dm * 60000);
        var x = ec(s2, sect), y2 = ec(a2, sect);
        var p = [x.getYear(), x.getMonth(), y2.getDay(), y2.getTime()];
        if (p.join() !== [res.year, res.month, res.day, res.time].join()) alts.push({ dm: dm, pillars: p });
      });
      res.alts = alts;
    } else {
      // 時間不詳：若當日有節氣交接，月柱可能不同
      var s0 = parts(Date.UTC(opt.y, opt.m - 1, opt.d, 0, 1)), s1 = parts(Date.UTC(opt.y, opt.m - 1, opt.d, 23, 58));
      var m0 = ec(s0, sect).getMonth(), m1 = ec(s1, sect).getMonth();
      if (m0 !== m1) res.notes.push('當日交節，月柱在 ' + m0 + ' 與 ' + m1 + ' 之間，須知出生時間方能確定。');
    }
    if (opt.zone !== 'fixed' && w.off !== 480) res.notes.push('出生時當地鐘錶為 UTC' + (w.off >= 0 ? '+' : '') + (w.off / 60) + '（夏令時或戰時時間），已換算為 UTC+8 標準時 ' + fmt(std) + '。');
    if (w.gap) res.notes.push('所填時刻落在撥快時鐘之空隙，請核對。');
    if (res.ambiguous) res.notes.push('所填時刻在撥回時鐘之重複時段，已依夏令時計；若為標準時，請將時間加一小時重算。');
    return res;
  }
  var lunarToSolar = function (y, m, leap, d) {
    var l = Lunar.fromYmd(y, leap ? -m : m, d); var s = l.getSolar(); return { y: s.getYear(), m: s.getMonth(), d: s.getDay() };
  };
  return { compute: compute, lunarToSolar: lunarToSolar, wallToUTC: wallToUTC, ZHI: ZHI };
});
