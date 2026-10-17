/* 카드: 360명 중 36명 뽑기 — 단순임의·계통·층화·집락 추출의 표본평균 분포 비교(가상 학교) */
(() => {
  const root = document.getElementById("card-pstat-sampling-methods");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const r = NMStat.rng(36), g = () => NMStat.gauss(r);
  const GR = 3, CL = 6, ST = 20, N = GR * CL * ST, n = 36, NAME = ["단순임의", "계통", "층화(학년별)", "집락(반 2개)"];
  /* 명단 순서: 학년 → 반 → 번호. 학년 평균 차이가 크고, 반마다 조금씩 다름 */
  const GM = [5.2, 3.4, 1.8], cls = Array.from({ length: GR * CL }, () => g() * 0.6);
  const V = Array.from({ length: N }, (_, i) => Math.max(0, GM[Math.floor(i / (CL * ST))] + cls[Math.floor(i / ST)] + g() * 1.1));
  const MU = NMPst.mean(V);
  const pickK = (arr, k, rr) => { const a = [...arr]; for (let i = 0; i < k; i++) { const j = i + Math.floor(rr() * (a.length - i)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, k); };
  const all = Array.from({ length: N }, (_, i) => i);
  const M = [
    (rr) => pickK(all, n, rr),
    (rr) => { const s0 = Math.floor(rr() * 10); return Array.from({ length: n }, (_, k) => s0 + 10 * k); },
    (rr) => [0, 1, 2].flatMap((gr) => pickK(all.slice(gr * CL * ST, (gr + 1) * CL * ST), n / GR, rr)),
    (rr) => pickK(Array.from({ length: GR * CL }, (_, c) => c), 2, rr).flatMap((c) => all.slice(c * ST, (c + 1) * ST)),
  ];
  let cur = 0, sample = [], dist = null;
  const rr = Math.random;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const ox = 34, s = Math.min((w * 0.44 - ox) / ST, (h - 8) / (GR * CL + 2)), set = new Set(sample);
    for (let i = 0; i < N; i++) {
      const c = Math.floor(i / ST), row = c + Math.floor(c / CL) * 1, x = ox + (i % ST) * s, y = 4 + row * s, t = Math.min(1, V[i] / 8);
      ctx.fillStyle = `rgba(59,124,42,${0.12 + 0.75 * t})`; ctx.fillRect(x, y, s - 1, s - 1);
      if (set.has(i)) { ctx.strokeStyle = C.warn; ctx.lineWidth = 1.6; ctx.strokeRect(x + 0.5, y + 0.5, s - 2, s - 2); }
    }
    ctx.fillStyle = C.ink2; ctx.font = `10px ${F.sans}`; ctx.textAlign = "right";
    for (let gr = 0; gr < GR; gr++) ctx.fillText(`${gr + 1}학년`, ox - 4, 4 + (gr * (CL + 1) + CL / 2) * s + 3);
    /* 오른쪽: 방법별 표본평균 분포(가로 0~7시간) */
    const x0 = ox + ST * s + 56, x1 = w - 8, X = (v) => x0 + ((x1 - x0) * v) / 7, rowH = (h - 26) / 4;
    ctx.font = `11px ${F.mono}`; ctx.textAlign = "center"; [0, 1, 2, 3, 4, 5, 6, 7].forEach((v) => ctx.fillText(String(v), X(v), h - 8));
    NAME.forEach((nm, m) => {
      const yb = 4 + (m + 1) * rowH - 4;
      ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke();
      ctx.fillStyle = m === cur ? C.warn : C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "right"; ctx.fillText(nm.slice(0, 2), x0 - 4, yb - rowH / 2 + 4);
      if (dist) {
        const cnt = NMStat.counts(dist[m], 0, 7, 70), mx = Math.max(...dist.map((d) => Math.max(...NMStat.counts(d, 0, 7, 70))));
        ctx.fillStyle = m === cur ? "rgba(181,83,47,.6)" : "rgba(63,111,163,.55)";
        cnt.forEach((c, b) => { if (!c) return; const bh = ((rowH - 8) * c) / mx; ctx.fillRect(X(b * 0.1), yb - bh, Math.max(1, X(0.1) - X(0) - 0.5), bh); });
      }
    });
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(X(MU), 4); ctx.lineTo(X(MU), h - 22); ctx.stroke(); ctx.setLineDash([]);
  }
  function pick(m) {
    cur = m; sample = M[m](rr);
    root.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.m === m)));
    const est = NMPst.mean(sample.map((i) => V[i]));
    $(".say").textContent = `${NAME[m]}: ${sample.length}명 뽑음(빨간 테두리) · 표본평균 ${est.toFixed(2)}시간 · 전체 평균(점선) ${MU.toFixed(2)}시간` + (dist ? ` · 300번의 표준편차: ${dist.map((d, k) => `${NAME[k].slice(0, 2)} ${NMPst.sd(d).toFixed(2)}`).join(", ")}` : "");
    draw();
  }
  root.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => pick(+b.dataset.m)));
  $(".many").addEventListener("click", () => { dist = M.map((f) => Array.from({ length: 300 }, () => NMPst.mean(f(rr).map((i) => V[i])))); pick(cur); });
  pick(0);
})();
