/* 카드: 압정이 바늘 끝을 위로 하고 떨어질 확률은 계산할 수 있을까? — 통계적 확률(가상의 압정)과 주사위 비교 */
(() => {
  const root = document.getElementById("card-pmath-thumbtack");
  if (!root) return;
  const { C, fit } = NM;
  const { BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const verdict = $(".verdict");
  let p, n = 0, up = 0, one = 0;
  const rt = NMSim.recorder(), rd = NMSim.recorder();
  const { ctx, size } = fit($("canvas"), () => draw());
  const newTack = () => { p = 0.3 + Math.round(Math.random() * 40) / 100; };   // 0.30 ~ 0.70

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const box = { x0: 36, y0: 10, w: w - 46, h: h - 44 };
    NMSim.trend(ctx, box, rt.pts, { yr: [0, 1], ylabel: "상대도수", color: C.warn });
    NMSim.trend(ctx, box, rd.pts, { target: 1 / 6, yr: [0, 1], color: BLUE });
  }
  function nums() {
    $(".n-n").textContent = n;
    $(".n-t").textContent = n ? NMSim.n(up / n, 4) : "—";
    $(".n-d").textContent = n ? NMSim.n(one / n, 4) : "—";
  }
  NMSim.runner(root, {
    trial(k) { for (let i = 0; i < k; i++) { n++; if (Math.random() < p) up++; if (Math.floor(Math.random() * 6) === 0) one++; rt.push(n, up / n); rd.push(n, one / n); } },
    draw() { nums(); draw(); },
    reset() { n = 0; up = 0; one = 0; rt.clear(); rd.clear(); newTack(); verdict.textContent = ""; verdict.className = "verdict"; $(".g").value = ""; },
    rate: 60,
  });
  $(".go-reveal").addEventListener("click", () => {
    const g = parseFloat($(".g").value);
    const msg = `숨은 확률은 ${p.toFixed(2)}입니다. ${n}번 던진 상대도수는 ${n ? (up / n).toFixed(3) : "—"}.`;
    verdict.textContent = Number.isFinite(g) ? `${msg} 내 어림 ${g.toFixed(2)} → 차이 ${Math.abs(g - p).toFixed(2)}` : msg;
    verdict.className = "verdict " + (Number.isFinite(g) && Math.abs(g - p) <= 0.03 ? "good" : "");
  });
  newTack(); nums();
})();
