/* 카드: 지구 위의 삼각형은 세 각의 합이 왜 180°보다 클까? — 구면삼각형, 구면 과잉 = 넓이 */
(() => {
  const root = document.getElementById("card-adgeo-sphere-triangle");
  if (!root) return;
  const { C } = NM;
  const S = NMSpace3, G = NMSphere;
  const $ = (s) => root.querySelector(s);
  const latIn = $(".lat"), lonIn = $(".lon");
  let V = [[60, -20], [-5, -40], [5, 40]], sel = 0; // [위도, 경도]
  const v = S.view($("canvas"), () => draw(), { center: [0, 0, 0], span: 2.6, yaw: -2.1, pitch: 0.35 });
  const P = () => V.map(([a, b]) => G.xyz(a, b));
  function draw() {
    const { ctx, size } = v; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    G.globe(v, 1, true);
    const [A, B, Cc] = P(), cols = ["#3f6fa3", C.warn, C.forest];
    [[A, B], [B, Cc], [Cc, A]].forEach(([p, q]) => G.curve(v, G.slerp(p, q, 80), "#7b5ea7", 3));
    [A, B, Cc].forEach((p, i) => { v.dot(p, G.front(v, p) ? cols[i] : "rgba(141,141,146,.7)", i === sel ? 7 : 5); v.label(p, "ABC"[i], cols[i], 8, -8, "left", `italic 700 14px ${NM.F.serif}`); });
  }
  function update() {
    const [A, B, Cc] = P(), a = G.arc(B, Cc), b = G.arc(Cc, A), c = G.arc(A, B);
    const An = G.angleAt(A, B, Cc), Bn = G.angleAt(B, Cc, A), Cn = G.angleAt(Cc, A, B), sum = An + Bn + Cn, E = sum - Math.PI;
    const d = (x) => G.deg(x).toFixed(1);
    $(".lat-out").textContent = latIn.value; $(".lon-out").textContent = lonIn.value;
    $(".say").textContent = `변(중심각) a = ${d(a)}°, b = ${d(b)}°, c = ${d(c)}° · 각 A = ${d(An)}°, B = ${d(Bn)}°, C = ${d(Cn)}° · 합 ${d(sum)}° · 구면 과잉 E = ${d(E)}° = ${S.n(E, 4)} rad = 넓이(단위구) · 구 겉넓이의 ${S.n((E / (4 * Math.PI)) * 100, 2)}%`;
    draw();
  }
  function selectV(i) { sel = i; root.querySelectorAll("[data-v]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.v === i))); latIn.value = V[i][0]; lonIn.value = V[i][1]; update(); }
  root.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => selectV(+b.dataset.v)));
  [latIn, lonIn].forEach((el) => el.addEventListener("input", () => { V[sel] = [+latIn.value, +lonIn.value]; update(); }));
  $(".go-big").addEventListener("click", () => { V = [[90, 0], [0, 0], [0, 90]]; selectV(sel); });
  $(".go-small").addEventListener("click", () => { V = [[12, 0], [0, -6], [0, 6]]; selectV(sel); });
  selectV(0);
})();
