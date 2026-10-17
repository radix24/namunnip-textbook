/* 카드: 새 공부법의 효과 — 자기 선택(의욕이 교란) vs 무작위 배정, 추정 효과의 분포(가상) */
(() => {
  const root = document.getElementById("card-pstat-random-assign");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const eIn = $(".e"), n = 40, r = Math.random, g = () => NMStat.gauss(r);
  let res = null;
  /* 점수 = 60 + 8·의욕 + 효과·(새 방법) + 잡음 */
  function experiment(eff, random) {
    const mot = Array.from({ length: n }, g);
    const grp = random ? (() => { const a = Array.from({ length: n }, (_, i) => i < n / 2); for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; })() : mot.map((m) => r() < 1 / (1 + Math.exp(-2 * m)));
    const sc = mot.map((m, i) => 60 + 8 * m + (grp[i] ? eff : 0) + 4 * g());
    const A = sc.filter((_, i) => grp[i]), B = sc.filter((_, i) => !grp[i]);
    return A.length && B.length ? NMPst.mean(A) - NMPst.mean(B) : 0;
  }
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const eff = +eIn.value, lo = -10, hi = 25, f = NMPst.frame(ctx, size, { x0: lo, x1: hi, y0: 0, y1: 1, xt: [-10, -5, 0, 5, 10, 15, 20, 25], yt: [], xlab: "추정한 효과(새 방법 평균 − 기존 방법 평균, 점)", B: 30, T: 10 });
    if (res) {
      const bins = 70, wd = (hi - lo) / bins, cs = res.map((d) => NMStat.counts(d, lo, hi, bins)), mx = Math.max(...cs.flat());
      const Ys = (c) => f.Y((0.9 * c) / mx);
      [["rgba(181,83,47,.55)", 0], ["rgba(63,111,163,.55)", 1]].forEach(([col, k]) => { ctx.fillStyle = col; cs[k].forEach((c, i) => { if (!c) return; const x0 = f.X(lo + i * wd); ctx.fillRect(x0, Ys(c), f.X(lo + (i + 1) * wd) - x0 - 0.5, f.Y(0) - Ys(c)); }); });
      ctx.font = `11px ${F.sans}`; ctx.textAlign = "left"; ctx.fillStyle = C.warn; ctx.fillText("자기 선택", f.L + 6, 22); ctx.fillStyle = "#3f6fa3"; ctx.fillText("무작위 배정", f.L + 70, 22);
    } else { ctx.fillStyle = C.ink3; ctx.font = `12px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText("‘두 방법으로 각 200번 실험하기’를 눌러 보세요", w / 2, h / 2); }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(f.X(eff), 8); ctx.lineTo(f.X(eff), f.Y(0)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.ink; ctx.font = `11px ${F.sans}`; ctx.textAlign = "left"; ctx.fillText(`실제 효과 ${eff}`, f.X(eff) + 4, 36);
  }
  function update() {
    $(".e-out").textContent = eIn.value;
    $(".say").textContent = res ? `평균 추정 효과: 자기 선택 ${NMPst.mean(res[0]).toFixed(1)}점, 무작위 배정 ${NMPst.mean(res[1]).toFixed(1)}점 (실제 ${eIn.value}점)` : "";
    draw();
  }
  $(".run").addEventListener("click", () => { const eff = +eIn.value; res = [Array.from({ length: 200 }, () => experiment(eff, false)), Array.from({ length: 200 }, () => experiment(eff, true))]; update(); });
  eIn.addEventListener("input", () => { res = null; update(); });
  update();
})();
