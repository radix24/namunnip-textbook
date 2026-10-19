/* 카드: r = cos kθ의 꽃잎은 몇 장일까? — 꽃잎 수와 필요한 θ 범위 예측 후 그리기 */
(() => {
  const root = document.getElementById("card-adcalc-rose-predict");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, seg, dot, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const sg = $(".sg"), sp = $(".sp"), verdict = $(".verdict"), PI = Math.PI;
  const PR = ["π/2", "π", "2π"], PV = [PI / 2, PI, 2 * PI];
  let k = 2, th = 0, raf = 0;
  const solved = new Set();
  const { ctx, size } = fit($("canvas"), () => draw());
  const truth = () => ({ petals: k % 2 ? k : 2 * k, range: k % 2 ? 1 : 2 });
  /* θ까지 그려진 서로 다른 꽃잎 수: 꽃잎마다 끝점 방향으로 센다 */
  function drawn() {
    const set = new Set();
    for (let j = 0; j < 2 * k; j++) {
      const mid = j * PI / k;   // |cos kθ| = 1 인 곳
      if (mid > th + 1e-9) break;
      const r = Math.cos(k * mid), ang = r >= 0 ? mid : mid + PI;
      set.add(Math.round((((ang % (2 * PI)) + 2 * PI) % (2 * PI)) / (PI / k)) % (2 * k));
    }
    return set.size;
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pf = A.pframe(ctx, w, h, { rmax: 1.1, rings: 2, rays: 12, ringLabels: false });
    const f = (t) => Math.cos(k * t);
    if (th > 0) {
      const N = Math.ceil(800 * th / (2 * PI)) + 2;
      for (let i = 0; i < N; i++) {
        const a = th * i / N, b = th * (i + 1) / N, again = (a + b) / 2 > PI && k % 2;
        const [x1, y1] = pf.P(f(a), a), [x2, y2] = pf.P(f(b), b);
        seg(ctx, x1, y1, x2, y2, again ? C.warn : BLUE, again ? 4 : 2.2);
      }
      const [px, py] = pf.P(f(th), th);
      seg(ctx, pf.cx, pf.cy, px, py, C.ink3, 1, [3, 3]); dot(ctx, px, py, C.ink);
    }
    label(ctx, `r = cos ${k}θ`, 8, 12, BLUE, "left", `600 12px ${F.sans}`);
    if (th > PI && k % 2) label(ctx, "주황: 덧그리는 부분", 8, h - 10, C.warn, "left", `600 11px ${F.sans}`);
  }
  function nums() {
    $(".g-out").textContent = sg.value; $(".p-out").textContent = PR[+sp.value];
    $(".n-t").textContent = `${n(th / PI, 2)}π`;
    $(".n-p").textContent = th > 0 ? `${drawn()}장` : "—";
    $(".n-s").textContent = `${solved.size} / 6`;
    draw();
  }
  function go() {
    cancelAnimationFrame(raf);
    const t = truth(), gp = +sg.value, gr = +sp.value, ok = gp === t.petals && gr === t.range;
    if (ok) solved.add(k);
    const finish = () => {
      verdict.textContent = `꽃잎 ${t.petals}장, θ = ${PR[t.range]}까지면 다 그려집니다. ${ok ? "둘 다 맞혔습니다." : `예측: ${gp}장, ${PR[gr]}`}`;
      verdict.className = "verdict " + (ok ? "good" : "bad"); nums();
    };
    if (NM.reduce) { th = 2 * PI; finish(); return; }
    const t0 = performance.now();
    const tick = (now) => { th = Math.min(2 * PI, (now - t0) / 4000 * 2 * PI); nums(); if (th < 2 * PI) raf = requestAnimationFrame(tick); else finish(); };
    raf = requestAnimationFrame(tick);
  }
  root.querySelectorAll(".ks .chip").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll(".ks .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    cancelAnimationFrame(raf); k = +b.dataset.k; th = 0; verdict.textContent = ""; verdict.className = "verdict"; nums();
  }));
  [sg, sp].forEach((s) => s.addEventListener("input", nums));
  $(".go-draw").addEventListener("click", go);
  nums();
})();
