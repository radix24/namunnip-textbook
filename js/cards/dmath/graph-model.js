/* 카드: 버스 노선 설명을 그래프로 그리면 무엇이 보일까? — 설명대로 변 잇기, 모양 바꿔도 같은 그래프 */
(() => {
  const root = document.getElementById("card-dmath-graph-model");
  if (!root) return;
  const { C } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  const NAMES = ["시청", "도서관", "공원", "학교", "병원", "역", "시장"];
  const TARGET = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [4, 5], [2, 5], [5, 6]];
  const key = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`), tset = new Set(TARGET.map(([a, b]) => key(a, b)));
  const ring = () => NAMES.map((label, i) => ({ x: 0.5 + 0.45 * Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / NAMES.length), y: 0.5 + 0.45 * Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / NAMES.length), label }));
  const V = ring(), E = [];
  let sel = -1;
  const gb = G.board($("canvas"), {
    V, E, drag: true, pad: 30,
    vStyle: (i) => ({ r: 20, fill: i === sel ? "#e0a02a" : C.card, text: NAMES[i] }),
    eStyle: (k) => ({ color: tset.has(key(...E[k])) ? C.forest : C.warn, width: 3 }),
    vClick: (i) => {
      if (sel < 0) { sel = i; update(); return; }
      if (sel !== i) { const k = E.findIndex((e) => key(...e) === key(sel, i)); if (k >= 0) E.splice(k, 1); else E.push([sel, i]); }
      sel = -1; update();
    },
  });
  function update() {
    const good = E.filter((e) => tset.has(key(...e))).length, bad = E.length - good, d = G.degrees(V.length, E);
    let m = sel >= 0 ? `${NAMES[sel]} 선택 · 이을 정류장을 누르세요. ` : "";
    m += `맞게 이은 노선 ${good} / ${TARGET.length}` + (bad ? ` · 설명에 없는 선 ${bad}개(빨강)` : "");
    if (good === TARGET.length && !bad) {
      const mx = Math.max(...d);
      m += ` · 완성! 노선이 가장 많은 정류장: ${NAMES.filter((_, i) => d[i] === mx).join(", ")}(${mx}개) · 하나뿐인 노선으로만 이어진 정류장: ${NAMES.filter((_, i) => d[i] === 1).join(", ") || "없음"}`;
    }
    $(".say").textContent = m; gb.draw();
  }
  $(".list").textContent = TARGET.map(([a, b]) => `${NAMES[a]}–${NAMES[b]}`).join(", ");
  $(".go-shape").addEventListener("click", () => { V.forEach((v) => { v.x = 0.08 + Math.random() * 0.84; v.y = 0.08 + Math.random() * 0.84; }); update(); });
  $(".go-clr").addEventListener("click", () => { E.length = 0; sel = -1; update(); });
  update();
})();
