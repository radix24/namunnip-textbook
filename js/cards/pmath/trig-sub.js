/* 카드: ∫₀ᵃ√(1 − x²)dx를 원의 그림만으로 계산할 수 있을까? — 삼각형 + 부채꼴, x = sin θ 치환 */
(() => {
  const root = document.getElementById("card-pmath-trig-sub");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, piLab, label, seg, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa");
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const a = +sa.value, b = Math.sqrt(1 - a * a), th = Math.asin(a);
    // 왼쪽: 단위원 윗부분
    const lw = w * 0.5, R = Math.min(lw / 2.3, h * 0.82), cx = lw / 2, cy = h - 22;
    const P = (x, y) => [cx + R * x, cy - R * y];
    seg(ctx, cx - R - 8, cy, cx + R + 8, cy, C.ink3, 1); seg(ctx, cx, cy + 4, cx, cy - R - 8, C.ink3, 1);
    // 부채꼴: y축(각 π/2)에서 OP(각 π/2 − θ)까지
    ctx.fillStyle = "rgba(116,171,102,.55)"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, -Math.PI / 2, -(Math.PI / 2 - th)); ctx.closePath(); ctx.fill();
    // 삼각형 O, (a, 0), (a, b)
    ctx.fillStyle = "rgba(63,111,163,.4)"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(...P(a, 0)); ctx.lineTo(...P(a, b)); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI, 0); ctx.stroke();
    seg(ctx, cx, cy, ...P(a, b), C.ink, 1.4); seg(ctx, ...P(a, 0), ...P(a, b), C.ink, 1.4);
    ctx.strokeStyle = C.forest; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(cx, cy, R * 0.28, -Math.PI / 2, -(Math.PI / 2 - th)); ctx.stroke();
    label(ctx, "θ", cx + R * 0.36 * Math.sin(th / 2), cy - R * 0.36 * Math.cos(th / 2), C.forest, "center", `italic 700 12px ${F.serif}`);
    label(ctx, "a", ...P(a, -0.07), C.ink, "center", `italic 700 12px ${F.serif}`);
    label(ctx, "1", ...P(1, -0.07), C.ink3, "center", `11px ${F.mono}`); label(ctx, "−1", ...P(-1, -0.07), C.ink3, "center", `11px ${F.mono}`);
    label(ctx, "부채꼴", 8, 14, C.forest, "left", `600 11.5px ${F.sans}`);
    label(ctx, "삼각형", 8, 30, BLUE, "left", `600 11.5px ${F.sans}`);
    // 오른쪽: θ축, cos²θ
    ctx.save(); ctx.translate(lw + 8, 0);
    const g = G.frame(ctx, w - lw - 8, h, { xr: [0, Math.PI / 2 + 0.05], yr: [0, 1.1], xs: Math.PI / 8, ys: 0.5, xf: (v) => (Math.abs(v % (Math.PI / 4)) < 1e-6 ? piLab(v) : ""), yf: (v) => n(v, 1) });
    ctx.fillStyle = "rgba(116,171,102,.45)"; ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0));
    for (let i = 0; i <= 80; i++) { const t = th * i / 80; ctx.lineTo(g.X(t), g.Y(Math.cos(t) ** 2)); }
    ctx.lineTo(g.X(th), g.Y(0)); ctx.closePath(); ctx.fill();
    G.curve(ctx, g, (t) => Math.cos(t) ** 2, C.forest, { width: 2.2, from: 0, to: Math.PI / 2 });
    G.guide(ctx, g, th, Math.cos(th) ** 2, C.ink3, "x");
    G.tag(ctx, g, "y = cos²θ", g.x0 + g.w - 4, g.y0 + 10, C.forest, "right");
    G.tag(ctx, g, `θ = arcsin a = ${n(th, 3)}`, g.x0 + g.w - 4, g.y0 + 28, C.ink2, "right");
    ctx.restore();
  }
  function update() {
    const a = +sa.value, tri = a * Math.sqrt(1 - a * a) / 2, sec = Math.asin(a) / 2;
    let s = 0; const N = 2000; for (let i = 0; i < N; i++) { const x = a * (i + 0.5) / N; s += Math.sqrt(1 - x * x) * a / N; }
    $(".a-out").textContent = n(a, 2);
    $(".n-tri").textContent = n(tri, 4); $(".n-sec").textContent = n(sec, 4); $(".n-sum").textContent = n(tri + sec, 4); $(".n-num").textContent = n(s, 4);
    draw();
  }
  sa.addEventListener("input", update);
  update();
})();
