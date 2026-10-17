/* 카드: 허용 오차 E 안으로 추정하려면 — n ≥ (zσ/E)², E에 따른 n 곡선 */
(() => {
  const root = document.getElementById("card-pstat-sample-size");
  if (!root) return;
  const { C, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const eIn = $(".e"), sIn = $(".s"), cSel = $(".c"), P = NMPst;
  const z = () => P.ninv(1 - (1 - +cSel.value) / 2);
  const need = (E) => Math.ceil(((z() * +sIn.value) / E) ** 2);
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w } = size; if (!w) return;
    ctx.clearRect(0, 0, w, size.h);
    const top = Math.max(200, need(0.25) * 1.05), E = +eIn.value;
    const step = top > 20000 ? 10000 : top > 8000 ? 4000 : top > 3000 ? 1000 : top > 1000 ? 500 : 100;
    const yt = []; for (let v = 0; v <= top; v += step) yt.push(v);
    const f = P.frame(ctx, size, { x0: 0, x1: 2, y0: 0, y1: top, xt: [0, 0.5, 1, 1.5, 2], yt, yf: (v) => v.toLocaleString("ko-KR"), L: 52, xlab: "허용 오차 E(시간)" });
    ctx.save(); ctx.beginPath(); ctx.rect(f.L, 0, w, f.Y(0)); ctx.clip();
    P.curve(ctx, f.X, f.Y, (e) => ((z() * +sIn.value) / e) ** 2, 0.1, 2, "#3f6fa3", 2.5);
    ctx.restore();
    const n = need(E);
    ctx.setLineDash([3, 3]); ctx.strokeStyle = C.warn; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(f.X(E), f.Y(0)); ctx.lineTo(f.X(E), f.Y(Math.min(n, top))); ctx.lineTo(f.L, f.Y(Math.min(n, top))); ctx.stroke(); ctx.setLineDash([]);
    if (n <= top) { ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(f.X(E), f.Y(n), 5, 0, 7); ctx.fill(); }
  }
  function update() {
    const E = +eIn.value, s = +sIn.value, zz = z(), raw = ((zz * s) / E) ** 2;
    $(".e-out").textContent = E.toFixed(2); $(".s-out").textContent = s.toFixed(1);
    $(".n-out").textContent = `${need(E).toLocaleString("ko-KR")}건`;
    $(".say").textContent = `n ≥ (z·σ/E)² = (${zz.toFixed(3)} × ${s} / ${E})² = ${raw.toFixed(1)} → 올림 ${need(E)}건 · 오차를 절반(${(E / 2).toFixed(2)})으로 하면 ${need(E / 2).toLocaleString("ko-KR")}건`;
    draw();
  }
  [eIn, sIn, cSel].forEach((x) => x.addEventListener("input", update));
  update();
})();
