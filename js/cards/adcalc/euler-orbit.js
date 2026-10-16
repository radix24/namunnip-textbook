/* 카드: 원을 그려야 할 공이 왜 점점 멀어질까? — 원운동에 오일러 방법과 고친(반암시적) 오일러 방법 */
(() => {
  const root = document.getElementById("card-adcalc-euler-orbit");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sh = $(".sh"), bE = $(".m-e"), bS = $(".m-s"), T = 6 * Math.PI;
  const { ctx, size } = fit($("canvas"), () => draw());
  function run(semi) {
    const h = +sh.value, N = Math.round(T / h), pts = [[1, 0]];
    let x = 1, y = 0;
    for (let i = 0; i < N; i++) {
      if (semi) { x = x - h * y; y = y + h * x; } else { const nx = x - h * y; y = y + h * x; x = nx; }
      pts.push([x, y]);
    }
    return { pts, N };
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const e = run(false), s = run(true);
    const rmax = Math.max(1.3, Math.min(8, Math.hypot(...e.pts[e.pts.length - 1]) * 1.05));
    const cx = w / 2, cy = h / 2, S = Math.min(w, h) / 2 / rmax * 0.95;
    const P = ([x, y]) => [cx + x * S, cy - y * S];
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, S, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    const line = (pts, col) => { ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...P(p)) : ctx.moveTo(...P(p)))); ctx.stroke(); dot(ctx, ...P(pts[pts.length - 1]), col, 4); };
    if (bE.getAttribute("aria-pressed") === "true") line(e.pts, C.warn);
    if (bS.getAttribute("aria-pressed") === "true") line(s.pts, BLUE);
    label(ctx, "점선: 참값(반지름 1)", 8, 12, C.ink2, "left", `11px ${F.sans}`);
    label(ctx, "주황: 오일러 · 파랑: 고친 오일러", 8, h - 10, C.ink2, "left", `11px ${F.sans}`);
  }
  function nums() {
    const e = run(false), s = run(true), hh = +sh.value;
    $(".h-out").textContent = n(hh, 2);
    $(".n-e").textContent = n(Math.hypot(...e.pts[e.pts.length - 1]), 4);
    $(".n-f").textContent = `${n((1 + hh * hh) ** (e.N / 2), 4)} (N = ${e.N})`;
    $(".n-s").textContent = n(Math.hypot(...s.pts[s.pts.length - 1]), 4);
    draw();
  }
  [bE, bS].forEach((b) => b.addEventListener("click", () => { b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); draw(); }));
  sh.addEventListener("input", nums);
  nums();
})();
