/* 카드: 벽에 높이 걸린 그림은 몇 걸음 떨어져야 가장 크게 보일까? — θ(x) = arctan(b/x) − arctan(a/x)의 최대 */
(() => {
  const root = document.getElementById("card-pmath-museum");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, deg, label, dot, seg, arc, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa"), sh = $(".sh"), sx = $(".sx"), best = $(".go-best");
  const { ctx, size } = fit($("canvas"), () => draw());
  const th = (x, a, b) => Math.atan(b / x) - Math.atan(a / x);

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const a = +sa.value, b = a + +sh.value, x = +sx.value, show = best.getAttribute("aria-pressed") === "true";
    // 왼쪽: 옆에서 본 모습 (가로 0~8 m, 세로 −1.6~6.2 m, 같은 축척)
    const lw = w * 0.46, s = Math.min((lw - 30) / 8.6, (h - 20) / 7.8);
    const wallX = 14 + 8.3 * s, eyeY = h - 18 - 1.6 * s;
    const P = (dx, dy) => [wallX - dx * s, eyeY - dy * s];
    seg(ctx, 10, h - 18, wallX, h - 18, C.ink3, 1.2);                     // 바닥
    seg(ctx, wallX, h - 18, wallX, 6, C.ink2, 2.4);                        // 벽
    ctx.fillStyle = "#e7d7b5"; ctx.fillRect(wallX - 5, P(0, b)[1], 5, (b - a) * s);
    ctx.strokeStyle = C.amber; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(...P(0, a)); ctx.lineTo(...P(0, b)); ctx.stroke();
    const [ex, ey] = P(x, 0);
    // 사람
    seg(ctx, ex, ey, ex, h - 18, C.ink3, 2); ctx.strokeStyle = C.ink3; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ex, ey, 6, 0, 7); ctx.stroke();
    seg(ctx, ex, ey, ...P(0, a), BLUE, 1.4); seg(ctx, ex, ey, ...P(0, b), BLUE, 1.4);
    seg(ctx, ex, ey, wallX, ey, C.rule, 1, [3, 3]);
    arc(ctx, ex, ey, 24, Math.atan(a / x), Math.atan(b / x), C.warn, 2.2);
    const mid = (Math.atan(a / x) + Math.atan(b / x)) / 2;
    label(ctx, "θ", ex + 36 * Math.cos(mid), ey - 36 * Math.sin(mid), C.warn, "center", `italic 700 13px ${F.serif}`);
    label(ctx, `${n(x, 2)} m`, (ex + wallX) / 2, ey + 12, C.ink2, "center", `11px ${F.sans}`);
    if (show) { const [bx] = P(Math.sqrt(a * b), 0); seg(ctx, bx, h - 24, bx, h - 12, C.forest, 3); label(ctx, "최적", bx, h - 30, C.forest, "center", `600 11px ${F.sans}`); }
    // 오른쪽: 시야각 그래프
    ctx.save(); ctx.translate(lw + 8, 0);
    const xmax = 8, top = Math.ceil(deg(th(Math.sqrt(a * b), a, b)) / 10) * 10 + 5;
    const g = G.frame(ctx, w - lw - 8, h, { xr: [0, xmax], yr: [0, top], xs: 2, ys: 10, xf: (v) => n(v, 0), yf: (v) => `${n(v, 0)}°` });
    G.curve(ctx, g, (t) => (t > 0 ? deg(th(t, a, b)) : NaN), C.forest, { width: 2.4, from: 0.02 });
    G.dot(ctx, g, x, deg(th(x, a, b)), C.warn);
    if (show) { const bx = Math.sqrt(a * b); G.guide(ctx, g, bx, deg(th(bx, a, b)), C.forest, "x"); G.dot(ctx, g, bx, deg(th(bx, a, b)), C.forest, true, 5.5); }
    G.tag(ctx, g, "시야각 θ(x)", g.x0 + 4, g.y0 + 10, C.forest);
    G.tag(ctx, g, "거리 x (m)", g.x0 + g.w - 4, g.y0 + g.h - 10, C.ink3, "right");
    ctx.restore();
  }

  function update() {
    const a = +sa.value, b = a + +sh.value, x = +sx.value;
    $(".a-out").textContent = n(a, 1); $(".hh-out").textContent = n(+sh.value, 1); $(".x-out").textContent = n(x, 2);
    $(".n-t").textContent = `${n(deg(th(x, a, b)), 1)}°`;
    const d = -b / (x * x + b * b) + a / (x * x + a * a);
    $(".n-d").textContent = `${n(d, 4)} ${d > 1e-5 ? "(+)" : d < -1e-5 ? "(−)" : "(0)"}`;
    $(".n-best").textContent = best.getAttribute("aria-pressed") === "true" ? `√(ab) = ${n(Math.sqrt(a * b), 2)} m` : "?";
    draw();
  }
  best.addEventListener("click", () => { best.setAttribute("aria-pressed", String(best.getAttribute("aria-pressed") !== "true")); update(); });
  [sa, sh, sx].forEach((s) => s.addEventListener("input", update));
  update();
})();
