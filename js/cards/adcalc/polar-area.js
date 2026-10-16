/* 카드: 극곡선의 넓이는 왜 부채꼴로 잘라 구할까? — 부채꼴 합, 적분, 범위에 따른 이중 계산 */
(() => {
  const root = document.getElementById("card-adcalc-polar-area");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn"), PI = Math.PI;
  /* area: 실제로 둘러싼 넓이 */
  const P = {
    card: { f: (t) => 1 + Math.cos(t), rmax: 2.1, area: 1.5 * PI },
    circ: { f: (t) => 2 * Math.cos(t), rmax: 2.1, area: PI },
    rose: { f: (t) => Math.cos(2 * t), rmax: 1.1, area: PI / 2 },
    rose3: { f: (t) => Math.cos(3 * t), rmax: 1.1, area: PI / 4 },
  };
  let pk = "card", span = 2;
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = P[pk], k = +sn.value, T = span * PI, dt = T / k;
    const pf = A.pframe(ctx, w, h, { rmax: p.rmax, rings: 2, rays: 12, ringLabels: false });
    ctx.save();
    for (let i = 0; i < k; i++) {
      const m = (i + 0.5) * dt, r = p.f(m), a0 = i * dt, a1 = (i + 1) * dt;
      const sh = r < 0 ? PI : 0;   // 음의 r은 반대쪽
      ctx.fillStyle = r < 0 ? "rgba(181,83,47,.22)" : "rgba(59,124,42,.2)";
      ctx.strokeStyle = r < 0 ? "rgba(181,83,47,.5)" : "rgba(59,124,42,.45)"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(pf.cx, pf.cy);
      ctx.arc(pf.cx, pf.cy, Math.abs(r) * pf.S, -(a0 + sh), -(a1 + sh), true);
      ctx.closePath(); ctx.fill(); if (k <= 60) ctx.stroke();
    }
    ctx.restore();
    A.pcurve(ctx, pf, p.f, 0, 2 * PI, BLUE, { width: 2.2 });
  }
  function nums() {
    const p = P[pk], k = +sn.value, T = span * PI, dt = T / k;
    let s = 0; for (let i = 0; i < k; i++) s += 0.5 * p.f((i + 0.5) * dt) ** 2 * dt;
    $(".n-out").textContent = k;
    $(".n-s").textContent = n(s, 4);
    const I = A.simpson((t) => 0.5 * p.f(t) ** 2, 0, T, 2000);
    const ii = $(".n-i"); ii.textContent = n(I, 4); ii.classList.toggle("bad", Math.abs(I - p.area) > 1e-3);
    $(".n-a").textContent = n(p.area, 4);
    draw();
  }
  G.chips(root, ".pk .chip", (b) => { pk = b.dataset.p; nums(); });
  G.chips(root, ".rg .chip", (b) => { span = +b.dataset.r; nums(); });
  sn.addEventListener("input", nums);
  nums();
})();
