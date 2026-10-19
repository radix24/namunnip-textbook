/* 카드: 다섯 명을 세 모둠으로 나누는 방법은 몇 가지일까? — 분할 직접 만들기, 스털링 수 표 */
(() => {
  const root = document.getElementById("card-dmath-set-partition");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const NAMES = "ABCDE", COLS = ["#b5532f", "#3b7c2a", "#3f6fa3", "#7b5ea7", "#e0a02a"];
  let n, k, g, seen;
  /* 번호 다시 붙이기: 처음 나오는 순서대로 0, 1, 2 … */
  const canon = (a) => { const map = new Map(); return a.map((x) => { if (!map.has(x)) map.set(x, map.size); return map.get(x); }); };
  const text = (a) => { const c = canon(a), groups = []; c.forEach((x, i) => (groups[x] = (groups[x] || "") + NAMES[i])); return groups.map((s) => `{${s.split("").join(", ")}}`).join(" "); };
  const S = (N, K) => { const t = [[1]]; for (let i = 1; i <= N; i++) { t[i] = [0]; for (let j = 1; j <= i; j++) t[i][j] = (t[i - 1][j - 1] || 0) + j * (t[i - 1][j] || 0); } return t[N][K] || 0; };
  function render() {
    const els = $(".els"); els.innerHTML = "";
    g.forEach((x, i) => {
      const b = document.createElement("button"); b.type = "button"; b.style.borderColor = COLS[x]; b.style.color = COLS[x];
      b.innerHTML = `${NAMES[i]}<small>${x + 1}모둠</small>`; b.setAttribute("aria-label", `${NAMES[i]}: ${x + 1}모둠`);
      b.addEventListener("click", () => { g[i] = (g[i] + 1) % k; render(); });
      els.append(b);
    });
    const used = new Set(g).size, ok = used === k;
    $(".cur").textContent = `지금: ${text(g)}` + (ok ? "" : ` (빈 모둠이 있어 ${k}모둠 분할이 아닙니다)`);
    $(".say").textContent = `기록 ${seen.size}개 / S(${n}, ${k}) = ${S(n, k)}` + (seen.size ? ` · ${[...seen].slice(-4).join(" · ")}` : "");
    let rows = "<tr><th>n＼k</th>" + [1, 2, 3, 4, 5].map((j) => `<th>${j}</th>`).join("") + "<th>벨 수</th></tr>";
    for (let i = 1; i <= 5; i++) rows += `<tr><th>${i}</th>${[1, 2, 3, 4, 5].map((j) => `<td class="${i === n && j === k ? "hi" : ""}">${j <= i ? S(i, j) : ""}</td>`).join("")}<td>${[1, 2, 3, 4, 5].reduce((s, j) => s + S(i, j), 0)}</td></tr>`;
    $(".st").innerHTML = rows;
  }
  function load() { n = +$(".pn").value; k = Math.min(+$(".pk").value, n); $(".pk").value = k; g = [...Array(n)].map((_, i) => Math.min(i, k - 1)); seen = new Set(); render(); }
  $(".go-save").addEventListener("click", () => {
    if (new Set(g).size !== k) { $(".cur").textContent = "빈 모둠이 있어 기록할 수 없습니다."; return; }
    const t = text(g), had = seen.has(t); seen.add(t); render();
    if (had) $(".cur").textContent = `이미 기록한 분할입니다: ${t}`;
  });
  $(".pn").addEventListener("change", load); $(".pk").addEventListener("change", load);
  load();
})();
