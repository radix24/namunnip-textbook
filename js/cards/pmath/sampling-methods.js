/* 카드: 학생 40명을 어떻게 뽑아야 전교생의 평균 통학 시간을 잘 맞힐까? — 표본추출 방법 비교(모의 학교) */
(() => {
  const root = document.getElementById("card-pmath-sampling-methods");
  if (!root) return;
  const { C, fit } = NM;
  const { n: fm } = NMPm;
  const $ = (s) => root.querySelector(s);
  const NS = 40, COLS = 20, ROWS = 30;   // 600명: 학년마다 10행 × 20열
  /* 모의 학교: 학년마다 평균이 다르고(1학년 45분, 2학년 30분, 3학년 25분), 정문 도착 순서는 통학 시간과 관계 */
  const pop = [];
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
  for (let i = 0; i < 600; i++) { const gr = Math.floor(i / 200), base = [45, 30, 25][gr]; pop.push({ gr, t: Math.max(5, base + 9 * gauss()) }); }
  const MU = pop.reduce((a, p) => a + p.t, 0) / 600;
  const byArrival = pop.map((p, i) => [p.t + 6 * gauss(), i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);   // 짧은 통학이 먼저 도착
  let mk = "srs", last = [], means = [];
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const draw1 = () => {
    const idx = [...Array(600).keys()];
    if (mk === "srs") return shuffle(idx).slice(0, NS);
    if (mk === "strat") return [0, 1, 2].flatMap((g) => shuffle(idx.filter((i) => pop[i].gr === g)).slice(0, NS / 3 + (g === 0 ? 1 : 0))).slice(0, NS);
    if (mk === "sys") { const k = 600 / NS, st = Math.floor(Math.random() * k); return Array.from({ length: NS }, (_, j) => st + j * k); }
    const off = Math.floor(Math.random() * 20); return byArrival.slice(off, off + NS);
  };
  const fp = fit($(".pop"), () => drawPop()), fh = fit($(".hist"), () => drawHist());

  function drawPop() {
    const { ctx, size } = fp; const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const cw = w / COLS, ch = h / ROWS, picked = new Set(last);
    pop.forEach((p, i) => {
      const r = Math.floor(i / COLS), c = i % COLS, v = Math.min(1, p.t / 70);
      ctx.fillStyle = `rgba(59,124,42,${0.12 + 0.6 * v})`; ctx.fillRect(c * cw + 0.5, r * ch + 0.5, cw - 1, ch - 1);
      if (picked.has(i)) { ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.strokeRect(c * cw + 1, r * ch + 1, cw - 2, ch - 2); }
    });
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; [10, 20].forEach((r) => { ctx.beginPath(); ctx.moveTo(0, r * ch); ctx.lineTo(w, r * ch); ctx.stroke(); });
  }
  function drawHist() {
    const { ctx, size } = fh; const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const lo = 20, hi = 45, k = 25, cnt = Array(k).fill(0);
    means.forEach((m) => { const i = Math.floor((m - lo) / (hi - lo) * k); if (i >= 0 && i < k) cnt[i]++; });
    const box = { x0: 30, y0: 10, w: w - 36, h: h - 34 };
    const r = NMSim.bars(ctx, box, cnt, { labels: cnt.map((_, i) => (i % 5 === 0 ? String(lo + i) : "")), ylabel: "표본평균(분)" });
    const X = box.x0 + (MU - lo) / (hi - lo) * box.w;
    ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(X, box.y0); ctx.lineTo(X, box.y0 + box.h); ctx.stroke(); ctx.setLineDash([]);
  }
  function nums() {
    $(".n-mu").textContent = `${fm(MU, 2)}분`;
    if (!means.length) { $(".n-m").textContent = "—"; $(".n-s").textContent = "—"; return; }
    const m = means.reduce((a, b) => a + b, 0) / means.length, s = Math.sqrt(means.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, means.length - 1));
    $(".n-m").textContent = `${fm(m, 2)}분 (${means.length}번)`; $(".n-s").textContent = `${fm(s, 2)}분`;
  }
  NMSim.runner(root, {
    trial(k) { for (let i = 0; i < k; i++) { last = draw1(); means.push(last.reduce((a, j) => a + pop[j].t, 0) / last.length); } },
    draw() { nums(); drawPop(); drawHist(); },
    reset() { means = []; last = []; }, rate: 30,
  });
  root.querySelectorAll(".how .chip").forEach((b) => b.addEventListener("click", () => {
    mk = b.dataset.m; root.querySelectorAll(".how .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    means = []; last = []; nums(); drawPop(); drawHist();
  }));
  nums();
})();
