/* 카드: sinh의 역함수는 왜 로그로 쓸 수 있을까? — 증명 조립과 sinh, arsinh, 로그 식의 그래프 */
(() => {
  const root = document.getElementById("card-adcalc-arsinh-proof");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sx = $(".sx");
  let stage = -1;
  const ash = (x) => Math.log(x + Math.sqrt(x * x + 1));
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const g = G.frame(ctx, w, h, { xr: [-4, 4], yr: [-4, 4], xs: 1, ys: 1, xf: (v) => n(v, 0), yf: (v) => n(v, 0) });
    G.curve(ctx, g, (x) => x, C.rule, { width: 1.2, dash: [4, 4] });
    G.curve(ctx, g, Math.sinh, BLUE, { width: 2.2 });
    // 역함수: (sinh t, t)를 이어 그린다 (식을 쓰지 않고 뒤집기)
    ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
    ctx.strokeStyle = C.forest; ctx.lineWidth = 2.4; ctx.beginPath();
    for (let i = 0; i <= 300; i++) { const t = -2.2 + 4.4 * i / 300; const X = g.X(Math.sinh(t)), Y = g.Y(t); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
    ctx.stroke(); ctx.restore();
    if (stage >= 4) G.curve(ctx, g, ash, C.warn, { width: 2, dash: [3, 4] });
    const x = +sx.value, y = ash(x);
    G.dot(ctx, g, x, y, C.forest); G.dot(ctx, g, y, x, BLUE, true);
    G.tag(ctx, g, "파랑 y = sinh x", g.x0 + 4, g.y0 + 10, BLUE);
    G.tag(ctx, g, "초록 역함수 (y = x에 대칭)", g.x0 + 4, g.y0 + 28, C.forest);
    if (stage >= 4) G.tag(ctx, g, "점선 y = ln(x + √(x² + 1))", g.x0 + 4, g.y0 + 46, C.warn);
  }
  function nums() {
    const x = +sx.value, r = Math.sqrt(x * x + 1);
    $(".x-out").textContent = n(x, 2);
    $(".n-up").textContent = stage >= 2 ? n(x + r, 4) : "—";
    const um = $(".n-um");
    um.textContent = stage >= 2 ? n(x - r, 4) : "—";
    um.classList.toggle("bad", stage >= 3);
    $(".n-y").textContent = stage >= 4 ? n(ash(x), 4) : "—";
    draw();
  }
  NMProof.mount($(".pf"), { order: ["a", "b", "c", "d", "e"], onStep(i) { stage = i; nums(); } });
  sx.addEventListener("input", nums);
  nums();
})();
