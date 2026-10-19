/* 카드: 단위원에 접선 하나를 그으면 삼각함수 몇 개가 보일까? — 접선의 x·y절편으로 sec·csc, 접선 조각으로 tan·cot */
(() => {
  const root = document.getElementById("card-pmath-recip-circle");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, rad, deg, piLab, label, dot, seg, arc, drag, BLUE, PURPLE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const st = $(".st");
  const FN = {
    sec: { f: (t) => 1 / Math.cos(t), col: C.warn, name: "sec θ" },
    csc: { f: (t) => 1 / Math.sin(t), col: BLUE, name: "csc θ" },
    tan: { f: (t) => Math.tan(t), col: C.forest, name: "tan θ" },
    cot: { f: (t) => 1 / Math.tan(t), col: PURPLE, name: "cot θ" },
  };
  let fk = "sec", geo = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const t = rad(+st.value), c = Math.cos(t), s = Math.sin(t);
    // 왼쪽: 원 (반지름 R, 그림은 ±2.6까지)
    const half = Math.min(w * 0.24, h * 0.48), R = half / 2.6, cx = half + 6, cy = h / 2;
    geo = { cx, cy, R };
    const P = (x, y) => [cx + R * x, cy - R * y];
    ctx.save(); ctx.beginPath(); ctx.rect(cx - half, cy - half, 2 * half, 2 * half); ctx.clip();
    seg(ctx, cx - half, cy, cx + half, cy, C.ink3, 1); seg(ctx, cx, cy - half, cx, cy + half, C.ink3, 1);
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    const [px, py] = P(c, s);
    // 접선: P에서 방향 (−s, c)
    seg(ctx, ...P(c + 4 * s, s - 4 * c), ...P(c - 4 * s, s + 4 * c), C.ink3, 1.2);
    seg(ctx, cx, cy, px, py, C.ink2, 1.4);
    arc(ctx, cx, cy, R * 0.3, 0, t, C.ink2);
    const S = Math.abs(c) > 1e-6 ? 1 / c : null, T = Math.abs(s) > 1e-6 ? 1 / s : null;
    if (S != null) { seg(ctx, cx, cy, ...P(S, 0), C.warn, 3.2); seg(ctx, px, py, ...P(S, 0), C.forest, 2.2); dot(ctx, ...P(S, 0), C.warn, 4); label(ctx, "S", ...P(S, -0.22), C.warn, "center", `italic 700 12px ${F.serif}`); }
    if (T != null) { seg(ctx, cx, cy, ...P(0, T), BLUE, 3.2); seg(ctx, px, py, ...P(0, T), PURPLE, 2.2); dot(ctx, ...P(0, T), BLUE, 4); label(ctx, "T", ...P(-0.22, T), BLUE, "center", `italic 700 12px ${F.serif}`); }
    dot(ctx, px, py, C.ink, 6);
    label(ctx, "P", px + (c >= 0 ? 11 : -11), py - 10, C.ink, "center", `italic 700 13px ${F.serif}`);
    ctx.restore();
    if (S != null && Math.abs(S) > 2.6) label(ctx, `S는 그림 밖 (${n(S, 1)})`, cx, cy + half - 8, C.warn, "center", `600 11px ${F.sans}`);
    if (T != null && Math.abs(T) > 2.6) label(ctx, `T는 그림 밖 (${n(T, 1)})`, cx, cy - half + 8, BLUE, "center", `600 11px ${F.sans}`);
    // 오른쪽: 그래프
    const L = 2 * half + 44;
    const g = G.frame(ctx, w, h, { xr: [0, 2 * Math.PI], yr: [-4, 4], xs: Math.PI / 2, ys: 2, L, R: 8, xf: piLab, yf: (v) => n(v, 0) });
    const fn = FN[fk];
    G.curve(ctx, g, fn.f, fn.col, { width: 2.4, N: 800 });
    // 점근선: 함숫값이 정의되지 않는 곳
    const bad = fk === "sec" ? [Math.PI / 2, 3 * Math.PI / 2] : fk === "tan" ? [Math.PI / 2, 3 * Math.PI / 2] : [0, Math.PI, 2 * Math.PI];
    bad.forEach((x) => { ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.moveTo(g.X(x), g.y0); ctx.lineTo(g.X(x), g.y0 + g.h); ctx.stroke(); ctx.restore(); });
    const v = fn.f(t % (2 * Math.PI));
    if (Number.isFinite(v) && Math.abs(v) < 1e6) { G.guide(ctx, g, t % (2 * Math.PI), NM.clamp(v, -4, 4), fn.col, "x"); if (Math.abs(v) <= 4) G.dot(ctx, g, t % (2 * Math.PI), v, fn.col); }
    G.tag(ctx, g, `y = ${fn.name}`, g.x0 + 4, g.y0 + 10, fn.col);
  }

  function update() {
    const t = rad(+st.value), c = Math.cos(t), s = Math.sin(t);
    $(".t-out").textContent = `${st.value}°`;
    const f = (v) => (Math.abs(v) > 1e6 || !Number.isFinite(v) ? "정의 안 됨" : n(v, 3));
    $(".n-sec").textContent = f(1 / c); $(".n-csc").textContent = f(1 / s);
    $(".n-tan").textContent = f(s / c); $(".n-cot").textContent = f(c / s);
    draw();
  }
  drag(cv, (x, y) => {
    if (!geo) return null;
    const t = rad(+st.value), px = geo.cx + geo.R * Math.cos(t), py = geo.cy - geo.R * Math.sin(t);
    return Math.hypot(x - px, y - py) < 18 ? 1 : null;
  }, (_, x, y) => {
    let a = deg(Math.atan2(geo.cy - y, x - geo.cx)); if (a < 0) a += 360;
    st.value = Math.round(a); update();
  }, null, "none");
  G.chips(root, ".presets .chip", (b) => { fk = b.dataset.f; draw(); });
  st.addEventListener("input", update);
  update();
})();
