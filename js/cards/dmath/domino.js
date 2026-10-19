/* 카드: 2×n 복도에 1×2 타일을 까는 방법은 몇 가지일까? — 왼쪽부터 세로(V)·가로 두 개(H) 놓기 */
(() => {
  const root = document.getElementById("card-dmath-domino");
  if (!root) return;
  const { F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n");
  let n = 5, cur = [], found = new Map();
  const big = fit($(".big"), () => paint(big, cur, n));
  const len = (seq) => seq.reduce((s, t) => s + (t === "V" ? 1 : 2), 0);
  function paint(f, seq, N) {
    const { ctx, size: { w, h } } = f; if (!w) return;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
    const c = Math.min((w - 8) / N, (h - 8) / 2), ox = (w - c * N) / 2, oy = (h - 2 * c) / 2;
    ctx.strokeStyle = "#d9dad2"; ctx.lineWidth = 1;
    for (let i = 0; i <= N; i++) { ctx.beginPath(); ctx.moveTo(ox + i * c, oy); ctx.lineTo(ox + i * c, oy + 2 * c); ctx.stroke(); }
    [0, 1, 2].forEach((j) => { ctx.beginPath(); ctx.moveTo(ox, oy + j * c); ctx.lineTo(ox + N * c, oy + j * c); ctx.stroke(); });
    let x = 0;
    seq.forEach((t) => {
      const g = 2;
      if (t === "V") { ctx.fillStyle = "#3f6fa3"; ctx.fillRect(ox + x * c + g, oy + g, c - 2 * g, 2 * c - 2 * g); x += 1; }
      else { ctx.fillStyle = "#e0a02a"; ctx.fillRect(ox + x * c + g, oy + g, 2 * c - 2 * g, c - 2 * g); ctx.fillRect(ox + x * c + g, oy + c + g, 2 * c - 2 * g, c - 2 * g); x += 2; }
    });
  }
  const fib = (k) => { let a = 1, b = 1; for (let i = 1; i < k; i++) [a, b] = [b, a + b]; return k === 0 ? 1 : b; };
  function update() {
    $(".n-out").textContent = n;
    const L = len(cur), full = L === n;
    if (full) { const key = cur.join(""); if (!found.has(key)) { found.set(key, cur.slice()); gallery(); } }
    const startV = [...found.keys()].filter((k) => k[0] === "V").length, startH = found.size - startV;
    $(".say").textContent = `채운 길이 ${L} / ${n}` + (full ? " · 완성!" : "") + ` · 찾은 배치 ${found.size} / a${n} = ${fib(n)} (세로로 시작 ${startV}, 가로로 시작 ${startH})` + ` · 수열 ${[1, 2, 3, 4, 5, 6, 7, 8].map(fib).join(", ")}`;
    paint(big, cur, n);
  }
  function gallery() {
    const gal = $(".gal"); gal.innerHTML = "";
    [...found.values()].forEach((seq) => { const c = document.createElement("canvas"); c.className = "no-invert"; c.setAttribute("aria-label", seq.map((t) => (t === "V" ? "세로" : "가로 둘")).join(", ")); gal.append(c); const f = fit(c, () => paint(f, seq, n)); paint(f, seq, n); });
  }
  const add = (t) => { if (len(cur) === n) cur = []; if (len(cur) + (t === "V" ? 1 : 2) > n) { $(".say").textContent = "남은 길이가 모자랍니다."; return; } cur.push(t); update(); };
  $(".go-v").addEventListener("click", () => add("V"));
  $(".go-h").addEventListener("click", () => add("H"));
  $(".go-back").addEventListener("click", () => { cur.pop(); update(); });
  nIn.addEventListener("input", () => { n = +nIn.value; cur = []; found.clear(); gallery(); update(); });
  update();
})();
