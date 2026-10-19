/* 카드: 회로 없이 모든 점을 이으려면 선이 몇 개 필요할까? — 수형도 만들기, 회로 경고, 두 점 사이의 길 */
(() => {
  const root = document.getElementById("card-dmath-tree-facts");
  if (!root) return;
  const { C } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  const V = [], E = [];
  let sel = -1, pathMode = false, ends = [], route = [], cyc = new Set();
  const key = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  /* 회로에 속한 변: 그 변을 빼도 양 끝이 이어져 있으면 회로 위 */
  function cycleEdges() { const s = new Set(); E.forEach((e, k) => { const rest = E.filter((_, j) => j !== k); if (findPath(e[0], e[1], rest)) s.add(k); }); return s; }
  function findPath(a, b, edges = E) { const prev = new Map([[a, -1]]), q = [a]; while (q.length) { const u = q.shift(); if (u === b) break; edges.forEach(([x, y]) => { [[x, y], [y, x]].forEach(([p, r]) => { if (p === u && !prev.has(r)) { prev.set(r, u); q.push(r); } }); }); } if (!prev.has(b)) return null; const path = []; for (let u = b; u !== -1; u = prev.get(u)) path.unshift(u); return path; }
  const onRoute = (a, b) => route.some((x, i) => i && ((route[i - 1] === a && x === b) || (route[i - 1] === b && x === a)));
  const gb = G.board($("canvas"), {
    V, E, drag: true,
    vStyle: (i) => { const d = G.degrees(V.length, E)[i]; return { r: 13, text: "", fill: i === sel || ends.includes(i) ? "#e0a02a" : d === 1 ? "#dcebd5" : C.card }; },
    eStyle: (k) => ({ color: onRoute(...E[k]) ? "#e0a02a" : cyc.has(k) ? C.warn : "#3f6fa3", width: onRoute(...E[k]) ? 5 : 2.6 }),
    vClick: (i) => {
      if (pathMode) { ends = ends.length >= 2 ? [i] : [...ends, i]; route = ends.length === 2 ? findPath(ends[0], ends[1]) || [] : []; update(); return; }
      if (sel < 0) { sel = i; gb.draw(); return; }
      if (sel !== i) { const k = E.findIndex((e) => key(...e) === key(sel, i)); if (k >= 0) E.splice(k, 1); else E.push([sel, i]); }
      sel = -1; update();
    },
  });
  function update() {
    cyc = cycleEdges();
    const n = V.length, comp = G.components(n, E), tree = comp === 1 && !cyc.size, leaves = G.degrees(n, E).filter((d) => d === 1).length;
    let m = `꼭짓점 ${n} · 변 ${E.length} · 조각 ${comp}개 · ${cyc.size ? "회로 있음(빨강)" : "회로 없음"}`;
    if (tree) m += ` · 수형도 완성! 변 ${E.length} = ${n} − 1, 잎(초록) ${leaves}개`;
    if (pathMode) m += ends.length === 2 ? ` · 두 점 사이의 길: ${route.length ? `${route.length - 1}개의 변` : "없음(끊어짐)"}${cyc.size ? " (회로가 있으면 다른 길도 있습니다)" : tree ? " (수형도라 이 길 하나뿐)" : ""}` : " · 두 점을 누르세요";
    $(".say").textContent = m; gb.draw();
  }
  function load() { const n = +$(".pick").value; V.length = 0; E.length = 0; for (let i = 0; i < n; i++) V.push({ x: 0.5 + 0.44 * Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / n), y: 0.5 + 0.44 * Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / n) }); sel = -1; ends = []; route = []; update(); }
  $(".go-path").addEventListener("click", (e) => { pathMode = !pathMode; e.target.setAttribute("aria-pressed", String(pathMode)); ends = []; route = []; sel = -1; update(); });
  $(".go-clr").addEventListener("click", () => { E.length = 0; ends = []; route = []; update(); });
  $(".pick").addEventListener("change", load);
  load();
})();
