/* 카드: 뒤틀린 그림을 제자리로 되돌리는 행렬은? — 역행렬 입력, det = 0이면 되돌릴 수 없다고 판정 */
(() => {
  const root = document.getElementById("card-adalg-undo");
  if (!root) return;
  const { C, fit } = NM;
  const L = NMLin;
  const { BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const R90 = [[0, -1], [1, 0]], SH = [[1, 1], [0, 1]];
  const LV = [
    { A: [[1, 2], [0, 1]], say: "가로로 밀었습니다." },
    { A: R90, say: "90° 돌렸습니다." },
    { A: [[2, 0], [0, 0.5]], say: "가로로 늘이고 세로로 줄였습니다." },
    { A: [[2, 1], [1, 1]], say: "알 수 없는 변환입니다." },
    { A: L.mul(SH, R90), say: "90° 돌린 다음 가로로 밀었습니다." },
    { A: [[1, 2], [0.5, 1]], say: "알 수 없는 변환입니다." },
  ];
  const ks = [...root.querySelectorAll("[data-k]")], verdict = $(".verdict"), next = $(".go-next");
  let lv = 0, solved = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const mine = () => { const v = ks.map((el) => +el.value || 0); return [[v[0], v[1]], [v[2], v[3]]]; };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pl = L.plane(ctx, { x: 0, y: 0, w, h }, 3.4), A = LV[lv].A;
    ctx.save(); ctx.setLineDash([5, 4]); L.shape(ctx, pl, L.HOUSE, null, null, C.ink3); ctx.restore();
    L.shape(ctx, pl, L.HOUSE, A, "rgba(224,160,42,.3)", C.amber);
    L.shape(ctx, pl, L.HOUSE, L.mul(mine(), A), null, BLUE);
  }
  const win = (msg) => { solved = true; verdict.textContent = msg; verdict.className = "verdict good"; next.disabled = lv === LV.length - 1; };
  function update() {
    $(".lv").textContent = `${lv + 1} / ${LV.length} · ${LV[lv].say}`;
    const A = LV[lv].A, P = L.mul(mine(), A);
    if (!solved && Math.abs(L.det(A)) > 1e-9 && P.every((r, i) => r.every((x, j) => Math.abs(x - (i === j ? 1 : 0)) < 1e-9)))
      win(`제자리! 내 행렬 × A = I. det A = ${L.frac(L.det(A))}` + (lv === 4 ? " · 밀기를 먼저 되돌리고 회전을 나중에 되돌린 것과 같습니다." : ""));
    draw();
  }
  function load() { solved = false; ks.forEach((el, i) => (el.value = [1, 0, 0, 1][i])); $(".hint").textContent = ""; verdict.textContent = ""; verdict.className = "verdict"; next.disabled = true; update(); }
  $(".go-no").addEventListener("click", () => {
    if (solved) return;
    const d = L.det(LV[lv].A);
    if (Math.abs(d) < 1e-9) win("맞습니다. det A = 0이라 집이 선분으로 납작해졌습니다. 납작해진 점들이 원래 어디서 왔는지 알 수 없습니다.");
    else { verdict.textContent = `아닙니다. det A = ${L.frac(d)} ≠ 0이라 되돌릴 수 있습니다.`; verdict.className = "verdict bad"; }
  });
  $(".go-hint").addEventListener("click", () => {
    const A = LV[lv].A, d = L.det(A);
    $(".hint").textContent = `A = ${L.matStr(A)}, det A = ${L.frac(d)}` + (Math.abs(d) > 1e-9 ? ` → A⁻¹ = (1/${L.frac(d)})·[${L.frac(A[1][1])}, ${L.frac(-A[0][1])} ; ${L.frac(-A[1][0])}, ${L.frac(A[0][0])}]` : "");
  });
  next.addEventListener("click", () => { if (lv < LV.length - 1) { lv++; load(); } });
  ks.forEach((el) => el.addEventListener("input", update));
  load();
})();
