/* 카드: 색이 k가지일 때 칠하는 방법은 몇 가지일까? — 직접 칠하기와 P(G, k) 표 (시간표 그래프는 가상) */
(() => {
  const root = document.getElementById("card-dmath-chromatic-poly");
  if (!root) return;
  const { C } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  const ring = (n, r = 0.44) => [...Array(n)].map((_, i) => ({ x: 0.5 + r * Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / n), y: 0.5 + r * Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / n) }));
  const cyc = (n) => [...Array(n)].map((_, i) => [i, (i + 1) % n]);
  const GR = [
    { name: "경로 P₄", V: [0, 1, 2, 3].map((i) => ({ x: 0.1 + 0.27 * i, y: i % 2 ? 0.35 : 0.65 })), E: [[0, 1], [1, 2], [2, 3]], f: "k(k − 1)³" },
    { name: "삼각형 K₃", V: ring(3), E: cyc(3), f: "k(k − 1)(k − 2)" },
    { name: "회로 C₄", V: ring(4), E: cyc(4), f: "(k − 1)⁴ + (k − 1)" },
    { name: "회로 C₅", V: ring(5), E: cyc(5), f: "(k − 1)⁵ − (k − 1)" },
    { name: "완전그래프 K₄", V: ring(4), E: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]], f: "k(k − 1)(k − 2)(k − 3)" },
    { name: "시험 시간표", V: ring(5, 0.42), E: [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [1, 4]], f: "삭제-축약으로 계산", names: ["수학", "국어", "영어", "과학", "사회"], desc: "가상의 시간표: 함께 듣는 학생이 있는 두 과목을 변으로 이었습니다." },
  ];
  const PAL = ["#e57373", "#64b5f6", "#81c784", "#ffd54f"];
  const pick = $(".pick"); GR.forEach((g, i) => { const o = document.createElement("option"); o.value = i; o.textContent = g.name; pick.append(o); });
  let gi = 0, col = [];
  const V = [], E = [];
  const clash = (k) => col[E[k][0]] >= 0 && col[E[k][0]] === col[E[k][1]];
  const gb = G.board($("canvas"), {
    V, E, pad: 34,
    vStyle: (i) => ({ r: GR[gi].names ? 24 : 16, fill: col[i] >= 0 ? PAL[col[i]] : "#f1f1ec", text: GR[gi].names ? GR[gi].names[i] : "", textColor: "#232326", stroke: "#232326" }),
    eStyle: (k) => ({ color: clash(k) ? "#c62828" : "#8d8d92", width: clash(k) ? 4 : 2.4 }),
    vClick: (i) => { const k = +$(".k").value; col[i] = col[i] + 1 >= k ? -1 : col[i] + 1; update(); },
  });
  function count(k) { const n = V.length, c = Array(n).fill(-1); let total = 0; const go = (i) => { if (i === n) { total++; return; } for (let t = 0; t < k; t++) if (!E.some(([a, b]) => (a === i && c[b] === t) || (b === i && c[a] === t))) { c[i] = t; go(i + 1); c[i] = -1; } }; go(0); return total; }
  function update() {
    const k = +$(".k").value, g = GR[gi];
    col = col.map((x) => (x >= k ? -1 : x));
    const bad = E.filter((_, j) => clash(j)).length, done = col.every((x) => x >= 0);
    const P = [1, 2, 3, 4, 5].map(count), chi = P.findIndex((x) => x > 0) + 1;
    $(".desc").textContent = g.desc || "꼭짓점을 누를 때마다 색이 바뀝니다(마지막에는 지워짐).";
    $(".say").textContent = (done ? (bad ? `같은 색으로 이어진 변 ${bad}개` : `올바르게 칠했습니다! (${k}가지 색)`) : `칠한 꼭짓점 ${col.filter((x) => x >= 0).length} / ${V.length}`) + ` · P(G, ${k}) = ${P[k - 1]} · 채색수 χ = ${chi} · 공식 ${g.f}`;
    $(".st").innerHTML = `<tr><th>k</th>${[1, 2, 3, 4, 5].map((x) => `<th>${x}</th>`).join("")}</tr><tr><th>P(G, k)</th>${P.map((x, i) => `<td class="${i + 1 === k ? "hi" : ""}">${x}</td>`).join("")}</tr>`;
    gb.draw();
  }
  function load() { gi = +pick.value; V.length = 0; E.length = 0; GR[gi].V.forEach((v) => V.push({ ...v })); GR[gi].E.forEach((e) => E.push(e)); col = V.map(() => -1); update(); }
  pick.addEventListener("change", load);
  $(".k").addEventListener("change", update);
  load();
})();
