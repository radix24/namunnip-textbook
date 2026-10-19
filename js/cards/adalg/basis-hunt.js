/* 카드: 비스듬한 두 방향만으로 목표점까지 안내할 수 있을까? — 기저 좌표 맞히기 */
(() => {
  const root = document.getElementById("card-adalg-basis-hunt");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { label, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const c1 = $(".c1"), c2 = $(".c2"), verdict = $(".verdict"), next = $(".go-next");
  /* 단계: 기저와 목표(표준 좌표). 답은 모두 0.5 간격 */
  const LV = [
    { b1: [1, 1], b2: [-1, 1], T: [1, 3] },
    { b1: [2, 1], b2: [-1, 1], T: [4, -1] },
    { b1: [2, 1], b2: [-1, 1], T: [1.5, 3] },
    { b1: [1, 2], b2: [2, -1], T: [0, 5] },
  ];
  let lv = 0, solved = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const cur = () => { const q = LV[lv]; return L.add(L.scl(q.b1, +c1.value), L.scl(q.b2, +c2.value)); };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const box = { x: 0, y: 0, w, h }, pl = L.plane(ctx, box, 5), q = LV[lv];
    L.grid(ctx, box, pl, L.T([q.b1, q.b2]), { K: 10, square: false });
    ctx.fillStyle = "rgba(224,160,42,.3)"; ctx.beginPath(); ctx.arc(...pl.P(...q.T), 12, 0, 7); ctx.fill();
    dot(ctx, ...pl.P(...q.T), C.amber, 6); label(ctx, "T", pl.P(...q.T)[0] + 10, pl.P(...q.T)[1] - 10, C.amber, "left", `italic 700 13px ${F.serif}`);
    const m = L.scl(q.b1, +c1.value), p = cur();
    NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...m), C.warn, 2.2); NMPm.arrow(ctx, ...pl.P(...m), ...pl.P(...p), C.forest, 2.2);
    dot(ctx, ...pl.P(...p), BLUE, 5);
  }
  function update() {
    const q = LV[lv], p = cur(), f = (v) => `(${v.map((x) => L.frac(x)).join(", ")})`;
    $(".c1-out").textContent = L.frac(+c1.value); $(".c2-out").textContent = L.frac(+c2.value);
    $(".lv").textContent = `${lv + 1} / ${LV.length} · b₁ = ${f(q.b1)}, b₂ = ${f(q.b2)} · 목표 T = ${f(q.T)} · 지금 ${f(p)}`;
    if (!solved && Math.hypot(p[0] - q.T[0], p[1] - q.T[1]) < 1e-9) { solved = true; verdict.textContent = `도착! 기저 좌표 (${L.frac(+c1.value)}, ${L.frac(+c2.value)})`; verdict.className = "verdict good"; next.disabled = lv === LV.length - 1; }
    draw();
  }
  function load() { solved = false; c1.value = 0; c2.value = 0; verdict.textContent = ""; verdict.className = "verdict"; $(".calc").textContent = ""; next.disabled = true; update(); }
  $(".go-show").addEventListener("click", () => {
    const q = LV[lv], B = L.T([q.b1, q.b2]), Bi = L.inv(B), c = L.mv(Bi, q.T);
    $(".calc").textContent = `B⁻¹ = ${L.matStr(Bi)} → B⁻¹T = (${c.map((x) => L.frac(x)).join(", ")})`;
  });
  next.addEventListener("click", () => { if (lv < LV.length - 1) { lv++; load(); } });
  [c1, c2].forEach((el) => el.addEventListener("input", update));
  load();
})();
