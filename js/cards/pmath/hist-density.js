/* 카드: 버스를 정확히 3분 기다릴 확률은 왜 0일까? — 밀도 히스토그램이 확률밀도함수로 */
(() => {
  const root = document.getElementById("card-pmath-hist-density");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sw = $(".sw"), sa = $(".sa"), sb = $(".sb");
  const WIDTHS = [0.25, 0.5, 1, 2, 2.5, 5];
  /* 분포: 표본 뽑기, 밀도, 누적분포 (모두 0 ~ 10분) */
  const D = {
    uni: { draw: () => Math.random() * 10, f: (x) => (x >= 0 && x <= 10 ? 0.1 : 0), F: (x) => Math.min(1, Math.max(0, x / 10)), top: 0.25 },
    tri: { draw: () => Math.max(Math.random(), Math.random()) * 10, f: (x) => (x >= 0 && x <= 10 ? 2 * x / 100 : 0), F: (x) => Math.min(1, Math.max(0, (x / 10) ** 2)), top: 0.3 },
    exp: { draw: () => Math.min(9.9999, -2 * Math.log(1 - Math.random())), f: (x) => (x >= 0 && x <= 10 ? Math.exp(-x / 2) / 2 / (1 - Math.exp(-5)) : 0), F: (x) => Math.min(1, Math.max(0, (1 - Math.exp(-x / 2)) / (1 - Math.exp(-5)))), top: 0.6 },
  };
  let dk = "uni", data = [];
  const { ctx, size } = fit($("canvas"), () => draw());
  const sample = () => {
    const d = D[dk]; data = [];
    // 지수분포는 10분에서 잘라 쓴다(10분 넘는 값은 다시 뽑음)
    while (data.length < 5000) { const v = dk === "exp" ? -2 * Math.log(1 - Math.random()) : d.draw(); if (v < 10) data.push(v); }
  };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const d = D[dk], bw = WIDTHS[+sw.value], k = Math.round(10 / bw), a = Math.min(+sa.value, +sb.value), b = Math.max(+sa.value, +sb.value);
    const g = G.frame(ctx, w, h, { xr: [0, 10], yr: [0, d.top], xs: 1, ys: d.top > 0.4 ? 0.1 : 0.05, xf: (v) => n(v, 0), yf: (v) => n(v, 2) });
    const cnt = Array(k).fill(0); data.forEach((x) => { cnt[Math.min(k - 1, Math.floor(x / bw))]++; });
    cnt.forEach((c, i) => {
      const hgt = c / data.length / bw, x0 = g.X(i * bw), x1 = g.X((i + 1) * bw);
      ctx.fillStyle = C.sprout; ctx.fillRect(x0 + 0.5, g.Y(hgt), x1 - x0 - 1, g.Y(0) - g.Y(hgt));
    });
    // 고른 구간의 곡선 아래 넓이
    ctx.fillStyle = "rgba(63,111,163,.35)"; ctx.beginPath(); ctx.moveTo(g.X(a), g.Y(0));
    for (let i = 0; i <= 80; i++) { const x = a + (b - a) * i / 80; ctx.lineTo(g.X(x), g.Y(d.f(x))); }
    ctx.lineTo(g.X(b), g.Y(0)); ctx.closePath(); ctx.fill();
    G.curve(ctx, g, d.f, BLUE, { width: 2.4, from: 0, to: 10 });
    G.tag(ctx, g, "y = f(x)", g.x0 + g.w - 4, g.y0 + 10, BLUE, "right");
    G.tag(ctx, g, "기다린 시간 (분)", g.x0 + g.w - 4, g.y0 + g.h - 10, C.ink3, "right");
    const s = cnt.reduce((acc, c) => acc + c / data.length, 0);
    $(".n-s").textContent = n(s, 3);
  }
  function update() {
    const d = D[dk], a = Math.min(+sa.value, +sb.value), b = Math.max(+sa.value, +sb.value);
    $(".w-out").textContent = WIDTHS[+sw.value]; $(".a-out").textContent = n(+sa.value, 1); $(".b-out").textContent = n(+sb.value, 1);
    $(".n-r").textContent = n(data.filter((x) => x >= a && x <= b).length / data.length, 4);
    $(".n-i").textContent = n(d.F(b) - d.F(a), 4);
    draw();
  }
  root.querySelectorAll(".dist .chip").forEach((bt) => bt.addEventListener("click", () => {
    dk = bt.dataset.d; root.querySelectorAll(".dist .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === bt))); sample(); update();
  }));
  [sw, sa, sb].forEach((el) => el.addEventListener("input", update));
  sample(); update();
})();
