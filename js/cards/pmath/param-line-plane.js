/* 카드: 매개변수 하나는 직선을, 둘은 평면을 그릴까? — p = a + t·u, p = a + s·u + t·v */
(() => {
  const root = document.getElementById("card-pmath-param-line-plane");
  if (!root) return;
  const { C, F } = NM;
  const S = NMSpace3, { add, sub, mul, cross, dot } = S;
  const { n, BLUE, PURPLE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const st = $(".st"), ss = $(".ss");
  const A = [1, -1, 1], U = [1, 1, 0], V = [0, 1, 1], N = cross(U, V);
  let mode = "line", trail = [];
  const vw = S.view($("canvas"), () => draw(), { center: [0.8, 0, 1], span: 9, yaw: -2.25, pitch: 0.4 });
  const point = () => (mode === "line" ? add(A, mul(U, +st.value)) : add(A, add(mul(U, +ss.value), mul(V, +st.value))));
  const fmt = (p) => `(${p.map((x) => n(x, 2)).join(", ")})`;

  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    vw.axes(4, 2.5);
    trail.forEach((p) => vw.dot(p, mode === "line" ? C.amber : "#c9b16a", 2.2));
    vw.dot(A, C.ink, 5); vw.label(A, "A", C.ink, -10, -8);
    vw.line(A, add(A, U), C.forest, 2.6); vw.label(add(A, U), "u", C.forest, 8, -6, "left", `italic 700 13px ${F.serif}`);
    if (mode === "plane") {
      vw.line(A, add(A, V), BLUE, 2.6); vw.label(add(A, V), "v", BLUE, 8, -6, "left", `italic 700 13px ${F.serif}`);
      const nn = mul(N, 1 / S.len(N));
      vw.line(A, add(A, mul(nn, 1.5)), PURPLE, 2.2); vw.label(add(A, mul(nn, 1.5)), "n = u × v", PURPLE, 8, -6, "left", `600 11.5px ${F.sans}`);
    }
    const P = point();
    vw.line(A, P, C.warn, 1.4, [4, 3]);
    vw.dot(P, C.warn, 6); vw.label(P, "P", C.warn, 8, 10);
  }
  function update(record) {
    const P = point();
    if (record) { trail.push(P); if (trail.length > 2500) trail.splice(0, 500); }
    $(".t-out").textContent = n(+st.value, 2); $(".s-out").textContent = n(+ss.value, 2);
    $(".n-p").textContent = fmt(P);
    $(".n-n").textContent = mode === "plane" ? fmt(N) : "—";
    $(".n-c").textContent = mode === "plane" ? n(dot(N, sub(P, A)), 4) : "—";
    draw();
  }
  root.querySelectorAll(".mode .chip").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m; root.querySelectorAll(".mode .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".sw").style.visibility = mode === "plane" ? "visible" : "hidden"; trail = []; update(false);
  }));
  $(".go-clear").addEventListener("click", () => { trail = []; update(false); });
  [st, ss].forEach((el) => el.addEventListener("input", () => update(true)));
  $(".sw").style.visibility = "hidden";
  update(false);
})();
