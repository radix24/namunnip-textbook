/* 카드: 무대용 마이크는 왜 뒤쪽 소리를 잘 받지 않을까? — 지향 특성 r = a + (1 − a)cos θ, 스피커 끌기 */
(() => {
  const root = document.getElementById("card-adcalc-mic-pattern");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, dg, drag, label, seg, dot, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa"), cv = $("canvas"), PI = Math.PI;
  let src = PI * 0.85, pf = null;   // 정면에서 잰 각 (정면 = 화면 위쪽)
  const { ctx, size } = fit(cv, () => draw());
  const sens = (t) => { const a = +sa.value; return a + (1 - a) * Math.cos(t); };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    pf = A.pframe(ctx, w, h, { rmax: 1.25, rings: 5, rays: 12, ringLabels: false });
    const rot = PI / 2;   // 정면을 위쪽으로
    const N = 720;
    for (let i = 0; i < N; i++) {
      const a = 2 * PI * i / N, b = 2 * PI * (i + 1) / N, r = sens((a + b) / 2);
      const [x1, y1] = pf.P(sens(a), a + rot), [x2, y2] = pf.P(sens(b), b + rot);
      seg(ctx, x1, y1, x2, y2, r < 0 ? C.warn : BLUE, 2.4);
    }
    const aa = +sa.value;
    if (aa <= 0.5) { const z = Math.acos(-aa / (1 - aa || 1e-9)); [z, -z].forEach((t) => { const [x, y] = pf.P(1.2, t + rot); seg(ctx, pf.cx, pf.cy, x, y, C.ink3, 1.2, [4, 4]); }); }
    // 마이크
    ctx.save(); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(pf.cx - 5, pf.cy - 4, 10, 22, 4) : ctx.rect(pf.cx - 5, pf.cy - 4, 10, 22); ctx.fill(); ctx.beginPath(); ctx.arc(pf.cx, pf.cy - 6, 7, 0, 7); ctx.fill(); ctx.restore();
    label(ctx, "정면", pf.cx, 10, C.ink2, "center", `600 11px ${F.sans}`);
    // 스피커
    const [sx, sy] = pf.P(1.12, src + rot);
    const r = sens(src), [qx, qy] = pf.P(r, src + rot);
    seg(ctx, pf.cx, pf.cy, sx, sy, C.ink3, 1, [2, 3]);
    if (Math.abs(r) > 0.01) dot(ctx, qx, qy, r < 0 ? C.warn : BLUE, 4);
    ctx.save(); ctx.fillStyle = C.warn; ctx.fillRect(sx - 7, sy - 7, 14, 14); ctx.restore();
    label(ctx, "스피커", sx, sy + (sy > pf.cy ? 15 : -15), C.warn, "center", `600 11px ${F.sans}`);
  }
  function nums() {
    const r = sens(src);
    $(".a-out").textContent = n(+sa.value, 2);
    let d = ((src % (2 * PI)) + 2 * PI) % (2 * PI); if (d > PI) d = 2 * PI - d;
    $(".n-t").textContent = dg(d);
    $(".n-r").textContent = n(Math.abs(r), 3);
    $(".n-db").textContent = Math.abs(r) < 1e-3 ? "−∞" : `${n(20 * Math.log10(Math.abs(r)), 1)} dB`;
    draw();
  }
  drag(cv, (x, y) => { if (!pf) return null; const [sx, sy] = pf.P(1.12, src + PI / 2); return Math.hypot(x - sx, y - sy) < 22 ? 1 : null; },
    (_, x, y) => { const [, t] = pf.inv(x, y); src = t - PI / 2; nums(); }, null, "none");
  root.querySelectorAll(".presets .chip").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll(".presets .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    sa.value = b.dataset.a; nums();
  }));
  sa.addEventListener("input", nums);
  nums();
})();
