/* 카드: 회전, 대칭, 닮음 중 어느 것으로 목표 모양을 만들까? — 세 변환의 행렬과 목표 맞히기 */
(() => {
  const root = document.getElementById("card-adalg-transform-target");
  if (!root) return;
  const { C, fit } = NM;
  const L = NMLin;
  const { rad, seg, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const rot = (t) => { const r = rad(t); return [[Math.cos(r), -Math.sin(r)], [Math.sin(r), Math.cos(r)]]; };
  const ref = (p) => { const r = 2 * rad(p); return [[Math.cos(r), Math.sin(r)], [Math.sin(r), -Math.cos(r)]]; };
  const dil = (k) => [[k, 0], [0, k]];
  const KIND = {
    rot: { name: "회전각 θ", min: -180, max: 180, step: 15, v: 0, unit: "°", f: rot },
    ref: { name: "대칭축 각 φ", min: 0, max: 165, step: 15, v: 90, unit: "°", f: ref },
    dil: { name: "닮음비 k", min: -2, max: 2, step: 0.25, v: 1, unit: "", f: dil },
  };
  const LV = [
    { T: rot(90), say: "회전" }, { T: ref(45), say: "대칭" }, { T: dil(1.5), say: "닮음" },
    { T: ref(0), say: "?" }, { T: rot(180), say: "?" }, { T: ref(120), say: "?" }, { T: rot(-45), say: "?" },
  ];
  let kind = "rot", lv = 0, solved = false;
  const p = $(".p"), next = $(".go-next"), verdict = $(".verdict");
  const { ctx, size } = fit($("canvas"), () => draw());
  const cur = () => KIND[kind].f(+p.value);
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pl = L.plane(ctx, { x: 0, y: 0, w, h }, 3.2);
    if (kind === "ref") { const r = rad(+p.value), u = [Math.cos(r), Math.sin(r)]; seg(ctx, ...pl.P(...L.scl(u, -5)), ...pl.P(...L.scl(u, 5)), C.ink2, 1.4, [6, 4]); }
    L.shape(ctx, pl, L.HOUSE, null, "rgba(141,141,146,.25)", "rgba(141,141,146,.8)");
    ctx.save(); ctx.setLineDash([6, 4]); L.shape(ctx, pl, L.HOUSE, LV[lv].T, "rgba(224,160,42,.25)", C.amber); ctx.restore();
    L.shape(ctx, pl, L.HOUSE, cur(), null, BLUE);
  }
  function update() {
    const k = KIND[kind], A = cur(), T = LV[lv].T;
    $(".p-out").textContent = L.n(+p.value, 2) + k.unit;
    $(".mat").textContent = `행렬 [${A.map((r) => r.map((x) => L.n(x, 3)).join(", ")).join(" ; ")}] · det = ${L.n(L.det(A), 3)}`;
    $(".lv").textContent = `${lv + 1} / ${LV.length} · 목표 종류: ${LV[lv].say}`;
    const ok = A.every((r, i) => r.every((x, j) => Math.abs(x - T[i][j]) < 1e-6));
    if (ok && !solved) {
      solved = true; next.disabled = lv === LV.length - 1;
      verdict.textContent = "맞았습니다!" + (lv === 4 ? " 180° 회전은 닮음비 −1인 닮음변환과 같습니다. 다른 방법으로도 만들어 보세요." : "");
      verdict.className = "verdict good";
    }
    draw();
  }
  function setKind(t) {
    kind = t; const k = KIND[t];
    root.querySelectorAll("[data-t]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.t === t)));
    p.min = k.min; p.max = k.max; p.step = k.step; p.value = k.v; $(".p-name").textContent = k.name;
    update();
  }
  root.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => setKind(b.dataset.t)));
  p.addEventListener("input", update);
  next.addEventListener("click", () => { if (lv < LV.length - 1) { lv++; solved = false; verdict.textContent = ""; verdict.className = "verdict"; next.disabled = true; setKind("rot"); } });
  setKind("rot");
})();
