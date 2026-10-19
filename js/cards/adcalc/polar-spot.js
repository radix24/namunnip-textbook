/* 카드: θ = tan⁻¹(y/x)로 각을 구한 이 풀이, 맞을까? — 좌표 변환 풀이 네 개의 오류 찾기와 극좌표 판 */
(() => {
  const root = document.getElementById("card-adcalc-polar-spot");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { label, dot, spot } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const PI = Math.PI, S3 = Math.sqrt(3);
  let sk = 0;
  const done = new Set();
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pf = A.pframe(ctx, w, h, { rmax: 3, rings: 3, rays: 12 });
    const XY = (x, y) => [pf.cx + x * pf.S, pf.cy - y * pf.S];
    const pt = (x, y, col, txt, dy = -12) => { const [a, b] = XY(x, y); dot(ctx, a, b, col, 5.5); label(ctx, txt, a, b + dy, col, "center", `600 11px ${F.sans}`); };
    if (sk === 0) { pt(-1, -S3, C.forest, "(−1, −√3)", 14); pt(1, S3, C.warn, "풀이의 답 (2, π/3)"); }
    if (sk === 1) { pt(0, -2, C.forest, "(0, −2)", 14); if (done.has(1)) pt(0, -2, C.forest, "(2, 3π/2)", -12); }
    if (sk === 2) { pt(1, S3, C.forest, "(−2, 4π/3) = (1, √3)"); const [a, b] = XY(-1, -S3); ctx.save(); ctx.strokeStyle = C.ink3; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(...XY(1, S3)); ctx.stroke(); ctx.restore(); label(ctx, "4π/3 방향", a, b + 12, C.ink3, "center", `11px ${F.sans}`); }
    if (sk === 3) {
      A.pcurve(ctx, pf, (t) => 2 * Math.cos(t), 0, PI, C.forest, { width: 2.6 });
      ctx.save(); ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath();
      ctx.moveTo(...XY(0, 0)); ctx.lineTo(...XY(1.6, 1.6 * S3)); ctx.moveTo(...XY(0, 0)); ctx.lineTo(...XY(1.6, -1.6 * S3)); ctx.stroke(); ctx.restore();
      label(ctx, "r = 2cos θ", ...XY(1, 1.2), C.forest, "center", `600 11px ${F.sans}`);
      label(ctx, "풀이의 답 y² = 3x²", ...XY(1.4, -2.7), C.warn, "center", `600 11px ${F.sans}`);
    }
  }
  root.querySelectorAll(".spot").forEach((ol, i) => spot(ol, () => { done.add(i); draw(); }));
  G.chips(root, ".presets .chip", (b) => {
    sk = +b.dataset.s;
    root.querySelectorAll(".sol").forEach((d) => { d.hidden = +d.dataset.s !== sk; });
    draw();
  });
  draw();
})();
