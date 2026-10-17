/* 카드: 불량품을 가려내는 기준 무게는 사람이 정하는 것이 좋을까, 자료가 정하는 것이 좋을까? — 오류 개수를 최소로 하는 기준 (가상 자료) */
(() => {
  const root = document.getElementById("card-aimath-rule-vs-learn");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon, A = NMAi;
  const $ = (s) => root.querySelector(s);
  const tIn = $(".t"), X0 = 80, X1 = 110;
  /* 정상 18봉지(평균 99, 표준편차 2.5), 불량 12봉지(평균 92, 표준편차 2.5) — 가상 */
  const r = A.rng(11), D = [...Array(30)].map((_, i) => { const bad = i < 12, w = bad ? 92 + 2.5 * A.gauss(r) : 99 + 2.5 * A.gauss(r); return [Math.round(Math.max(X0 + 0.5, Math.min(X1 - 0.5, w)) * 10) / 10, bad]; });
  const err = (t) => D.reduce((s, [w, bad]) => s + ((w < t) !== bad ? 1 : 0), 0);
  /* 학습: 0.1 g 간격으로 모두 시험해 오류 최소인 구간의 가운데 */
  const learn = () => { let best = Infinity, lo = X0, hi = X0; for (let t = X0; t <= X1 + 1e-9; t += 0.1) { const e = err(t); if (e < best) { best = e; lo = hi = t; } else if (e === best && Math.abs(t - hi - 0.1) < 1e-6) hi = t; } return { t: (lo + hi) / 2, e: best }; };
  let L = null, ev = null;
  const pv = fit($(".pts"), () => drawPts());
  function drawPts() {
    const { ctx, size } = pv; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: X0, x1: X1, y0: 0, y1: 4, xt: [80, 85, 90, 95, 100, 105, 110], yt: [], xlab: "무게(g)", L: 16, B: 30 });
    /* 같은 무게 근처는 위로 쌓는다 */
    const stack = {}; [...D].sort((a, b) => a[0] - b[0]).forEach(([w, bad]) => { const k = Math.round(w); stack[k] = (stack[k] || 0) + 1; E.dot(ctx, P, w, 0.35 + (stack[k] - 1) * 0.55, bad ? E.ORANGE : C.forest, 5.5); });
    const line = (t, col, lab, dash) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(P.X(t), P.T); ctx.lineTo(P.X(t), P.T + P.h); ctx.stroke(); ctx.restore(); E.text(ctx, P.X(t) + 4, P.T + 12, lab, col); };
    line(+tIn.value, C.ink, "내 기준");
    if (L) line(L.t, E.BLUE, "학습한 기준", [6, 4]);
    E.text(ctx, P.X(X1) - 4, P.T + 12, "초록: 정상 · 주황: 불량", C.ink2, "right");
  }
  function drawErr() {
    if (!ev || !ev.size.w) return;
    const { ctx, size } = ev;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: X0, x1: X1, y0: 0, y1: 20, xt: [80, 90, 100, 110], yt: [0, 10, 20], xlab: "기준(g)", ylab: "오류 개수", L: 30, B: 26 });
    const pts = []; for (let t = X0; t <= X1 + 1e-9; t += 0.1) pts.push([t, err(t)]);
    E.line(ctx, P, pts, C.warn, 2);
    E.dot(ctx, P, +tIn.value, err(+tIn.value), C.ink, 4.5);
    E.dot(ctx, P, L.t, L.e, E.BLUE, 5, `최소 ${L.e}개`, 6, -6);
  }
  function update() {
    const t = +tIn.value, e = err(t), miss = D.filter(([w, bad]) => bad && w >= t).length, wrong = D.filter(([w, bad]) => !bad && w < t).length;
    $(".t-out").textContent = E.n(t, 1);
    $(".say").textContent = `내 기준 ${E.n(t, 1)} g: 오류 ${e}개(불량을 놓침 ${miss}, 정상을 버림 ${wrong})` + (L ? ` · 학습한 기준 ${E.n(L.t, 1)} g: 오류 ${L.e}개` : "");
    drawPts(); drawErr();
  }
  tIn.addEventListener("input", update);
  $(".go-learn").addEventListener("click", () => { L = learn(); const c = $(".err"); c.hidden = false; if (!ev) ev = fit(c, () => drawErr()); update(); });
  update();
})();
