/* 카드: 효과 없는 영양제를 m가지 증상에 검정 — 귀무가설이 참이면 유의확률 ~ 균등분포, 1 − 0.95^m */
(() => {
  const root = document.getElementById("card-pstat-p-hacking");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const mIn = $(".m");
  let ps = null, many = null;
  /* 두 집단 각 30명의 평균 차를 z검정 → 양측 유의확률(귀무가설 참: 같은 분포에서 뽑음) */
  const study = () => { const g = () => NMStat.gauss(Math.random); let a = 0, b = 0; for (let i = 0; i < 30; i++) { a += g(); b += g(); } const z = (a / 30 - b / 30) / Math.sqrt(2 / 30); return 2 * (1 - NMStat.ncdf(Math.abs(z))); };
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const m = +mIn.value, L = 36, R = 8, T = 10, B = 24, Y = (p) => T + (h - T - B) * (1 - p), bw = (w - L - R) / m;
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "right";
    [0, 0.25, 0.5, 0.75, 1].forEach((p) => { ctx.beginPath(); ctx.moveTo(L, Y(p)); ctx.lineTo(w - R, Y(p)); ctx.stroke(); ctx.fillText(p.toFixed(2), L - 4, Y(p) + 4); });
    if (ps) ps.forEach((p, i) => { ctx.fillStyle = p < 0.05 ? C.warn : "rgba(63,111,163,.5)"; ctx.fillRect(L + i * bw + 1, Y(p), Math.max(1, bw - 2), Y(0) - Y(p)); });
    ctx.strokeStyle = C.warn; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(L, Y(0.05)); ctx.lineTo(w - R, Y(0.05)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText(ps ? "증상별 유의확률(빨강: 0.05 미만 = '유의함')" : "‘연구 한 번 하기’를 눌러 보세요", (L + w - R) / 2, h - 6);
  }
  function update() {
    const m = +mIn.value; $(".m-out").textContent = m;
    let s = `이론: 적어도 하나 유의할 확률 1 − 0.95^${m} = ${(100 * (1 - 0.95 ** m)).toFixed(1)}%`;
    if (ps) s = `이번 연구: ${m}개 중 '유의함' ${ps.filter((p) => p < 0.05).length}개 · ` + s;
    if (many) s += ` · 연구 1000번 중 적어도 하나 유의 ${many}번(${(many / 10).toFixed(1)}%)`;
    $(".say").textContent = s; draw();
  }
  $(".one").addEventListener("click", () => { ps = Array.from({ length: +mIn.value }, study); update(); });
  $(".many").addEventListener("click", () => { const m = +mIn.value; let c = 0; for (let k = 0; k < 1000; k++) { for (let j = 0; j < m; j++) if (study() < 0.05) { c++; break; } } many = c; update(); });
  mIn.addEventListener("input", () => { ps = null; many = null; update(); });
  update();
})();
