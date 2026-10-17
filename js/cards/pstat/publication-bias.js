/* 카드: 유의한 결과만 발표되면 — 연구 200개의 추정 효과, 양수·유의한 것만 '실림', 평균 비교(가상) */
(() => {
  const root = document.getElementById("card-pstat-publication-bias");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const dIn = $(".d"), nIn = $(".n"), LO = -1, HI = 1.5, BINS = 50;
  let R = null;
  /* 두 집단 평균 차의 추정값 ~ N(d, 2/n), z = 추정/√(2/n) */
  const study = (d, n) => { const se = Math.sqrt(2 / n), est = d + se * NMStat.gauss(Math.random), p = 2 * (1 - NMStat.ncdf(Math.abs(est / se))); return { est, pub: est > 0 && p < 0.05 }; };
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w } = size; if (!w) return;
    ctx.clearRect(0, 0, w, size.h);
    const d = +dIn.value, f = NMPst.frame(ctx, size, { x0: LO, x1: HI, y0: 0, y1: 1, xt: [-1, -0.5, 0, 0.5, 1, 1.5], yt: [], xlab: "연구에서 추정한 효과", L: 12 });
    if (R) {
      const wd = (HI - LO) / BINS, all = NMStat.counts(R.map((r) => r.est), LO, HI, BINS), pub = NMStat.counts(R.filter((r) => r.pub).map((r) => r.est), LO, HI, BINS), mx = Math.max(...all, 1);
      NMPst.bars(ctx, f.X, (v) => f.Y((0.9 * v) / mx), all, LO, wd, "rgba(141,141,146,.45)");
      NMPst.bars(ctx, f.X, (v) => f.Y((0.9 * v) / mx), pub, LO, wd, "rgba(181,83,47,.8)");
      const mp = R.filter((r) => r.pub);
      if (mp.length) { const m = NMPst.mean(mp.map((r) => r.est)); ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(f.X(m), 6); ctx.lineTo(f.X(m), f.Y(0)); ctx.stroke(); ctx.fillStyle = C.warn; ctx.font = `11px ${F.sans}`; ctx.textAlign = "left"; ctx.fillText("실린 연구 평균", f.X(m) + 4, 18); }
    } else { ctx.fillStyle = C.ink3; ctx.font = `12px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText("‘연구 200개 하기’를 눌러 보세요", w / 2, size.h / 2); }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(f.X(d), 6); ctx.lineTo(f.X(d), f.Y(0)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.ink; ctx.font = `11px ${F.sans}`; ctx.textAlign = "right"; ctx.fillText("실제 효과", f.X(d) - 4, 32);
  }
  function update() {
    $(".d-out").textContent = (+dIn.value).toFixed(2); $(".n-out").textContent = nIn.value;
    if (R) { const pub = R.filter((r) => r.pub), mAll = NMPst.mean(R.map((r) => r.est)); $(".say").textContent = `연구 200개 중 실린 연구 ${pub.length}개(빨강) · 모든 연구의 평균 ${mAll.toFixed(3)} · 실린 연구의 평균 ${pub.length ? NMPst.mean(pub.map((r) => r.est)).toFixed(3) : "-"} · 실제 효과 ${(+dIn.value).toFixed(2)}`; }
    else $(".say").textContent = "";
    draw();
  }
  $(".run").addEventListener("click", () => { R = Array.from({ length: 200 }, () => study(+dIn.value, +nIn.value)); update(); });
  [dIn, nIn].forEach((x) => x.addEventListener("input", () => { R = null; update(); }));
  update();
})();
