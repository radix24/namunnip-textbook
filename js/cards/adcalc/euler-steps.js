/* 카드: 접선을 따라 한 걸음씩 가면 해를 얼마나 정확히 그릴 수 있을까? — 오일러 방법, 걸음 수에 따른 오차 */
(() => {
  const root = document.getElementById("card-adcalc-euler-steps");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn");
  const P = {
    exp: { f: (x, y) => y, y0: 1, X: 1, exact: Math.exp, yr: [0, 3], ys: 0.5 },
    cos: { f: (x) => Math.cos(x), y0: 0, X: 2, exact: Math.sin, yr: [-0.2, 1.6], ys: 0.5 },
    xy: { f: (x, y) => x - y, y0: 1, X: 2, exact: (x) => x - 1 + 2 * Math.exp(-x), yr: [0, 1.6], ys: 0.5 },
  };
  let pk = "exp";
  const { ctx, size } = fit($("canvas"), () => draw());
  function euler(k) {
    const p = P[pk], h = p.X / k, pts = [[0, p.y0]];
    let x = 0, y = p.y0;
    for (let i = 0; i < k; i++) { y += h * p.f(x, y); x += h; pts.push([x, y]); }
    return pts;
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = P[pk], k = 2 ** +sn.value;
    const g = G.frame(ctx, w, h, { xr: [0, p.X * 1.05], yr: p.yr, xs: p.X > 1 ? 0.5 : 0.25, ys: p.ys, xf: (v) => n(v, 2), yf: (v) => n(v, 1) });
    A.field(ctx, g, p.f, { nx: 15, ny: 10 });
    G.curve(ctx, g, (x) => (x > p.X ? NaN : p.exact(x)), C.ink, { width: 2.4 });
    const pts = euler(k);
    A.path(ctx, g, pts, C.warn, { width: 2 });
    if (k <= 32) pts.forEach(([x, y]) => G.dot(ctx, g, x, y, C.warn, false, 3));
    G.tag(ctx, g, "검정: 참값 · 주황: 오일러", g.x0 + 4, g.y0 + 10, C.ink2);
  }
  function nums() {
    const p = P[pk], k = 2 ** +sn.value, yN = euler(k)[k][1], t = p.exact(p.X);
    $(".n-out").textContent = k; $(".h-out").textContent = n(p.X / k, 5);
    $(".n-e").textContent = n(yN, 6); $(".n-t").textContent = n(t, 6);
    $(".n-r").textContent = n((t - yN) * k, 4);
    const rows = [];
    for (let j = 0; j <= 7; j++) { const kk = 2 ** j, e = t - euler(kk)[kk][1]; rows.push(`n = ${String(kk).padStart(3)}  오차 ${n(e, 6).padStart(10)}${j ? `  (앞 줄의 ${n(e / (t - euler(kk / 2)[kk / 2][1]), 2)}배)` : ""}`); }
    $(".tbl").innerHTML = rows.map((r, j) => (j === +sn.value ? `<b>${r}</b>` : r)).join("<br>").replace(/ /g, "&nbsp;");
    draw();
  }
  G.chips(root, ".pk .chip", (b) => { pk = b.dataset.p; nums(); });
  sn.addEventListener("input", nums);
  nums();
})();
