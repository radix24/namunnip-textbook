/* 카드: 해마다 일부 고객이 갈아타면 점유율은 결국 어떻게 될까? — 전이 행렬의 거듭제곱 (가상 값) */
(() => {
  const root = document.getElementById("card-econ-market-share");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const abIn = $(".ab"), baIn = $(".ba"), a0In = $(".a0"), N = 20;
  const { ctx, size } = fit($("canvas"), () => draw());
  const run = () => { const p = +abIn.value / 100, q = +baIn.value / 100; let a = +a0In.value / 100, b = 1 - a; const out = [[a, b]]; for (let k = 0; k < N; k++) { [a, b] = [(1 - p) * a + q * b, p * a + (1 - q) * b]; out.push([a, b]); } return out; };
  const steady = () => { const p = +abIn.value / 100, q = +baIn.value / 100; return p + q ? q / (p + q) : NaN; };
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const s = run(), st = steady();
    const P = E.frame(ctx, size, { x0: 0, x1: N, y0: 0, y1: 1, xt: [0, 5, 10, 15, 20].map((v) => [v, `${v}년`]), yt: [[0, "0"], [0.25, "25%"], [0.5, "50%"], [0.75, "75%"], [1, "100%"]], ylab: "점유율", L: 42 });
    if (Number.isFinite(st)) { E.fn(ctx, P, () => st, 0, N, E.BLUE, 1.2, [4, 4]); E.fn(ctx, P, () => 1 - st, 0, N, C.warn, 1.2, [4, 4]); }
    E.line(ctx, P, s.map(([a], k) => [k, a]), E.BLUE, 2.4); E.line(ctx, P, s.map(([, b], k) => [k, b]), C.warn, 2.4);
    s.forEach(([a, b], k) => { E.dot(ctx, P, k, a, E.BLUE, 2.6); E.dot(ctx, P, k, b, C.warn, 2.6); });
    E.text(ctx, P.X(N) - 2, P.Y(s[N][0]) - 6, "A", E.BLUE, "right"); E.text(ctx, P.X(N) - 2, P.Y(s[N][1]) - 6, "B", C.warn, "right");
  }
  function update() {
    const p = +abIn.value / 100, q = +baIn.value / 100, s = run(), st = steady();
    $(".ab-out").textContent = abIn.value; $(".ba-out").textContent = baIn.value; $(".a0-out").textContent = a0In.value;
    $(".tm").innerHTML = `<tr><th></th><th>올해 A</th><th>올해 B</th></tr><tr><th>내년 A</th><td>${E.n(1 - p, 2)}</td><td>${E.n(q, 2)}</td></tr><tr><th>내년 B</th><td>${E.n(p, 2)}</td><td>${E.n(1 - q, 2)}</td></tr>`;
    $(".say").textContent = `1년 뒤 A ${E.pct(s[1][0])}, 5년 뒤 ${E.pct(s[5][0])}, 20년 뒤 ${E.pct(s[N][0])}` + (Number.isFinite(st) ? ` · 안정 상태 A = q/(p + q) = ${E.pct(st)}` : " · 아무도 옮기지 않으면 처음 점유율이 그대로입니다");
    draw();
  }
  [abIn, baIn, a0In].forEach((el) => el.addEventListener("input", update));
  update();
})();
