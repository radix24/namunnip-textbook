/* 카드: 한붓그리기가 되는 그림은 미리 알 수 있을까? — 꼭짓점을 이어 누르며 그리기, 차수 조건 */
(() => {
  const root = document.getElementById("card-dmath-euler-trail");
  if (!root) return;
  const { C } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  const LV = [
    { name: "봉투", V: [[0.15, 0.4], [0.85, 0.4], [0.85, 0.92], [0.15, 0.92], [0.5, 0.08]], E: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3], [0, 4], [4, 1]] },
    { name: "별", V: [...Array(5)].map((_, i) => [0.5 + 0.45 * Math.cos(-Math.PI / 2 + (4 * Math.PI * i) / 5), 0.52 + 0.45 * Math.sin(-Math.PI / 2 + (4 * Math.PI * i) / 5)]), E: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
    { name: "창문", V: [[0.1, 0.1], [0.5, 0.1], [0.9, 0.1], [0.1, 0.5], [0.5, 0.5], [0.9, 0.5], [0.1, 0.9], [0.5, 0.9], [0.9, 0.9]], E: [[0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [0, 3], [3, 6], [1, 4], [4, 7], [2, 5], [5, 8]] },
    { name: "나비", V: [[0.5, 0.5], [0.1, 0.15], [0.1, 0.85], [0.9, 0.15], [0.9, 0.85]], E: [[0, 1], [1, 2], [2, 0], [0, 3], [3, 4], [4, 0]] },
    { name: "다이아몬드", V: [[0.5, 0.08], [0.12, 0.5], [0.88, 0.5], [0.5, 0.92]], E: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [0, 3]] },
  ];
  let lv = 0, path = [], used = [], showDeg = false, done = false;
  const V = [], E = [];
  const gb = G.board($("canvas"), {
    V, E,
    vStyle: (i) => { const d = G.degrees(V.length, E)[i]; return { r: 13, text: "", fill: i === path[path.length - 1] ? "#e0a02a" : i === path[0] ? "#f6d38a" : C.card, badge: showDeg ? d : null, badgeColor: d % 2 ? C.warn : C.forest }; },
    eStyle: (k) => ({ color: used.includes(k) ? "#e0a02a" : C.ink3, width: used.includes(k) ? 5 : 2.6 }),
    vClick: (i) => {
      if (done) return;
      if (!path.length) { path.push(i); update(); return; }
      const at = path[path.length - 1], k = E.findIndex((e, j) => !used.includes(j) && ((e[0] === at && e[1] === i) || (e[1] === at && e[0] === i)));
      if (k < 0) { say("지금 점과 아직 그리지 않은 선으로 이어진 점을 누르세요."); return; }
      used.push(k); path.push(i); update();
    },
  });
  const say = (m) => { $(".verdict").textContent = m; $(".verdict").className = "verdict"; gb.draw(); };
  function load() { V.length = 0; E.length = 0; LV[lv].V.forEach(([x, y]) => V.push({ x, y })); LV[lv].E.forEach((e) => E.push(e)); path = []; used = []; done = false; $(".go-next").disabled = true; say(""); update(); }
  const odd = () => G.degrees(V.length, E).filter((d) => d % 2).length;
  function update() {
    $(".lv").textContent = `${lv + 1} / ${LV.length} · ${LV[lv].name} · 그린 선 ${used.length} / ${E.length}`;
    if (!done && used.length === E.length) { done = true; $(".verdict").textContent = `성공! ${path[0] === path[path.length - 1] ? "출발점으로 돌아왔습니다(오일러 회로)." : "출발점과 끝점이 다릅니다(오일러 경로)."} 홀수 차수 꼭짓점 ${odd()}개.`; $(".verdict").className = "verdict good"; $(".go-next").disabled = lv === LV.length - 1; }
    else if (!done && path.length && !E.some((e, j) => !used.includes(j) && (e[0] === path[path.length - 1] || e[1] === path[path.length - 1]))) { $(".verdict").textContent = "더 그릴 선이 없습니다. 되돌리거나 다른 점에서 시작해 보세요."; $(".verdict").className = "verdict bad"; }
    gb.draw();
  }
  $(".go-no").addEventListener("click", () => {
    if (done) return; const o = odd();
    if (o > 2) { done = true; $(".verdict").textContent = `맞습니다. 홀수 차수 꼭짓점이 ${o}개라 한붓그리기가 불가능합니다.`; $(".verdict").className = "verdict good"; $(".go-next").disabled = lv === LV.length - 1; }
    else { $(".verdict").textContent = `가능합니다. 홀수 차수 꼭짓점이 ${o}개입니다.${o === 2 ? " 홀수인 점에서 출발해 보세요." : ""}`; $(".verdict").className = "verdict bad"; }
  });
  $(".go-undo").addEventListener("click", () => { if (done) return; if (used.length) { used.pop(); path.pop(); } else path = []; say(""); update(); });
  $(".go-reset").addEventListener("click", () => { path = []; used = []; done = false; say(""); update(); });
  $(".go-deg").addEventListener("click", (e) => { showDeg = !showDeg; e.target.setAttribute("aria-pressed", String(showDeg)); gb.draw(); });
  $(".go-next").addEventListener("click", () => { if (lv < LV.length - 1) { lv++; load(); } });
  load();
})();
