/* 카드: 해마다 100만 원씩 20년 모으면 얼마가 될까? — 기말 적립 연금, 등비수열의 합을 막대로 */
(() => {
  const root = document.getElementById("card-econ-annuity");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".a"), rIn = $(".r"), nIn = $(".n");
  const { ctx, size } = fit($("canvas"), () => draw());
  const S = (a, r, n) => (r ? (a * ((1 + r) ** n - 1)) / r : a * n);
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const a = +aIn.value, r = +rIn.value / 100, n = +nIn.value, tot = S(a, r, n);
    /* 오른쪽 막대 하나에 k년 말에 넣은 돈의 최종 가치 a(1+r)^(n−k)를 아래부터 쌓는다(일찍 넣은 돈이 아래) */
    const top = Math.max(tot, a * n) * 1.08, L = 56, Rr = 12, T = 16, B = 30, Y = (v) => T + (1 - v / top) * (h - T - B), X0 = L, bwid = Math.min(90, (w - L - Rr) * 0.28);
    const step = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000].find((s) => top / s <= 6) || 10000;
    NM.axes(ctx, { x0: L, y0: T, w: w - L - Rr, h: h - T - B, X: (x) => x, Y, yt: [...Array(Math.floor(top / step) + 1)].map((_, i) => [i * step, E.n(i * step)]), ylabel: "만 원" });
    const bars = [[X0 + 20, "넣은 돈의 합"], [X0 + 40 + bwid, `${n}년 말 원리합계`]];
    let acc = 0;
    for (let k = 1; k <= n; k++) { const v = a * (1 + r) ** (n - k), t = (k - 1) / Math.max(1, n - 1); ctx.fillStyle = `rgb(${Math.round(63 + (181 - 63) * t)},${Math.round(111 + (215 - 111) * t)},${Math.round(163 + (172 - 163) * t)})`; ctx.fillRect(bars[1][0], Y(acc + v), bwid, Y(acc) - Y(acc + v)); acc += v; }
    ctx.fillStyle = "rgba(141,141,146,.35)"; ctx.fillRect(bars[0][0], Y(a * n), bwid, Y(0) - Y(a * n));
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1; for (let k = 1; k < n; k++) { ctx.beginPath(); ctx.moveTo(bars[0][0], Y(a * k)); ctx.lineTo(bars[0][0] + bwid, Y(a * k)); ctx.stroke(); }
    bars.forEach(([x, lab], i) => { E.text(ctx, x + bwid / 2, h - B + 16, lab, C.ink2, "center"); E.text(ctx, x + bwid / 2, Y(i ? tot : a * n) - 5, E.n(i ? tot : a * n, 1), C.ink, "center", `600 11px ${F.mono}`); });
    const lx = bars[1][0] + bwid + 14;
    if (lx + 120 < w) { E.text(ctx, lx, Y(tot) + 12, "↑ 마지막 해에 넣은 돈", C.ink2); E.text(ctx, lx, Y(0) - 4, "↓ 첫해에 넣은 돈", C.ink2); E.text(ctx, lx, Y(0) - 18, `= ${E.n(a * (1 + r) ** (n - 1), 1)}만 원`, C.ink3); }
  }
  function update() {
    const a = +aIn.value, r = +rIn.value / 100, n = +nIn.value, tot = S(a, r, n);
    $(".a-out").textContent = a; $(".r-out").textContent = E.n(+rIn.value, 1); $(".n-out").textContent = n;
    $(".say").textContent = `S = ${a}·(${E.n(1 + r, 3)}^${n} − 1)/${E.n(r, 3)} = ${E.n(tot, 1)}만 원 · 넣은 돈 ${E.n(a * n)}만 원 · 이자 ${E.n(tot - a * n, 1)}만 원 (${E.pct(tot / (a * n) - 1)})`;
    draw();
  }
  [aIn, rIn, nIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
