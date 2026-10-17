/* 카드: 모든 마을에 광케이블을 가장 싸게 연결하려면? — 직접 고르기와 크러스컬 방법 (모의 공사비) */
(() => {
  const root = document.getElementById("card-dmath-kruskal");
  if (!root) return;
  const { C } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  const NAMES = ["가", "나", "다", "라", "마", "바", "사"];
  const V = [{ x: 0.1, y: 0.2 }, { x: 0.45, y: 0.05 }, { x: 0.85, y: 0.15 }, { x: 0.3, y: 0.55 }, { x: 0.7, y: 0.5 }, { x: 0.12, y: 0.92 }, { x: 0.82, y: 0.92 }];
  const W = [[0, 1, 7], [0, 3, 5], [1, 2, 8], [1, 3, 9], [1, 4, 7], [2, 4, 5], [3, 4, 15], [3, 5, 6], [4, 5, 8], [4, 6, 9], [5, 6, 11], [2, 6, 12]];
  const E = W.map(([a, b]) => [a, b]);
  let pick = new Set(), kr = null; // kr: { order, i, chosen:Set, log:[] }
  const find = (p, x) => (p[x] === x ? x : (p[x] = find(p, p[x])));
  const gb = G.board($("canvas"), {
    V, E, pad: 26,
    vStyle: (i) => ({ r: 15, text: NAMES[i] }),
    eStyle: (k) => {
      const kc = kr && kr.chosen.has(k), kx = kr && kr.rejected.has(k), on = pick.has(k);
      return { color: kc ? C.forest : kx ? "rgba(181,83,47,.5)" : on ? "#e0a02a" : C.ink3, width: kc || on ? 5 : 2, dash: kx ? [5, 4] : null, label: W[k][2] };
    },
    eClick: (k) => { kr = null; $(".log").textContent = ""; pick.has(k) ? pick.delete(k) : pick.add(k); update(); },
  });
  function status(set) {
    const p = [...V.keys()]; let cyc = false;
    [...set].forEach((k) => { const [a, b] = W[k], ra = find(p, a), rb = find(p, b); if (ra === rb) cyc = true; else p[ra] = rb; });
    const comps = new Set(V.map((_, i) => find(p, i))).size, cost = [...set].reduce((s, k) => s + W[k][2], 0);
    return { cyc, comps, cost };
  }
  const best = (() => { const order = W.map((_, k) => k).sort((a, b) => W[a][2] - W[b][2]), p = [...V.keys()]; let c = 0; order.forEach((k) => { const ra = find(p, W[k][0]), rb = find(p, W[k][1]); if (ra !== rb) { p[ra] = rb; c += W[k][2]; } }); return c; })();
  function update() {
    const s = status(pick);
    let m = `고른 변 ${pick.size}개 · 비용 ${s.cost}억 원 · ${s.cyc ? "회로 있음" : "회로 없음"} · 조각 ${s.comps}개`;
    if (!s.cyc && s.comps === 1) m += s.cost === best ? " · 최소 생성수형도입니다!" : ` · 생성수형도입니다. 최소 비용은 ${best}억 원입니다.`;
    if (kr) { const ks = status(kr.chosen); m = `크러스컬: 고른 변 ${kr.chosen.size} / ${V.length - 1} · 비용 ${ks.cost}억 원`; }
    $(".say").textContent = m; gb.draw();
  }
  function step() {
    if (!kr) { kr = { order: W.map((_, k) => k).sort((a, b) => W[a][2] - W[b][2]), i: 0, chosen: new Set(), rejected: new Set(), p: [...V.keys()], log: [] }; pick.clear(); }
    if (kr.chosen.size >= V.length - 1 || kr.i >= kr.order.length) return false;
    const k = kr.order[kr.i++], [a, b, w] = W[k], ra = find(kr.p, a), rb = find(kr.p, b);
    if (ra === rb) { kr.rejected.add(k); kr.log.push(`${NAMES[a]}–${NAMES[b]} (${w}) 버림: 이미 이어져 있어 회로가 생김`); }
    else { kr.p[ra] = rb; kr.chosen.add(k); kr.log.push(`${NAMES[a]}–${NAMES[b]} (${w}) 고름`); }
    $(".log").innerHTML = kr.log.join("<br>"); update(); return true;
  }
  $(".go-step").addEventListener("click", () => { if (!step()) $(".log").innerHTML += `<br>끝: 최소 비용 ${best}억 원`; });
  $(".go-all").addEventListener("click", () => { while (step()); $(".log").innerHTML += `<br>끝: 최소 비용 ${best}억 원`; });
  $(".go-clr").addEventListener("click", () => { pick.clear(); kr = null; $(".log").textContent = ""; update(); });
  update();
})();
