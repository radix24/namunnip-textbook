/* 카드: 이차식 하나로 cos x를 가장 잘 흉내 내려면? — 계수 막대로 맞추기와 테일러다항식 비교 */
(() => {
  const root = document.getElementById("card-adcalc-taylor-fit");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const s0 = $(".s0"), s1 = $(".s1"), s2 = $(".s2"), bShow = $(".go-show");
  const P = { cos: { f: Math.cos, t: [1, 0, -0.5], yr: [-0.6, 1.6] }, exp: { f: Math.exp, t: [1, 1, 0.5], yr: [-0.5, 3.2] } };
  let pk = "cos";
  const { ctx, size } = fit($("canvas"), () => draw());
  const mine = (x) => +s0.value + +s1.value * x + +s2.value * x * x;
  const tay = (x) => { const t = P[pk].t; return t[0] + t[1] * x + t[2] * x * x; };
  const maxErr = (p) => { let m = 0; for (let i = 0; i <= 200; i++) { const x = -1 + i / 100; m = Math.max(m, Math.abs(p(x) - P[pk].f(x))); } return m; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = P[pk];
    const g = G.frame(ctx, w, h, { xr: [-2, 2], yr: p.yr, xs: 0.5, ys: 0.5, xf: (v) => n(v, 1), yf: (v) => n(v, 1) });
    ctx.save(); ctx.fillStyle = "rgba(59,124,42,.07)"; ctx.fillRect(g.X(-1), g.y0, g.X(1) - g.X(-1), g.h); ctx.restore();
    G.curve(ctx, g, p.f, C.ink2, { width: 3 });
    G.curve(ctx, g, mine, C.warn, { width: 2.2 });
    if (bShow.getAttribute("aria-pressed") === "true") G.curve(ctx, g, tay, BLUE, { width: 2, dash: [6, 4] });
    G.tag(ctx, g, `회색: ${pk === "cos" ? "cos x" : "eˣ"} · 주황: 내 이차식${bShow.getAttribute("aria-pressed") === "true" ? " · 파랑: 테일러" : ""}`, g.x0 + 4, g.y0 + 10, C.ink3);
  }
  function nums() {
    $(".o0").textContent = n(+s0.value, 2); $(".o1").textContent = n(+s1.value, 2); $(".o2").textContent = n(+s2.value, 2);
    const f = P[pk].f, shown = bShow.getAttribute("aria-pressed") === "true";
    $(".n-a").textContent = n(Math.abs(mine(0.1) - f(0.1)), 6);
    $(".n-b").textContent = shown ? n(Math.abs(tay(0.1) - f(0.1)), 6) : "?";
    $(".n-c").textContent = n(maxErr(mine), 4) + (shown ? ` (테일러 ${n(maxErr(tay), 4)})` : "");
    draw();
  }
  G.chips(root, ".pk .chip", (b) => { pk = b.dataset.p; s0.value = pk === "cos" ? 0.8 : 1.3; s1.value = pk === "cos" ? 0.3 : 0.5; s2.value = 0; bShow.setAttribute("aria-pressed", "false"); nums(); });
  bShow.addEventListener("click", () => { bShow.setAttribute("aria-pressed", String(bShow.getAttribute("aria-pressed") !== "true")); nums(); });
  [s0, s1, s2].forEach((s) => s.addEventListener("input", nums));
  nums();
})();
