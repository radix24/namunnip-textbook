/* 카드: 더하는 순서만 바꿨는데 합이 달라질 수 있을까? — 리만 재배열(탐욕 규칙)으로 목표값에 다가가기 */
(() => {
  const root = document.getElementById("card-adcalc-rearrange");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const st = $(".st"), K = 4000;
  const P = { h: { pos: (i) => 1 / (2 * i - 1), neg: (i) => 1 / (2 * i), S: Math.LN2 }, sq: { pos: (i) => 1 / (2 * i - 1) ** 2, neg: (i) => 1 / (2 * i) ** 2, S: Math.PI ** 2 / 12 } };
  let pk = "h", sums = [], first = [];
  const { ctx, size } = fit($("canvas"), () => draw());

  function run() {
    const p = P[pk], T = +st.value;
    let s = 0, ip = 1, ineg = 1, run = 0, last = 0; sums = []; first = [];
    for (let k = 0; k < K; k++) {
      let t, up = s <= T;
      // 절대수렴 급수는 한쪽 부호만 쓰다 끝날 수 있으므로, 같은 부호 10번 연속이면 다른 부호를 하나 끼워 모든 항이 쓰이게 한다
      if (pk === "sq" && run >= 10) up = last < 0;
      run = (up ? 1 : -1) === last ? run + 1 : 1; last = up ? 1 : -1;
      if (up) { t = p.pos(ip); ip++; first.length < 12 && first.push(`+1/${pk === "h" ? 2 * ip - 3 : `${2 * ip - 3}²`}`); }
      else { t = -p.neg(ineg); ineg++; first.length < 12 && first.push(`−1/${pk === "h" ? 2 * ineg - 2 : `${2 * ineg - 2}²`}`); }
      s += t; sums.push(s);
    }
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const T = +st.value;
    const g = G.frame(ctx, w, h, { xr: [0, 3.6], yr: [-2.3, 3.3], xs: 1, ys: 1, xf: (v) => (v === 0 ? "1" : `10${["", "¹", "²", "³"][v] || ""}`), yf: (v) => n(v, 0) });
    G.curve(ctx, g, () => T, C.forest, { width: 1.4, dash: [5, 4] });
    G.curve(ctx, g, () => P[pk].S, C.ink3, { width: 1.2, dash: [2, 4] });
    ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
    ctx.strokeStyle = BLUE; ctx.lineWidth = 1.6; ctx.beginPath();
    sums.forEach((v, k) => { const x = g.X(Math.log10(k + 1)); k ? ctx.lineTo(x, g.Y(v)) : ctx.moveTo(x, g.Y(v)); });
    ctx.stroke(); ctx.restore();
    G.tag(ctx, g, `목표 ${n(T, 2)}`, g.x0 + g.w - 4, g.Y(T) - 10, C.forest, "right");
    G.tag(ctx, g, "가로: 쓴 항 수 (로그 눈금)", g.x0 + 4, g.y0 + g.h - 10, C.ink3);
  }
  function nums() {
    run();
    $(".t-out").textContent = n(+st.value, 2);
    $(".n-k").textContent = K;
    $(".n-s").textContent = n(sums[K - 1], 4);
    $(".n-o").textContent = n(P[pk].S, 4);
    $(".seq").textContent = `처음 순서: ${first.join(" ")} …`;
    draw();
  }
  G.chips(root, ".pk .chip", (b) => { pk = b.dataset.p; nums(); });
  st.addEventListener("input", nums);
  nums();
})();
