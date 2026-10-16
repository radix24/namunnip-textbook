/* 카드: 접선의 기울기를 모으면 sec x의 도함수가 보일까? — 접선 기울기의 자취와 도함수 공식 비교 */
(() => {
  const root = document.getElementById("card-pmath-deriv-trace");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, piLab, drag, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sx = $(".sx"), fbtn = $(".go-formula"), PI = Math.PI;
  const FN = {
    sec: { f: (x) => 1 / Math.cos(x), d: (x) => Math.sin(x) / Math.cos(x) ** 2, xr: [-PI, PI], yr: [-4, 4], dyr: [-6, 6], pi: true, name: "sec x tan x" },
    csc: { f: (x) => 1 / Math.sin(x), d: (x) => -Math.cos(x) / Math.sin(x) ** 2, xr: [0.02, 2 * PI - 0.02], yr: [-4, 4], dyr: [-6, 6], pi: true, name: "−csc x cot x" },
    cot: { f: (x) => Math.cos(x) / Math.sin(x), d: (x) => -1 / Math.sin(x) ** 2, xr: [0.02, PI - 0.02], yr: [-4, 4], dyr: [-8, 1], pi: true, name: "−csc²x" },
    asin: { f: Math.asin, d: (x) => 1 / Math.sqrt(1 - x * x), xr: [-0.995, 0.995], yr: [-2, 2], dyr: [0, 6], pi: false, name: "1/√(1 − x²)" },
    atan: { f: Math.atan, d: (x) => 1 / (1 + x * x), xr: [-4, 4], yr: [-2, 2], dyr: [0, 1.2], pi: false, name: "1/(1 + x²)" },
  };
  let fk = "sec", trail = [], gT = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const xval = () => { const F_ = FN[fk]; return F_.xr[0] + (F_.xr[1] - F_.xr[0]) * (+sx.value) / 1000; };
  const slope = (x) => { const F_ = FN[fk], hh = 1e-5; return (F_.f(x + hh) - F_.f(x - hh)) / (2 * hh); };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const F_ = FN[fk], x = xval(), y = F_.f(x), m = slope(x);
    const xf = F_.pi ? (v) => piLab(v) : (v) => n(v, 1), xs = F_.pi ? PI / 2 : (fk === "atan" ? 1 : 0.5);
    const hTop = h * 0.54;
    gT = G.frame(ctx, w, hTop, { xr: F_.xr, yr: F_.yr, xs, ys: F_.yr[1] > 3 ? 2 : 1, xf, B: 18 });
    G.curve(ctx, gT, F_.f, C.forest, { width: 2.4, N: 900 });
    if (Number.isFinite(y) && Math.abs(y) < 50) {
      G.curve(ctx, gT, (t) => y + m * (t - x), C.warn, { width: 1.6, from: x - 1.2, to: x + 1.2 });
      G.dot(ctx, gT, x, y, C.warn);
    }
    G.tag(ctx, gT, "y = f(x)와 접선", gT.x0 + 4, gT.y0 + 10, C.forest);
    ctx.save(); ctx.translate(0, hTop + 6);
    const gB = G.frame(ctx, w, h - hTop - 6, { xr: F_.xr, yr: F_.dyr, xs, ys: (F_.dyr[1] - F_.dyr[0]) > 4 ? 2 : 0.5, xf });
    if (fbtn.getAttribute("aria-pressed") === "true") G.curve(ctx, gB, F_.d, BLUE, { width: 2, N: 900, dash: [6, 4] });
    ctx.fillStyle = C.warn;
    trail.forEach(([tx, ty]) => { if (ty >= F_.dyr[0] && ty <= F_.dyr[1]) { ctx.beginPath(); ctx.arc(gB.X(tx), gB.Y(ty), 2.2, 0, 7); ctx.fill(); } });
    if (Number.isFinite(m) && m >= F_.dyr[0] && m <= F_.dyr[1]) G.dot(ctx, gB, x, m, C.warn);
    G.tag(ctx, gB, "기울기의 자취", gB.x0 + 4, gB.y0 + 10, C.warn);
    if (fbtn.getAttribute("aria-pressed") === "true") G.tag(ctx, gB, `y = ${F_.name}`, gB.x0 + gB.w - 4, gB.y0 + 10, BLUE, "right");
    ctx.restore();
  }

  function update() {
    const F_ = FN[fk], x = xval(), m = slope(x), d = F_.d(x);
    $(".x-out").textContent = F_.pi ? `${n(x, 2)} (${n(x * 180 / PI, 0)}°)` : n(x, 3);
    const ok = (v) => Number.isFinite(v) && Math.abs(v) < 1e5;
    $(".n-num").textContent = ok(m) ? n(m, 3) : "정의 안 됨";
    $(".n-for").textContent = ok(d) ? n(d, 3) : "정의 안 됨";
    $(".n-name").textContent = F_.name;
    if (ok(m)) trail.push([x, m]);
    if (trail.length > 3000) trail.splice(0, 1000);
    draw();
  }
  drag(cv, () => 1, (_, px) => { if (!gT) return; const F_ = FN[fk]; sx.value = Math.round(NM.clamp((gT.ix(px) - F_.xr[0]) / (F_.xr[1] - F_.xr[0]), 0, 1) * 1000); update(); });
  G.chips(root, ".presets .chip[data-f]", (b) => { fk = b.dataset.f; trail = []; update(); });
  fbtn.addEventListener("click", () => { fbtn.setAttribute("aria-pressed", String(fbtn.getAttribute("aria-pressed") !== "true")); draw(); });
  $(".go-clear").addEventListener("click", () => { trail = []; draw(); });
  sx.addEventListener("input", update);
  update();
})();
