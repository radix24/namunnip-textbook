/* 카드: tan⁻¹x의 급수로 원주율을 몇 자리까지 구할 수 있을까? — 라이프니츠 급수와 마친의 공식 */
(() => {
  const root = document.getElementById("card-adcalc-pi-race");
  if (!root) return;
  const { C, F, fit } = NM;
  const { label, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn"), PI = Math.PI, NMX = 30;
  const at = (x, N) => { let s = 0, p = x; for (let k = 0; k < N; k++) { s += (k % 2 ? -1 : 1) * p / (2 * k + 1); p *= x * x; } return s; };
  const leib = (N) => 4 * at(1, N), machin = (N) => 16 * at(1 / 5, N) - 4 * at(1 / 239, N);
  const digits = (v) => { const e = Math.abs(v - PI); return e === 0 ? 15 : Math.max(0, Math.min(15, Math.floor(-Math.log10(e)))); };
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const L = 34, T = 12, W = w - L - 10, H = h - T - 24;
    const X = (k) => L + (k - 1) / (NMX - 1) * W, Y = (d) => T + H - d / 16 * H;
    NM.axes(ctx, { x0: L, y0: T, w: W, h: H, X, Y, xt: [1, 5, 10, 15, 20, 25, 30].map((k) => [k, String(k)]), yt: [0, 4, 8, 12, 16].map((d) => [d, String(d)]) });
    label(ctx, "세로: 맞는 자릿수 · 가로: 항의 수", L + 6, T + 8, C.ink3, "left", `10.5px ${F.sans}`);
    const line = (fn, col) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); for (let k = 1; k <= NMX; k++) { const d = digits(fn(k)); k > 1 ? ctx.lineTo(X(k), Y(d)) : ctx.moveTo(X(k), Y(d)); } ctx.stroke(); ctx.restore(); };
    line(leib, BLUE); line(machin, C.forest);
    const N = +sn.value;
    dot(ctx, X(N), Y(digits(leib(N))), BLUE, 4.5); dot(ctx, X(N), Y(digits(machin(N))), C.forest, 4.5);
    label(ctx, "마친의 공식", X(9) + 6, Y(13.5), C.forest, "left", `600 11.5px ${F.sans}`);
    label(ctx, "라이프니츠 급수", X(NMX) - 4, Y(1.4) - 10, BLUE, "right", `600 11.5px ${F.sans}`);
  }
  function show(v) {
    const s = v.toFixed(14), k = digits(v), cut = 2 + k;   // "3." 다음 k자리
    return `<b>${s.slice(0, cut)}</b>${s.slice(cut)}`;
  }
  function nums() {
    const N = +sn.value;
    $(".n-out").textContent = N;
    $(".pis").innerHTML = `라이프니츠 ${show(leib(N))} (${digits(leib(N))}자리)<br>마친&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${show(machin(N))} (${digits(machin(N))}자리)`;
    draw();
  }
  sn.addEventListener("input", nums);
  nums();
})();
