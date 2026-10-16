/* 카드: 자유투 성공률 70 %인 선수가 20번 던지면 몇 번쯤 넣을까? — 이항분포 B(n, p)와 실험 */
(() => {
  const root = document.getElementById("card-pmath-binom-slider");
  if (!root) return;
  const { C, fit } = NM;
  const { n: fm } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn"), sp = $(".sp");
  let cnt = [], runs = 0, s1 = 0, s2 = 0;
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const n = +sn.value, p = +sp.value, th = Array.from({ length: n + 1 }, (_, k) => NMSim.binom(n, k, p));
    const obs = cnt.map((c) => (runs ? c / runs : 0));
    const box = { x0: 40, y0: 10, w: w - 48, h: h - 34 };
    const step = Math.max(1, Math.ceil((n + 1) / 25));
    const r = NMSim.bars(ctx, box, obs, { expect: th, labels: th.map((_, k) => (k % step === 0 ? String(k) : "")), top: Math.max(...th, ...obs) * 1.1 + 1e-9, yfmt: (v) => fm(v, 2), ylabel: "확률" });
    const mu = n * p, sd = Math.sqrt(n * p * (1 - p)), X = (v) => box.x0 + (v + 0.5) * r.bw;
    ctx.fillStyle = "rgba(212,73,58,.12)"; ctx.fillRect(X(mu - sd), box.y0, X(mu + sd) - X(mu - sd), box.h);
    ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(mu), box.y0); ctx.lineTo(X(mu), box.y0 + box.h); ctx.stroke();
  }
  function nums() {
    const n = +sn.value, p = +sp.value;
    $(".n-out").textContent = n; $(".p-out").textContent = fm(p, 2);
    $(".n-m").textContent = fm(n * p, 2); $(".n-s").textContent = fm(Math.sqrt(n * p * (1 - p)), 3);
    const m = s1 / runs;
    $(".n-xm").textContent = runs ? fm(m, 2) : "—"; $(".n-xs").textContent = runs > 1 ? fm(Math.sqrt(Math.max(0, s2 / runs - m * m)), 3) : "—";
  }
  const reset = () => { cnt = Array(+sn.value + 1).fill(0); runs = 0; s1 = 0; s2 = 0; };
  NMSim.runner(root, {
    trial(k) { const n = +sn.value, p = +sp.value; for (let i = 0; i < k; i++) { let x = 0; for (let j = 0; j < n; j++) if (Math.random() < p) x++; cnt[x]++; runs++; s1 += x; s2 += x * x; } },
    draw() { nums(); draw(); }, reset, rate: 40,
  });
  [sn, sp].forEach((el) => el.addEventListener("input", () => { reset(); nums(); draw(); }));
  reset(); nums();
})();
