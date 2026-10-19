/* 카드: 세 점을 모두 지나는 원은 어떻게 작도할까? — 외심(수직이등분선)과 내심(각의 이등분선)의 작도 */
(() => {
  const root = document.getElementById("card-adgeo-center-construct");
  if (!root) return;
  const E = NMEuclid;
  const $ = (s) => root.querySelector(s);
  const { C } = NM;
  const n2 = (x) => String(Math.round(x * 100) / 100).replace("-", "−");
  const GIVEN = [{ x: -2.4, y: -1.6, label: "A" }, { x: 2.2, y: -1.4, label: "B" }, { x: -0.4, y: 2, label: "C" }];
  let ci = 0, step = 0, m = {};
  /* 선분의 수직이등분선 (두 원 + 직선) */
  const perpBis = (b, p, q) => { const c1 = b.add("circle", p, q), c2 = b.add("circle", q, p); const P1 = b.addPoint(c1, c2, 0), P2 = b.addPoint(c1, c2, 1); return b.add("line", P1, P2); };
  /* 꼭짓점 v에서 변 v–a, v–b 사이 각의 이등분선 (반지름 va의 원 하나 + 두 원 + 직선) */
  const angBis = (b, v, a, bb, lva, lvb) => { const c = b.add("circle", v, a), V0 = b.st.P[v], Bp = b.st.P[bb], rr = b.inters(lvb, c), kk = rr.findIndex((p) => (p.x - V0.x) * (Bp.x - V0.x) + (p.y - V0.y) * (Bp.y - V0.y) > 0), Y = b.addPoint(lvb, c, kk < 0 ? 0 : kk), c1 = b.add("circle", a, Y), c2 = b.add("circle", Y, a); const Z = b.addPoint(c1, c2, 0, "", v); return b.add("line", v, Z); };
  const footDist = (P, A, B) => Math.abs((B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x)) / E.dist(A, B);
  const CON = [
    [["세 변 AB, BC, CA를 긋습니다.", (b) => { m.ab = b.add("line", 0, 1); m.bc = b.add("line", 1, 2); m.ca = b.add("line", 2, 0); }],
     ["AB의 수직이등분선을 작도합니다(A, B를 중심으로 하는 두 원).", (b) => { m.p1 = perpBis(b, 0, 1); }],
     ["BC의 수직이등분선을 작도합니다.", (b) => { m.p2 = perpBis(b, 1, 2); }],
     ["두 수직이등분선의 교점이 외심 O입니다. O를 중심으로 A를 지나는 원이 외접원입니다.", (b) => { m.O = b.addPoint(m.p1, m.p2, 0, "O"); m.circ = b.add("circle", m.O, 0); }]],
    [["세 변 AB, BC, CA를 긋습니다.", (b) => { m.ab = b.add("line", 0, 1); m.bc = b.add("line", 1, 2); m.ca = b.add("line", 2, 0); }],
     ["∠A의 이등분선을 작도합니다.", (b) => { m.a1 = angBis(b, 0, 1, 2, m.ab, m.ca); }],
     ["∠B의 이등분선을 작도합니다.", (b) => { m.b1 = angBis(b, 1, 2, 0, m.bc, m.ab); }],
     ["두 이등분선의 교점이 내심 I입니다. I에서 변에 내린 수선의 길이를 반지름으로 하는 원이 내접원입니다(수선의 작도는 생략하고 원만 그림).", (b) => { m.I = b.addPoint(m.a1, m.b1, 0, "I"); m.done = true; }]],
  ];
  const b = E.board($("canvas"), {
    given: GIVEN, interactive: false,
    style: (k, i) => (m.circ === i || [m.p1, m.p2, m.a1, m.b1].includes(i) ? { color: C.warn } : { color: "rgba(123,94,167,.35)" }),
    extra: (ctx, toScr, s) => { if (ci === 1 && m.done) { const [A, B, Cc] = b.st.P, I = b.st.P[m.I]; ctx.strokeStyle = C.forest; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(...toScr(I), footDist(I, A, B) * s, 0, 7); ctx.stroke(); void Cc; } },
    onChange: () => say(),
  });
  function say() {
    const c = CON[ci]; $(".say").textContent = step ? `${step} / ${c.length} · ${c[step - 1][0]}` : "꼭짓점을 끌어 삼각형을 바꿀 수 있습니다. 다음 단계를 누르세요.";
    const [A, B, Cc] = b.st.P; let t = "";
    if (ci === 0 && m.O != null && b.st.P[m.O].ok) { const O = b.st.P[m.O]; t = `OA = ${n2(E.dist(O, A))}, OB = ${n2(E.dist(O, B))}, OC = ${n2(E.dist(O, Cc))}`; }
    if (ci === 0 && m.O != null && !b.st.P[m.O].ok) t = "세 점이 한 직선 위에 있어 외심이 없습니다.";
    if (ci === 1 && m.I != null) { const I = b.st.P[m.I]; t = `I에서 세 변까지의 거리: ${n2(footDist(I, A, B))}, ${n2(footDist(I, B, Cc))}, ${n2(footDist(I, Cc, A))}`; }
    $(".chk").textContent = t;
  }
  function load() { ci = +$(".pick").value; step = 0; m = {}; b.setGiven(GIVEN.map((p) => ({ ...p }))); say(); }
  function next() { const c = CON[ci]; if (step >= c.length) return false; c[step][1](b); step++; b.draw(); say(); return true; }
  $(".go-step").addEventListener("click", next);
  $(".go-all").addEventListener("click", () => { while (next()); });
  $(".go-reset").addEventListener("click", load);
  $(".pick").addEventListener("change", load);
  load();
})();
