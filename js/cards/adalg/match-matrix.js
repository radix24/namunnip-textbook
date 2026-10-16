/* 카드: 바뀐 그림만 보고 행렬을 알아낼 수 있을까? — 목표 모양에 맞는 2×2 행렬 입력 */
(() => {
  const root = document.getElementById("card-adalg-match-matrix");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { label, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const LV = [
    [[2, 0], [0, 1]], [[0, 1], [1, 0]], [[-1, 0], [0, 1]], [[1, 1], [0, 1]],
    [[0, -1], [1, 0]], [[1, -1], [1, 1]], [[0.5, 0], [1, 1.5]],
  ];
  const ks = [...root.querySelectorAll("[data-k]")], verdict = $(".verdict"), next = $(".go-next");
  let lv = 0, hint = false, solved = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const mine = () => { const v = ks.map((el) => +el.value || 0); return [[v[0], v[1]], [v[2], v[3]]]; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pl = L.plane(ctx, { x: 0, y: 0, w, h }, 3.4), T = LV[lv];
    L.shape(ctx, pl, L.HOUSE, null, "rgba(141,141,146,.25)", "rgba(141,141,146,.8)");
    ctx.save(); ctx.setLineDash([6, 4]); L.shape(ctx, pl, L.HOUSE, T, "rgba(224,160,42,.25)", C.amber); ctx.restore();
    L.shape(ctx, pl, L.HOUSE, mine(), null, BLUE);
    dot(ctx, ...pl.P(1, 0), C.warn, 4.5); dot(ctx, ...pl.P(0, 1), C.forest, 4.5);
    if (hint) {
      const e1 = L.mv(T, [1, 0]), e2 = L.mv(T, [0, 1]);
      NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...e1), C.warn, 2.4); NMPm.arrow(ctx, ...pl.P(0, 0), ...pl.P(...e2), C.forest, 2.4);
      label(ctx, `(${e1.map((x) => L.frac(x)).join(", ")})`, pl.P(...e1)[0] + 8, pl.P(...e1)[1] + 12, C.warn, "left", `600 12px ${F.mono}`);
      label(ctx, `(${e2.map((x) => L.frac(x)).join(", ")})`, pl.P(...e2)[0] + 8, pl.P(...e2)[1] - 12, C.forest, "left", `600 12px ${F.mono}`);
    }
  }
  function update() {
    $(".lv").textContent = `${lv + 1} / ${LV.length} · 회색 집을 주황 점선 모양으로 보내는 행렬은?`;
    const A = mine(), T = LV[lv], ok = A.every((r, i) => r.every((x, j) => Math.abs(x - T[i][j]) < 1e-9));
    if (ok && !solved) { solved = true; verdict.textContent = `맞았습니다! ${hint ? "(힌트 사용)" : ""} det = ${L.frac(L.det(T))}`; verdict.className = "verdict good"; next.disabled = lv === LV.length - 1; }
    draw();
  }
  function load() { hint = false; solved = false; ks.forEach((el, i) => (el.value = [1, 0, 0, 1][i])); verdict.textContent = ""; verdict.className = "verdict"; next.disabled = true; update(); }
  $(".go-hint").addEventListener("click", () => { hint = true; draw(); });
  next.addEventListener("click", () => { if (lv < LV.length - 1) { lv++; load(); } });
  ks.forEach((el) => el.addEventListener("input", update));
  load();
})();
