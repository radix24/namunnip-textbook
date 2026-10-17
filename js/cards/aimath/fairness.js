/* 카드: 같은 기준 점수를 적용하면 공정한 인공지능일까? — 집단별 오류율과 기준 (가상 자료) */
(() => {
  const root = document.getElementById("card-aimath-fairness");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon, A = NMAi;
  const $ = (s) => root.querySelector(s);
  const taIn = $(".ta"), tbIn = $(".tb"), sameIn = $(".same");
  /* 집단마다 60명: 자격 있음/없음과 점수. B는 같은 자격이라도 점수가 낮게 나오도록 치우친 가상 점수 */
  const r = A.rng(9);
  const make = (shift) => [...Array(60)].map((_, i) => { const q = i < 30; return [Math.max(2, Math.min(98, (q ? 62 : 38) + shift + 10 * A.gauss(r))), q]; });
  const G = [make(0), make(-8)], NAME = ["A", "B"];
  const rates = (g, t) => { const q = g.filter((d) => d[1]), nq = g.filter((d) => !d[1]); return { miss: q.filter((d) => d[0] < t).length / q.length, fp: nq.filter((d) => d[0] >= t).length / nq.length, rec: g.filter((d) => d[0] >= t).length / g.length }; };
  const { ctx, size } = fit($("canvas"), () => draw());
  const th = () => [+taIn.value, sameIn.checked ? +taIn.value : +tbIn.value];
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const T = th(), P = E.frame(ctx, size, { x0: 0, x1: 100, y0: 0, y1: 2, xt: [0, 25, 50, 75, 100], yt: [[0.5, "B"], [1.5, "A"]], xlab: "인공지능 점수", L: 24 });
    [1, 0].forEach((gi, row) => { const g = G[gi], base = row ? 0.5 : 1.5; g.forEach(([s, q], k) => E.dot(ctx, P, s, base - 0.35 + ((k * 7) % 11) * 0.065, q ? C.forest : "rgba(141,141,146,.7)", 3.6)); const t = T[gi]; E.line(ctx, P, [[t, base - 0.45], [t, base + 0.45]], C.warn, 2.2); E.text(ctx, P.X(t) + 4, P.Y(base + 0.42), `기준 ${t}`, C.warn); });
  }
  function update() {
    if (sameIn.checked) tbIn.value = taIn.value;
    tbIn.disabled = sameIn.checked;
    const T = th(), R = G.map((g, i) => rates(g, T[i]));
    $(".ta-out").textContent = T[0]; $(".tb-out").textContent = T[1];
    $("table").innerHTML = `<tr><th>집단</th><th>놓침률</th><th>잘못 추천률</th><th>추천률</th></tr>` + R.map((x, i) => `<tr><td>${NAME[i]}</td><td>${(x.miss * 100).toFixed(0)}%</td><td>${(x.fp * 100).toFixed(0)}%</td><td>${(x.rec * 100).toFixed(0)}%</td></tr>`).join("");
    const dm = Math.abs(R[0].miss - R[1].miss) * 100, df = Math.abs(R[0].fp - R[1].fp) * 100;
    $(".say").textContent = `놓침률 차이 ${dm.toFixed(0)}%p · 잘못 추천률 차이 ${df.toFixed(0)}%p` + (dm < 4 && df < 4 ? " · 두 오류율이 거의 같습니다" : dm < 4 ? " · 놓침률은 맞췄지만 잘못 추천률이 다릅니다" : "");
    draw();
  }
  [taIn, tbIn, sameIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
