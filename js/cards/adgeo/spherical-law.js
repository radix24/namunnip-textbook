/* 카드: 구면삼각형에서도 코사인법칙이 성립할까? — A를 북극에 두고 잰 값과 공식 비교 */
(() => {
  const root = document.getElementById("card-adgeo-spherical-law");
  if (!root) return;
  const { C } = NM;
  const S = NMSpace3, G = NMSphere;
  const $ = (s) => root.querySelector(s);
  const bIn = $(".b"), cIn = $(".c"), AIn = $(".A");
  const v = S.view($("canvas"), () => draw(), { center: [0, 0, 0], span: 2.6, yaw: -2.3, pitch: 0.55 });
  /* A = 북극, B = 경도 0에서 북극으로부터 c, C = 경도 A에서 북극으로부터 b */
  const pts = () => { const b = +bIn.value, c = +cIn.value, A = +AIn.value; return [[0, 0, 1], G.xyz(90 - c, 0), G.xyz(90 - b, A)]; };
  function draw() {
    const { ctx, size } = v; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    G.globe(v, 1, true);
    const [A, B, Cc] = pts(), cols = ["#3f6fa3", C.warn, C.forest];
    [[B, Cc, "a"], [Cc, A, "b"], [A, B, "c"]].forEach(([p, q, nm]) => { const arcPts = G.slerp(p, q, 80); G.curve(v, arcPts, "#7b5ea7", 3); const mid = arcPts[40]; if (G.front(v, mid)) v.label(mid, nm, "#7b5ea7", 6, 4, "left", `italic 700 14px ${NM.F.serif}`); });
    [A, B, Cc].forEach((p, i) => { v.dot(p, G.front(v, p) ? cols[i] : "rgba(141,141,146,.7)", 5); v.label(p, "ABC"[i], cols[i], 8, -8, "left", `italic 700 14px ${NM.F.serif}`); });
  }
  function update() {
    const b = G.rad(+bIn.value), c = G.rad(+cIn.value), A = G.rad(+AIn.value);
    $(".b-out").textContent = bIn.value; $(".c-out").textContent = cIn.value; $(".A-out").textContent = AIn.value;
    const [PA, PB, PC] = pts();
    const meas = G.arc(PB, PC);
    const sph = Math.acos(Math.max(-1, Math.min(1, Math.cos(b) * Math.cos(c) + Math.sin(b) * Math.sin(c) * Math.cos(A))));
    const pl = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(A));
    const d = (x) => G.deg(x).toFixed(2) + "°";
    $(".m-a").textContent = d(meas); $(".s-a").textContent = d(sph);
    $(".p-a").textContent = `${d(pl)} (오차 ${S.n(((pl - meas) / meas) * 100, 2)}%)`;
    const B = G.angleAt(PB, PC, PA), Cn = G.angleAt(PC, PA, PB);
    const r = [Math.sin(meas) / Math.sin(A), Math.sin(b) / Math.sin(B), Math.sin(c) / Math.sin(Cn)].map((x) => x.toFixed(4));
    $(".say").textContent = `각 B = ${G.deg(B).toFixed(1)}°, C = ${G.deg(Cn).toFixed(1)}° · 사인법칙 sin a/sin A = ${r[0]}, sin b/sin B = ${r[1]}, sin c/sin C = ${r[2]} · 세 각의 합 ${G.deg(A + B + Cn).toFixed(1)}°`;
    draw();
  }
  [bIn, cIn, AIn].forEach((el) => el.addEventListener("input", update));
  const set = (b, c) => { bIn.value = b; cIn.value = c; update(); };
  $(".go-small").addEventListener("click", () => set(2, 2));
  $(".go-big").addEventListener("click", () => set(90, 90));
  update();
})();
