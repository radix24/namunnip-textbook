/* 카드: 스위치와 게이트로 규칙을 회로로 만들 수 있을까? — 미리 만든 회로 넷, 입력 스위치, 신호 흐름 */
(() => {
  const root = document.getElementById("card-dmath-gate-lab");
  if (!root) return;
  const { F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const OPS = { AND: (v) => v.every(Boolean), OR: (v) => v.some(Boolean), NOT: (v) => !v[0], XOR: (v) => v.filter(Boolean).length % 2 === 1, NAND: (v) => !v.every(Boolean) };
  /* 게이트: [이름, 종류, 입력 이름들, 열, 행(0~1)] — 입력은 열 0 */
  const CIRC = [
    { name: "계단 조명 (XOR)", desc: "아래층 스위치 A, 위층 스위치 B. 둘 중 하나만 바꿔도 전등이 바뀝니다.", ins: ["A", "B"], g: [["L", "XOR", ["A", "B"], 1, 0.5]] },
    { name: "금고 A·(B + C)", desc: "열쇠 A가 있고, 비밀번호 B 또는 지문 C 중 하나가 맞아야 열립니다.", ins: ["A", "B", "C"], g: [["o", "OR", ["B", "C"], 1, 0.65], ["L", "AND", ["A", "o"], 2, 0.4]] },
    { name: "다수결 AB + BC + CA", desc: "세 사람 중 둘 이상 찬성하면 통과합니다.", ins: ["A", "B", "C"], g: [["p", "AND", ["A", "B"], 1, 0.2], ["q", "AND", ["B", "C"], 1, 0.5], ["r", "AND", ["C", "A"], 1, 0.8], ["L", "OR", ["p", "q", "r"], 2, 0.5]] },
    { name: "NAND로 만든 OR", desc: "NAND 게이트 세 개만으로 OR을 만듭니다: (A′ · B′)′ = A + B.", ins: ["A", "B"], g: [["na", "NAND", ["A", "A"], 1, 0.25], ["nb", "NAND", ["B", "B"], 1, 0.75], ["L", "NAND", ["na", "nb"], 2, 0.5]] },
  ];
  const pick = $(".pick"); CIRC.forEach((c, i) => { const o = document.createElement("option"); o.value = i; o.textContent = c.name; pick.append(o); });
  let ci = 0, inp = {};
  const { ctx, size } = fit($("canvas"), () => draw());
  function evalAll(c, val) { const v = { ...val }; c.g.forEach(([id, op, ins]) => (v[id] = OPS[op](ins.map((s) => v[s])) ? 1 : 0)); return v; }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.fillStyle = "#fbfbf8"; ctx.fillRect(0, 0, w, h);
    const c = CIRC[ci], v = evalAll(c, inp), maxCol = Math.max(...c.g.map((g) => g[3])), colX = (k) => 40 + (k / (maxCol + 1)) * (w - 120);
    const pos = {}; c.ins.forEach((s, i) => (pos[s] = [colX(0), ((i + 1) / (c.ins.length + 1)) * h]));
    const gw = 70, gh = 40;
    c.g.forEach(([id, , , col, row]) => (pos[id] = [colX(col), 20 + row * (h - 40)]));
    // 선
    c.g.forEach(([id, , ins]) => ins.forEach((s, k) => {
      const [x1, y1] = pos[s], [x2, yc] = pos[id], y2 = yc - gh / 2 + ((k + 1) / (ins.length + 1)) * gh, sx = c.ins.includes(s) ? x1 + 14 : x1 + gw / 2;
      ctx.strokeStyle = v[s] ? "#e0a02a" : "#bbbbbf"; ctx.lineWidth = v[s] ? 3.5 : 2;
      ctx.beginPath(); ctx.moveTo(sx, y1); const mx = (sx + x2 - gw / 2) / 2; ctx.bezierCurveTo(mx, y1, mx, y2, x2 - gw / 2, y2); ctx.stroke();
    }));
    // 출력 전등 선
    const [lx, ly] = pos.L; ctx.strokeStyle = v.L ? "#e0a02a" : "#bbbbbf"; ctx.lineWidth = v.L ? 3.5 : 2; ctx.beginPath(); ctx.moveTo(lx + gw / 2, ly); ctx.lineTo(w - 40, ly); ctx.stroke();
    ctx.beginPath(); ctx.arc(w - 26, ly, 15, 0, 7); ctx.fillStyle = v.L ? "#f6c945" : "#dcdcd6"; ctx.fill(); ctx.strokeStyle = "#5d5d61"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = "#232326"; ctx.font = `700 12px ${F.sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(v.L ? "켜짐" : "꺼짐", w - 26, ly + 26);
    // 게이트와 입력
    c.g.forEach(([id, op]) => { const [x, y] = pos[id]; ctx.fillStyle = "#fff"; ctx.strokeStyle = "#232326"; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - gw / 2, y - gh / 2, gw, gh, op === "OR" || op === "XOR" ? 18 : 8); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#232326"; ctx.font = `700 13px ${F.mono}`; ctx.fillText(op, x, y); });
    c.ins.forEach((s) => { const [x, y] = pos[s]; ctx.beginPath(); ctx.arc(x, y, 14, 0, 7); ctx.fillStyle = inp[s] ? "#e0a02a" : "#dcdcd6"; ctx.fill(); ctx.fillStyle = "#232326"; ctx.font = `700 13px ${F.sans}`; ctx.fillText(`${s}=${inp[s]}`, x, y - 24); });
  }
  function render() {
    const c = CIRC[ci], sw = $(".sw"); sw.innerHTML = "";
    c.ins.forEach((s) => { const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = `${s} = ${inp[s]}`; b.setAttribute("aria-pressed", String(!!inp[s])); b.addEventListener("click", () => { inp[s] ^= 1; render(); }); sw.append(b); });
    $(".desc").textContent = c.desc;
    const n = c.ins.length, rows = [];
    for (let x = 0; x < 1 << n; x++) { const val = {}; c.ins.forEach((s, i) => (val[s] = (x >> (n - 1 - i)) & 1)); const out = evalAll(c, val).L, on = c.ins.every((s) => val[s] === inp[s]); rows.push(`<tr class="${on ? "on" : ""}">${c.ins.map((s) => `<td>${val[s]}</td>`).join("")}<td>${out}</td></tr>`); }
    $(".tt").innerHTML = `<tr>${c.ins.map((s) => `<th>${s}</th>`).join("")}<th>출력</th></tr>` + rows.join("");
    const v = evalAll(c, inp);
    $(".say").textContent = `출력 ${v.L} · 게이트 ${c.g.length}개` + (c.g.length > 1 ? ` · 중간 신호 ${c.g.filter((g) => g[0] !== "L").map((g) => `${g[1]}=${v[g[0]]}`).join(", ")}` : "");
    draw();
  }
  function load() { ci = +pick.value; inp = {}; CIRC[ci].ins.forEach((s) => (inp[s] = 0)); render(); }
  pick.addEventListener("change", load);
  load();
})();
