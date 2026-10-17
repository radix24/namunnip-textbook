/* 카드: 지도를 칠하는 데 색이 최소 몇 가지 필요할까? — 칸으로 만든 가상 지도, 경계 충돌, 채색수 */
(() => {
  const root = document.getElementById("card-dmath-map-color");
  if (!root) return;
  const { F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  /* 가상 지도: 글자마다 한 지역. 가운데 F를 B, C, G, I, E 다섯 지역이 둘러쌈 */
  const MAP = [
    "AAABBBBBCCCC",
    "AAABBBBBCCDD",
    "EEEBBFFCCDDD",
    "EEEEFFFFGGDD",
    "HEEEFFFFGGGJ",
    "HHHIIIFGGJJJ",
    "HHKKIIIIGJJJ",
    "KKKKKKILLLJJ",
  ];
  const R = MAP.length, Cn = MAP[0].length, IDS = [...new Set(MAP.join(""))].sort();
  const PAL = ["#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8"];
  const adj = IDS.map(() => new Set());
  for (let r = 0; r < R; r++) for (let c = 0; c < Cn; c++) { const a = IDS.indexOf(MAP[r][c]); [[0, 1], [1, 0]].forEach(([dr, dc]) => { const rr = r + dr, cc = c + dc; if (rr < R && cc < Cn) { const b = IDS.indexOf(MAP[rr][cc]); if (a !== b) { adj[a].add(b); adj[b].add(a); } } }); }
  let col = IDS.map(() => -1), cur = 0, showG = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const cell = () => Math.min(size.w / Cn, size.h / R);
  const center = (i) => { let sx = 0, sy = 0, n = 0; for (let r = 0; r < R; r++) for (let c = 0; c < Cn; c++) if (MAP[r][c] === IDS[i]) { sx += c + 0.5; sy += r + 0.5; n++; } return [sx / n, sy / n]; };
  function draw() {
    const { w, h } = size; if (!w) return;
    const s = cell(), ox = (w - s * Cn) / 2, oy = (h - s * R) / 2;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
    for (let r = 0; r < R; r++) for (let c = 0; c < Cn; c++) { const i = IDS.indexOf(MAP[r][c]); ctx.fillStyle = col[i] < 0 ? "#f1f1ec" : PAL[col[i]]; ctx.fillRect(ox + c * s, oy + r * s, s + 0.5, s + 0.5); }
    // 경계
    for (let r = 0; r < R; r++) for (let c = 0; c < Cn; c++) {
      const a = IDS.indexOf(MAP[r][c]);
      [[0, 1], [1, 0]].forEach(([dr, dc]) => {
        const rr = r + dr, cc = c + dc; if (rr >= R || cc >= Cn) return; const b = IDS.indexOf(MAP[rr][cc]); if (a === b) return;
        const clash = col[a] >= 0 && col[a] === col[b];
        ctx.strokeStyle = clash ? "#c62828" : "#5d5d61"; ctx.lineWidth = clash ? 4 : 1.5; ctx.beginPath();
        if (dc) { ctx.moveTo(ox + (c + 1) * s, oy + r * s); ctx.lineTo(ox + (c + 1) * s, oy + (r + 1) * s); } else { ctx.moveTo(ox + c * s, oy + (r + 1) * s); ctx.lineTo(ox + (c + 1) * s, oy + (r + 1) * s); }
        ctx.stroke();
      });
    }
    ctx.strokeStyle = "#232326"; ctx.lineWidth = 2; ctx.strokeRect(ox, oy, s * Cn, s * R);
    if (showG) { ctx.strokeStyle = "rgba(35,35,38,.55)"; ctx.lineWidth = 1.5; adj.forEach((set, a) => set.forEach((b) => { if (a < b) { const p = center(a), q = center(b); ctx.beginPath(); ctx.moveTo(ox + p[0] * s, oy + p[1] * s); ctx.lineTo(ox + q[0] * s, oy + q[1] * s); ctx.stroke(); } })); }
    ctx.font = `700 ${Math.round(s * 0.45)}px ${F.sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    IDS.forEach((id, i) => { const [x, y] = center(i); if (showG) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ox + x * s, oy + y * s, s * 0.32, 0, 7); ctx.fill(); } ctx.fillStyle = "#232326"; ctx.fillText(id, ox + x * s, oy + y * s); });
  }
  function chi() { for (let k = 1; k <= 5; k++) { const c = IDS.map(() => -1); const go = (i) => { if (i === IDS.length) return true; for (let t = 0; t < k; t++) if (![...adj[i]].some((j) => c[j] === t)) { c[i] = t; if (go(i + 1)) return true; c[i] = -1; } return false; }; if (go(0)) return k; } return 5; }
  function update(extra = "") {
    const clashes = []; adj.forEach((set, a) => set.forEach((b) => { if (a < b && col[a] >= 0 && col[a] === col[b]) clashes.push(`${IDS[a]}–${IDS[b]}`); }));
    const used = new Set(col.filter((x) => x >= 0)).size, all = col.every((x) => x >= 0);
    $(".say").textContent = `칠한 지역 ${col.filter((x) => x >= 0).length} / ${IDS.length} · 쓴 색 ${used}가지` + (clashes.length ? ` · 같은 색 이웃: ${clashes.join(", ")}` : "") + (all && !clashes.length ? ` · 완성! ${used}가지 색으로 칠했습니다.` : "") + extra;
    draw();
  }
  const pal = $(".pal");
  PAL.forEach((p, i) => { const b = document.createElement("button"); b.type = "button"; b.style.background = p; b.setAttribute("aria-label", `색 ${i + 1}`); b.setAttribute("aria-pressed", String(i === 0)); b.addEventListener("click", () => { cur = i; pal.querySelectorAll("button").forEach((x, j) => x.setAttribute("aria-pressed", String(j === i))); }); pal.append(b); });
  $("canvas").addEventListener("click", (e) => {
    const b = e.currentTarget.getBoundingClientRect(), s = cell(), ox = (size.w - s * Cn) / 2, oy = (size.h - s * R) / 2;
    const c = Math.floor((e.clientX - b.left - ox) / s), r = Math.floor((e.clientY - b.top - oy) / s); if (r < 0 || r >= R || c < 0 || c >= Cn) return;
    const i = IDS.indexOf(MAP[r][c]); col[i] = col[i] === cur ? -1 : cur; update();
  });
  $(".go-graph").addEventListener("click", (e) => { showG = !showG; e.target.setAttribute("aria-pressed", String(showG)); draw(); });
  $(".go-clr").addEventListener("click", () => { col = IDS.map(() => -1); update(); });
  $(".go-hint").addEventListener("click", () => { const k = chi(); update(` · 이 지도의 채색수는 ${k}입니다. 가운데 F를 B, C, G, I, E 다섯 지역(홀수 고리)이 둘러싸고 있습니다.`); });
  update();
})();
