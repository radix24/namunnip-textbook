/* 카드: 모든 도시를 꼭 한 번씩 들르고 돌아오는 길이 있을까? — 정육면체·정십이면체·바둑판·페테르센 */
(() => {
  const root = document.getElementById("card-dmath-hamilton");
  if (!root) return;
  const { C } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  const ring = (n, r, rot = 0) => [...Array(n)].map((_, i) => [0.5 + r * Math.cos(rot - Math.PI / 2 + (2 * Math.PI * i) / n), 0.5 + r * Math.sin(rot - Math.PI / 2 + (2 * Math.PI * i) / n)]);
  const m5 = (i) => ((i % 5) + 5) % 5;
  const dodE = []; for (let i = 0; i < 5; i++) { dodE.push([i, m5(i + 1)], [i, 5 + i], [5 + i, 10 + i], [5 + i, 10 + m5(i - 1)], [10 + i, 15 + i], [15 + i, 15 + m5(i + 1)]); }
  const grid = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) grid.push([0.12 + 0.38 * c, 0.12 + 0.38 * r]);
  const gridE = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { const i = 3 * r + c; if (c < 2) gridE.push([i, i + 1]); if (r < 2) gridE.push([i, i + 3]); }
  const pet = []; for (let i = 0; i < 5; i++) pet.push([i, m5(i + 1)], [i, 5 + i], [5 + i, 5 + m5(i + 2)]);
  const LV = [
    { name: "정육면체", V: [...ring(4, 0.46, Math.PI / 4), ...ring(4, 0.2, Math.PI / 4)], E: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], has: true },
    { name: "정십이면체 (해밀턴의 이코시안 게임)", V: [...ring(5, 0.47), ...ring(5, 0.34), ...ring(5, 0.24, Math.PI / 5), ...ring(5, 0.12, Math.PI / 5)], E: dodE, has: true },
    { name: "3 × 3 바둑판", V: grid, E: gridE, has: false, why: "칸을 번갈아 칠하면 한 색이 5개, 다른 색이 4개입니다. 회로는 두 색을 번갈아 지나므로 두 색의 개수가 같아야 합니다." },
    { name: "페테르센 그래프", V: [...ring(5, 0.46), ...ring(5, 0.22)], E: pet, has: false, why: "페테르센 그래프에는 해밀턴 회로가 없다는 것이 알려져 있습니다(경우를 나누어 증명). 해밀턴 경로(돌아오지 않는 길)는 있습니다." },
  ];
  let lv = 0, path = [], done = false;
  const V = [], E = [];
  const adj = (a, b) => E.some((e) => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a));
  const onPath = (a, b) => { for (let i = 1; i < path.length; i++) if ((path[i - 1] === a && path[i] === b) || (path[i - 1] === b && path[i] === a)) return true; return false; };
  const gb = G.board($("canvas"), {
    V, E,
    vStyle: (i) => ({ r: 11, text: "", fill: i === path[path.length - 1] ? "#e0a02a" : path.includes(i) ? "#f6d38a" : C.card }),
    eStyle: (k) => ({ color: onPath(...E[k]) ? "#e0a02a" : C.ink3, width: onPath(...E[k]) ? 5 : 2.2 }),
    vClick: (i) => {
      if (done) return;
      if (!path.length) { path.push(i); update(); return; }
      const at = path[path.length - 1];
      if (!adj(at, i)) { msg("지금 점과 이어진 점을 누르세요.", ""); return; }
      if (i === path[0] && path.length === V.length) { path.push(i); done = true; update(); msg(`성공! 모든 ${V.length}개 꼭짓점을 한 번씩 들르고 돌아왔습니다.`, "good"); $(".go-next").disabled = lv === LV.length - 1; return; }
      if (path.includes(i)) { msg("이미 들른 점입니다.", ""); return; }
      path.push(i); update();
    },
  });
  const msg = (m, c) => { $(".verdict").textContent = m; $(".verdict").className = "verdict " + c; gb.draw(); };
  function update() { $(".lv").textContent = `${lv + 1} / ${LV.length} · ${LV[lv].name} · 들른 점 ${new Set(path).size} / ${V.length}` + (path.length === V.length && !done ? " · 이제 출발점으로 돌아가세요" : ""); gb.draw(); }
  function load() { V.length = 0; E.length = 0; LV[lv].V.forEach(([x, y]) => V.push({ x, y })); LV[lv].E.forEach((e) => E.push(e)); path = []; done = false; $(".go-next").disabled = true; msg("", ""); update(); }
  $(".go-no").addEventListener("click", () => {
    if (done) return;
    if (!LV[lv].has) { done = true; msg(`맞습니다. ${LV[lv].why}`, "good"); $(".go-next").disabled = lv === LV.length - 1; }
    else msg("이 그래프에는 해밀턴 회로가 있습니다. 다시 도전해 보세요.", "bad");
  });
  $(".go-undo").addEventListener("click", () => { if (!done) { path.pop(); msg("", ""); update(); } });
  $(".go-reset").addEventListener("click", () => { path = []; done = false; msg("", ""); update(); });
  $(".go-next").addEventListener("click", () => { if (lv < LV.length - 1) { lv++; load(); } });
  load();
})();
