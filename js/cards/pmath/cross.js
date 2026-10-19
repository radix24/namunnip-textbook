/* 카드: 두 벡터에 모두 수직인 벡터는 어느 쪽을 향하고, 길이는 얼마일까? — 외적 a × b */
(() => {
  const root = document.getElementById("card-pmath-cross");
  if (!root) return;
  const { C, F } = NM;
  const S = NMSpace3, { add, cross, dot, len } = S;
  const { n, BLUE, PURPLE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sp = $(".sp"), sb = $(".sb"), se = $(".se");
  let order = "ab";
  const vw = S.view($("canvas"), () => draw(), { center: [0.6, 0.6, 0.9], span: 8, yaw: -2.3, pitch: 0.42 });
  const A = [2, 0, 0];
  const vecB = () => { const p = +sp.value * Math.PI / 180, e = +se.value * Math.PI / 180, b = +sb.value; return [b * Math.cos(p) * Math.cos(e), b * Math.sin(p) * Math.cos(e), b * Math.sin(e)]; };
  const fmt = (v) => `(${v.map((x) => n(x, 2)).join(", ")})`;

  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    vw.axes(3.4, 1.4);
    const B = vecB(), X = order === "ab" ? cross(A, B) : cross(B, A);
    vw.poly([[0, 0, 0], A, add(A, B), B], C.amber, C.amber, 0.25, 1);
    vw.line([0, 0, 0], A, C.forest, 3); vw.label(A, "a", C.forest, 8, -6, "left", `italic 700 14px ${F.serif}`);
    vw.line([0, 0, 0], B, BLUE, 3); vw.label(B, "b", BLUE, 8, -6, "left", `italic 700 14px ${F.serif}`);
    const L = len(X);
    if (L > 1e-9) {
      vw.line([0, 0, 0], X, C.warn, 3.4);
      vw.dot(X, C.warn, 5);
      vw.label(X, order === "ab" ? "a × b" : "b × a", C.warn, 8, -6, "left", `italic 700 13px ${F.serif}`);
    } else vw.label([0, 0, 0], "외적 = 영벡터", C.warn, 10, -14, "left", `600 12px ${F.sans}`);
    vw.dot([0, 0, 0], C.ink, 3.5);
  }
  function update() {
    const B = vecB(), X = order === "ab" ? cross(A, B) : cross(B, A);
    $(".p-out").textContent = `${sp.value}°`; $(".b-out").textContent = n(+sb.value, 1); $(".e-out").textContent = `${se.value}°`;
    const area = len(A) * len(B) * Math.sin(Math.acos(Math.max(-1, Math.min(1, dot(A, B) / (len(A) * len(B))))));
    $(".n-c").textContent = fmt(X);
    $(".n-a").textContent = `${n(len(X), 3)} · ${n(area, 3)}`;
    $(".n-d").textContent = `${n(dot(X, A), 3)}, ${n(dot(X, B), 3)}`;
    draw();
  }
  root.querySelectorAll(".presets .chip").forEach((b) => b.addEventListener("click", () => {
    order = b.dataset.o; root.querySelectorAll(".presets .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update();
  }));
  [sp, sb, se].forEach((el) => el.addEventListener("input", update));
  update();
})();
