/* 카드: 차수 목록만 보고 그런 그래프가 있는지 알 수 있을까? — 목표 차수대로 변 잇기, 하벨-하키미 */
(() => {
  const root = document.getElementById("card-dmath-degree-seq");
  if (!root) return;
  const { C } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  const LV = [[3, 3, 2, 2, 2], [5, 3, 2, 2, 1, 1], [3, 3, 3, 1], [4, 4, 4, 4, 4], [3, 3, 3, 3, 3], [4, 4, 1, 1, 1, 1]];
  let lv = 0, sel = -1, solved = false;
  const V = [], E = [];
  const key = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  const left = () => { const d = G.degrees(V.length, E); return LV[lv].map((t, i) => t - d[i]); };
  function hh(seq) {
    const lines = []; let s = seq.slice().sort((a, b) => b - a);
    while (true) {
      lines.push(`(${s.join(", ")})`);
      if (s.some((x) => x < 0)) return { ok: false, lines };
      if (s.every((x) => x === 0)) return { ok: true, lines };
      const d = s.shift(); if (d > s.length) { lines.push(`${d}개를 빼야 하는데 남은 수가 ${s.length}개뿐`); return { ok: false, lines }; }
      for (let i = 0; i < d; i++) s[i]--;
      s.sort((a, b) => b - a);
    }
  }
  const gb = G.board($("canvas"), {
    V, E,
    vStyle: (i) => { const l = left()[i]; return { r: 17, text: LV[lv][i], fill: i === sel ? "#e0a02a" : l === 0 ? "#dcebd5" : C.card, badge: l, badgeColor: l === 0 ? C.forest : l < 0 ? C.warn : C.ink2 }; },
    eStyle: () => ({ color: "#3f6fa3", width: 2.4 }),
    vClick: (i) => {
      if (solved) return;
      if (sel < 0) { sel = i; update(); return; }
      if (sel !== i) { const k = E.findIndex((e) => key(...e) === key(sel, i)); if (k >= 0) E.splice(k, 1); else E.push([sel, i]); }
      sel = -1; update();
    },
  });
  function load() {
    const n = LV[lv].length; V.length = 0; E.length = 0;
    for (let i = 0; i < n; i++) V.push({ x: 0.5 + 0.45 * Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / n), y: 0.5 + 0.45 * Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / n) });
    sel = -1; solved = false; $(".verdict").textContent = ""; $(".verdict").className = "verdict"; $(".hh").textContent = ""; $(".go-next").disabled = true; update();
  }
  const win = (msg, good = true) => { solved = true; $(".verdict").textContent = msg; $(".verdict").className = "verdict " + (good ? "good" : "bad"); $(".go-next").disabled = lv === LV.length - 1; };
  function update() {
    const seq = LV[lv], sum = seq.reduce((s, x) => s + x, 0);
    $(".lv").textContent = `${lv + 1} / ${LV.length} · 목표 차수열 (${seq.join(", ")}) · 합 ${sum}`;
    if (!solved && left().every((x) => x === 0)) win(`성공! 변 ${E.length}개 = 합 ${sum} ÷ 2`);
    gb.draw();
  }
  $(".go-no").addEventListener("click", () => {
    if (solved) return; const r = hh(LV[lv]), sum = LV[lv].reduce((s, x) => s + x, 0);
    if (!r.ok) win(`맞습니다. 불가능합니다.` + (sum % 2 ? ` 합 ${sum}이 홀수입니다.` : " 합은 짝수지만 하벨-하키미에서 막힙니다."));
    else { $(".verdict").textContent = "가능한 목록입니다. 조금 더 시도해 보세요(하벨-하키미 방법이 힌트가 됩니다)."; $(".verdict").className = "verdict bad"; }
  });
  $(".go-hh").addEventListener("click", () => { const r = hh(LV[lv]); $(".hh").textContent = r.lines.join(" → ") + (r.ok ? " → 모두 0: 가능" : " → 음수 또는 부족: 불가능"); });
  $(".go-clr").addEventListener("click", () => { if (!solved) { E.length = 0; sel = -1; update(); } });
  $(".go-next").addEventListener("click", () => { if (lv < LV.length - 1) { lv++; load(); } });
  load();
})();
