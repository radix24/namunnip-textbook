/* 카드: 바둑판 도시에서 가장 짧은 길은 몇 가지일까? — 최단 경로 = 같은 것이 있는 순열, 막힌 교차로 */
(() => {
  const root = document.getElementById("card-dmath-grid-path");
  if (!root) return;
  const { C, F, fit } = NM;
  const D = NMDm;
  const $ = (s) => root.querySelector(s);
  const mIn = $(".m"), nIn = $(".n");
  let m = 5, n = 3, path = [], blocked = new Set(), showCnt = false, geo = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const key = (x, y) => `${x},${y}`;
  function counts() {
    const c = [...Array(m + 1)].map(() => Array(n + 1).fill(0n));
    for (let x = 0; x <= m; x++) for (let y = 0; y <= n; y++) {
      if (blocked.has(key(x, y))) continue;
      c[x][y] = x === 0 && y === 0 ? 1n : (x ? c[x - 1][y] : 0n) + (y ? c[x][y - 1] : 0n);
    }
    return c;
  }
  const pos = () => path.reduce(([x, y], s) => (s === "→" ? [x + 1, y] : [x, y + 1]), [0, 0]);
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pad = 30, s = Math.min((w - 2 * pad) / m, (h - 2 * pad) / n), ox = (w - s * m) / 2, oy = (h + s * n) / 2;
    const P = (x, y) => [ox + x * s, oy - y * s];
    geo = { P, s };
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 2;
    for (let x = 0; x <= m; x++) { ctx.beginPath(); ctx.moveTo(...P(x, 0)); ctx.lineTo(...P(x, n)); ctx.stroke(); }
    for (let y = 0; y <= n; y++) { ctx.beginPath(); ctx.moveTo(...P(0, y)); ctx.lineTo(...P(m, y)); ctx.stroke(); }
    // 내 경로
    let [x, y] = [0, 0]; ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(...P(0, 0));
    path.forEach((st) => { if (st === "→") x++; else y++; ctx.lineTo(...P(x, y)); }); ctx.stroke(); ctx.lineCap = "butt";
    const c = counts();
    for (let i = 0; i <= m; i++) for (let j = 0; j <= n; j++) {
      const [px, py] = P(i, j);
      if (blocked.has(key(i, j))) { ctx.strokeStyle = C.warn; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px - 7, py - 7); ctx.lineTo(px + 7, py + 7); ctx.moveTo(px + 7, py - 7); ctx.lineTo(px - 7, py + 7); ctx.stroke(); continue; }
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(px, py, 3, 0, 7); ctx.fill();
      if (showCnt) { ctx.fillStyle = C.forest; ctx.font = `700 11px ${F.mono}`; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(D.big(c[i][j]), px + 4, py - 3); }
    }
    ctx.fillStyle = C.ink; ctx.font = `700 13px ${F.sans}`; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText("S", P(0, 0)[0] - 6, P(0, 0)[1] + 4);
    ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText("T", P(m, n)[0] + 6, P(m, n)[1] - 4);
  }
  function update() {
    $(".m-out").textContent = m; $(".n-out").textContent = n;
    $(".path").textContent = path.length ? `내 길: ${path.join(" ")}` + (path.length === m + n ? ` (완성 · → ${m}개, ↑ ${n}개)` : "") : "내 길: (버튼으로 만드세요)";
    const total = counts()[m][n], free = D.C(m + n, n);
    $(".say").textContent = `막힌 곳이 없으면 (${m}+${n})!/(${m}!·${n}!) = ${D.big(free)}가지` + (blocked.size ? ` · 막힌 교차로 ${blocked.size}곳을 피하면 ${D.big(total)}가지` : "");
    draw();
  }
  const step = (s) => { const [x, y] = pos(); if (s === "→" ? x >= m : y >= n) return; const nx = s === "→" ? x + 1 : x, ny = s === "→" ? y : y + 1; if (blocked.has(key(nx, ny))) { $(".path").textContent = "그 교차로는 공사 중입니다."; return; } path.push(s); update(); };
  $(".go-r").addEventListener("click", () => step("→"));
  $(".go-u").addEventListener("click", () => step("↑"));
  $(".go-clr").addEventListener("click", () => { path = []; update(); });
  $(".go-cnt").addEventListener("click", (e) => { showCnt = !showCnt; e.target.setAttribute("aria-pressed", String(showCnt)); draw(); });
  cv.addEventListener("click", (e) => {
    if (!geo) return; const b = cv.getBoundingClientRect(), px = e.clientX - b.left, py = e.clientY - b.top;
    for (let i = 0; i <= m; i++) for (let j = 0; j <= n; j++) {
      if ((i === 0 && j === 0) || (i === m && j === n)) continue;
      const [qx, qy] = geo.P(i, j);
      if (Math.hypot(px - qx, py - qy) < 12) { const k = key(i, j); blocked.has(k) ? blocked.delete(k) : blocked.add(k); path = []; update(); return; }
    }
  });
  [mIn, nIn].forEach((el) => el.addEventListener("input", () => { m = +mIn.value; n = +nIn.value; path = []; blocked.clear(); update(); }));
  update();
})();
