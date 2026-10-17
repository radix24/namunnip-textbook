/* 카드: 장비를 며칠 이상 쓰면 빌리는 것보다 사는 것이 나을까? — B + mx < rx (가상 가격) */
(() => {
  const root = document.getElementById("card-jmath-rent-or-buy");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const rIn = $(".r"), bIn = $(".b"), mIn = $(".m"), XM = 60;
  const { ctx, size } = fit($("canvas"), () => draw());
  const v = () => ({ r: +rIn.value, b: +bIn.value, m: +mIn.value });
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const { r, b, m } = v(), top = Math.ceil(Math.max(r * XM, b + m * XM) / 500000) * 500000;
    const yt = []; for (let y = 0; y <= top; y += top > 2000000 ? 1000000 : 500000) yt.push([y, `${y / 10000}만`]);
    const P = E.frame(ctx, size, { x0: 0, x1: XM, y0: 0, y1: top, xt: [0, 10, 20, 30, 40, 50, 60], yt, xlab: "사용 일수 x", ylab: "총비용(원)", L: 48 });
    if (r > m) { const x0 = b / (r - m); if (x0 < XM) { ctx.fillStyle = "rgba(116,171,102,.14)"; ctx.fillRect(P.X(x0), P.T, P.X(XM) - P.X(x0), P.h); E.text(ctx, P.X(x0) + 4, P.T + 12, "사는 편이 유리", C.forest); E.dot(ctx, P, x0, r * x0, C.ink, 5, `${x0.toFixed(2)}일`, 6, 14); } }
    P.clip(); E.fn(ctx, P, (x) => r * x, 0, XM, E.BLUE, 2.4); E.fn(ctx, P, (x) => b + m * x, 0, XM, C.warn, 2.4); ctx.restore();
    E.text(ctx, P.X(4), P.Y(r * 4) - 8, "빌리기", E.BLUE); E.text(ctx, P.X(XM) - 4, P.Y(b + m * XM) + 14, "사기", C.warn, "right");
  }
  function update() {
    const { r, b, m } = v();
    $(".r-out").textContent = E.n(r); $(".b-out").textContent = E.n(b); $(".m-out").textContent = E.n(m);
    $(".say").textContent = r > m ? `${E.n(b)} + ${E.n(m)}x < ${E.n(r)}x → ${E.n(r - m)}x > ${E.n(b)} → x > ${(b / (r - m)).toFixed(2)} → ${Math.floor(b / (r - m)) + 1}일 이상 쓰면 사는 것이 유리` : "관리비가 대여료 이상이라 아무리 오래 써도 사는 것이 유리해지지 않습니다.";
    draw();
  }
  [rIn, bIn, mIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
