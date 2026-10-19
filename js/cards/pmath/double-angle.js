/* 카드: cos²x의 그래프는 왜 코사인 곡선과 똑같이 생겼을까? — 단위원의 θ·2θ와 반각 공식 그래프 */
(() => {
  const root = document.getElementById("card-pmath-double-angle");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, rad, piLab, label, dot, seg, arc, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const st = $(".st"), show = $(".go-show");
  const FN = {
    c2: { f: (x) => Math.cos(x) ** 2, g: (x) => (1 + Math.cos(2 * x)) / 2, name: "cos²x", alt: "(1 + cos 2x)/2" },
    s2: { f: (x) => Math.sin(x) ** 2, g: (x) => (1 - Math.cos(2 * x)) / 2, name: "sin²x", alt: "(1 − cos 2x)/2" },
    sc: { f: (x) => Math.sin(x) * Math.cos(x), g: (x) => Math.sin(2 * x) / 2, name: "sin x cos x", alt: "(sin 2x)/2" },
  };
  let fk = "c2";
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const t = rad(+st.value);
    // 왼쪽: 단위원
    const R = Math.min(w * 0.17, h * 0.36), cx = R + 18, cy = h / 2;
    seg(ctx, cx - R - 8, cy, cx + R + 8, cy, C.ink3, 1); seg(ctx, cx, cy - R - 8, cx, cy + R + 8, C.ink3, 1);
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    const p1 = [cx + R * Math.cos(t), cy - R * Math.sin(t)], p2 = [cx + R * Math.cos(2 * t), cy - R * Math.sin(2 * t)];
    arc(ctx, cx, cy, R * 0.25, 0, t, C.forest); arc(ctx, cx, cy, R * 0.38, 0, 2 * t % (2 * Math.PI) || 2 * t, BLUE);
    seg(ctx, cx, cy, ...p1, C.forest, 1.6); seg(ctx, cx, cy, ...p2, BLUE, 1.6);
    seg(ctx, p1[0], p1[1], p1[0], cy, C.forest, 1, [3, 3]); seg(ctx, p2[0], p2[1], p2[0], cy, BLUE, 1, [3, 3]);
    dot(ctx, ...p1, C.forest); dot(ctx, ...p2, BLUE);
    label(ctx, "θ", p1[0] + (p1[0] >= cx ? 9 : -9), p1[1] - 9, C.forest, "center", `italic 700 13px ${F.serif}`);
    label(ctx, "2θ", p2[0] + (p2[0] >= cx ? 12 : -12), p2[1] + 11, BLUE, "center", `italic 700 13px ${F.serif}`);
    label(ctx, `cos 2θ = ${n(Math.cos(2 * t), 3)}`, cx, cy + R + 22, BLUE, "center", `600 11.5px ${F.sans}`);
    // 오른쪽: 그래프
    const L = cx + R + 50;
    const g = G.frame(ctx, w, h, { xr: [0, 2 * Math.PI], yr: [-1.1, 1.1], xs: Math.PI / 2, ys: 0.5, L, R: 10, xf: piLab, yf: (v) => n(v, 1) });
    const F_ = FN[fk];
    G.curve(ctx, g, (x) => Math.cos(2 * x), "#c9cbc2", { width: 1.4, dash: [4, 4] });
    G.curve(ctx, g, F_.f, C.forest, { width: 2.6 });
    if (show.getAttribute("aria-pressed") === "true") G.curve(ctx, g, F_.g, C.warn, { width: 2, dash: [7, 5] });
    const tt = t % (2 * Math.PI);
    G.guide(ctx, g, tt, F_.f(tt), C.forest, "x");
    G.dot(ctx, g, tt, F_.f(tt), C.forest);
    G.tag(ctx, g, `y = ${F_.name}`, g.x0 + 6, g.y0 + 10, C.forest);
    if (show.getAttribute("aria-pressed") === "true") G.tag(ctx, g, `y = ${F_.alt}`, g.x0 + 6, g.y0 + 28, C.warn);
    G.tag(ctx, g, "점선: cos 2x", g.x0 + g.w - 4, g.y0 + g.h - 10, C.ink3, "right");
  }

  function update() {
    const t = rad(+st.value);
    $(".t-out").textContent = `${st.value}°`;
    $(".n-c2").textContent = n(Math.cos(2 * t), 4);
    $(".n-d").textContent = n(Math.cos(t) ** 2 - Math.sin(t) ** 2, 4);
    $(".n-s").textContent = `${n(2 * Math.sin(t) * Math.cos(t), 4)} = sin 2θ`;
    draw();
  }
  G.chips(root, ".presets .chip", (b) => { fk = b.dataset.f; draw(); });
  show.addEventListener("click", () => { show.setAttribute("aria-pressed", String(show.getAttribute("aria-pressed") !== "true")); draw(); });
  st.addEventListener("input", update);
  update();
})();
