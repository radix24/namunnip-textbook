/* 카드: 우리 반의 키(또는 직접 잰 자료)는 정규분포를 따를까? — 입력한 자료의 히스토그램과 N(x̄, s²) */
(() => {
  const root = document.getElementById("card-pmath-height-normal");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n: fm, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const ta = $(".data"), sb = $(".sb");
  let xs = [];
  const { ctx, size } = fit($("canvas"), () => draw());
  const parse = () => (ta.value.match(/-?\d+(\.\d+)?/g) || []).map(Number).filter(Number.isFinite);
  const stat = () => { const N = xs.length, m = xs.reduce((a, b) => a + b, 0) / N, s = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, N - 1)); return { N, m, s }; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    if (xs.length < 3) { G.frame(ctx, w, h, { xr: [0, 1], yr: [0, 1], xs: 1, ys: 1, xf: () => "", yf: () => "" }); return; }
    const { m, s } = stat(), lo = Math.min(...xs, m - 3 * s), hi = Math.max(...xs, m + 3 * s), k = +sb.value, bw = (Math.max(...xs) - Math.min(...xs) || 1) / k, x0 = Math.min(...xs);
    const cnt = Array(k).fill(0); xs.forEach((x) => { cnt[Math.min(k - 1, Math.floor((x - x0) / bw))]++; });
    const dens = cnt.map((c) => c / xs.length / bw), top = Math.max(...dens, NMSim.npdf(m, m, s)) * 1.15;
    const step = (v) => { const r = v / 6, mag = 10 ** Math.floor(Math.log10(r)); return [1, 2, 5, 10].map((q) => q * mag).find((q) => q >= r); };
    const g = G.frame(ctx, w, h, { xr: [lo, hi], yr: [0, top], xs: step(hi - lo), ys: step(top), xf: (v) => fm(v, 1), yf: (v) => fm(v, 3) });
    ctx.fillStyle = "rgba(63,111,163,.08)"; ctx.fillRect(g.X(m - 2 * s), g.y0, g.X(m + 2 * s) - g.X(m - 2 * s), g.h);
    ctx.fillStyle = "rgba(63,111,163,.12)"; ctx.fillRect(g.X(m - s), g.y0, g.X(m + s) - g.X(m - s), g.h);
    dens.forEach((d, i) => { ctx.fillStyle = C.sprout; ctx.fillRect(g.X(x0 + i * bw) + 0.5, g.Y(d), g.X(x0 + (i + 1) * bw) - g.X(x0 + i * bw) - 1, g.Y(0) - g.Y(d)); });
    G.curve(ctx, g, (x) => NMSim.npdf(x, m, s), BLUE, { width: 2.4 });
    G.tag(ctx, g, `N(${fm(m, 1)}, ${fm(s, 2)}²)`, g.x0 + g.w - 4, g.y0 + 10, BLUE, "right");
  }
  function update() {
    xs = parse(); $(".b-out").textContent = sb.value;
    if (xs.length < 3) { ["n", "m", "s", "r"].forEach((c) => { $(`.n-${c}`).textContent = "—"; }); $(".n-n").textContent = String(xs.length); draw(); return; }
    const { N, m, s } = stat(), in1 = xs.filter((x) => Math.abs(x - m) <= s).length / N, in2 = xs.filter((x) => Math.abs(x - m) <= 2 * s).length / N;
    $(".n-n").textContent = N; $(".n-m").textContent = fm(m, 2); $(".n-s").textContent = fm(s, 2);
    $(".n-r").textContent = `${NMSim.pct(in1, 0)} / ${NMSim.pct(in2, 0)}`;
    draw();
  }
  $(".go-draw").addEventListener("click", update);
  $(".go-ex").addEventListener("click", () => {
    // 모의 자료: 평균 170, 표준편차 6인 정규분포에서 뽑은 100개(실제 측정값 아님)
    ta.value = Array.from({ length: 100 }, () => (170 + 6 * NMSim.gauss()).toFixed(1)).join(", "); update();
  });
  $(".go-clear").addEventListener("click", () => { ta.value = ""; update(); });
  sb.addEventListener("input", update);
  update();
})();
