/* 카드: 몇 개를 만들어 팔아야 이윤이 가장 클까? — MR = MC (가상 수요와 비용) */
(() => {
  const root = document.getElementById("card-econ-profit-max");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const qIn = $(".q"), fIn = $(".f"), QM = 45;
  const R = (q) => (100 - 2 * q) * q, Cf = (q) => q * q + 10 * q + +fIn.value, MR = (q) => 100 - 4 * q, MC = (q) => 2 * q + 10, QS = 15;
  const tot = fit($(".tot"), () => drawT()), mar = fit($(".mar"), () => drawM());
  function drawT() {
    const { ctx, size } = tot; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const q = +qIn.value;
    const P = E.frame(ctx, size, { x0: 0, x1: QM, y0: 0, y1: 2500, xt: [0, 15, 25, 45], yt: [0, 500, 1000, 1500, 2000, 2500], xlab: "Q", ylab: "만 원", L: 42 });
    P.clip();
    E.fn(ctx, P, R, 0, 50, E.BLUE, 2.4);
    E.fn(ctx, P, Cf, 0, QM, C.warn, 2.4);
    ctx.save(); ctx.strokeStyle = R(q) >= Cf(q) ? C.forest : C.warn; ctx.lineWidth = 4; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(P.X(q), P.Y(R(q))); ctx.lineTo(P.X(q), P.Y(Cf(q))); ctx.stroke(); ctx.restore();
    ctx.restore();
    E.text(ctx, P.X(26), P.Y(R(26)) - 8, "총수입 R", E.BLUE);
    E.text(ctx, P.X(40), P.Y(Math.min(2450, Cf(40))) + 14, "총비용 C", C.warn, "right");
  }
  function drawM() {
    const { ctx, size } = mar; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const q = +qIn.value;
    const P = E.frame(ctx, size, { x0: 0, x1: QM, y0: -60, y1: 100, xt: [0, 15, 25, 45], yt: [-50, 0, 50, 100], xlab: "Q", ylab: "만 원/개", L: 34 });
    P.clip();
    E.fn(ctx, P, () => 0, 0, QM, C.ink3, 1);
    E.fn(ctx, P, MR, 0, QM, E.BLUE, 2.4);
    E.fn(ctx, P, MC, 0, QM, C.warn, 2.4);
    ctx.restore();
    E.dot(ctx, P, QS, MR(QS), C.ink, 5, "MR = MC", 6, -8);
    E.dot(ctx, P, q, MR(q), E.BLUE, 4); E.dot(ctx, P, q, MC(q), C.warn, 4);
    E.text(ctx, P.X(1), P.Y(92), "MR(파랑) · MC(주황)", C.ink2);
  }
  function update() {
    const q = +qIn.value, pr = R(q) - Cf(q), best = R(QS) - Cf(QS);
    $(".q-out").textContent = q; $(".f-out").textContent = fIn.value;
    $(".say").textContent = `Q = ${q}: 가격 ${100 - 2 * q}, 총수입 ${E.n(R(q))}, 총비용 ${E.n(Cf(q))}, 이윤 ${E.n(pr)}만 원 · MR ${MR(q)} ${MR(q) > MC(q) ? ">" : MR(q) < MC(q) ? "<" : "="} MC ${MC(q)} → ${MR(q) > MC(q) ? "더 팔면 이윤 증가" : MR(q) < MC(q) ? "덜 팔면 이윤 증가" : "이윤 최대"} · 최적 Q = 15에서 이윤 ${E.n(best)}만 원${best < 0 ? "(손실)" : ""}`;
    drawT(); drawM();
  }
  [qIn, fIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
