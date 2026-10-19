/* 카드: 구불구불한 산길에 1 km마다 표지판을 세우려면? — t 등분과 호의 길이 등분 비교(모의 곡선) */
(() => {
  const root = document.getElementById("card-adgeo-milestones");
  if (!root) return;
  const { F, fit } = NM;
  const K = NMCurve;
  const $ = (s) => root.querySelector(s);
  /* 모의 산길: t ∈ [0, 1] */
  const f = (t) => { const u = t * 1; return [10 * u + 1.2 * Math.sin(9 * u), 2.2 * Math.sin(6 * u) + 1.4 * Math.sin(15 * u) * u]; };
  const T0 = 0, T1 = 1, TOTAL = K.arcLen(f, T0, T1, 2000);
  let mode = "t";
  const { ctx, size } = fit($("canvas"), () => draw());
  /* s(t) 표로 역함수 */
  const tab = (() => { const N = 4000, out = [[0, 0]]; let s = 0, p = f(0); for (let k = 1; k <= N; k++) { const t = k / N, q = f(t); s += Math.hypot(q[0] - p[0], q[1] - p[1]); out.push([t, s]); p = q; } return out; })();
  const tOfS = (s) => { const i = tab.findIndex((r) => r[1] >= s); if (i <= 0) return i === 0 ? 0 : 1; const [t0, s0] = tab[i - 1], [t1, s1] = tab[i]; return t0 + ((t1 - t0) * (s - s0)) / (s1 - s0); };
  const sOfT = (t) => { const i = Math.min(tab.length - 1, Math.round(t * (tab.length - 1))); return tab[i][1]; };
  function signs() { const n = Math.floor(TOTAL); return [...Array(n + 1)].map((_, k) => (mode === "t" ? (k / Math.floor(TOTAL)) * (tOfS(Math.floor(TOTAL))) : tOfS(k))); }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.fillStyle = "#e8efdf"; ctx.fillRect(0, 0, w, h);
    const s = Math.min((w - 30) / 12, (h - 30) / 7.5), X = (x) => 15 + (x + 0.5) * s, Y = (y) => h / 2 - y * s;
    ctx.strokeStyle = "#8d8d92"; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); for (let k = 0; k <= 600; k++) { const p = f(k / 600); k ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])); } ctx.stroke();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.setLineDash([6, 6]); ctx.stroke(); ctx.setLineDash([]); ctx.lineCap = "butt";
    signs().forEach((t, k) => { const p = f(t); ctx.fillStyle = "#3b7c2a"; ctx.fillRect(X(p[0]) - 2, Y(p[1]) - 18, 4, 18); ctx.fillStyle = "#fff"; ctx.strokeStyle = "#3b7c2a"; ctx.lineWidth = 1.5; ctx.fillRect(X(p[0]) - 10, Y(p[1]) - 30, 20, 13); ctx.strokeRect(X(p[0]) - 10, Y(p[1]) - 30, 20, 13); ctx.fillStyle = "#232326"; ctx.font = `700 10px ${F.mono}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(k, X(p[0]), Y(p[1]) - 23.5); });
  }
  function update() {
    root.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.m === mode)));
    const ts = signs(), gaps = ts.slice(1).map((t, i) => sOfT(t) - sOfT(ts[i]));
    $(".say").textContent = `길 전체 ${K.n(TOTAL, 2)} km · 표지판 사이의 길 거리(km): ${gaps.map((g) => K.n(g, 2)).join(", ")} · 가장 짧은 ${K.n(Math.min(...gaps), 2)}, 가장 긴 ${K.n(Math.max(...gaps), 2)}`;
    draw();
  }
  root.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; update(); }));
  update();
})();
