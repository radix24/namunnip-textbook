/* 카드: 소득이 늘면 라면 값은 오를까 내릴까? — 사건별 곡선 이동과 새 균형 예측 (가상 사건) */
(() => {
  const root = document.getElementById("card-econ-income-shift");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon, M = NMMarket;
  const $ = (s) => root.querySelector(s);
  const QM = 100, PM = 100, BASE = { a: 90, b: 1, c: -10, d: 1 };
  /* [사건, 수요 이동, 공급 이동, 설명] */
  const EV = [
    ["소득이 늘었다. 외식(정상재) 시장은?", 20, 0, "소득 증가로 정상재의 수요곡선이 오른쪽으로 이동합니다."],
    ["소득이 늘었다. 라면(열등재로 가정) 시장은?", -20, 0, "열등재는 소득이 늘면 덜 사므로 수요곡선이 왼쪽으로 이동합니다."],
    ["밀가루 값이 올랐다. 빵 시장은?", 0, -20, "원재료 값이 올라 같은 가격에 팔려는 양이 줄어 공급곡선이 왼쪽으로 이동합니다."],
    ["새 반도체 공정으로 생산비가 줄었다. 노트북 시장은?", 0, 25, "생산비가 줄어 공급곡선이 오른쪽으로 이동합니다."],
    ["커피가 건강에 좋다는 연구가 나왔다. 커피 시장은?", 15, 0, "기호의 변화로 수요곡선이 오른쪽으로 이동합니다."],
  ];
  let i = 0, gp = 0, gq = 0, shown = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const mNew = () => ({ ...BASE, a: BASE.a + EV[i][1], c: BASE.c + EV[i][2] });
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const G = M.plot(ctx, size, { QM, PM, xt: [], yt: [], xlab: "거래량", ylab: "가격", L: 20 }), P = G.P, e0 = M.eq(BASE);
    P.clip();
    G.dLine(BASE, shown && EV[i][1] ? "rgba(63,111,163,.4)" : M.D, shown && EV[i][1] ? 1.6 : 2.6, shown && EV[i][1] ? [5, 4] : null);
    G.sLine(BASE, shown && EV[i][2] ? "rgba(181,83,47,.4)" : M.S, shown && EV[i][2] ? 1.6 : 2.6, shown && EV[i][2] ? [5, 4] : null);
    if (shown) { const m = mNew(); if (EV[i][1]) G.dLine(m, M.D); if (EV[i][2]) G.sLine(m, M.S); }
    ctx.restore();
    E.dot(ctx, P, e0.Q, e0.P, C.ink3, 5, shown ? "전" : "균형", 7, 14);
    if (shown) { const e1 = M.eq(mNew()); E.line(ctx, P, [[e0.Q, e0.P], [e1.Q, e1.P]], C.ink, 1.4, [2, 3]); E.dot(ctx, P, e1.Q, e1.P, C.ink, 5.5, "후", 7, -7); }
  }
  function sync() {
    root.querySelectorAll("[data-p]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.p === gp)));
    root.querySelectorAll("[data-q]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.q === gq)));
    $(".go-check").disabled = !(gp && gq) || shown;
  }
  function load() {
    shown = false; gp = gq = 0;
    $(".no-out").textContent = `사건 ${i + 1} / ${EV.length}`; $(".q-txt").textContent = EV[i][0];
    $(".verdict").textContent = ""; $(".go-next").disabled = true; sync(); draw();
  }
  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { if (!shown) { gp = +b.dataset.p; sync(); } }));
  root.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => { if (!shown) { gq = +b.dataset.q; sync(); } }));
  $(".go-check").addEventListener("click", () => {
    shown = true; const e0 = M.eq(BASE), e1 = M.eq(mNew()), sp = Math.sign(e1.P - e0.P), sq = Math.sign(e1.Q - e0.Q), ok = sp === gp && sq === gq;
    $(".verdict").textContent = `${ok ? "맞혔습니다." : "다시 보세요."} ${EV[i][3]} 그래서 균형 가격은 ${sp > 0 ? "오르고" : "내리고"}, 거래량은 ${sq > 0 ? "늘어납니다" : "줄어듭니다"}.`;
    $(".go-next").disabled = false; sync(); draw();
  });
  $(".go-next").addEventListener("click", () => { i = (i + 1) % EV.length; load(); });
  load();
})();
