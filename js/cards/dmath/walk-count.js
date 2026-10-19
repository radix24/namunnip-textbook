/* 카드: 세 번 갈아타서 도착하는 항공편 경로는 몇 가지일까? — 가상 노선의 Aᵏ와 경로 목록 */
(() => {
  const root = document.getElementById("card-dmath-walk-count");
  if (!root) return;
  const { C } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  const NAMES = ["서울", "부산", "제주", "광주", "대구"];
  const V = [{ x: 0.35, y: 0.08 }, { x: 0.9, y: 0.62 }, { x: 0.18, y: 0.92 }, { x: 0.08, y: 0.55 }, { x: 0.72, y: 0.3 }];
  const E = [[0, 2], [0, 4], [0, 3], [1, 2], [2, 3], [4, 1], [2, 4]]; // 수업용 가상 노선
  const N = NAMES.length, A = [...Array(N)].map(() => Array(N).fill(0));
  E.forEach(([a, b]) => { A[a][b] = 1; A[b][a] = 1; });
  const mul = (X, Y) => X.map((r) => Y[0].map((_, j) => r.reduce((s, x, m) => s + x * Y[m][j], 0)));
  ["s", "t"].forEach((c, ci) => NAMES.forEach((nm, i) => { const o = document.createElement("option"); o.value = i; o.textContent = nm; if (i === ci) o.selected = true; $(`.${c}`).append(o); }));
  const gb = G.board($("canvas"), {
    V, E, pad: 30,
    vStyle: (i) => ({ r: 20, text: NAMES[i], fill: i === +$(".s").value ? "#f6d38a" : i === +$(".t").value ? "#cfe6c4" : C.card }),
    eStyle: () => ({ color: "#3f6fa3", width: 2.4 }),
  });
  function walks(s, t, k) { const out = []; const go = (cur, path) => { if (path.length === k + 1) { if (cur === t) out.push(path.slice()); return; } for (let m = 0; m < N; m++) if (A[cur][m]) { path.push(m); go(m, path); path.pop(); } }; go(s, [s]); return out; }
  function update() {
    const s = +$(".s").value, t = +$(".t").value, k = +$(".k").value;
    let P = A; for (let i = 1; i < k; i++) P = mul(P, A);
    $(".cap").textContent = `A${k === 1 ? "" : ["", "", "²", "³", "⁴"][k]}`;
    $(".am").innerHTML = `<tr><th></th>${NAMES.map((n) => `<th>${n}</th>`).join("")}</tr>` + P.map((r, i) => `<tr><th>${NAMES[i]}</th>${r.map((x, j) => `<td class="${i === s && j === t ? "hi" : ""}">${x}</td>`).join("")}</tr>`).join("");
    const W = walks(s, t, k);
    $(".say").textContent = `${NAMES[s]} → ${NAMES[t]}, 비행 ${k}번: 표의 값 ${P[s][t]} · 직접 센 경로 ${W.length}가지` + (k === 2 ? ` · 대각선 = 노선 수(차수) ${G.degrees(N, E).join(", ")}` : "");
    $(".walks").textContent = W.length ? W.slice(0, 60).map((p) => p.map((i) => NAMES[i]).join("→")).join(" · ") + (W.length > 60 ? " …" : "") : "경로가 없습니다.";
    gb.draw();
  }
  ["s", "t", "k"].forEach((c) => $(`.${c}`).addEventListener("change", update));
  update();
})();
