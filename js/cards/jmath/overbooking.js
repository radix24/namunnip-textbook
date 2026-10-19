/* 카드: 식당 좌석이 40석일 때 예약을 몇 팀까지 받아도 될까? — 이항분포로 초과 예약의 위험 (가상 모형) */
(() => {
  const root = document.getElementById("card-jmath-overbooking");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const rIn = $(".r"), qIn = $(".q"), SEATS = 40;
  /* 이항분포 확률(로그로 계산해 넘침 방지) */
  const lf = (k) => { let s = 0; for (let i = 2; i <= k; i++) s += Math.log(i); return s; };
  const binom = (n, p) => [...Array(n + 1)].map((_, k) => (p <= 0 ? (k === 0 ? 1 : 0) : p >= 1 ? (k === n ? 1 : 0) : Math.exp(lf(n) - lf(k) - lf(n - k) + k * Math.log(p) + (n - k) * Math.log(1 - p))));
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const n = +rIn.value, p = 1 - +qIn.value / 100, d = binom(n, p), top = Math.max(0.3, Math.ceil(Math.max(...d) * 10) / 10);
    const P = E.frame(ctx, size, { x0: 24.5, x1: 56.5, y0: 0, y1: top, xt: [25, 30, 35, 40, 45, 50, 55], yt: [[0, "0"], [top / 2, (top / 2).toFixed(2)], [top, top.toFixed(1)]], xlab: "실제로 온 손님(명)", ylab: "확률", L: 36 });
    const bw = (P.X(1) - P.X(0)) * 0.8;
    d.forEach((v, k) => { if (k < 25) return; ctx.fillStyle = k > SEATS ? C.warn : E.BLUE; ctx.fillRect(P.X(k) - bw / 2, P.Y(v), bw, P.Y(0) - P.Y(v)); });
    E.line(ctx, P, [[SEATS + 0.5, 0], [SEATS + 0.5, top]], C.ink, 1.4, [4, 3]);
    E.text(ctx, P.X(SEATS + 0.5) + 4, P.T + 12, "좌석 40석", C.ink2);
  }
  function update() {
    const n = +rIn.value, q = +qIn.value / 100, p = 1 - q, d = binom(n, p);
    $(".r-out").textContent = n; $(".q-out").textContent = qIn.value;
    const over = d.slice(SEATS + 1).reduce((a, b) => a + b, 0), empty = d.reduce((s, v, k) => s + v * Math.max(0, SEATS - k), 0);
    let best = SEATS; for (let m = SEATS; m <= 80; m++) { if (binom(m, p).slice(SEATS + 1).reduce((a, b) => a + b, 0) < 0.05) best = m; else break; }
    $(".say").textContent = `오는 손님 평균 ${(n * p).toFixed(1)}명 · 자리가 모자랄 확률 ${(over * 100).toFixed(1)}% · 빈자리 평균 ${empty.toFixed(1)}석 · 모자랄 확률 5% 미만으로 받을 수 있는 최대 예약 ${best}석`;
    draw();
  }
  [rIn, qIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
