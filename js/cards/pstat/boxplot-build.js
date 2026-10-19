/* 카드: 점을 옮기며 상자그림 만들기 — 다섯 수 요약, IQR, 1.5·IQR 이상값(가상 점수 15개) */
(() => {
  const root = document.getElementById("card-pstat-boxplot-build");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const cv = $("canvas");
  const PRE = [[42, 48, 51, 55, 58, 60, 62, 65, 67, 70, 72, 75, 78, 82, 88], [30, 52, 61, 66, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90], [45, 50, 52, 55, 57, 58, 60, 61, 63, 65, 66, 68, 70, 72, 99]];
  let V = [...PRE[0]], drag = -1;
  const med = (a) => { const n = a.length; return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2; };
  function five() {
    const s = [...V].sort((a, b) => a - b), n = s.length, h = Math.floor(n / 2);
    const q1 = med(s.slice(0, h)), q2 = med(s), q3 = med(s.slice(n - h)), iqr = q3 - q1, lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
    const inside = s.filter((v) => v >= lo && v <= hi);
    return { s, q1, q2, q3, iqr, lo, hi, wl: inside[0], wh: inside.at(-1), out: s.filter((v) => v < lo || v > hi) };
  }
  const { ctx, size } = fit(cv, () => draw());
  const X = (v) => { const { w } = size; return 20 + ((w - 40) * v) / 100; };
  const inv = (px) => Math.round(((px - 20) * 100) / (size.w - 40));
  const pos = () => { const seen = {}; return V.map((v) => { const k = Math.round(v); seen[k] = (seen[k] || 0) + 1; return seen[k] - 1; }); };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const f = five(), yAxis = h * 0.5, yb = h * 0.75, bh = h * 0.16, st = pos();
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(0), yAxis); ctx.lineTo(X(100), yAxis); ctx.stroke();
    ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "center"; for (let v = 0; v <= 100; v += 10) ctx.fillText(String(v), X(v), yAxis + 14);
    V.forEach((v, i) => { ctx.fillStyle = i === drag ? C.warn : "#3f6fa3"; ctx.beginPath(); ctx.arc(X(v), yAxis - 8 - st[i] * 13, 5.5, 0, 7); ctx.fill(); });
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(X(f.wl), yb); ctx.lineTo(X(f.q1), yb); ctx.moveTo(X(f.q3), yb); ctx.lineTo(X(f.wh), yb);
    ctx.moveTo(X(f.wl), yb - bh / 3); ctx.lineTo(X(f.wl), yb + bh / 3); ctx.moveTo(X(f.wh), yb - bh / 3); ctx.lineTo(X(f.wh), yb + bh / 3); ctx.stroke();
    ctx.fillStyle = "rgba(63,111,163,.15)"; ctx.fillRect(X(f.q1), yb - bh / 2, X(f.q3) - X(f.q1), bh); ctx.strokeRect(X(f.q1), yb - bh / 2, X(f.q3) - X(f.q1), bh);
    ctx.strokeStyle = C.warn; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X(f.q2), yb - bh / 2); ctx.lineTo(X(f.q2), yb + bh / 2); ctx.stroke();
    f.out.forEach((v) => { ctx.strokeStyle = C.warn; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(X(v), yb, 5, 0, 7); ctx.stroke(); });
    ctx.setLineDash([2, 3]); ctx.strokeStyle = C.ink3; ctx.lineWidth = 1;
    [f.lo, f.hi].forEach((v) => { if (v >= 0 && v <= 100) { ctx.beginPath(); ctx.moveTo(X(v), yb - bh); ctx.lineTo(X(v), yb + bh); ctx.stroke(); } });
    ctx.setLineDash([]);
  }
  function update() {
    const f = five(), m = V.reduce((a, b) => a + b, 0) / V.length;
    $(".say").textContent = `최솟값 ${f.s[0]} · Q1 ${f.q1} · 중앙값 ${f.q2} · Q3 ${f.q3} · 최댓값 ${f.s.at(-1)} · IQR ${f.iqr} · 이상값 경계 ${f.lo}~${f.hi}(점선) · 이상값 ${f.out.length ? f.out.join(", ") : "없음"} · 평균 ${m.toFixed(1)}`;
    draw();
  }
  const near = (e) => { const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, st = pos(); let b = -1, bd = 14; V.forEach((v, i) => { const d = Math.hypot(X(v) - x, size.h * 0.5 - 8 - st[i] * 13 - y); if (d < bd) { bd = d; b = i; } }); return b; };
  cv.addEventListener("pointerdown", (e) => { drag = near(e); if (drag >= 0) { cv.setPointerCapture(e.pointerId); update(); } });
  cv.addEventListener("pointermove", (e) => { if (drag < 0) return; const r = cv.getBoundingClientRect(); V[drag] = Math.max(0, Math.min(100, inv(e.clientX - r.left))); update(); });
  ["pointerup", "pointercancel"].forEach((t) => cv.addEventListener(t, () => { drag = -1; update(); }));
  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { V = [...PRE[+b.dataset.p]]; update(); }));
  update();
})();
