/* 카드: 악수한 횟수를 모두 더하면 왜 늘 짝수일까? — 변 잇기와 차수의 합 = 2|E| */
(() => {
  const root = document.getElementById("card-dmath-handshake");
  if (!root) return;
  const { C } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  const N = 7, V = [...Array(N)].map((_, i) => ({ x: 0.5 + 0.45 * Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / N), y: 0.5 + 0.45 * Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / N), label: "ABCDEFG"[i] }));
  const E = [[0, 1], [1, 2], [2, 0], [3, 4]];
  let sel = -1;
  const key = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);
  const gb = G.board($("canvas"), {
    V, E,
    vStyle: (i) => { const d = G.degrees(N, E)[i]; return { r: 15, fill: i === sel ? "#e0a02a" : d % 2 ? "#f7d9cf" : C.card, badge: d, badgeColor: d % 2 ? C.warn : C.forest }; },
    eStyle: () => ({ color: "#3f6fa3", width: 2.4 }),
    vClick: (i) => {
      if (sel < 0) { sel = i; update(); return; }
      if (sel !== i) { const k = E.findIndex((e) => key(...e) === key(sel, i)); if (k >= 0) E.splice(k, 1); else E.push([sel, i]); }
      sel = -1; update();
    },
  });
  function update() {
    const d = G.degrees(N, E), sum = d.reduce((s, x) => s + x, 0), odd = d.filter((x) => x % 2).length;
    $(".say").textContent = (sel >= 0 ? `${V[sel].label} 선택 · ` : "") + `차수 ${d.join(" + ")} = ${sum} · 변 ${E.length}개 × 2 = ${2 * E.length} · 차수가 홀수인 꼭짓점 ${odd}개(분홍)`;
    gb.draw();
  }
  $(".go-rand").addEventListener("click", () => { E.length = 0; for (let a = 0; a < N; a++) for (let b = a + 1; b < N; b++) if (Math.random() < 0.35) E.push([a, b]); sel = -1; update(); });
  $(".go-full").addEventListener("click", () => { E.length = 0; for (let a = 0; a < N; a++) for (let b = a + 1; b < N; b++) E.push([a, b]); sel = -1; update(); });
  $(".go-clr").addEventListener("click", () => { E.length = 0; sel = -1; update(); });
  update();
})();
