/* 카드: 못이 박힌 판에 공을 떨어뜨리면 왜 가운데에 많이 쌓일까? — 갈톤 보드, 이항계수 */
(() => {
  const root = document.getElementById("card-pmath-galton");
  if (!root) return;
  const { C, F, fit } = NM;
  const { label } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn"), pas = $(".go-pas");
  let bins = [], total = 0, lastPath = null;
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const n = +sn.value, top = 16, boardH = h * 0.5, dx = Math.min((w - 30) / (n + 1), 40), dy = boardH / (n + 0.5);
    const X = (row, k) => w / 2 + (k - row / 2) * dx, Y = (row) => top + row * dy;
    // 못
    for (let r = 0; r < n; r++) for (let k = 0; k <= r; k++) {
      ctx.fillStyle = C.ink3; ctx.beginPath(); ctx.arc(X(r, k), Y(r), 3, 0, 7); ctx.fill();
      if (pas.getAttribute("aria-pressed") === "true" && n <= 10) label(ctx, String(NMSim.C(r, k)), X(r, k), Y(r) - 9, C.ink2, "center", `10px ${F.mono}`);
    }
    // 마지막 공의 길
    if (lastPath) {
      ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0, 0), Y(0) - 12);
      let k = 0; ctx.lineTo(X(0, 0), Y(0));
      lastPath.forEach((s, r) => { k += s; ctx.lineTo(X(r + 1, k), Y(r + 1)); });
      ctx.stroke();
    }
    // 칸과 막대
    const y0 = top + n * dy + 6, bh = h - y0 - 18;
    const exp = Array.from({ length: n + 1 }, (_, k) => total * NMSim.C(n, k) / 2 ** n);
    const mx = Math.max(1, ...bins, ...exp) * 1.05;
    for (let k = 0; k <= n; k++) {
      const x = X(n, k);
      ctx.strokeStyle = C.rule; ctx.beginPath(); ctx.moveTo(x - dx / 2, y0); ctx.lineTo(x - dx / 2, y0 + bh); ctx.stroke();
      const bhk = bins[k] / mx * bh;
      ctx.fillStyle = C.sprout; ctx.fillRect(x - dx * 0.4, y0 + bh - bhk, dx * 0.8, bhk);
      if (total) { ctx.strokeStyle = C.ink; ctx.setLineDash([3, 2]); const e = y0 + bh - exp[k] / mx * bh; ctx.beginPath(); ctx.moveTo(x - dx * 0.45, e); ctx.lineTo(x + dx * 0.45, e); ctx.stroke(); ctx.setLineDash([]); }
      label(ctx, String(k), x, y0 + bh + 10, C.ink3, "center", `10px ${F.mono}`);
    }
  }
  function nums() {
    const n = +sn.value, mid = Math.floor(n / 2);
    $(".n-out").textContent = n; $(".n-n").textContent = total;
    $(".n-m").textContent = total ? NMSim.pct(bins[mid] / total) : "—";
    $(".n-e").textContent = NMSim.pct(NMSim.C(n, mid) / 2 ** n);
  }
  const drop = () => { const n = +sn.value, path = []; let k = 0; for (let r = 0; r < n; r++) { const s = Math.random() < 0.5 ? 0 : 1; path.push(s); k += s; } bins[k]++; total++; return path; };
  const reset = () => { bins = Array(+sn.value + 1).fill(0); total = 0; lastPath = null; };
  NMSim.runner(root, {
    trial(k) { let p; for (let i = 0; i < k; i++) p = drop(); lastPath = k === 1 ? p : null; },
    draw() { nums(); draw(); },
    reset, rate: 80,
  });
  pas.addEventListener("click", () => { pas.setAttribute("aria-pressed", String(pas.getAttribute("aria-pressed") !== "true")); draw(); });
  sn.addEventListener("input", () => { reset(); nums(); draw(); });
  reset(); nums();
})();
