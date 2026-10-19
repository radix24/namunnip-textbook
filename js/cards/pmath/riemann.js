/* 카드: 직사각형을 끝없이 잘게 쪼개면 곡선 아래 넓이가 될까? — 구분구적법, 높이 재는 위치에 따른 오차 */
(() => {
  const root = document.getElementById("card-pmath-riemann");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, piLab } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn");
  const FN = {
    sq: { f: (x) => x * x, a: 0, b: 2, I: 8 / 3, yr: [0, 4.4], name: "x²" },
    rt: { f: Math.sqrt, a: 0, b: 4, I: 16 / 3, yr: [0, 2.3], name: "√x" },
    sin: { f: Math.sin, a: 0, b: Math.PI, I: 2, yr: [0, 1.15], name: "sin x", pi: true },
    ex: { f: Math.exp, a: 0, b: 1, I: Math.E - 1, yr: [0, 2.9], name: "eˣ" },
  };
  let fk = "sq", r = 1;
  const { ctx, size } = fit($("canvas"), () => draw());
  const S = (N) => { const F_ = FN[fk], dx = (F_.b - F_.a) / N; let s = 0; for (let k = 0; k < N; k++) s += F_.f(F_.a + (k + r) * dx) * dx; return s; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const F_ = FN[fk], N = +sn.value, dx = (F_.b - F_.a) / N;
    const g = G.frame(ctx, w, h, { xr: [F_.a, F_.b + (F_.b - F_.a) * 0.04], yr: F_.yr, xs: F_.pi ? Math.PI / 4 : (F_.b - F_.a) / 4, ys: F_.yr[1] > 3 ? 1 : 0.5, xf: F_.pi ? piLab : (v) => n(v, 2), yf: (v) => n(v, 1) });
    ctx.fillStyle = C.sprout; ctx.strokeStyle = C.forest; ctx.lineWidth = N > 60 ? 0 : 1;
    for (let k = 0; k < N; k++) {
      const x0 = F_.a + k * dx, y = F_.f(x0 + r * dx);
      const X0 = g.X(x0), X1 = g.X(x0 + dx), Y = g.Y(y), Y0 = g.Y(0);
      ctx.fillRect(X0, Y, X1 - X0, Y0 - Y);
      if (N <= 60) ctx.strokeRect(X0 + 0.5, Y + 0.5, X1 - X0 - 1, Y0 - Y);
      if (N <= 24) { ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(g.X(x0 + r * dx), Y, 2.6, 0, 7); ctx.fill(); ctx.fillStyle = C.sprout; }
    }
    G.curve(ctx, g, F_.f, C.ink, { width: 2.2, from: F_.a, to: F_.b });
    G.tag(ctx, g, `y = ${F_.name}`, g.x0 + 4, g.y0 + 10, C.ink);
  }

  function update() {
    const F_ = FN[fk], N = +sn.value, s = S(N), e = s - F_.I, e2 = S(2 * N) - F_.I;
    $(".n-out").textContent = N;
    $(".n-s").textContent = n(s, 5); $(".n-t").textContent = n(F_.I, 5);
    $(".n-e").textContent = n(e, 5);
    $(".n-q").textContent = Math.abs(e) < 1e-12 ? "—" : `약 ${n(e2 / e, 3)}배`;
    const pos = r === 1 ? "k" : r === 0 ? "(k − 1)" : "(k − ½)";
    $(".sum").textContent = `S_n = Σ(k=1…${N}) f(a + ${pos}·Δx)·Δx,  Δx = ${n((F_.b - F_.a) / N, 4)}`;
    draw();
  }
  G.chips(root, ".fn .chip", (b) => { fk = b.dataset.f; update(); });
  G.chips(root, ".rule .chip", (b) => { r = +b.dataset.r; update(); });
  sn.addEventListener("input", update);
  update();
})();
