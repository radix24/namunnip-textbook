/* 카드: 짧은 글과 긴 글이 같은 주제인지 어떻게 알 수 있을까? — 코사인 유사도 vs 거리 */
(() => {
  const root = document.getElementById("card-aimath-cosine-doc");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon, A = NMAi;
  const $ = (s) => root.querySelector(s);
  const ins = ["a1", "a2", "b1", "b2"].map((k) => $(`.${k}`));
  const { ctx, size } = fit($("canvas"), () => draw());
  const vecs = () => [[+ins[0].value, +ins[1].value], [+ins[2].value, +ins[3].value]];
  function arrow(P, v, col, lab) {
    const x0 = P.X(0), y0 = P.Y(0), x1 = P.X(v[0]), y1 = P.Y(v[1]), a = Math.atan2(y1 - y0, x1 - x0);
    ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    if (Math.hypot(x1 - x0, y1 - y0) > 8) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 10 * Math.cos(a - 0.4), y1 - 10 * Math.sin(a - 0.4)); ctx.lineTo(x1 - 10 * Math.cos(a + 0.4), y1 - 10 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill(); }
    ctx.restore(); E.text(ctx, x1 + 6, y1 - 4, lab, col, "left", `700 13px ${NM.F.sans}`);
  }
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const [a, b] = vecs();
    const P = E.frame(ctx, size, { x0: 0, x1: 11, y0: 0, y1: 11, xt: [0, 5, 10], yt: [0, 5, 10], xlab: "축구", ylab: "요리", L: 28, B: 28 });
    const ta = Math.atan2(a[1], a[0]), tb = Math.atan2(b[1], b[0]);
    if (A.norm(a) && A.norm(b)) { ctx.save(); ctx.strokeStyle = E.PURPLE; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(P.X(0), P.Y(0), 34, -Math.max(ta, tb), -Math.min(ta, tb)); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.strokeStyle = C.ink3; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(P.X(a[0]), P.Y(a[1])); ctx.lineTo(P.X(b[0]), P.Y(b[1])); ctx.stroke(); ctx.restore();
    arrow(P, a, E.BLUE, "A"); arrow(P, b, C.warn, "B");
  }
  function update() {
    const [a, b] = vecs();
    ["a1", "a2", "b1", "b2"].forEach((k, i) => ($(`.${k}-out`).textContent = ins[i].value));
    const c = A.cos(a, b), d = A.dist(a, b);
    $(".say").textContent = A.norm(a) && A.norm(b) ? `같은 낱말끼리 곱한 합 ${A.dot(a, b)} · |A| = ${A.n(A.norm(a))}, |B| = ${A.n(A.norm(b))} · 코사인 유사도 ${c.toFixed(3)}(각 ${E.n((Math.acos(Math.min(1, c)) * 180) / Math.PI, 1)}°) · 거리(점선) ${A.n(d)}` : "영벡터는 방향이 없어 코사인 유사도를 정할 수 없습니다.";
    draw();
  }
  ins.forEach((el) => el.addEventListener("input", update));
  $(".go-long").addEventListener("click", () => { const a = [+ins[0].value || 1, +ins[1].value]; const k = Math.min(3, Math.floor(10 / Math.max(a[0], a[1], 1))); ins[2].value = a[0] * k; ins[3].value = a[1] * k; update(); });
  $(".go-diff").addEventListener("click", () => { ins[0].value = 5; ins[1].value = 1; ins[2].value = 1; ins[3].value = 6; update(); });
  update();
})();
