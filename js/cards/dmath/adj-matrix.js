/* 카드: 그래프를 수의 표로 바꾸면 무엇을 계산할 수 있을까? — 그래프와 인접행렬을 함께 편집 */
(() => {
  const root = document.getElementById("card-dmath-adj-matrix");
  if (!root) return;
  const { C } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  const N = 5, L = "12345";
  const V = [...Array(N)].map((_, i) => ({ x: 0.5 + 0.43 * Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / N), y: 0.5 + 0.43 * Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / N), label: L[i] }));
  let A = [...Array(N)].map(() => Array(N).fill(0)), dir = false, sel = -1;
  [[0, 1], [1, 2], [2, 3], [0, 3], [3, 4]].forEach(([a, b]) => { A[a][b] = 1; A[b][a] = 1; });
  const E = [];
  const sync = () => { E.length = 0; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (A[i][j] && (dir || i < j)) E.push([i, j]); };
  const toggle = (i, j) => { if (i === j) return; A[i][j] ^= 1; if (!dir) A[j][i] = A[i][j]; update(); };
  const gb = G.board($("canvas"), {
    V, E, pad: 24,
    vStyle: (i) => ({ r: 14, fill: i === sel ? "#e0a02a" : C.card }),
    eStyle: () => ({ color: "#3f6fa3", width: 2.4 }),
    over: (ctx, P) => { if (!dir) return; E.forEach(([a, b]) => { const p = P(a), q = P(b), t = Math.atan2(q[1] - p[1], q[0] - p[0]), x = q[0] - 15 * Math.cos(t), y = q[1] - 15 * Math.sin(t); ctx.fillStyle = "#3f6fa3"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10 * Math.cos(t - 0.4), y - 10 * Math.sin(t - 0.4)); ctx.lineTo(x - 10 * Math.cos(t + 0.4), y - 10 * Math.sin(t + 0.4)); ctx.fill(); }); },
    vClick: (i) => { if (sel < 0) { sel = i; gb.draw(); return; } const s = sel; sel = -1; toggle(s, i); },
  });
  function update() {
    sync();
    const rows = A.map((r, i) => `<tr><th>${L[i]}</th>${r.map((x, j) => `<td><button type="button" data-i="${i}" data-j="${j}" class="${x ? "one" : ""}" ${i === j ? "disabled" : ""} aria-label="${L[i]}에서 ${L[j]}: ${x}">${x}</button></td>`).join("")}<td class="sum">${r.reduce((s, x) => s + x, 0)}</td></tr>`).join("");
    $(".am").innerHTML = `<tr><th></th>${[...L].map((c) => `<th>${c}</th>`).join("")}<th>행의 합</th></tr>` + rows;
    $(".am").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => toggle(+b.dataset.i, +b.dataset.j)));
    const sym = A.every((r, i) => r.every((x, j) => x === A[j][i])), total = A.flat().reduce((s, x) => s + x, 0);
    const cols = [...Array(N)].map((_, j) => A.reduce((s, r) => s + r[j], 0));
    $(".say").textContent = `성분의 합 ${total} · 변 ${E.length}개 · ${sym ? "대칭행렬" : "대칭이 아님"}` + (dir ? ` · 열의 합(들어오는 변) ${cols.join(", ")}` : ` · 행의 합 = 차수 ${G.degrees(N, E).join(", ")}`);
    gb.draw();
  }
  root.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => {
    dir = b.dataset.d === "1"; root.querySelectorAll("[data-d]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    if (!dir) A = A.map((r, i) => r.map((x, j) => (x || A[j][i] ? 1 : 0)));
    update();
  }));
  update();
})();
