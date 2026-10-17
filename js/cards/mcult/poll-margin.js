/* 카드: 여론조사 오차범위 ±1.96√(p̂(1−p̂)/n)의 뜻 — 모의 조사 50번의 95% 신뢰구간 */
(() => {
  const root = document.getElementById("card-mcult-poll-margin");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p"), nIn = $(".n");
  let polls = [];
  const { ctx, size } = fit($("canvas"), () => draw());
  const moe = (ph, n) => 1.96 * Math.sqrt((ph * (1 - ph)) / n);
  /* 이항분포 표본: n이 커서 정규근사 + 반올림으로 충분 */
  const gauss = () => { let u = 0; while (!u) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = +pIn.value / 100, x0 = p - 0.15, x1 = p + 0.15, L = 10, R = 10, T = 8, B = 24;
    const X = (v) => L + ((w - L - R) * (v - x0)) / (x1 - x0);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "center";
    for (let v = Math.ceil(x0 * 20) / 20; v <= x1 + 1e-9; v += 0.05) { ctx.beginPath(); ctx.moveTo(X(v), T); ctx.lineTo(X(v), h - B); ctx.stroke(); ctx.fillText(`${Math.round(v * 100)}%`, X(v), h - B + 14); }
    const rh = (h - T - B) / 50;
    polls.forEach((ph, i) => {
      const m = moe(ph, +nIn.value), hit = Math.abs(ph - p) <= m, y = T + (i + 0.5) * rh;
      ctx.strokeStyle = hit ? "#3f6fa3" : C.warn; ctx.lineWidth = Math.max(1, rh * 0.5);
      ctx.beginPath(); ctx.moveTo(X(ph - m), y); ctx.lineTo(X(ph + m), y); ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle; ctx.fillRect(X(ph) - 1.5, y - rh * 0.4, 3, rh * 0.8);
    });
    ctx.strokeStyle = C.forest; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(p), T); ctx.lineTo(X(p), h - B); ctx.stroke();
    if (!polls.length) { ctx.fillStyle = C.ink3; ctx.font = `12px ${F.sans}`; ctx.fillText("‘여론조사 50번 하기’를 눌러 보세요", w / 2, h / 2); }
  }
  function update() {
    const p = +pIn.value / 100, n = +nIn.value, m = moe(0.5, n);
    $(".p-out").textContent = Math.round(p * 100); $(".n-out").textContent = n;
    const miss = polls.filter((ph) => Math.abs(ph - p) > moe(ph, n)).length;
    $(".say").textContent = `${n}명 조사의 최대 오차범위(p̂ = 0.5) ±${(100 * m).toFixed(1)}%p` + (polls.length ? ` · 모의 조사 ${polls.length}번 중 실제 지지율을 포함하지 못한 조사(빨간 막대) ${miss}번` : "");
    draw();
  }
  $(".run").addEventListener("click", () => {
    const p = +pIn.value / 100, n = +nIn.value;
    polls = Array.from({ length: 50 }, () => Math.min(n, Math.max(0, Math.round(n * p + gauss() * Math.sqrt(n * p * (1 - p))))) / n);
    update();
  });
  [pIn, nIn].forEach((x) => x.addEventListener("input", () => { polls = []; update(); }));
  update();
})();
