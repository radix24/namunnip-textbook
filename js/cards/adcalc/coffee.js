/* 카드: 커피를 빨리 식히려면 찬 우유를 언제 넣어야 할까? — 뉴턴 냉각 법칙, 우유를 넣는 시각 비교 (모식) */
(() => {
  const root = document.getElementById("card-adcalc-coffee");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, seg, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sk = $(".sk"), verdict = $(".verdict");
  const TA = 20, TC = 90, TM = 5, VC = 200, VM = 20, TEND = 10, TMAX = 30;
  let guessed = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const mix = (t) => (VC * t + VM * TM) / (VC + VM);
  const cool = (T0, t) => TA + (T0 - TA) * Math.exp(-+sk.value * t);
  const A = (t) => cool(mix(TC), t);
  const B = (t) => (t < TEND ? cool(TC, t) : cool(mix(cool(TC, TEND)), t - TEND));

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const L = 34, T = 10, W = w - L - 10, H = h - T - 24, X = (t) => L + t / TMAX * W, Y = (v) => T + H - (v - 10) / 85 * H;
    NM.axes(ctx, { x0: L, y0: T, w: W, h: H, X, Y, xt: [0, 5, 10, 15, 20, 25, 30].map((t) => [t, `${t}분`]), yt: [20, 40, 60, 80].map((v) => [v, `${v}°`]) });
    seg(ctx, L, Y(TA), L + W, Y(TA), C.ink3, 1, [4, 4]);
    seg(ctx, X(TEND), T, X(TEND), T + H, C.rule, 1.2, [2, 3]);
    if (!guessed) { label(ctx, "예측을 고르면 그래프가 나타납니다", L + W / 2, T + H / 2, C.ink2, "center", `12px ${F.sans}`); return; }
    const line = (f, col) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); let prev = null; for (let i = 0; i <= 300; i++) { const t = TMAX * i / 300, v = f(t); if (prev != null && Math.abs(v - prev) > 3) ctx.moveTo(X(t), Y(v)); else i ? ctx.lineTo(X(t), Y(v)) : ctx.moveTo(X(t), Y(v)); prev = v; } ctx.stroke(); ctx.restore(); };
    line(A, BLUE); line(B, C.warn);
    // B의 섞는 순간: 세로 점프
    seg(ctx, X(TEND), Y(cool(TC, TEND)), X(TEND), Y(B(TEND)), C.warn, 2);
    dot(ctx, X(TEND), Y(A(TEND)), BLUE, 4.5); dot(ctx, X(TEND), Y(B(TEND)), C.warn, 4.5);
    label(ctx, "A: 바로 넣음", X(TMAX) - 4, Y(A(TMAX)) - 12, BLUE, "right", `600 11px ${F.sans}`);
    label(ctx, "B: 10분 뒤 넣음", X(3), Y(B(3)) - 12, C.warn, "left", `600 11px ${F.sans}`);
  }
  function nums() {
    $(".k-out").textContent = n(+sk.value, 3);
    if (guessed) { const a = A(TEND), b = B(TEND); $(".n-a").textContent = `${n(a, 2)} °C`; $(".n-b").textContent = `${n(b, 2)} °C`; $(".n-d").textContent = `${n(a - b, 2)} °C`; }
    draw();
  }
  root.querySelectorAll(".guess .chip").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll(".guess .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    guessed = true;
    const ok = b.dataset.g === "B";
    verdict.textContent = ok ? "맞습니다. B가 조금 더 차갑습니다. 그래프에서 까닭을 찾아보세요." : "그래프와 수치를 확인해 보세요. 더 차가운 쪽은 B입니다.";
    verdict.className = "verdict " + (ok ? "good" : "bad");
    nums();
  }));
  sk.addEventListener("input", nums);
  nums();
})();
