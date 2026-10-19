/* 카드: 평면그래프에서 점, 선, 면의 수 사이에는 어떤 관계가 있을까? — 변·점 더하며 v − e + f 확인 */
(() => {
  const root = document.getElementById("card-dmath-euler-formula");
  if (!root) return;
  const { C } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  const ring = (n, r, rot = 0, cx = 0.5, cy = 0.5) => [...Array(n)].map((_, i) => ({ x: cx + r * Math.cos(rot - Math.PI / 2 + (2 * Math.PI * i) / n), y: cy + r * Math.sin(rot - Math.PI / 2 + (2 * Math.PI * i) / n) }));
  const START = [
    () => ({ V: ring(3, 0.4), E: [[0, 1], [1, 2], [2, 0]] }),
    () => ({ V: [...ring(4, 0.46, Math.PI / 4), ...ring(4, 0.2, Math.PI / 4)], E: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]] }),
    () => ({ V: [{ x: 0.5, y: 0.5 }, ...ring(6, 0.44)], E: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]] }),
    () => ({ V: [{ x: 0.5, y: 0.15 }, { x: 0.3, y: 0.45 }, { x: 0.7, y: 0.45 }, { x: 0.18, y: 0.8 }, { x: 0.42, y: 0.8 }, { x: 0.82, y: 0.8 }], E: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]] }),
  ];
  const V = [], E = [];
  let sel = -1, bad = new Set();
  const key = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  const gb = G.board($("canvas"), {
    V, E, drag: true,
    vStyle: (i) => ({ r: 10, fill: i === sel ? "#e0a02a" : C.card, text: "" }),
    eStyle: (k) => ({ color: bad.has(k) ? C.warn : "#3f6fa3", width: 2.6 }),
    vClick: (i) => { if (sel < 0) { sel = i; gb.draw(); return; } if (sel !== i) { const k = E.findIndex((e) => key(...e) === key(sel, i)); if (k >= 0) E.splice(k, 1); else E.push([sel, i]); } sel = -1; update(); },
    change: () => update(),
  });
  function update() {
    const { n, pairs } = G.crossings(V, E); bad = new Set(pairs.flat());
    const comp = G.components(V.length, E), v = V.length, e = E.length;
    if (n) { $(".vef").textContent = `v = ${v}, e = ${e}, f = ?`; $(".say").textContent = `변이 교차합니다(빨강). 점을 옮겨 교차를 없애야 면을 셀 수 있습니다.`; }
    else {
      // 면: 연결 성분마다 바깥 면을 공유하므로 성분별로 센 뒤 바깥 면 중복을 뺌
      const f = faceCount();
      $(".vef").textContent = `v − e + f = ${v} − ${e} + ${f} = ${v - e + f}`;
      $(".say").textContent = comp === 1 ? "연결된 평면그래프입니다." : `조각이 ${comp}개로 나뉘어 있습니다 (v − e + f = 조각 수 + 1).`;
    }
    gb.draw();
  }
  function faceCount() {
    // 성분별 면 수(각 성분 바깥 면 포함)를 더하고, 바깥 면을 하나로 합침. 고립점은 면 1개짜리 성분.
    const n = V.length, p = [...Array(n).keys()], find = (x) => (p[x] === x ? x : (p[x] = find(p[x])));
    E.forEach(([a, b]) => (p[find(a)] = find(b)));
    const groups = new Map(); for (let i = 0; i < n; i++) { const r = find(i); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(i); }
    let total = 0;
    groups.forEach((vs) => {
      const idx = new Map(vs.map((x, i) => [x, i])), subE = E.filter(([a]) => idx.has(a)).map(([a, b]) => [idx.get(a), idx.get(b)]);
      total += subE.length ? G.faces(vs.map((x) => V[x]), subE) : 1;
    });
    return total - (groups.size - 1);
  }
  function load() { const s = START[+$(".pick").value](); V.length = 0; E.length = 0; s.V.forEach((x) => V.push(x)); s.E.forEach((x) => E.push(x)); sel = -1; update(); }
  $(".go-v").addEventListener("click", () => { V.push({ x: 0.1 + Math.random() * 0.8, y: 0.05 + Math.random() * 0.12 }); update(); });
  $(".pick").addEventListener("change", load);
  load();
})();
