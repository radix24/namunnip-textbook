/* 카드: 풀지 않고도 미분방정식의 해를 그릴 수 있을까? — 방향장과 누른 점을 지나는 해 곡선 */
(() => {
  const root = document.getElementById("card-adcalc-slope-field");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const cv = $("canvas");
  const P = {
    y: (x, y) => y, x: (x) => x, circ: (x, y) => -x / y, xy: (x, y) => x - y, log: (x, y) => y * (2 - y),
  };
  const XR = [-4, 4], YR = [-3, 4];
  let pk = "y", curves = [], last = null, g = null;
  const { ctx, size } = fit(cv, () => draw());

  function solve(x0, y0) {
    const f = P[pk], lim = 40;
    const fw = A.rk4(f, x0, y0, XR[1], 0.01, lim), bw = A.rk4(f, x0, y0, XR[0], 0.01, lim);
    // −x/y는 y = 0 근처에서 기울기가 무한대 → 큰 기울기에서 끊는다
    const cut = (pts) => { const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { const [, y] = pts[i]; if (pk === "circ" && Math.abs(y) < 0.03) break; if (Math.abs(y - out[out.length - 1][1]) > 1) break; out.push(pts[i]); } return out; };
    return cut(bw).reverse().concat(cut(fw).slice(1));
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    g = G.frame(ctx, w, h, { xr: XR, yr: YR, xs: 1, ys: 1, xf: (v) => n(v, 0), yf: (v) => n(v, 0) });
    A.field(ctx, g, P[pk], { nx: 21, ny: 15 });
    curves.forEach((c, i) => A.path(ctx, g, c, i === curves.length - 1 ? C.warn : BLUE, { width: 2.2 }));
    if (last) G.dot(ctx, g, last[0], last[1], C.warn, false, 5);
  }
  function nums() {
    $(".n-k").textContent = curves.length;
    if (last) { $(".n-p").textContent = `(${n(last[0], 2)}, ${n(last[1], 2)})`; const m = P[pk](last[0], last[1]); $(".n-m").textContent = Number.isFinite(m) ? n(m, 3) : "정의 안 됨"; }
    else { $(".n-p").textContent = "—"; $(".n-m").textContent = "—"; }
    draw();
  }
  cv.addEventListener("click", (e) => {
    if (!g) return;
    const b = cv.getBoundingClientRect(), x = g.ix(e.clientX - b.left), y = g.iy(e.clientY - b.top);
    if (x < XR[0] || x > XR[1] || y < YR[0] || y > YR[1]) return;
    last = [x, y]; curves.push(solve(x, y)); nums();
  });
  // 보기마다 처음 보여 줄 해 몇 개
  const seed = () => { curves = []; last = null; [[0, 1], [0, 0.3], [0, -0.5]].forEach(([x, y]) => curves.push(solve(x, y))); };
  G.chips(root, ".pk .chip", (b) => { pk = b.dataset.p; seed(); nums(); });
  $(".go-clear").addEventListener("click", () => { curves = []; last = null; nums(); });
  seed(); nums();
})();
