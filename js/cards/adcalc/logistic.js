/* 카드: 개체 수는 왜 끝없이 지수적으로 늘지 않을까? — 로지스틱 성장, 지수 성장 비교, P′–P 그래프 (모식) */
(() => {
  const root = document.getElementById("card-adcalc-logistic");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, seg, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sr = $(".sr"), sp = $(".sp"), st = $(".st"), K = 1000, TM = 15;
  const { ctx, size } = fit($("canvas"), () => draw());
  const P = (t) => { const r = +sr.value, p0 = +sp.value; return K / (1 + (K / p0 - 1) * Math.exp(-r * t)); };
  const D = (p) => +sr.value * p * (1 - p / K);
  const tInf = () => { const r = +sr.value, p0 = +sp.value; return p0 >= K / 2 ? null : Math.log(K / p0 - 1) / r; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const top = h * 0.6, L = 40, T = 10, W = w - L - 10, H = top - T - 20, ymax = 1600;
    const X = (t) => L + t / TM * W, Y = (v) => T + H - v / ymax * H;
    NM.axes(ctx, { x0: L, y0: T, w: W, h: H, X, Y, xt: [0, 3, 6, 9, 12, 15].map((t) => [t, String(t)]), yt: [0, 500, 1000, 1500].map((v) => [v, String(v)]) });
    seg(ctx, L, Y(K), L + W, Y(K), C.warn, 1.2, [5, 4]);
    label(ctx, "K = 1000", L + 4, Y(K) - 9, C.warn, "left", `600 11px ${F.sans}`);
    // 지수 성장
    ctx.save(); ctx.beginPath(); ctx.rect(L, T, W, H); ctx.clip();
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.6; ctx.setLineDash([3, 3]); ctx.beginPath();
    for (let i = 0; i <= 200; i++) { const t = TM * i / 200, v = +sp.value * Math.exp(+sr.value * t); i ? ctx.lineTo(X(t), Y(Math.min(v, ymax * 2))) : ctx.moveTo(X(t), Y(v)); }
    ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.beginPath();
    for (let i = 0; i <= 300; i++) { const t = TM * i / 300; i ? ctx.lineTo(X(t), Y(P(t))) : ctx.moveTo(X(t), Y(P(t))); }
    ctx.stroke(); ctx.restore();
    const t = +st.value, p = P(t);
    dot(ctx, X(t), Y(p), BLUE, 5);
    const ti = tInf(); if (ti != null && ti <= TM) dot(ctx, X(ti), Y(K / 2), C.forest, 4.5, true);
    label(ctx, "점선: 지수 성장 P₀e^(rt)", L + W - 4, T + 10, C.ink3, "right", `11px ${F.sans}`);
    // 아래: P′–P
    const by = top + 8, BH = h - by - 22, pm = 1600, dm = Math.max(+sr.value * K / 4 * 1.15, 1);
    const PX = (v) => L + v / pm * W, PY = (d) => by + BH * 0.75 - d / dm * BH * 0.75;
    NM.axes(ctx, { x0: L, y0: by, w: W, h: BH, X: PX, Y: PY, xt: [0, 500, 1000, 1500].map((v) => [v, String(v)]), yt: [[0, "0"], [+sr.value * K / 4, n(+sr.value * K / 4, 0)]] });
    seg(ctx, L, PY(0), L + W, PY(0), C.ink3, 1);
    ctx.strokeStyle = C.forest; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 200; i++) { const v = pm * i / 200, d = D(v); const yy = Math.max(by, Math.min(by + BH, PY(d))); i ? ctx.lineTo(PX(v), yy) : ctx.moveTo(PX(v), yy); }
    ctx.stroke();
    dot(ctx, PX(p), PY(D(p)), BLUE, 4.5);
    label(ctx, "아래: 가로 P, 세로 P′", L + W - 4, by + 8, C.ink3, "right", `11px ${F.sans}`);
  }
  function nums() {
    const t = +st.value, p = P(t), ti = tInf();
    $(".r-out").textContent = n(+sr.value, 2); $(".p-out").textContent = sp.value; $(".t-out").textContent = n(t, 2);
    $(".n-p").textContent = n(p, 1); $(".n-d").textContent = n(D(p), 1);
    $(".n-i").textContent = ti == null ? "처음부터 감속" : `t ≈ ${n(ti, 2)} (P = 500)`;
    draw();
  }
  [sr, sp, st].forEach((s) => s.addEventListener("input", nums));
  nums();
})();
