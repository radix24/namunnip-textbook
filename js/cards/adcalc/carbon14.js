/* 카드: 원자 하나하나는 제멋대로 붕괴하는데 왜 전체는 지수함수를 따를까? — 원자 400개 붕괴 시뮬레이션과 연대 측정 */
(() => {
  const root = document.getElementById("card-adcalc-carbon14");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sf = $(".sf"), N0 = 400, HL = 5730, STEP = HL / 10, P = 1 - 2 ** -0.1, KMAX = 60;
  let alive, hist;
  const { ctx, size } = fit($("canvas"), () => draw());
  const reset = () => { alive = new Uint8Array(N0).fill(1); hist = [[0, N0]]; };
  function step() {
    let left = 0;
    for (let i = 0; i < N0; i++) { if (alive[i] && Math.random() < P) alive[i] = 0; left += alive[i]; }
    hist.push([hist.length, left]);
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    // 왼쪽 격자
    const gw = Math.min(w * 0.4, h - 10), cell = gw / 20, ox = 6, oy = (h - gw) / 2;
    for (let i = 0; i < N0; i++) {
      const x = ox + (i % 20) * cell + cell / 2, y = oy + Math.floor(i / 20) * cell + cell / 2;
      ctx.fillStyle = alive[i] ? C.forest : C.rule; ctx.beginPath(); ctx.arc(x, y, cell * 0.36, 0, 7); ctx.fill();
    }
    // 오른쪽 그래프
    const L = ox + gw + 34, T = 10, W = w - L - 8, H = h - T - 24;
    const X = (k) => L + k / KMAX * W, Y = (v) => T + H - v * H;
    NM.axes(ctx, { x0: L, y0: T, w: W, h: H, X, Y, xt: [0, 20, 40, 60].map((k) => [k, k ? `${n(k * STEP / 10000, 2)}만` : "0"]), yt: [0, 0.25, 0.5, 0.75, 1].map((v) => [v, `${v * 100}%`]) });
    ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.beginPath();
    for (let i = 0; i <= 120; i++) { const k = KMAX * i / 120; i ? ctx.lineTo(X(k), Y(2 ** (-k / 10))) : ctx.moveTo(X(k), Y(2 ** (-k / 10))); }
    ctx.stroke(); ctx.restore();
    hist.forEach(([k, v]) => { if (k <= KMAX) dot(ctx, X(k), Y(v / N0), BLUE, 2.8); });
    // 측정 비율 → 나이
    const f = +sf.value / 100, age = -HL / Math.LN2 * Math.log(f), ka = age / STEP;
    if (ka <= KMAX) { ctx.save(); ctx.strokeStyle = C.warn; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(L, Y(f)); ctx.lineTo(X(ka), Y(f)); ctx.lineTo(X(ka), T + H); ctx.stroke(); ctx.restore(); }
    label(ctx, "점선: 2^(−t/5730)", L + W - 4, T + 10, C.ink2, "right", `600 11px ${F.sans}`);
    label(ctx, "가로: 년", L + W - 4, T + 26, C.ink3, "right", `10.5px ${F.sans}`);
  }
  function nums() {
    const last = hist[hist.length - 1], f = +sf.value / 100;
    $(".n-t").textContent = `${n(last[0] * STEP, 0)}년`;
    $(".n-n").textContent = `${last[1]} (${n(last[1] / N0 * 100, 1)}%)`;
    $(".f-out").textContent = n(+sf.value, 1);
    $(".n-a").textContent = f >= 1 ? "0년" : `약 ${n(-HL / Math.LN2 * Math.log(f), 0)}년`;
    draw();
  }
  NMSim.runner(root, { trial(k) { for (let i = 0; i < k && hist.length <= KMAX; i++) step(); }, draw: nums, reset, rate: 4, max: KMAX });
  sf.addEventListener("input", nums);
  reset(); nums();
})();
