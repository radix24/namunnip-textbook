/* 카드: 당첨 확률 1%인 뽑기를 100번 하면 반드시 당첨될까? — 1 − (1 − p)^n, 첫 당첨까지 횟수(기하분포) */
(() => {
  const root = document.getElementById("card-mcult-gacha");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p"), nIn = $(".n"), NMAX = 400;
  let hist = null;   // 가상 이용자의 첫 당첨 횟수
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = +pIn.value / 100, n = +nIn.value, L = 40, R = 12, T = 12, B = 30;
    const X = (k) => L + ((w - L - R) * k) / NMAX, Y = (q) => T + (h - T - B) * (1 - q);
    if (hist) {   // 첫 당첨 횟수 막대(구간 10회), 높이는 오른쪽 기준으로 비율
      const bins = new Array(NMAX / 10).fill(0); hist.forEach((k) => { if (k <= NMAX) bins[Math.ceil(k / 10) - 1]++; });
      const m = Math.max(...bins);
      ctx.fillStyle = "rgba(116,171,102,.35)";
      bins.forEach((c, i) => { const y0 = Y((0.9 * c) / m); ctx.fillRect(X(i * 10) + 1, y0, X(10) - X(0) - 2, Y(0) - y0); });
    }
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2;
    [0, 0.5, 1].forEach((q) => { ctx.beginPath(); ctx.moveTo(L, Y(q)); ctx.lineTo(w - R, Y(q)); ctx.stroke(); ctx.textAlign = "right"; ctx.fillText(q.toFixed(1), L - 4, Y(q) + 4); });
    [0, 100, 200, 300, 400].forEach((k) => { ctx.textAlign = "center"; ctx.fillText(String(k), X(k), h - B + 14); });
    ctx.font = `11px ${F.sans}`; ctx.fillText("뽑는 횟수 n", (L + w - R) / 2, h - 3);
    ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 2; ctx.beginPath();
    for (let k = 0; k <= NMAX; k += 2) { const q = 1 - (1 - p) ** k; k ? ctx.lineTo(X(k), Y(q)) : ctx.moveTo(X(k), Y(q)); }
    ctx.stroke();
    const q = 1 - (1 - p) ** n;
    ctx.setLineDash([3, 3]); ctx.strokeStyle = C.warn; ctx.beginPath(); ctx.moveTo(X(n), Y(0)); ctx.lineTo(X(n), Y(q)); ctx.lineTo(L, Y(q)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(X(n), Y(q), 5, 0, 7); ctx.fill();
  }
  function update() {
    const p = +pIn.value / 100, n = +nIn.value, q = 1 - (1 - p) ** n, half = Math.ceil(Math.log(0.5) / Math.log(1 - p));
    $(".p-out").textContent = (+pIn.value).toFixed(1); $(".n-out").textContent = n;
    $(".say").textContent = `${n}번 중 한 번 이상 당첨: 1 − ${(1 - p).toFixed(3)}^${n} = ${(100 * q).toFixed(1)}% · 한 번도 안 됨 ${(100 * (1 - q)).toFixed(1)}% · 평균 ${(1 / p).toFixed(0)}번 · 50%를 넘는 횟수 ${half}번`;
    draw();
  }
  $(".sim").addEventListener("click", () => {
    const p = +pIn.value / 100;
    hist = Array.from({ length: 1000 }, () => { let k = 1; while (Math.random() >= p && k < 5000) k++; return k; });
    const sorted = [...hist].sort((a, b) => a - b), mean = hist.reduce((s, v) => s + v, 0) / 1000;
    $(".sim-say").textContent = `가상 이용자 1000명(초록 막대): 첫 당첨까지 평균 ${mean.toFixed(1)}번, 가운데값 ${sorted[499]}번, 가장 많이 뽑은 사람 ${sorted[999]}번, 300번 넘게 뽑은 사람 ${hist.filter((k) => k > 300).length}명`;
    draw();
  });
  pIn.addEventListener("input", () => { hist = null; $(".sim-say").textContent = ""; update(); });
  nIn.addEventListener("input", update);
  update();
})();
