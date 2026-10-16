/* 카드: 평면에서 참인 명제가 공간에서도 참일까? — 공간 명제 여섯 개의 판정과 반례 찾기 */
(() => {
  const root = document.getElementById("card-pmath-space-counter");
  if (!root) return;
  const { C } = NM;
  const S = NMSpace3, { add, mul } = S;
  const { BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const st = $(".st"), verdict = $(".verdict");
  const GRAY = "#9a9a96";
  /* 명제마다: 글, 참 여부, 그리기(t ∈ [0, π]), 결론이 성립하는지 */
  const D = (t) => [Math.cos(t), Math.sin(t), 0];
  const P = [
    { s: "한 직선에 수직인 서로 다른 두 직선은 평행하다.", truth: false,
      draw: (vw, t) => { vw.line([0, 0, -2.2], [0, 0, 2.2], GRAY, 3); vw.line([-2, 0, 1], [2, 0, 1], C.forest, 2.6); vw.line(mul(D(t), -2).map((v, i) => v + [0, 0, -1][i]), mul(D(t), 2).map((v, i) => v + [0, 0, -1][i]), BLUE, 2.6); },
      ok: (t) => Math.abs(Math.sin(t)) < 1e-9 },
    { s: "한 평면에 수직인 서로 다른 두 직선은 평행하다.", truth: true,
      draw: (vw, t) => { plane(vw, [0, 0, 0], [1, 0, 0], [0, 1, 0]); vw.line([-1, -1, 0], [-1, -1, 2.4], C.forest, 2.6); const q = [1.4 * Math.cos(t), 1.4 * Math.sin(t), 0]; vw.line(q, add(q, [0, 0, 2.4]), BLUE, 2.6); },
      ok: () => true },
    { s: "한 직선에 평행한 서로 다른 두 평면은 평행하다.", truth: false,
      draw: (vw, t) => { vw.line([-2.4, 0, 0], [2.4, 0, 0], GRAY, 3); plane(vw, [0, 0, 1.1], [1, 0, 0], [0, 1, 0], C.forest); plane(vw, [0, 0, -1.1], [1, 0, 0], [0, Math.cos(t), Math.sin(t)], BLUE); },
      ok: (t) => Math.abs(Math.sin(t)) < 1e-9 },
    { s: "한 평면에 평행한 서로 다른 두 직선은 평행하다.", truth: false,
      draw: (vw, t) => { plane(vw, [0, 0, 0], [1, 0, 0], [0, 1, 0]); vw.line([-2, 0, 0.9], [2, 0, 0.9], C.forest, 2.6); vw.line(add([0, 0, 1.8], mul(D(t), -2)), add([0, 0, 1.8], mul(D(t), 2)), BLUE, 2.6); },
      ok: (t) => Math.abs(Math.sin(t)) < 1e-9 },
    { s: "한 평면에 수직인 서로 다른 두 평면은 평행하다.", truth: false,
      draw: (vw, t) => { plane(vw, [0, 0, 0], [1, 0, 0], [0, 1, 0]); plane(vw, [-1.2, 0, 1.1], [0, 1, 0], [0, 0, 1], C.forest, 1.1); const dd = D(t + Math.PI / 2); plane(vw, [1.2, 0, 1.1], dd, [0, 0, 1], BLUE, 1.1); },
      ok: (t) => Math.abs(Math.sin(t)) < 1e-9 },
    { s: "한 직선에 수직인 서로 다른 두 평면은 평행하다.", truth: true,
      draw: (vw, t) => { vw.line([0, 0, -2.2], [0, 0, 2.2], GRAY, 3); plane(vw, [0, 0, -1], [1, 0, 0], [0, 1, 0], C.forest); plane(vw, [0, 0, -0.6 + 2.2 * t / Math.PI], [1, 0, 0], [0, 1, 0], BLUE); },
      ok: () => true },
  ];
  let sk = 0, judged = false;
  const vw = S.view($("canvas"), () => draw(), { center: [0, 0, 0.2], span: 6.6, yaw: -2.2, pitch: 0.38 });
  function plane(v, c, u, w2, col = GRAY, b = 1.8) { v.poly(v.quad(c, u, w2, 1.9, b), col, col, col === GRAY ? 0.16 : 0.22, 1); }
  const tval = () => +st.value * Math.PI / 180;

  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    P[sk].draw(vw, tval());
  }
  function update() {
    const p = P[sk], t = tval(), ok = p.ok(t);
    $(".stmt").textContent = `공간에서 ${p.s}`;
    $(".t-out").textContent = sk === 1 || sk === 5 ? "위치" : `${st.value}°`;
    const s = $(".status");
    s.textContent = ok ? "조건 ✓ · 결론 ✓ (두 도형이 평행)" : "조건 ✓ · 결론 ✗ — 반례입니다!";
    s.style.color = ok ? "" : "var(--warn)";
    draw();
  }
  root.querySelectorAll(".which .chip").forEach((b) => b.addEventListener("click", () => {
    sk = +b.dataset.s; root.querySelectorAll(".which .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    judged = false; verdict.textContent = ""; verdict.className = "verdict"; st.value = 0;
    root.querySelectorAll(".judge .chip").forEach((x) => x.setAttribute("aria-pressed", "false"));
    update();
  }));
  root.querySelectorAll(".judge .chip").forEach((b) => b.addEventListener("click", () => {
    const say = b.dataset.j === "1", right = say === P[sk].truth;
    root.querySelectorAll(".judge .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    verdict.textContent = right ? (P[sk].truth ? "맞습니다. 슬라이더를 끝까지 움직여도 결론이 깨지지 않습니다." : "맞습니다. 슬라이더로 반례를 직접 찾아보세요.")
      : (P[sk].truth ? "다시 생각해 보세요. 슬라이더를 움직여도 결론이 깨지지 않습니다." : "다시 생각해 보세요. 슬라이더를 움직이면 결론이 깨지는 순간이 있습니다.");
    verdict.className = "verdict " + (right ? "good" : "bad"); judged = true;
  }));
  st.addEventListener("input", update);
  update();
})();
