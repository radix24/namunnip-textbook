/* 카드: 화살표가 아닌 다항식도 벡터처럼 더할 수 있을까? — P₂를 계수 벡터로 */
(() => {
  const root = document.getElementById("card-adalg-poly-vector");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc, L = NMLin;
  const { BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const p0 = $(".p0"), p1 = $(".p1"), p2 = $(".p2"), sk = $(".sk");
  const Q = [-1, 2, -0.5];
  let show = "sum";
  const { ctx, size } = fit($("canvas"), () => draw());
  const P = () => [+p0.value, +p1.value, +p2.value];
  const ev = (c) => (x) => c[0] + c[1] * x + c[2] * x * x;
  const ps = (c) => {
    const t = [];
    if (c[0]) t.push(L.n(c[0], 2)); if (c[1]) t.push(`${L.n(c[1], 2)}x`); if (c[2]) t.push(`${L.n(c[2], 2)}x²`);
    return (t.join(" + ") || "0").replace(/\+ −/g, "− ");
  };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const g = G.frame(ctx, w, h, { xr: [-4, 4], yr: [-6, 6], xs: 1, ys: 2, xf: (v) => L.n(v, 0), yf: (v) => L.n(v, 0) });
    const p = P(), r = show === "sum" ? L.add(p, Q) : L.scl(p, +sk.value);
    G.curve(ctx, g, ev(p), C.forest, { width: 2.2 });
    if (show === "sum") G.curve(ctx, g, ev(Q), BLUE, { width: 2.2 });
    G.curve(ctx, g, ev(r), C.warn, { width: 3, dash: [7, 4] });
    G.tag(ctx, g, "p", g.x0 + 4, g.y0 + 10, C.forest);
    if (show === "sum") G.tag(ctx, g, "q", g.x0 + 22, g.y0 + 10, BLUE);
    G.tag(ctx, g, show === "sum" ? "p + q" : "k·p", g.x0 + 40, g.y0 + 10, C.warn);
  }
  function update() {
    const p = P(), k = +sk.value;
    $(".o0").textContent = L.n(p[0], 2); $(".o1").textContent = L.n(p[1], 2); $(".o2").textContent = L.n(p[2], 2); $(".ko").textContent = L.n(k, 1);
    const v = (c) => `(${c.map((x) => L.n(x, 2)).join(", ")})`;
    $(".vec").innerHTML = show === "sum"
      ? `p = ${v(p)} → ${ps(p)}<br>q = ${v(Q)} → ${ps(Q)}<br>p + q = ${v(L.add(p, Q))} → ${ps(L.add(p, Q))}`
      : `p = ${v(p)}<br>${L.n(k, 1)}·p = ${v(L.scl(p, k))} → ${ps(L.scl(p, k))}`;
    draw();
  }
  root.querySelectorAll(".show .chip").forEach((b) => b.addEventListener("click", () => {
    show = b.dataset.s; root.querySelectorAll(".show .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update();
  }));
  [p0, p1, p2, sk].forEach((el) => el.addEventListener("input", update));
  update();
})();
