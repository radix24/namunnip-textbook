/* 카드: 복잡한 분수식을 간단한 분수 두 개로 쪼갤 수 있을까? — A, B를 움직여 그래프를 겹치는 부분분수 */
(() => {
  const root = document.getElementById("card-pmath-partial-frac");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sA = $(".sA"), sB = $(".sB"), verdict = $(".verdict"), hint = $(".hint");
  /* (px + q)/((x − a)(x − b)) */
  const P = [{ p: 0, q: 1, a: 1, b: -1 }, { p: 1, q: 5, a: 1, b: -2 }, { p: 3, q: 0, a: 2, b: -1 }];
  let pk = 0;
  const { ctx, size } = fit($("canvas"), () => draw());
  const f = (x) => { const s = P[pk]; return (s.p * x + s.q) / ((x - s.a) * (x - s.b)); };
  const g = (x) => { const s = P[pk]; return +sA.value / (x - s.a) + +sB.value / (x - s.b); };
  const truth = () => { const s = P[pk]; return [(s.p * s.a + s.q) / (s.a - s.b), (s.p * s.b + s.q) / (s.b - s.a)]; };
  const fac = (a) => `x ${a < 0 ? "+" : "−"} ${Math.abs(a)}`;
  const matched = () => { const [tA, tB] = truth(); return Math.abs(+sA.value - tA) < 1e-9 && Math.abs(+sB.value - tB) < 1e-9; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = P[pk];
    const gr = G.frame(ctx, w, h, { xr: [-4, 4], yr: [-6, 6], xs: 1, ys: 2, xf: (v) => n(v, 0), yf: (v) => n(v, 0) });
    [s.a, s.b].forEach((x) => { ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.moveTo(gr.X(x), gr.y0); ctx.lineTo(gr.X(x), gr.y0 + gr.h); ctx.stroke(); ctx.restore(); });
    G.curve(ctx, gr, f, "#b9bbb2", { width: 6, N: 1200 });
    G.curve(ctx, gr, g, matched() ? C.forest : BLUE, { width: 2.2, N: 1200 });
  }
  function update() {
    const s = P[pk], A = +sA.value, B = +sB.value;
    $(".A-out").textContent = n(A, 2); $(".B-out").textContent = n(B, 2);
    $(".form").textContent = `색 곡선: ${n(A, 2)}/(${fac(s.a)}) + ${n(B, 2)}/(${fac(s.b)})`;
    if (matched()) { verdict.textContent = `겹쳤습니다! 적분하면 ${n(A, 2)} ln|${fac(s.a)}| + ${n(B, 2)} ln|${fac(s.b)}| + C`; verdict.className = "verdict good"; }
    else { verdict.textContent = ""; verdict.className = "verdict"; }
    draw();
  }
  $(".go-hint").addEventListener("click", () => {
    const s = P[pk], [tA, tB] = truth();
    const num = (x) => (s.p ? `${s.p === 1 ? "" : s.p}·(${x})` : "") + (s.q ? `${s.p ? " + " : ""}${s.q}` : "");
    hint.textContent = `A: (${fac(s.a)})를 가리고 x = ${s.a}를 넣으면 (${num(s.a)}) ÷ (${s.a} − (${s.b})) = ${n(tA, 2)}  ·  B: (${fac(s.b)})를 가리고 x = ${s.b}를 넣으면 (${num(s.b)}) ÷ (${s.b} − ${s.a}) = ${n(tB, 2)}`;
  });
  root.querySelectorAll(".presets .chip").forEach((b) => b.addEventListener("click", () => {
    pk = +b.dataset.p; root.querySelectorAll(".presets .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    sA.value = 0; sB.value = 0; hint.textContent = ""; update();
  }));
  [sA, sB].forEach((el) => el.addEventListener("input", update));
  update();
})();
