/* 카드: 오차 범위를 ±3 %p 안으로 하려면 몇 명에게 물어야 할까? — n ≥ z²p̂(1 − p̂)/e² */
(() => {
  const root = document.getElementById("card-pmath-sample-size");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n: fm, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const se = $(".se"), sp = $(".sp");
  let z = 1.96;
  const { ctx, size } = fit($("canvas"), () => draw());
  const need = (e) => { const p = +sp.value / 100; return Math.ceil(z * z * p * (1 - p) / (e * e)); };
  const err = (n) => { const p = +sp.value / 100; return z * Math.sqrt(p * (1 - p) / n); };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const e = +se.value / 100, N = need(e), xmax = Math.max(2000, Math.ceil(N * 1.3 / 500) * 500);
    const g = G.frame(ctx, w, h, { xr: [0, xmax], yr: [0, 0.12], xs: xmax / 4, ys: 0.02, L: 40, xf: (v) => fm(v, 0), yf: (v) => `${fm(v * 100, 0)}%` });
    G.curve(ctx, g, (n) => (n > 5 ? err(n) : NaN), BLUE, { width: 2.4, from: 5 });
    G.curve(ctx, g, () => e, C.warn, { width: 1.4, dash: [6, 4] });
    if (N <= xmax) { G.guide(ctx, g, N, e, C.warn, "x"); G.dot(ctx, g, N, e, C.warn); }
    G.tag(ctx, g, "오차 범위", g.x0 + 6, g.y0 + 10, BLUE);
    G.tag(ctx, g, "표본 크기 n", g.x0 + g.w - 4, g.y0 + g.h - 10, C.ink3, "right");
  }
  function update() {
    const e = +se.value / 100;
    $(".e-out").textContent = fm(+se.value, 1); $(".p-out").textContent = sp.value;
    $(".n-n").textContent = `${need(e).toLocaleString("ko-KR")}명`;
    $(".n-h").textContent = `${need(e / 2).toLocaleString("ko-KR")}명 (약 4배)`;
    $(".n-k").textContent = `±${fm(err(1000) * 100, 2)} %p`;
    draw();
  }
  root.querySelectorAll(".conf .chip").forEach((b) => b.addEventListener("click", () => {
    z = +b.dataset.z; root.querySelectorAll(".conf .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update();
  }));
  [se, sp].forEach((el) => el.addEventListener("input", update));
  update();
})();
