/* 카드: 원과 직선 몇 번이면 목표 도형을 그릴 수 있을까? — 작도 문제 다섯 개, 수 세기 */
(() => {
  const root = document.getElementById("card-adgeo-construct-challenge");
  if (!root) return;
  const E = NMEuclid;
  const $ = (s) => root.querySelector(s);
  const T = 1e-6, d = E.dist;
  const pts = (b) => b.st.P.filter((p) => p.ok);
  const lines = (b) => b.st.O.filter((o) => o.type === "line").map((o) => [b.st.P[o.p], b.st.P[o.q]]);
  /* 직선 (a, b)가 점 p를 지나고 방향 v와 평행한지 */
  const through = (a, b, p) => Math.abs((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)) / d(a, b) < T;
  const parallel = (a, b, v) => Math.abs((b.x - a.x) * v[1] - (b.y - a.y) * v[0]) / (d(a, b) * Math.hypot(...v)) < T;
  const LV = [
    { name: "AB를 한 변으로 하는 정삼각형의 꼭짓점 C를 작도하기", par: 2, given: [{ x: -1.2, y: -1, label: "A" }, { x: 1.2, y: -1, label: "B" }], pre: [],
      ok: (b) => { const [A, B] = b.st.P; return pts(b).some((p) => Math.abs(d(p, A) - d(A, B)) < T && Math.abs(d(p, B) - d(A, B)) < T); } },
    { name: "선분 AB의 중점 M을 작도하기 (직선 AB는 그려져 있음)", par: 3, given: [{ x: -2, y: -0.8, label: "A" }, { x: 1.8, y: 0.6, label: "B" }], pre: [["line", 0, 1]],
      ok: (b) => { const [A, B] = b.st.P; return pts(b).some((p) => Math.abs(d(p, A) - d(A, B) / 2) < T && Math.abs(d(p, B) - d(A, B) / 2) < T); } },
    { name: "∠AOB의 이등분선을 작도하기", par: 4, given: [{ x: -2.4, y: -1.6, label: "O" }, { x: 2.2, y: -1.2, label: "A" }, { x: 0.4, y: 2.2, label: "B" }], pre: [["line", 0, 1], ["line", 0, 2]],
      ok: (b) => { const [O, A, B] = b.st.P, u = [(A.x - O.x) / d(O, A), (A.y - O.y) / d(O, A)], v = [(B.x - O.x) / d(O, B), (B.y - O.y) / d(O, B)], w = [u[0] + v[0], u[1] + v[1]]; return lines(b).some(([p, q]) => through(p, q, O) && parallel(p, q, w)); } },
    { name: "점 P를 지나고 직선 AB에 평행한 직선을 작도하기", par: 4, given: [{ x: -2.6, y: -1.3, label: "A" }, { x: 2.4, y: -0.9, label: "B" }, { x: -0.4, y: 1.6, label: "P" }], pre: [["line", 0, 1]],
      ok: (b) => { const [A, B, P] = b.st.P; return lines(b).some(([p, q]) => through(p, q, P) && parallel(p, q, [B.x - A.x, B.y - A.y])); } },
    { name: "AB를 한 변으로 하는 정사각형의 꼭짓점 C(∠ABC = 90°, BC = AB)를 작도하기", par: 5, given: [{ x: -1.4, y: -1.2, label: "A" }, { x: 0.6, y: -1.2, label: "B" }], pre: [["line", 0, 1]],
      ok: (b) => { const [A, B] = b.st.P; return pts(b).some((p) => Math.abs(d(p, B) - d(A, B)) < T && Math.abs((A.x - B.x) * (p.x - B.x) + (A.y - B.y) * (p.y - B.y)) < T); } },
  ];
  let lv = 0, solved = false;
  const b = E.board($("canvas"), { given: LV[0].given, interactive: true, lockGiven: true, onChange: () => check() });
  function load() {
    solved = false; b.setGiven(LV[lv].given.map((p) => ({ ...p })));
    LV[lv].pre.forEach(([t, p, q]) => b.add(t, p, q)); b.st.moves = 0;
    $(".verdict").textContent = ""; $(".verdict").className = "verdict"; $(".go-next").disabled = true; check();
  }
  function check() {
    const L = LV[lv], used = b.st.moves;
    $(".lv").textContent = `${lv + 1} / ${LV.length} · ${L.name} · 쓴 수 ${used} (기준 ${L.par})`;
    if (!solved && L.ok(b)) {
      solved = true; $(".go-next").disabled = lv === LV.length - 1;
      $(".verdict").textContent = used <= L.par ? `성공! ${used}수로 작도했습니다.` : `성공! ${used}수 · 기준 ${L.par}수 안에도 해 보세요(되돌리기·다시).`;
      $(".verdict").className = "verdict good";
    }
  }
  root.querySelectorAll("[data-t]").forEach((x) => x.addEventListener("click", () => { b.setTool(x.dataset.t); root.querySelectorAll("[data-t]").forEach((y) => y.setAttribute("aria-pressed", String(y === x))); }));
  $(".go-undo").addEventListener("click", () => { if (b.st.O.length > LV[lv].pre.length) { b.undo(); solved = false; $(".verdict").textContent = ""; check(); } });
  $(".go-reset").addEventListener("click", load);
  $(".go-next").addEventListener("click", () => { if (lv < LV.length - 1) { lv++; load(); } });
  load();
})();
