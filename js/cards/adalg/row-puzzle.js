/* 카드: 세 가지 행 연산만으로 어떤 연립방정식이든 풀 수 있을까? — 첨가행렬에 행 연산을 직접 적용 */
(() => {
  const root = document.getElementById("card-adalg-row-puzzle");
  if (!root) return;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  const P = [
    [[1, 1, 1, 6], [2, -1, 1, 3], [1, 2, -1, 2]],      // x=1, y=2, z=3
    [[1, 2, -1, 3], [2, 4, 1, 9], [3, 6, 0, 12]],      // 무수히 많음
    [[1, -1, 2, 4], [2, 1, 1, 5], [3, 0, 3, 7]],       // 해 없음
  ];
  let M, hist, hi = -1, steps = 0;
  const VAR = ["x", "y", "z"];
  const parse = (s) => { s = String(s).trim().replace("−", "-"); const m = s.match(/^(-?\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?$/); return m ? +m[1] / (m[2] ? +m[2] : 1) : NaN; };
  const clean = (r) => r.map((x) => (Math.abs(x) < 1e-9 ? 0 : Math.round(x * 1e9) / 1e9));
  function eqs() {
    return M.map((r) => {
      let s = "";
      r.slice(0, 3).forEach((a, j) => {
        if (Math.abs(a) < 1e-9) return;
        const f = L.frac(Math.abs(a)), c = f === "1" ? "" : f;
        s += s ? (a < 0 ? " − " : " + ") : a < 0 ? "−" : "";
        s += c + VAR[j];
      });
      return `${s || "0"} = ${L.frac(r[3])}`;
    }).join("<br>");
  }
  /* 행 사다리꼴: 0행은 아래, 피벗 열이 오른쪽으로 */
  function shape() {
    const piv = M.map((r) => r.findIndex((x) => Math.abs(x) > 1e-9));
    let last = -1, zero = false, ech = true;
    piv.forEach((p) => { if (p < 0) zero = true; else { if (zero || p <= last) ech = false; last = p; } });
    if (!ech) return { ech: false };
    let red = true;
    piv.forEach((p, i) => { if (p < 0 || p > 2) return; if (Math.abs(M[i][p] - 1) > 1e-9) red = false; M.forEach((r, k) => { if (k !== i && Math.abs(r[p]) > 1e-9) red = false; }); });
    return { ech, red, piv };
  }
  function render() {
    $(".mat").innerHTML = L.table(M, { bar: 3, hiRow: hi });
    $(".eqs").innerHTML = eqs();
    const s = shape(), v = $(".verdict");
    if (!s.ech) { v.textContent = ""; v.className = "verdict"; return; }
    const bad = s.piv.some((p) => p === 3), nPiv = s.piv.filter((p) => p >= 0 && p < 3).length;
    let sol = bad ? "마지막 열에 피벗이 있어 0 = (0이 아닌 수)인 식이 생겼습니다. 해가 없습니다."
      : nPiv === 3 ? (s.red ? `해가 하나: x = ${L.frac(M[0][3])}, y = ${L.frac(M[1][3])}, z = ${L.frac(M[2][3])}` : "피벗이 3개라 해가 하나입니다. 기약 행 사다리꼴까지 가면 바로 읽힙니다.")
      : `피벗이 ${nPiv}개라 자유변수가 ${3 - nPiv}개, 해가 무수히 많습니다.`;
    v.textContent = `${s.red ? "기약 행 사다리꼴" : "행 사다리꼴"} 도달 (${steps}번). ${sol}`;
    v.className = "verdict good";
  }
  function load() { M = P[+$(".pick").value].map((r) => r.slice()); hist = []; hi = -1; steps = 0; $(".log").textContent = "—"; render(); }
  $(".go").addEventListener("click", () => {
    const op = $(".op").value, i = +$(".ri").value - 1, j = +$(".rj").value - 1, k = parse($(".k").value);
    const log = $(".log");
    if (op !== "scale" && i === j) { log.textContent = "i와 j는 서로 다른 행이어야 합니다."; return; }
    if (op !== "swap" && !Number.isFinite(k)) { log.textContent = "k에 수를 넣으세요. 분수는 -1/2처럼 씁니다."; return; }
    if (op === "scale" && Math.abs(k) < 1e-12) { log.textContent = "0을 곱하면 식이 사라집니다. 행 연산이 아닙니다."; return; }
    hist.push(M.map((r) => r.slice()));
    if (op === "swap") { [M[i], M[j]] = [M[j], M[i]]; log.textContent = `R${i + 1} ↔ R${j + 1}`; }
    else if (op === "scale") { M[i] = clean(M[i].map((x) => x * k)); log.textContent = `R${i + 1} ← ${L.frac(k)}·R${i + 1}`; }
    else { M[i] = clean(M[i].map((x, c) => x + k * M[j][c])); log.textContent = `R${i + 1} ← R${i + 1} + (${L.frac(k)})·R${j + 1}`; }
    hi = i; steps++; render();
  });
  $(".op").addEventListener("change", () => { const sw = $(".op").value === "swap", sc = $(".op").value === "scale"; $(".k").disabled = sw; $(".rj").disabled = sc; });
  $(".undo").addEventListener("click", () => { if (hist.length) { M = hist.pop(); steps = Math.max(0, steps - 1); hi = -1; render(); } });
  $(".reset").addEventListener("click", load);
  $(".pick").addEventListener("change", load);
  load();
})();
