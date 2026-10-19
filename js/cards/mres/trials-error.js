/* 카드: 주사위 합 7의 상대도수 — 횟수 n별 40모둠의 흩어짐과 이론 범위 1/6 ± 2√(p(1−p)/n) */
(() => {
  const root = document.getElementById("card-mres-trials-error");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const NS = [10, 30, 100, 300, 1000, 3000, 10000], P = 1 / 6;
  let R = null;
  const exp = (n) => { let k = 0; for (let i = 0; i < n; i++) { if (Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) === 5) k++; } return k / n; };   // 두 눈(0~5)의 합 5 = 실제 합 7
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const L = 40, Rr = 12, T = 10, B = 28, lx = (n) => Math.log10(n), X = (n) => L + ((w - L - Rr) * (lx(n) - 0.8)) / (lx(12000) - 0.8), Y = (v) => T + (h - T - B) * (1 - v / 0.5);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2;
    [0, 0.1, 0.2, 0.3, 0.4, 0.5].forEach((v) => { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(w - Rr, Y(v)); ctx.stroke(); ctx.textAlign = "right"; ctx.fillText(v.toFixed(1), L - 4, Y(v) + 4); });
    NS.forEach((n) => { ctx.textAlign = "center"; ctx.fillText(String(n), X(n), h - 12); });
    ctx.font = `11px ${F.sans}`; ctx.fillText("실험 횟수 n(로그 눈금)", (L + w - Rr) / 2, h - 1);
    ctx.fillStyle = "rgba(116,171,102,.18)"; ctx.beginPath();
    for (let i = 0; i <= 100; i++) { const n = 10 ** (0.9 + (i / 100) * (lx(12000) - 0.9)), e = 2 * Math.sqrt((P * (1 - P)) / n); i ? ctx.lineTo(X(n), Y(Math.min(0.5, P + e))) : ctx.moveTo(X(n), Y(Math.min(0.5, P + e))); }
    for (let i = 100; i >= 0; i--) { const n = 10 ** (0.9 + (i / 100) * (lx(12000) - 0.9)), e = 2 * Math.sqrt((P * (1 - P)) / n); ctx.lineTo(X(n), Y(Math.max(0, P - e))); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.forest; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(L, Y(P)); ctx.lineTo(w - Rr, Y(P)); ctx.stroke(); ctx.setLineDash([]);
    if (R) R.forEach((vals, j) => { ctx.fillStyle = "rgba(63,111,163,.55)"; vals.forEach((v, k) => { ctx.beginPath(); ctx.arc(X(NS[j]) + ((k % 8) - 3.5) * 1.6, Y(v), 2.5, 0, 7); ctx.fill(); }); });
    else { ctx.fillStyle = C.ink3; ctx.font = `12px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText("‘40모둠 실험하기’를 눌러 보세요", w / 2, h / 2); }
  }
  function update() {
    $(".say").textContent = R ? NS.map((n, j) => { const v = R[j], m = v.reduce((a, b) => a + b, 0) / v.length, sd = Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length); return `n=${n}: 흩어짐 ${sd.toFixed(3)}`; }).join(" · ") + " · 초록 띠: 이론 범위(약 95%)" : "참값 1/6 ≈ 0.167(점선)";
    draw();
  }
  $(".run").addEventListener("click", () => { R = NS.map((n) => Array.from({ length: 40 }, () => exp(n))); update(); });
  update();
})();
