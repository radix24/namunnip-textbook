/* 카드: 배터리 n개로 평균 수명 추정 — x̄ ± k·s/√n, k = 1.96 vs t₀.₀₂₅(n−1), 구간 50개의 적중(가상 N(20, 2²)) */
(() => {
  const root = document.getElementById("card-pstat-ci-t-cover");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), P = NMPst, MU = 20, SG = 2;
  let mode = "t", ivs = [], tally = { z: [0, 0], t: [0, 0] };
  const { ctx, size } = fit($("canvas"), () => draw());
  const k = (n) => (mode === "t" ? P.tinv(0.975, n - 1) : 1.96);
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const f = P.frame(ctx, size, { x0: 14, x1: 26, y0: 0, y1: 50, xt: [14, 16, 18, 20, 22, 24, 26], yt: [], xlab: "배터리 수명(시간)", L: 10, B: 30 });
    ivs.forEach(([m, e], i) => {
      const hit = Math.abs(m - MU) <= e, y = f.Y(49.5 - i);
      ctx.strokeStyle = hit ? "#3f6fa3" : C.warn; ctx.lineWidth = hit ? 1.6 : 2.4;
      ctx.beginPath(); ctx.moveTo(f.X(Math.max(14, m - e)), y); ctx.lineTo(f.X(Math.min(26, m + e)), y); ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle; ctx.fillRect(f.X(m) - 1.5, y - 2, 3, 4);
    });
    ctx.strokeStyle = C.forest; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(f.X(MU), f.Y(50)); ctx.lineTo(f.X(MU), f.Y(0)); ctx.stroke();
    if (!ivs.length) { ctx.fillStyle = C.ink3; ctx.font = `12px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText("‘구간 50개 만들기’를 눌러 보세요", w / 2, h / 2); }
  }
  function update() {
    const n = +nIn.value; $(".n-out").textContent = n;
    root.querySelectorAll("[data-k]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === mode)));
    const miss = ivs.filter(([m, e]) => Math.abs(m - MU) > e).length, tz = tally.z, tt = tally.t;
    $(".say").textContent = `경계값 ${mode === "t" ? `t₀.₀₂₅(${n - 1}) = ${k(n).toFixed(3)}` : "1.96"}` + (ivs.length ? ` · 이번 50개 중 놓친 구간 ${miss}개` : "") + ` · 누적 적중률: 1.96 ${tz[1] ? ((100 * tz[0]) / tz[1]).toFixed(1) + "%" : "-"}(${tz[1]}개), t값 ${tt[1] ? ((100 * tt[0]) / tt[1]).toFixed(1) + "%" : "-"}(${tt[1]}개)`;
    draw();
  }
  $(".run").addEventListener("click", () => {
    const n = +nIn.value, kk = k(n);
    ivs = Array.from({ length: 50 }, () => { const x = Array.from({ length: n }, () => MU + SG * NMStat.gauss(Math.random)); return [P.mean(x), (kk * P.sd(x)) / Math.sqrt(n)]; });
    const hit = ivs.filter(([m, e]) => Math.abs(m - MU) <= e).length; tally[mode][0] += hit; tally[mode][1] += 50;
    update();
  });
  root.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => { mode = b.dataset.k; ivs = []; update(); }));
  nIn.addEventListener("input", () => { ivs = []; tally = { z: [0, 0], t: [0, 0] }; update(); });
  update();
})();
