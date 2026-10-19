/* 카드: 불량률 2%인 공장에서 10개를 뽑아 검사하면 불량품이 하나도 안 나올 가능성은? — 상대도수가 (1 − p)ⁿ에 다가감 (가상 검사) */
(() => {
  const root = document.getElementById("card-jmath-defect-sample");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p"), nIn = $(".n");
  let hist = [], zero = 0;
  const prob = () => (1 - +pIn.value / 100) ** +nIn.value;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const T = Math.max(10, hist.length), P = E.frame(ctx, size, { x0: 0, x1: T, y0: 0, y1: 1, xt: [0, Math.round(T / 2), T], yt: [[0, "0"], [0.5, "0.5"], [1, "1"]], xlab: "검사 횟수", ylab: "'불량 0개' 비율", L: 34 });
    E.fn(ctx, P, () => prob(), 0, T, C.warn, 1.6, [6, 4]);
    E.text(ctx, P.X(T) - 4, P.Y(prob()) - 6, `계산한 확률 ${prob().toFixed(3)}`, C.warn, "right");
    if (hist.length) E.line(ctx, P, hist.map((v, i) => [i + 1, v]), E.BLUE, 2);
  }
  function run(k) {
    const p = +pIn.value / 100, n = +nIn.value;
    for (let t = 0; t < k; t++) { let bad = 0; for (let i = 0; i < n; i++) if (Math.random() < p) bad++; if (!bad) zero++; hist.push(zero / (hist.length + 1)); }
    update();
  }
  function update() {
    $(".p-out").textContent = (+pIn.value).toFixed(1); $(".n-out").textContent = nIn.value;
    const p = +pIn.value / 100, n = +nIn.value, need = Math.ceil(Math.log(0.1) / Math.log(1 - p));
    $(".say").textContent = `계산: (1 − ${p})^${n} = ${prob().toFixed(4)} · 검사 ${hist.length}번 중 '불량 0개' ${zero}번(${hist.length ? ((zero / hist.length) * 100).toFixed(1) : 0}%) · 불량을 90% 이상 찾으려면 ${need}개 이상 뽑아야 함`;
    draw();
  }
  $(".go-1").addEventListener("click", () => run(1));
  $(".go-100").addEventListener("click", () => run(100));
  $(".go-reset").addEventListener("click", () => { hist = []; zero = 0; update(); });
  [pIn, nIn].forEach((x) => x.addEventListener("input", () => { hist = []; zero = 0; update(); }));
  update();
})();
