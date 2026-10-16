/* 카드: 계산기는 √a를 어떻게 구할까? — 바빌로니아(뉴턴) 방법의 직사각형과, 이분법과의 오차 경주 */
(() => {
  const root = document.getElementById("card-adcalc-newton-sqrt");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, seg, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa");
  const KMAX = 12;
  let nw = [], bi = [];   // 걸음별 값
  const { ctx, size } = fit($("canvas"), () => draw());

  function reset() {
    const a = +sa.value;
    nw = [a]; bi = [{ lo: 0, hi: a }];
    nums();
  }
  function step() {
    if (nw.length > KMAX) return;
    const a = +sa.value, x = nw[nw.length - 1];
    nw.push((x + a / x) / 2);
    const { lo, hi } = bi[bi.length - 1], m = (lo + hi) / 2;
    bi.push(m * m < a ? { lo: m, hi } : { lo, hi: m });
    nums();
  }
  const mid = (b) => (b.lo + b.hi) / 2;

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const a = +sa.value, r = Math.sqrt(a), x = nw[nw.length - 1], y = a / x;
    // 왼쪽: 직사각형
    const lw = w * 0.42, pad = 18, box = Math.min(lw - 2 * pad, h - 2 * pad - 14);
    const sc = box / Math.max(nw[0], a / nw[0], x, y);
    const ox = pad, oy = h - pad - 4;
    ctx.save();
    ctx.setLineDash([4, 3]); ctx.strokeStyle = C.ink3; ctx.strokeRect(ox, oy - r * sc, r * sc, r * sc); ctx.setLineDash([]);
    ctx.fillStyle = "rgba(59,124,42,.16)"; ctx.fillRect(ox, oy - y * sc, x * sc, y * sc);
    ctx.strokeStyle = C.forest; ctx.lineWidth = 2; ctx.strokeRect(ox, oy - y * sc, x * sc, y * sc);
    ctx.restore();
    label(ctx, `가로 ${n(x, 4)}`, ox + Math.min(x * sc, lw - pad) / 2, oy + 9, C.forest, "center", `600 11px ${F.mono}`);
    label(ctx, `세로 ${n(y, 4)}`, ox + 4, oy - y * sc - 9 < 10 ? 12 : oy - y * sc - 9, C.forest, "left", `600 11px ${F.mono}`);
    label(ctx, `넓이 ${a}`, ox + Math.min(x * sc, lw) / 2, oy - Math.min(y * sc, h) / 2, C.ink2, "center", `11px ${F.sans}`);
    label(ctx, "점선: 정사각형", ox + 4, 10, C.ink3, "left", `11px ${F.sans}`);
    // 오른쪽: 오차(로그)
    const gx = lw + 40, gy = 12, gw = w - gx - 10, gh = h - 44;
    const X = (k) => gx + k / KMAX * gw, Y = (L) => gy + (2 - L) / 18 * gh;
    NM.axes(ctx, { x0: gx, y0: gy, w: gw, h: gh, X, Y, xt: [0, 2, 4, 6, 8, 10, 12].map((k) => [k, String(k)]), yt: [0, -4, -8, -12, -16].map((L) => [L, L === 0 ? "1" : `10${L === -4 ? "⁻⁴" : L === -8 ? "⁻⁸" : L === -12 ? "⁻¹²" : "⁻¹⁶"}`]), xlabel: "걸음" });
    const lg = (v) => Math.max(-16, Math.log10(Math.max(Math.abs(v - r) / r, 1e-17)));
    const line = (vals, col) => {
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath();
      vals.forEach((v, k) => (k ? ctx.lineTo(X(k), Y(lg(v))) : ctx.moveTo(X(k), Y(lg(v))))); ctx.stroke(); ctx.restore();
      vals.forEach((v, k) => dot(ctx, X(k), Y(lg(v)), col, 3.2));
    };
    line(bi.map(mid), BLUE); line(nw, C.forest);
    label(ctx, "뉴턴", gx + gw - 4, gy + 10, C.forest, "right", `600 11.5px ${F.sans}`);
    label(ctx, "이분법", gx + gw - 4, gy + 26, BLUE, "right", `600 11.5px ${F.sans}`);
    label(ctx, "상대 오차", gx + 4, gy + gh - 10, C.ink3, "left", `11px ${F.sans}`);
    seg(ctx, gx, Y(-16), gx + gw, Y(-16), C.ink3, 1, [2, 3]);
  }
  function nums() {
    $(".a-out").textContent = sa.value;
    $(".n-k").textContent = nw.length - 1;
    $(".n-nw").textContent = n(nw[nw.length - 1], 10);
    $(".n-bi").textContent = n(mid(bi[bi.length - 1]), 10);
    draw();
  }
  $(".go-step").addEventListener("click", step);
  $(".go-reset").addEventListener("click", reset);
  sa.addEventListener("input", reset);
  reset();
})();
