/* 카드: x¹⁰과 eˣ가 무한대까지 달리면 누가 이길까? — 예측한 뒤 로그 눈금 그래프로 확인 */
(() => {
  const root = document.getElementById("card-pmath-growth-race");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sx = $(".sx"), race = $(".race"), verdict = $(".verdict");
  /* 값 대신 log10 값을 다룬다(eˣ가 넘치지 않게). rank: 클수록 무한대에서 빠름 */
  const L10 = Math.LN10;
  const FN = {
    ln: { lg: (x) => Math.log10(Math.log(x)), name: "ln x", rank: 1 },
    sq: { lg: (x) => 0.5 * Math.log10(x), name: "√x", rank: 2 },
    sq2: { lg: (x) => 0.5 * Math.log10(x), name: "√x", rank: 2 },
    x2: { lg: (x) => 2 * Math.log10(x), name: "x²", rank: 4 },
    x3: { lg: (x) => 3 * Math.log10(x), name: "x³", rank: 5 },
    x10: { lg: (x) => 10 * Math.log10(x), name: "x¹⁰", rank: 6 },
    p2: { lg: (x) => x * Math.log10(2), name: "2ˣ", rank: 8 },
    ex: { lg: (x) => x / L10, name: "eˣ", rank: 9 },
  };
  const WHY = {
    "x10|ex": "로피탈을 10번 쓰면 10!/eˣ → 0", "x10|p2": "로피탈을 10번 쓰면 10!/((ln 2)¹⁰ 2ˣ) → 0",
    "ln|sq2": "(ln x)/√x → 로피탈 한 번이면 2/√x → 0", "ln|x3": "(ln x)/x³ → 1/(3x³) → 0", "ln|ex": "로그는 지수함수를 이길 수 없음",
    "x2|x3": "x²/x³ = 1/x → 0", "x10|x3": "x¹⁰/x³ = x⁷ → ∞", "sq|x3": "√x/x³ → 0", "x2|sq2": "x²/√x = x^1.5 → ∞", "x10|sq2": "x¹⁰/√x → ∞",
  };
  let fa = "x10", fb = "ex", guessed = null;
  const { ctx, size } = fit($("canvas"), () => draw());
  const sameFn = () => FN[fa].name === FN[fb].name;

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const X = +sx.value, A = FN[fa], B = FN[fb];
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i <= 100; i++) { const x = 1.05 + (X - 1.05) * i / 100; [A.lg(x), B.lg(x)].forEach((v) => { if (Number.isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }); }
    lo = Math.floor(Math.min(lo, 0)); hi = Math.ceil(hi + 0.3);
    const ys = Math.max(1, Math.ceil((hi - lo) / 6));
    const g = G.frame(ctx, w, h, { xr: [1, X], yr: [lo, hi], xs: X > 40 ? 10 : X > 15 ? 5 : X > 5 ? 1 : 0.5, ys, xf: (v) => n(v, 1), yf: (v) => `10^${n(v, 0)}` });
    G.curve(ctx, g, (x) => A.lg(Math.max(x, 1.0001)), C.forest, { width: 2.4, from: 1.05 });
    G.curve(ctx, g, (x) => B.lg(Math.max(x, 1.0001)), BLUE, { width: 2.4, from: 1.05 });
    G.tag(ctx, g, `A: ${A.name}`, g.x0 + 4, g.y0 + 10, C.forest);
    G.tag(ctx, g, `B: ${B.name}`, g.x0 + 4, g.y0 + 28, BLUE);
  }
  const sci = (lg) => {
    if (lg < 6 && lg >= -3) return n(10 ** lg, 3);
    const e = Math.floor(lg);
    return `${n(10 ** (lg - e), 2)}×10^${String(e).replace("-", "−")}`;
  };
  function update() {
    const X = +sx.value, A = FN[fa], B = FN[fb], la = A.lg(X), lb = B.lg(X);
    $(".x-out").textContent = n(X, 1);
    $(".n-a").textContent = sci(la); $(".n-b").textContent = sci(lb);
    $(".n-r").textContent = sci(la - lb);
    draw();
  }
  function reveal() {
    const A = FN[fa], B = FN[fb];
    const win = A.rank > B.rank ? "A" : A.rank < B.rank ? "B" : "=";
    const key = `${fa}|${fb}`, why = WHY[key] || "";
    if (win === "=") verdict.textContent = "두 선수가 같은 함수입니다. 다른 선수를 고르세요.";
    else verdict.textContent = `${guessed === win ? "예측 성공! " : "예측과 다릅니다. "}${win === "A" ? A.name : B.name}이(가) 이깁니다.${why ? ` (${why})` : ""}`;
    verdict.className = "verdict " + (guessed === win ? "good" : "bad");
  }
  function relock() {
    guessed = null; race.classList.add("predict-lock"); verdict.textContent = sameFn() ? "두 선수가 같은 함수입니다. 다른 선수를 고르세요." : ""; verdict.className = "verdict";
    root.querySelectorAll(".guess .chip").forEach((b) => b.setAttribute("aria-pressed", "false"));
    update();
  }
  G.chips(root, ".runner.a .chip", (b) => { fa = b.dataset.f; relock(); });
  G.chips(root, ".runner.b .chip", (b) => { fb = b.dataset.f; relock(); });
  root.querySelectorAll(".guess .chip").forEach((b) => b.addEventListener("click", () => {
    if (sameFn()) return;
    guessed = b.dataset.g;
    root.querySelectorAll(".guess .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    race.classList.remove("predict-lock"); reveal(); update();
  }));
  sx.addEventListener("input", update);
  relock();
})();
