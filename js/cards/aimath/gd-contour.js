/* 카드: 기울기와 절편을 함께 학습하면 어떤 길로 내려갈까? — L(a, b) 등고선 위의 경사하강 (가상 자료, x는 0~1로 맞춤) */
(() => {
  const root = document.getElementById("card-aimath-gd-contour");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon, A = NMAi;
  const $ = (s) => root.querySelector(s);
  const lrIn = $(".lr");
  const r = A.rng(21), D = [...Array(8)].map((_, i) => { const x = i / 7; return [x, 1.5 * x + 0.5 + 0.18 * A.gauss(r)]; }), n = D.length;
  const L = (a, b) => D.reduce((s, [x, y]) => s + (y - a * x - b) ** 2, 0) / n;
  const grad = (a, b) => { let ga = 0, gb = 0; D.forEach(([x, y]) => { const e = y - a * x - b; ga += -2 * x * e; gb += -2 * e; }); return [ga / n, gb / n]; };
  const AR = [-1, 4], BR = [-1.5, 2.5];
  let start = [-0.5, 2.2], path = [start.slice()], P = null;
  const mp = fit($(".map"), () => drawMap()), fc = fit($(".fitc"), () => drawFit());
  let bg = null, bgW = 0;
  function drawMap() {
    const { ctx, size } = mp; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    P = E.frame(ctx, size, { x0: AR[0], x1: AR[1], y0: BR[0], y1: BR[1], xt: [[-1, "−1"], [0, "0"], [1, "1"], [2, "2"], [3, "3"], [4, "4"]], yt: [[-1, "−1"], [0, "0"], [1, "1"], [2, "2"]], xlab: "기울기 a", ylab: "절편 b", L: 28, B: 28 });
    /* 높이에 따른 띠 칠하기(로그 눈금) — 크기가 바뀔 때만 다시 계산 */
    const cell = 3;
    if (!bg || bgW !== size.w) { bg = []; bgW = size.w; for (let px = P.L; px < P.L + P.w; px += cell) for (let py = P.T; py < P.T + P.h; py += cell) { const [a, b] = P.inv(px + cell / 2, py + cell / 2), lv = Math.floor(Math.log2(L(a, b) / 0.02 + 1) * 1.6); bg.push([px, py, lv]); } }
    bg.forEach(([px, py, lv]) => { ctx.fillStyle = lv % 2 ? "rgba(63,111,163,.10)" : "rgba(63,111,163,.22)"; if (lv > 14) ctx.fillStyle = "rgba(141,141,146,.08)"; ctx.fillRect(px, py, cell, cell); });
    ctx.save(); P.clip(); ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); path.forEach(([a, b], k) => (k ? ctx.lineTo(P.X(a), P.Y(b)) : ctx.moveTo(P.X(a), P.Y(b)))); ctx.stroke(); ctx.restore(); ctx.restore();
    path.forEach(([a, b], k) => E.dot(ctx, P, a, b, k === path.length - 1 ? C.warn : "rgba(181,83,47,.7)", k === path.length - 1 ? 5 : 2.6));
    /* 현재 점의 기울기 반대 방향 화살표 */
    const [a, b] = path[path.length - 1], g = grad(a, b), gl = Math.hypot(...g) || 1, s = 0.35;
    E.line(ctx, P, [[a, b], [a - (g[0] / gl) * s, b - (g[1] / gl) * s]], C.ink, 2);
  }
  function drawFit() {
    const { ctx, size } = fc; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const [a, b] = path[path.length - 1], Q = E.frame(ctx, size, { x0: 0, x1: 1, y0: -0.5, y1: 3, xt: [[0, "0"], [0.5, "0.5"], [1, "1"]], yt: [0, 1, 2, 3], xlab: "x", ylab: "y", L: 28, B: 28 });
    Q.clip(); E.fn(ctx, Q, (x) => a * x + b, 0, 1, E.BLUE, 2.4); ctx.restore();
    D.forEach(([x, y]) => E.dot(ctx, Q, x, y, C.ink, 4));
  }
  function update() {
    const [a, b] = path[path.length - 1], g = grad(a, b);
    $(".lr-out").textContent = (+lrIn.value).toFixed(2);
    const far = Math.abs(a) > 50 || Math.abs(b) > 50;
    $(".say").textContent = far ? `${path.length - 1}걸음: 값이 너무 커져 발산했습니다. 학습률을 줄이세요.` : `${path.length - 1}걸음: (a, b) = (${a.toFixed(3)}, ${b.toFixed(3)}) · (a 방향 기울기, b 방향 기울기) = (${g[0].toFixed(3)}, ${g[1].toFixed(3)}) · 손실 ${L(a, b).toFixed(4)}`;
    drawMap(); drawFit();
  }
  const step = () => { const [a, b] = path[path.length - 1]; if (Math.abs(a) > 50 || Math.abs(b) > 50) return; const g = grad(a, b), lr = +lrIn.value; path.push([a - lr * g[0], b - lr * g[1]]); };
  $(".go-1").addEventListener("click", () => { step(); update(); });
  $(".go-20").addEventListener("click", () => { for (let i = 0; i < 20; i++) step(); update(); });
  $(".go-reset").addEventListener("click", () => { path = [start.slice()]; update(); });
  lrIn.addEventListener("input", () => { path = [start.slice()]; update(); });
  $(".map").addEventListener("click", (e) => { if (!P) return; const rc = e.currentTarget.getBoundingClientRect(), [a, b] = P.inv(e.clientX - rc.left, e.clientY - rc.top); if (a < AR[0] || a > AR[1] || b < BR[0] || b > BR[1]) return; start = [a, b]; path = [start.slice()]; update(); });
  update();
})();
