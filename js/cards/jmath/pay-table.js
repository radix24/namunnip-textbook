/* 카드: 밤에 일하는 시간이 늘면 하루 급여는 어떻게 늘어날까? — y = w(H − x) + 1.5wx (수업용 가정) */
(() => {
  const root = document.getElementById("card-jmath-pay-table");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const wIn = $(".w"), hIn = $(".h"), ntIn = $(".nt");
  const pay = (w, H, x) => w * (H - x) + 1.5 * w * x;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const w = +wIn.value, H = +hIn.value, x = +ntIn.value, top = Math.ceil((pay(w, 10, 10) * 1.05) / 50000) * 50000;
    const yt = []; for (let v = 0; v <= top; v += 50000) yt.push([v, `${v / 10000}만`]);
    const P = E.frame(ctx, size, { x0: 0, x1: 10, y0: 0, y1: top, xt: [0, 2, 4, 6, 8, 10], yt, xlab: "야간 시간 x", ylab: "하루 급여(원)", L: 44 });
    E.line(ctx, P, [[0, pay(w, H, 0)], [H, pay(w, H, H)]], E.BLUE, 2.6);
    for (let k = 0; k <= H; k++) E.dot(ctx, P, k, pay(w, H, k), E.BLUE, 3);
    E.dot(ctx, P, x, pay(w, H, x), C.warn, 6, `${E.n(pay(w, H, x))}원`, 8, -8);
  }
  function update() {
    if (+ntIn.value > +hIn.value) ntIn.value = hIn.value;
    const w = +wIn.value, H = +hIn.value, x = +ntIn.value;
    $(".w-out").textContent = E.n(w); $(".h-out").textContent = H; $(".nt-out").textContent = x;
    $(".say").textContent = `y = ${E.n(w)}(${H} − x) + ${E.n(1.5 * w)}x = ${E.n(w * H)} + ${E.n(0.5 * w)}x (0 ≤ x ≤ ${H}) · x = ${x}이면 ${E.n(pay(w, H, x))}원 · 야간 1시간마다 ${E.n(0.5 * w)}원씩 늘어남`;
    draw();
  }
  [wIn, hIn, ntIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
