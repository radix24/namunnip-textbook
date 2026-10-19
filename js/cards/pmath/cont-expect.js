/* 카드: 밀도 곡선의 어디에 받침을 대면 수평이 될까? — E(X) = ∫x f(x)dx, σ(X) */
(() => {
  const root = document.getElementById("card-pmath-cont-expect");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, drag, label, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sm = $(".sm");
  const KN = [0, 1, 2, 3, 4];
  let dk = "uni", knots = [0.4, 1.2, 0.6, 0.3, 1], g = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const freeRaw = (x) => { const i = Math.min(3, Math.floor(x)), t = x - i; return knots[i] * (1 - t) + knots[i + 1] * t; };
  const freeArea = () => { let s = 0; for (let i = 0; i < 4; i++) s += (knots[i] + knots[i + 1]) / 2; return s; };
  const D = {
    uni: { f: () => 0.25, txt: "E(X) = ∫₀⁴ x·(1/4) dx = 2,  V(X) = ∫₀⁴ x²·(1/4) dx − 2² = 16/3 − 4 = 4/3" },
    lin: { f: (x) => x / 8, txt: "E(X) = ∫₀⁴ x²/8 dx = 8/3,  V(X) = ∫₀⁴ x³/8 dx − (8/3)² = 8 − 64/9 = 8/9" },
    sq: { f: (x) => 3 * x * x / 64, txt: "E(X) = ∫₀⁴ 3x³/64 dx = 3,  V(X) = ∫₀⁴ 3x⁴/64 dx − 9 = 9.6 − 9 = 0.6" },
    free: { f: (x) => freeRaw(x) / freeArea(), txt: "꺾은선 밀도함수 — 수치 적분으로 계산" },
  };
  const integ = (h) => { const N = 800; let s = 0; for (let i = 0; i < N; i++) { const x = 4 * (i + 0.5) / N; s += h(x) * 4 / N; } return s; };
  const stats = () => { const f = D[dk].f, A = integ(f), E = integ((x) => x * f(x)), V = integ((x) => (x - E) ** 2 * f(x)); return { A, E, sd: Math.sqrt(V) }; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const f = D[dk].f, { E, sd } = stats(), m = +sm.value;
    let top = 0; for (let i = 0; i <= 100; i++) top = Math.max(top, f(4 * i / 100));
    g = G.frame(ctx, w, h, { xr: [-0.2, 4.2], yr: [0, top * 1.35 + 0.05], xs: 1, ys: top > 0.5 ? 0.2 : 0.1, B: 36, xf: (v) => n(v, 0), yf: (v) => n(v, 2) });
    ctx.fillStyle = "rgba(116,171,102,.35)"; ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0));
    for (let i = 0; i <= 200; i++) { const x = 4 * i / 200; ctx.lineTo(g.X(x), g.Y(f(x))); }
    ctx.lineTo(g.X(4), g.Y(0)); ctx.closePath(); ctx.fill();
    G.curve(ctx, g, f, C.forest, { width: 2.4, from: 0, to: 4 });
    // 평균 ± 표준편차
    ctx.fillStyle = "rgba(63,111,163,.15)"; ctx.fillRect(g.X(E - sd), g.y0, g.X(E + sd) - g.X(E - sd), g.h);
    ctx.strokeStyle = BLUE; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(g.X(E), g.y0); ctx.lineTo(g.X(E), g.y0 + g.h); ctx.stroke(); ctx.setLineDash([]);
    // 받침과 기울기(돌림힘 부호에 따라 기울어진 판)
    const torque = E - m, tilt = Math.max(-0.12, Math.min(0.12, torque * 0.2));
    const py = g.Y(0), px = g.X(m);
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(px, py + 2); ctx.lineTo(px - 10, py + 20); ctx.lineTo(px + 10, py + 20); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.translate(px, py); ctx.rotate(tilt); ctx.strokeStyle = C.warn; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(g.X(0) - px, 0); ctx.lineTo(g.X(4) - px, 0); ctx.stroke(); ctx.restore();
    label(ctx, Math.abs(torque) < 0.02 ? "수평!" : torque > 0 ? "오른쪽으로 기움" : "왼쪽으로 기움", px, py + 30, Math.abs(torque) < 0.02 ? C.forest : C.warn, "center", `700 11px ${F.sans}`);
    if (dk === "free") KN.forEach((x) => G.dot(ctx, g, x, f(x), C.ink, false, 6));
  }
  function update() {
    const { A, E, sd } = stats(), m = +sm.value;
    $(".m-out").textContent = n(m, 2);
    $(".n-a").textContent = n(A, 3); $(".n-e").textContent = n(E, 3); $(".n-s").textContent = n(sd, 3);
    $(".n-t").textContent = n(integ((x) => (x - m) * D[dk].f(x)), 3);
    $(".f").textContent = D[dk].txt;
    draw();
  }
  drag(cv, (x, y) => {
    if (dk !== "free" || !g) return null;
    const f = D.free.f; let best = null, bd = 18;
    KN.forEach((k, i) => { const d = Math.hypot(x - g.X(k), y - g.Y(f(k))); if (d < bd) { bd = d; best = i; } });
    return best;
  }, (i, x, y) => {
    // 화면의 높이를 정규화 전 값으로 되돌려 넣는다
    const target = Math.max(0, g.iy(y)), A = freeArea();
    knots[i] = Math.max(0.02, target * A);
    update();
  }, null, "none");
  root.querySelectorAll(".dist .chip").forEach((b) => b.addEventListener("click", () => {
    dk = b.dataset.d; root.querySelectorAll(".dist .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    cv.style.touchAction = dk === "free" ? "none" : "pan-y"; update();
  }));
  cv.style.touchAction = "pan-y";
  sm.addEventListener("input", update);
  update();
})();
