/* 카드: 예시만 보여 주고 컴퓨터에게 사과와 귤을 구별하게 할 수 있을까? — 직접 찍는 1-최근접 이웃 (가상 자료) */
(() => {
  const root = document.getElementById("card-aimath-teach-machine");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon, A = NMAi;
  const $ = (s) => root.querySelector(s);
  const cv = $("canvas"), X0 = 4, X1 = 11, Y0 = 50, Y1 = 300, COL = ["#d4493a", "#e0a02a"], NAME = ["사과", "귤"];
  /* 정규화 거리: 지름 범위와 무게 범위를 같은 크기로 */
  const nd = (a, b) => Math.hypot((a[0] - b[0]) / (X1 - X0), (a[1] - b[1]) / (Y1 - Y0));
  /* 숨은 진짜 규칙(가상): 사과 ≈ 지름 7.5~10, 무게 160~280 / 귤 ≈ 지름 5~7.5, 무게 70~150 */
  const r = A.rng(7), gen = (k) => (k ? [5 + r() * 2.6, 70 + r() * 85] : [7.4 + r() * 2.6, 155 + r() * 125]);
  let pts = [[[8.5, 220], 0], [[9.2, 250], 0], [[6, 100], 1], [[6.8, 130], 1]], kind = 0, test = null, P = null;
  const { ctx, size } = fit(cv, () => draw());
  const classify = (q) => { let b = -1, bd = Infinity; pts.forEach(([p, k]) => { const d = nd(p, q); if (d < bd) { bd = d; b = k; } }); return b; };
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    P = E.frame(ctx, size, { x0: X0, x1: X1, y0: Y0, y1: Y1, xt: [4, 6, 8, 10], yt: [50, 100, 150, 200, 250, 300], xlab: "지름(cm)", ylab: "무게(g)", L: 40 });
    if (pts.length) { const cell = 6; for (let px = P.L; px < P.L + P.w; px += cell) for (let py = P.T; py < P.T + P.h; py += cell) { const k = classify(P.inv(px + cell / 2, py + cell / 2)); ctx.fillStyle = k ? "rgba(224,160,42,.16)" : "rgba(212,73,58,.12)"; ctx.fillRect(px, py, cell, cell); } }
    pts.forEach(([p, k]) => E.dot(ctx, P, p[0], p[1], COL[k], 6));
    if (test) test.forEach(([p, k]) => { const g = classify(p), ok = g === k; ctx.save(); ctx.strokeStyle = ok ? C.forest : C.ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(P.X(p[0]), P.Y(p[1]), 6, 0, 7); ctx.stroke(); if (!ok) { ctx.beginPath(); ctx.moveTo(P.X(p[0]) - 5, P.Y(p[1]) - 5); ctx.lineTo(P.X(p[0]) + 5, P.Y(p[1]) + 5); ctx.moveTo(P.X(p[0]) + 5, P.Y(p[1]) - 5); ctx.lineTo(P.X(p[0]) - 5, P.Y(p[1]) + 5); ctx.stroke(); } ctx.restore(); });
  }
  function update() {
    const c = [0, 1].map((k) => pts.filter((p) => p[1] === k).length);
    let s = `예시: 사과 ${c[0]}개, 귤 ${c[1]}개 · 평면을 누르면 ${NAME[kind]} 예시가 찍힙니다`;
    if (test) { const ok = test.filter(([p, k]) => classify(p) === k).length; s += ` · 새 과일 10개 중 ${ok}개 맞힘(초록 원: 맞힘, ×: 틀림)`; }
    $(".say").textContent = s; draw();
  }
  cv.addEventListener("pointerdown", (e) => { if (!P) return; const rc = cv.getBoundingClientRect(), [x, y] = P.inv(e.clientX - rc.left, e.clientY - rc.top); if (x < X0 || x > X1 || y < Y0 || y > Y1) return; pts.push([[x, y], kind]); update(); });
  root.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => { kind = +b.dataset.k; root.querySelectorAll("[data-k]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  $(".go-clear").addEventListener("click", () => { pts = []; test = null; update(); });
  $(".go-test").addEventListener("click", () => { if (!pts.length) { $(".say").textContent = "예시를 먼저 찍으세요."; return; } test = [...Array(10)].map((_, i) => { const k = i % 2; return [gen(k), k]; }); update(); });
  update();
})();
