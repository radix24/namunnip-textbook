/* 카드: 눈금 없는 자와 컴퍼스만으로 무엇을 그릴 수 있을까? — 기본 작도 네 가지를 한 단계씩, 주어진 점 끌기 */
(() => {
  const root = document.getElementById("card-adgeo-construct-replay");
  if (!root) return;
  const E = NMEuclid;
  const $ = (s) => root.querySelector(s);
  const deg = (r) => (r * 180) / Math.PI, n2 = (x) => String(Math.round(x * 100) / 100).replace("-", "−");
  const ang = (o, a, b) => { const u = [a.x - o.x, a.y - o.y], v = [b.x - o.x, b.y - o.y]; return deg(Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v)))))); };
  const CON = [
    { given: [{ x: -1.5, y: -1.2, label: "A" }, { x: 1.5, y: -1.2, label: "B" }],
      steps: [
        ["선분 AB를 긋습니다.", (b, m) => { m.l = b.add("line", 0, 1); }],
        ["A를 중심으로 B를 지나는 원을 그립니다.", (b, m) => { m.c1 = b.add("circle", 0, 1); }],
        ["B를 중심으로 A를 지나는 원을 그립니다.", (b, m) => { m.c2 = b.add("circle", 1, 0); }],
        ["두 원의 교점을 C라 하고 A, B와 잇습니다. CA = AB = CB이므로 정삼각형입니다.", (b, m) => { m.C = b.addPoint(m.c1, m.c2, 0, "C"); b.add("line", 0, m.C); b.add("line", 1, m.C); }],
      ],
      check: (b, m) => (m.C != null ? `AB = ${n2(E.dist(b.st.P[0], b.st.P[1]))}, BC = ${n2(E.dist(b.st.P[1], b.st.P[m.C]))}, CA = ${n2(E.dist(b.st.P[m.C], b.st.P[0]))}` : "") },
    { given: [{ x: -1.8, y: -0.6, label: "A" }, { x: 1.6, y: 0.4, label: "B" }],
      steps: [
        ["선분 AB를 긋습니다.", (b, m) => { m.l = b.add("line", 0, 1); }],
        ["A를 중심으로 B를 지나는 원을 그립니다.", (b, m) => { m.c1 = b.add("circle", 0, 1); }],
        ["B를 중심으로 A를 지나는 원을 그립니다.", (b, m) => { m.c2 = b.add("circle", 1, 0); }],
        ["두 교점 P, Q를 잇습니다. P, Q는 A와 B에서 같은 거리에 있으므로 PQ는 수직이등분선입니다.", (b, m) => { m.P = b.addPoint(m.c1, m.c2, 0, "P"); m.Q = b.addPoint(m.c1, m.c2, 1, "Q"); m.pq = b.add("line", m.P, m.Q); }],
        ["PQ와 AB의 교점 M이 AB의 중점입니다.", (b, m) => { m.M = b.addPoint(m.pq, m.l, 0, "M"); }],
      ],
      check: (b, m) => (m.M != null ? `AM = ${n2(E.dist(b.st.P[0], b.st.P[m.M]))}, MB = ${n2(E.dist(b.st.P[m.M], b.st.P[1]))}, ∠PMB = ${n2(ang(b.st.P[m.M], b.st.P[m.P], b.st.P[1]))}°` : "") },
    { given: [{ x: -2.2, y: -1.5, label: "O" }, { x: 2, y: -1.3, label: "A" }, { x: 0.6, y: 2.2, label: "B" }],
      steps: [
        ["반직선 OA와 OB를 긋습니다.", (b, m) => { m.la = b.add("line", 0, 1); m.lb = b.add("line", 0, 2); }],
        ["O를 중심으로 A를 지나는 원을 그려 OB와 만나는 점을 Y라 합니다. OA = OY입니다.", (b, m) => { m.c = b.add("circle", 0, 1); m.Y = b.addPoint(m.lb, m.c, 1, "Y"); }],
        ["A를 중심으로 Y를 지나는 원, Y를 중심으로 A를 지나는 원을 그립니다.", (b, m) => { m.c1 = b.add("circle", 1, m.Y); m.c2 = b.add("circle", m.Y, 1); }],
        ["두 원의 교점 중 O에서 먼 점 Z와 O를 잇습니다. 삼각형 OAZ와 OYZ가 합동(SSS)이므로 OZ가 각의 이등분선입니다.", (b, m) => { m.Z = b.addPoint(m.c1, m.c2, 0, "Z", 0); b.add("line", 0, m.Z); }],
      ],
      check: (b, m) => (m.Z != null ? `∠AOZ = ${n2(ang(b.st.P[0], b.st.P[1], b.st.P[m.Z]))}°, ∠ZOB = ${n2(ang(b.st.P[0], b.st.P[m.Z], b.st.P[2]))}°` : "") },
    { given: [{ x: -2.6, y: -1.4, label: "A" }, { x: 2.6, y: -0.8, label: "B" }, { x: 0.2, y: 2, label: "P" }],
      steps: [
        ["직선 AB를 긋습니다.", (b, m) => { m.l = b.add("line", 0, 1); }],
        ["P를 중심으로 A를 지나는 원을 그려 직선 AB와 다시 만나는 점을 X라 합니다.", (b, m) => { m.c = b.add("circle", 2, 0); m.X = b.addPoint(m.l, m.c, 0, "X", 0); }],
        ["A를 중심으로 P를 지나는 원, X를 중심으로 P를 지나는 원을 그립니다.", (b, m) => { m.c1 = b.add("circle", 0, 2); m.c2 = b.add("circle", m.X, 2); }],
        ["두 원의 다른 교점 P′과 P를 잇습니다. PA = PX이고 P′A = P′X이므로 PP′은 AX의 수직이등분선, 곧 수선입니다.", (b, m) => { m.P2 = b.addPoint(m.c1, m.c2, 0, "P′", 2); m.pp = b.add("line", 2, m.P2); m.H = b.addPoint(m.pp, m.l, 0, "H"); }],
      ],
      check: (b, m) => (m.H != null ? `∠PHB = ${n2(ang(b.st.P[m.H], b.st.P[2], b.st.P[1]))}°` : "") },
  ];
  let ci = 0, step = 0, mem = {};
  const b = E.board($("canvas"), { given: CON[0].given, interactive: false, onChange: () => say() });
  function say() { const c = CON[ci]; $(".say").textContent = step ? `${step} / ${c.steps.length} · ${c.steps[step - 1][0]}` : "주어진 점에서 시작합니다. 다음 단계를 누르세요."; $(".chk").textContent = step === c.steps.length ? "확인: " + c.check(b, mem) + " (검은 점을 끌어 보세요)" : ""; }
  function load() { ci = +$(".pick").value; step = 0; mem = {}; b.setGiven(CON[ci].given.map((p) => ({ ...p }))); say(); }
  function next() { const c = CON[ci]; if (step >= c.steps.length) return false; c.steps[step][1](b, mem); step++; b.draw(); say(); return true; }
  $(".go-step").addEventListener("click", next);
  $(".go-all").addEventListener("click", () => { while (next()); });
  $(".go-reset").addEventListener("click", load);
  $(".pick").addEventListener("change", load);
  load();
})();
