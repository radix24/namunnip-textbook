/* 카드: "신뢰도 95 %"의 95 %는 무엇에 대한 확률일까? — 신뢰구간을 여러 번 만들어 모평균을 품는 비율 세기 */
(() => {
  const root = document.getElementById("card-pmath-ci-100");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n: fm, label } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn"), sc = $(".sc");
  const M = 50, SIG = 10;
  const Z = [[80, 1.282], [90, 1.645], [95, 1.96], [99, 2.576]];   // 신뢰도 막대 0~3
  let ivs = [], made = 0, hit = 0;
  const { ctx, size } = fit($("canvas"), () => draw());
  const conf = () => Z[+sc.value];

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const lo = 38, hi = 62, X = (v) => 20 + (v - lo) / (hi - lo) * (w - 40), rows = 60, rh = (h - 24) / rows;
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
    for (let v = 40; v <= 60; v += 5) { ctx.beginPath(); ctx.moveTo(X(v), 4); ctx.lineTo(X(v), h - 20); ctx.stroke(); label(ctx, String(v), X(v), h - 8, C.ink3, "center", `10px ${F.mono}`); }
    ivs.slice(-rows).forEach(([a, b, xb], i) => {
      const y = 6 + i * rh + rh / 2, ok = a <= M && M <= b;
      ctx.strokeStyle = ok ? "#5a8f4a" : C.warn; ctx.lineWidth = Math.max(1.2, rh * 0.45);
      ctx.beginPath(); ctx.moveTo(X(Math.max(lo, a)), y); ctx.lineTo(X(Math.min(hi, b)), y); ctx.stroke();
      ctx.fillStyle = C.ink; ctx.fillRect(X(xb) - 1, y - rh * 0.4, 2, rh * 0.8);
    });
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(X(M), 2); ctx.lineTo(X(M), h - 20); ctx.stroke(); ctx.setLineDash([]);
    label(ctx, "모평균 m = 50", X(M) + 6, 10, C.ink, "left", `600 11px ${F.sans}`);
  }
  function nums() {
    const [c, z] = conf(), n = +sn.value;
    $(".n-out").textContent = n; $(".c-out").textContent = c;
    $(".n-k").textContent = made; $(".n-in").textContent = made ? `${hit}개 (${NMSim.pct(hit / made)})` : "—";
    $(".n-l").textContent = fm(2 * z * SIG / Math.sqrt(n), 3);
  }
  const reset = () => { ivs = []; made = 0; hit = 0; };
  NMSim.runner(root, {
    trial(k) {
      const n = +sn.value, half = conf()[1] * SIG / Math.sqrt(n);
      for (let i = 0; i < k; i++) {
        let s = 0; for (let j = 0; j < n; j++) s += M + SIG * NMSim.gauss();
        const xb = s / n, a = xb - half, b = xb + half;
        made++; if (a <= M && M <= b) hit++;
        ivs.push([a, b, xb]); if (ivs.length > 200) ivs.shift();
      }
    },
    draw() { nums(); draw(); }, reset, rate: 20,
  });
  [sn, sc].forEach((el) => el.addEventListener("input", () => { reset(); nums(); draw(); }));
  nums();
})();
