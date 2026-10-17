/* 고급 기하 작도 엔진 window.NMEuclid — 눈금 없는 자(직선)와 컴퍼스(원)로 작도하기.
   점: 주어진 점(끌 수 있음) 또는 두 도형의 교점(의존). 도형: 두 점을 지나는 직선, 중심과 지나는 점으로 정한 원.
   주어진 점을 끌면 모든 작도가 다시 계산되어, 작도가 "특정 그림"이 아니라 "방법"임을 보여 준다. */
window.NMEuclid = (() => {
  "use strict";
  const { C, F, fit } = NM;
  const EPS = 1e-9;
  /* 교점 계산: 결과는 점 배열(순서 고정) */
  function interLL(a, b, c, d) { const den = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x); if (Math.abs(den) < EPS) return []; const t = ((c.x - a.x) * (d.y - c.y) - (c.y - a.y) * (d.x - c.x)) / den; return [{ x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) }]; }
  function interLC(a, b, o, r) { const dx = b.x - a.x, dy = b.y - a.y, fx = a.x - o.x, fy = a.y - o.y, A = dx * dx + dy * dy, B = 2 * (fx * dx + fy * dy), Cc = fx * fx + fy * fy - r * r, D = B * B - 4 * A * Cc; if (D < -EPS) return []; const s = Math.sqrt(Math.max(0, D)); return [(-B - s) / (2 * A), (-B + s) / (2 * A)].map((t) => ({ x: a.x + t * dx, y: a.y + t * dy })); }
  function interCC(o1, r1, o2, r2) { const dx = o2.x - o1.x, dy = o2.y - o1.y, d = Math.hypot(dx, dy); if (d < EPS || d > r1 + r2 + EPS || d < Math.abs(r1 - r2) - EPS) return []; const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - a * a)), mx = o1.x + (a * dx) / d, my = o1.y + (a * dy) / d; return [{ x: mx - (h * dy) / d, y: my + (h * dx) / d }, { x: mx + (h * dy) / d, y: my - (h * dx) / d }]; }
  const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);

  /* 보드: o = { given: [{x, y, label}], interactive, world: {w, h}, onChange(b), style(kind, id) } */
  function board(canvas, o) {
    const W = o.world || { w: 10, h: 7 };
    const st = { P: [], O: [], hi: new Set(), tool: "circle", pick: [], moves: 0, labels: true };
    const f = fit(canvas, () => draw());
    const S = () => { const { w, h } = f.size; const s = Math.min(w / W.w, h / W.h); return { s, ox: w / 2, oy: h / 2 }; };
    const toScr = (p) => { const { s, ox, oy } = S(); return [ox + p.x * s, oy - p.y * s]; };
    const toW = (x, y) => { const { s, ox, oy } = S(); return { x: (x - ox) / s, y: (oy - y) / s }; };
    function reset() { st.P = o.given.map((g) => ({ kind: "given", x: g.x, y: g.y, label: g.label || "", ok: true })); st.O = []; st.pick = []; st.moves = 0; st.hi.clear(); draw(); }
    function geom(i) { const ob = st.O[i]; if (ob.type === "line") return { a: st.P[ob.p], b: st.P[ob.q] }; return { o: st.P[ob.p], r: dist(st.P[ob.p], st.P[ob.q]) }; }
    function inters(i, j) { const A = st.O[i], B = st.O[j], ga = geom(i), gb = geom(j); if (A.type === "line" && B.type === "line") return interLL(ga.a, ga.b, gb.a, gb.b); if (A.type === "line") return interLC(ga.a, ga.b, gb.o, gb.r); if (B.type === "line") return interLC(gb.a, gb.b, ga.o, ga.r); return interCC(ga.o, ga.r, gb.o, gb.r); }
    /* 의존 순서대로 다시 계산 */
    /* avoid가 있으면 그 점에서 더 먼 교점을 고른다(끌어도 "다른 교점"이 유지되게) */
    const pickRoot = (p) => { const rs = inters(p.i, p.j); if (p.avoid == null || rs.length < 2) return rs[p.k] || rs[0]; const q = st.P[p.avoid]; return dist(rs[0], q) >= dist(rs[1], q) ? rs[0] : rs[1]; };
    function recompute() { st.P.forEach((p) => { if (p.kind === "inter") { const r = pickRoot(p); if (r) { p.x = r.x; p.y = r.y; p.ok = true; } else p.ok = false; } }); }
    const findP = (q) => st.P.findIndex((p) => p.ok && dist(p, q) < 1e-6);
    function addPoint(i, j, k, label = "", avoid = null) { const r = pickRoot({ i, j, k, avoid }); if (!r) return -1; const e = findP(r); if (e >= 0) { if (label && !st.P[e].label) st.P[e].label = label; return e; } st.P.push({ kind: "inter", i, j, k, avoid, x: r.x, y: r.y, label, ok: true }); return st.P.length - 1; }
    /* 도형 추가(같은 것이 있으면 그것을 돌려줌). auto면 기존 도형과의 교점을 모두 점으로 추가 */
    function add(type, p, q, auto = o.interactive) {
      const same = st.O.findIndex((ob) => ob.type === type && ((ob.p === p && ob.q === q) || (type === "line" && ob.p === q && ob.q === p)));
      if (same >= 0) return same;
      st.O.push({ type, p, q }); const idx = st.O.length - 1; st.moves++;
      if (auto) for (let j = 0; j < idx; j++) inters(idx, j).forEach((_, k) => addPoint(idx, j, k));
      if (o.onChange) o.onChange(api); draw(); return idx;
    }
    function draw() {
      const { ctx, size: { w, h } } = f; if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const { s } = S();
      st.O.forEach((ob, i) => {
        const hi = st.hi.has("o" + i), sty = (o.style && o.style("o", i)) || {};
        ctx.strokeStyle = sty.color || (hi ? C.warn : ob.type === "line" ? "#3f6fa3" : "#7b5ea7"); ctx.lineWidth = hi ? 2.6 : 1.4; ctx.setLineDash(sty.dash || []);
        if (ob.type === "line") { const a = st.P[ob.p], b = st.P[ob.q]; if (!a.ok || !b.ok) return; const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, T = 40; const p1 = toScr({ x: a.x - (dx / L) * T, y: a.y - (dy / L) * T }), p2 = toScr({ x: a.x + (dx / L) * T, y: a.y + (dy / L) * T }); ctx.beginPath(); ctx.moveTo(...p1); ctx.lineTo(...p2); ctx.stroke(); }
        else { const c = st.P[ob.p], q = st.P[ob.q]; if (!c.ok || !q.ok) return; ctx.beginPath(); ctx.arc(...toScr(c), dist(c, q) * s, 0, 7); ctx.stroke(); }
        ctx.setLineDash([]);
      });
      if (o.extra) o.extra(ctx, toScr, s, api);
      st.P.forEach((p, i) => {
        if (!p.ok) return; const [x, y] = toScr(p), picked = st.pick.includes(i), hi = st.hi.has("p" + i);
        ctx.beginPath(); ctx.arc(x, y, p.kind === "given" ? 5.5 : picked || hi ? 5 : 3.2, 0, 7);
        ctx.fillStyle = picked ? "#e0a02a" : hi ? C.warn : p.kind === "given" ? C.ink : "#5d5d61"; ctx.fill();
        if (p.label && st.labels) { ctx.fillStyle = C.ink; ctx.font = `italic 700 13px ${F.serif}`; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(p.label, x + 6, y - 4); }
      });
    }
    // 입력: 주어진 점 끌기, 점 누르기(도구)
    const near = (x, y) => { let best = -1, d = 16; st.P.forEach((p, i) => { if (!p.ok) return; const [px, py] = toScr(p), dd = Math.hypot(px - x, py - y); if (dd < d) { d = dd; best = i; } }); return best; };
    let drag = null;
    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", (e) => { const b = canvas.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top, i = near(x, y); drag = { i, x, y, moved: false }; if (i >= 0) { canvas.setPointerCapture(e.pointerId); e.preventDefault(); } });
    canvas.addEventListener("pointermove", (e) => {
      if (!drag || drag.i < 0 || st.P[drag.i].kind !== "given" || o.lockGiven) return; const b = canvas.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      if (Math.hypot(x - drag.x, y - drag.y) > 4) drag.moved = true;
      if (drag.moved) { const q = toW(x, y); st.P[drag.i].x = Math.max(-W.w / 2, Math.min(W.w / 2, q.x)); st.P[drag.i].y = Math.max(-W.h / 2, Math.min(W.h / 2, q.y)); recompute(); draw(); if (o.onChange) o.onChange(api); }
    });
    canvas.addEventListener("pointerup", () => {
      if (!drag) return; const d = drag; drag = null; if (d.moved || d.i < 0 || !o.interactive) return;
      st.pick.push(d.i);
      if (st.pick.length === 2) { const [p, q] = st.pick; st.pick = []; if (p !== q) add(st.tool, p, q); else draw(); } else draw();
      if (o.onPick) o.onPick(api);
    });
    const api = { st, reset, setGiven: (g) => { o.given = g; reset(); }, add, addPoint, recompute, draw, dist, inters, setTool: (t) => { st.tool = t; st.pick = []; draw(); }, undo: () => { if (!st.O.length) return; const n = st.O.length - 1; st.O.pop(); st.P = st.P.filter((p) => p.kind !== "inter" || (p.i < n && p.j < n)); st.moves = Math.max(0, st.moves - 1); st.pick = []; draw(); if (o.onChange) o.onChange(api); } };
    reset();
    return api;
  }
  /* 판정 도우미 */
  const near = (a, b, tol = 1e-6) => Math.abs(a - b) < tol;
  /* 직선 (p, q)가 조건 f(x, y)를 만족하는 방향인지 등은 카드에서 직접 */
  return { board, dist, near, interLL, interLC, interCC };
})();
