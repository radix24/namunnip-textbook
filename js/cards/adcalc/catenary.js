/* 카드: 두 끝을 잡고 늘어뜨린 사슬은 포물선일까? — 구슬 사슬 시뮬레이션(위치 베를레 + 거리 제약)과 포물선·현수선 맞추기 */
(() => {
  const root = document.getElementById("card-adcalc-catenary");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, dot, seg, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sl = $(".sl"), bP = $(".ov-par"), bC = $(".ov-cat");
  const N = 40;   // 막대 수 (구슬 N + 1개, 양 끝 고정)
  let p = [], q = [], seg0 = 0, raf = 0;
  const { ctx, size } = fit($("canvas"), () => draw());

  function reset() {
    const L = +sl.value * 2; seg0 = L / N;
    const d = Math.sqrt(Math.max(0, (L / 2) ** 2 - 1));
    p = []; for (let i = 0; i <= N; i++) { const u = i / N; p.push([-1 + 2 * u, -d * (1 - Math.abs(2 * u - 1))]); }
    q = p.map((a) => a.slice());
    relax(2500, 0.9);
  }
  function relax(steps, damp) {
    const g = -0.0004;
    let ke = 0;
    for (let s = 0; s < steps; s++) {
      ke = 0;
      for (let i = 1; i < N; i++) {
        const vx = (p[i][0] - q[i][0]) * damp, vy = (p[i][1] - q[i][1]) * damp;
        ke += vx * vx + vy * vy;
        q[i] = p[i].slice(); p[i][0] += vx; p[i][1] += vy + g;
      }
      for (let k = 0; k < 40; k++) for (let i = 0; i < N; i++) {
        const a = p[i], b = p[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1e-9, e = (d - seg0) / d;
        const wa = i === 0 ? 0 : 0.5, wb = i + 1 === N ? 0 : 0.5, sum = wa + wb || 1;
        a[0] += dx * e * wa / sum; a[1] += dy * e * wa / sum;
        b[0] -= dx * e * wb / sum; b[1] -= dy * e * wb / sum;
      }
      p[0] = [-1, 0]; p[N] = [1, 0];
    }
    return ke;
  }
  const sag = () => -Math.min(...p.map((a) => a[1]));
  function catA(s) {   // a(cosh(1/a) − 1) = s 를 a에 대해 풀기 (a가 크면 왼쪽이 작아진다)
    let lo = 0.02, hi = 1e4;
    for (let i = 0; i < 100; i++) { const m = Math.sqrt(lo * hi); (m * (Math.cosh(1 / m) - 1) > s ? (lo = m) : (hi = m)); }
    return Math.sqrt(lo * hi);
  }
  const curves = () => {
    const s = sag(), a = catA(s);
    return { par: (x) => s * (x * x - 1), cat: (x) => a * (Math.cosh(x / a) - Math.cosh(1 / a)) };
  };
  const dev = (f) => Math.max(...p.map(([x, y]) => Math.abs(y - f(x)))) / 2;

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const S = Math.min(w / 2.5, (h - 26) / 2.45), cx = w / 2, cy = 22;
    const X = (x) => cx + x * S, Y = (y) => cy - y * S;
    // 천장과 못
    seg(ctx, X(-1.2), cy - 10, X(1.2), cy - 10, C.ink3, 2);
    [-1, 1].forEach((x) => { seg(ctx, X(x), cy - 10, X(x), cy, C.ink2, 2); dot(ctx, X(x), cy, C.ink, 4); });
    const { par, cat } = curves();
    const crv = (f, col, dash) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash(dash); ctx.beginPath(); for (let i = 0; i <= 200; i++) { const x = -1 + 2 * i / 200; i ? ctx.lineTo(X(x), Y(f(x))) : ctx.moveTo(X(x), Y(f(x))); } ctx.stroke(); ctx.restore(); };
    if (bP.getAttribute("aria-pressed") === "true") crv(par, C.warn, [7, 4]);
    if (bC.getAttribute("aria-pressed") === "true") crv(cat, BLUE, [2, 3]);
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.4; ctx.beginPath(); p.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke();
    p.forEach(([x, y]) => dot(ctx, X(x), Y(y), C.forest, 2.6));
    if (bP.getAttribute("aria-pressed") === "true") label(ctx, "포물선", 8, h - 28, C.warn, "left", `600 11.5px ${F.sans}`);
    if (bC.getAttribute("aria-pressed") === "true") label(ctx, "현수선 y = a cosh(x/a) + c", 8, h - 12, BLUE, "left", `600 11.5px ${F.sans}`);
  }
  function nums() {
    const { par, cat } = curves();
    $(".l-out").textContent = n(+sl.value, 2);
    $(".n-sag").textContent = n(sag() / 2, 3);
    $(".n-p").textContent = `${n(dev(par) * 100, 2)}%`;
    $(".n-c").textContent = `${n(dev(cat) * 100, 2)}%`;
    draw();
  }
  function shake() {
    for (let i = 1; i < N; i++) { q[i][0] = p[i][0] - (Math.random() - 0.5) * 0.06; q[i][1] = p[i][1] - (Math.random() - 0.5) * 0.06; }
    cancelAnimationFrame(raf);
    let frames = 0;
    const tick = () => { relax(6, 0.985); nums(); if (++frames < 600) raf = requestAnimationFrame(tick); else { relax(800, 0.9); nums(); } };
    raf = requestAnimationFrame(tick);
  }
  [bP, bC].forEach((b) => b.addEventListener("click", () => { b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); draw(); }));
  $(".go-shake").addEventListener("click", shake);
  sl.addEventListener("input", () => { cancelAnimationFrame(raf); reset(); nums(); });
  reset(); nums();
})();
