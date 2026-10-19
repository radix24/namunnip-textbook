/* 카드: 판매자에게 1잔에 500원씩 세금을 매기면 누가 그 세금을 낼까? — 조세 귀착 (모의 함수) */
(() => {
  const root = document.getElementById("card-econ-tax-incidence");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon, M = NMMarket;
  const $ = (s) => root.querySelector(s);
  const tIn = $(".t"), bIn = $(".b"), dIn = $(".d"), QM = 600, PM = 8000, P0 = 4000, Q0 = 300;
  /* 세금 전 균형 (Q0, P0)를 지나도록: Q = Q0 − b(P − P0), Q = Q0 + d(P − P0) */
  const mk = () => { const b = +bIn.value, d = +dIn.value; return { a: Q0 + b * P0, b, c: Q0 - d * P0, d }; };
  const { ctx, size } = fit($("canvas"), () => draw());
  const solve = (m, t) => { const Pc = (m.a - m.c + m.d * t) / (m.b + m.d); return { Pc, Ps: Pc - t, Q: Math.max(0, m.a - m.b * Pc) }; };
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const m = mk(), t = +tIn.value, r = solve(m, t);
    const G = M.plot(ctx, size, { QM, PM, xt: [0, 150, 300, 450, 600], yt: [[0, "0"], [2000, "2000"], [4000, "4000"], [6000, "6000"], [8000, "8000"]], xlab: "하루 거래량(잔)", ylab: "가격(원)" }), P = G.P;
    /* 세수 사각형과 자중 손실 삼각형 */
    ctx.fillStyle = "rgba(224,160,42,.35)"; ctx.fillRect(P.X(0), P.Y(r.Pc), P.X(r.Q) - P.X(0), P.Y(r.Ps) - P.Y(r.Pc));
    ctx.fillStyle = "rgba(123,94,167,.35)"; ctx.beginPath(); ctx.moveTo(P.X(r.Q), P.Y(r.Pc)); ctx.lineTo(P.X(Q0), P.Y(P0)); ctx.lineTo(P.X(r.Q), P.Y(r.Ps)); ctx.closePath(); ctx.fill();
    P.clip();
    G.dLine(m, M.D); G.sLine(m, M.S, 1.8, [5, 4]); if (t) G.sLine(m, M.S, 2.6, null, t);
    ctx.restore();
    [[r.Pc, "소비자 가격"], [P0, "세금 전"], [r.Ps, "판매자 가격"]].forEach(([p, lab], i) => { ctx.save(); ctx.strokeStyle = C.ink3; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(P.X(0), P.Y(p)); ctx.lineTo(P.X(i === 1 ? Q0 : r.Q), P.Y(p)); ctx.stroke(); ctx.restore(); if (i !== 1 && t) E.text(ctx, P.X(0) + 4, P.Y(p) + (i === 2 ? 13 : -5), `${lab} ${E.n(p)}`, C.ink2); else if (i === 1 && !t) E.text(ctx, P.X(0) + 4, P.Y(p) - 5, `${lab} ${E.n(p)}`, C.ink3); });
    E.dot(ctx, P, Q0, P0, C.ink3, 4); E.dot(ctx, P, r.Q, r.Pc, C.ink, 4.5); E.dot(ctx, P, r.Q, r.Ps, C.ink, 4.5);
    E.text(ctx, P.X(QM) - 4, P.T + 12, "노랑: 세수 · 보라: 자중 손실", C.ink2, "right");
  }
  function update() {
    const m = mk(), t = +tIn.value, r = solve(m, t);
    $(".t-out").textContent = E.n(t); $(".b-out").textContent = E.n(m.b, 2); $(".d-out").textContent = E.n(m.d, 2);
    $(".say").textContent = t ? `소비자 가격 ${E.n(r.Pc)}원(+${E.n(r.Pc - P0)}), 판매자 가격 ${E.n(r.Ps)}원(−${E.n(P0 - r.Ps)}) · 소비자 부담 ${E.pct((r.Pc - P0) / t, 0)}, 판매자 부담 ${E.pct((P0 - r.Ps) / t, 0)} · 거래량 ${E.n(Q0)} → ${E.n(r.Q)}잔 · 세수 ${E.n(t * r.Q)}원 · 자중 손실 ${E.n((t * (Q0 - r.Q)) / 2)}원` : "세금이 없으면 균형은 4000원, 300잔입니다.";
    draw();
  }
  [tIn, bIn, dIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
