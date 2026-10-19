/* 카드: 어떤 격자에서 보면 행렬이 늘이기만 할까? — 표준 격자와 고유벡터 격자의 변환 비교, A = PDP⁻¹ */
(() => {
  const root = document.getElementById("card-adalg-diag-grid");
  if (!root) return;
  const { C, fit } = NM;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  const AS = [[[2, 1], [1, 2]], [[3, 1], [0, 2]], [[1, 2], [2, 1]], [[1.5, 0.5], [1, 1]]];
  let A = AS[0], mode = "std";
  const sIn = $(".s");
  const { ctx, size } = fit($("canvas"), () => draw());
  const mix = (s) => A.map((r, i) => r.map((x, j) => (i === j ? 1 - s : 0) + s * x));
  const PD = () => { const e = L.eig2(A); return { P: L.T(e.vecs), D: [[e.vals[0], 0], [0, e.vals[1]]], e }; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const box = { x: 0, y: 0, w, h }, pl = L.plane(ctx, box, 4), s = +sIn.value / 100, M = mix(s), { P, e } = PD();
    const B = mode === "std" ? L.eye(2) : P; // 격자의 기저
    L.grid(ctx, box, pl, L.mul(M, B), { K: 12, square: true, axes: false });
    const cols = L.T(L.mul(M, B));
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...cols[0]), C.warn, 3);
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...cols[1]), C.forest, 3);
    L.shape(ctx, pl, L.HOUSE, M, "rgba(224,160,42,.3)", C.amber);
    if (mode === "eig") {
      ctx.fillStyle = C.ink2; ctx.font = `600 12px ${NM.F.sans}`; ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(`빨강 방향 ${L.n(1 - s + s * e.vals[0], 2)}배, 초록 방향 ${L.n(1 - s + s * e.vals[1], 2)}배`, 8, 8);
    }
  }
  function update() {
    $(".s-out").textContent = sIn.value;
    const { P, D } = PD(), Pi = L.inv(P), f = (x) => L.n(x, 3);
    const chk = L.mul(L.mul(P, D), Pi);
    $(".pdp").innerHTML = `A = P ${L.table(P, { f })} D ${L.table(D, { f })} P⁻¹ ${L.table(Pi, { f })} → PDP⁻¹ = ${L.table(chk, { f })}`;
    draw();
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.g; root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); draw();
  }));
  $(".pick").addEventListener("change", () => { A = AS[+$(".pick").value]; update(); });
  sIn.addEventListener("input", update);
  update();
})();
