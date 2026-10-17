/* 카드: 엉킨 그래프를 선이 겹치지 않게 펼 수 있을까? — 꼭짓점 끌기로 교차 없애기, K₅·K₃,₃ */
(() => {
  const root = document.getElementById("card-dmath-untangle");
  if (!root) return;
  const { C } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  const K = (n) => { const e = []; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) e.push([a, b]); return e; };
  const LV = [
    { name: "K₄", n: 4, E: K(4), planar: true },
    { name: "꼭짓점 6개 그래프", n: 6, E: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 4], [4, 2], [3, 5], [5, 0], [4, 5]], planar: true },
    { name: "정육면체", n: 8, E: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], planar: true },
    { name: "팔면체", n: 6, E: [[0, 1], [0, 2], [0, 3], [0, 4], [5, 1], [5, 2], [5, 3], [5, 4], [1, 2], [2, 3], [3, 4], [4, 1]], planar: true },
    { name: "K₅", n: 5, E: K(5), planar: false },
    { name: "K₃,₃ (세 집과 수도·가스·전기)", n: 6, E: [[0, 3], [0, 4], [0, 5], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5]], planar: false },
  ];
  let lv = 0, best = Infinity, done = false;
  const V = [], E = [];
  let bad = new Set();
  const gb = G.board($("canvas"), {
    V, E, drag: true,
    vStyle: (i) => ({ r: 11, fill: lv === 5 ? (i < 3 ? "#f6d38a" : "#cfe6c4") : C.card, text: lv === 5 ? ["집", "집", "집", "수", "가", "전"][i] : "" }),
    eStyle: (k) => ({ color: bad.has(k) ? C.warn : "#3f6fa3", width: bad.has(k) ? 3 : 2.4 }),
    change: () => update(),
  });
  function shuffle() { const n = LV[lv].n; V.length = 0; for (let i = 0; i < n; i++) { const a = (2 * Math.PI * ((i * 7) % n)) / n + Math.random() * 0.3; V.push({ x: 0.5 + 0.45 * Math.cos(a), y: 0.5 + 0.45 * Math.sin(a) }); } }
  function load() { E.length = 0; LV[lv].E.forEach((e) => E.push(e)); shuffle(); best = Infinity; done = false; $(".verdict").textContent = ""; $(".verdict").className = "verdict"; $(".go-next").disabled = true; update(); }
  function update() {
    const { n, pairs } = G.crossings(V, E); bad = new Set(pairs.flat()); best = Math.min(best, n);
    $(".lv").textContent = `${lv + 1} / ${LV.length} · ${LV[lv].name} · 꼭짓점 ${LV[lv].n}, 변 ${E.length} · 지금 교차 ${n}개 (최소 기록 ${best})`;
    if (!done && n === 0) { done = true; $(".verdict").textContent = "교차가 없습니다! 평면그래프입니다."; $(".verdict").className = "verdict good"; $(".go-next").disabled = lv === LV.length - 1; }
    gb.draw();
  }
  $(".go-no").addEventListener("click", () => {
    if (done) return;
    if (!LV[lv].planar) { done = true; $(".verdict").textContent = `맞습니다. ${LV[lv].name}은 비평면그래프라 교차를 1개보다 적게 할 수 없습니다. 다음 카드의 오일러 공식으로 증명할 수 있습니다.`; $(".verdict").className = "verdict good"; $(".go-next").disabled = lv === LV.length - 1; }
    else { $(".verdict").textContent = "이 그래프는 평면그래프입니다. 조금 더 시도해 보세요."; $(".verdict").className = "verdict bad"; }
  });
  $(".go-shuffle").addEventListener("click", () => { shuffle(); done = false; $(".verdict").textContent = ""; update(); });
  $(".go-next").addEventListener("click", () => { if (lv < LV.length - 1) { lv++; load(); } });
  load();
})();
