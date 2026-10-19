/* 카드: 선분 밖에서도 선분을 m : n으로 나눌 수 있을까? — 공간의 내분점·외분점 */
(() => {
  const root = document.getElementById("card-pmath-section3d");
  if (!root) return;
  const { C, F } = NM;
  const S = NMSpace3, { add, sub, mul, len } = S;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sm = $(".sm"), sn = $(".sn");
  const A = [-2, -1, 2], B = [2, 2, 0];
  let ext = false;
  const vw = S.view($("canvas"), () => draw(), { center: [0, 0, 0.6], span: 11, yaw: -2.3, pitch: 0.45 });
  const point = () => { const m = +sm.value, k = +sn.value; if (ext && m === k) return null; return ext ? mul(sub(mul(B, m), mul(A, k)), 1 / (m - k)) : mul(add(mul(B, m), mul(A, k)), 1 / (m + k)); };
  const fmt = (p) => `(${p.map((v) => n(v, 2)).join(", ")})`;

  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    vw.axes(4, 3);
    const P = point();
    // 직선 AB (연장선 점선)
    vw.line(add(A, mul(sub(B, A), -2)), add(A, mul(sub(B, A), 3)), C.rule, 1, [4, 4]);
    vw.line(A, B, C.ink, 2.6);
    vw.dot(A, C.ink, 5); vw.label(A, "A", C.ink, -10, -8); vw.dot(B, C.ink, 5); vw.label(B, "B", C.ink, 8, -8);
    if (P) {
      [[P[0], 0, 0], [0, P[1], 0], [0, 0, P[2]]].forEach((q) => vw.line(P, q, BLUE, 1, [3, 3]));
      vw.dot(P, C.warn, 6.5); vw.label(P, `P${fmt(P)}`, C.warn, 9, 12, "left", `600 11.5px ${F.mono}`);
    }
  }
  function update() {
    const m = +sm.value, k = +sn.value, P = point();
    $(".m-out").textContent = m; $(".n-out").textContent = k;
    if (!P) { $(".f").textContent = "m = n이면 외분점이 없습니다 (분모가 0)."; ["ap", "pb", "r"].forEach((c) => { $(`.n-${c}`).textContent = "—"; }); draw(); return; }
    $(".f").textContent = ext ? `P = (${m}B − ${k}A) / (${m} − ${k}) = ${fmt(P)}` : `P = (${m}B + ${k}A) / (${m} + ${k}) = ${fmt(P)}`;
    const ap = len(sub(P, A)), pb = len(sub(B, P));
    $(".n-ap").textContent = n(ap, 3); $(".n-pb").textContent = n(pb, 3); $(".n-r").textContent = `${n(ap / pb, 3)} : 1 (= ${m}/${k} : 1)`;
    draw();
  }
  root.querySelectorAll(".kind .chip").forEach((b) => b.addEventListener("click", () => {
    ext = b.dataset.e === "1"; root.querySelectorAll(".kind .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update();
  }));
  [sm, sn].forEach((el) => el.addEventListener("input", update));
  update();
})();
