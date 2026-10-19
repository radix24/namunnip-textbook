/* 카드: 사진을 돌리면 왜 구멍이 뚫릴까? — 21×21 픽셀 글자의 정방향·역방향 회전 */
(() => {
  const root = document.getElementById("card-adalg-pixel-rotate");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const N = 21, H = 10;
  /* 글자 F (중심 기준 좌표 x, y; y는 위쪽이 +) */
  const inF = (x, y) => (x >= -5 && x <= -2 && y >= -7 && y <= 7) || (y >= 4 && y <= 7 && x >= -5 && x <= 6) || (y >= -1 && y <= 1 && x >= -5 && x <= 4);
  const src = []; for (let y = -H; y <= H; y++) for (let x = -H; x <= H; x++) if (inF(x, y)) src.push([x, y]);
  let mode = "fwd";
  const a = $(".a");
  const { ctx, size } = fit($("canvas"), () => draw());
  const key = (x, y) => `${x},${y}`;

  function result() {
    const t = (+a.value * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t), set = new Set();
    if (mode === "fwd") src.forEach(([x, y]) => { const X = Math.round(c * x - s * y), Y = Math.round(s * x + c * y); if (Math.abs(X) <= H && Math.abs(Y) <= H) set.add(key(X, Y)); });
    else for (let Y = -H; Y <= H; Y++) for (let X = -H; X <= H; X++) { const x = Math.round(c * X + s * Y), y = Math.round(-s * X + c * Y); if (inF(x, y)) set.add(key(X, Y)); }
    // 구멍: 비어 있지만 상하 또는 좌우 이웃이 모두 칠해진 칸
    const holes = [];
    for (let Y = -H + 1; Y < H; Y++) for (let X = -H + 1; X < H; X++) {
      if (set.has(key(X, Y))) continue;
      const lr = set.has(key(X - 1, Y)) && set.has(key(X + 1, Y)), ud = set.has(key(X, Y - 1)) && set.has(key(X, Y + 1));
      if (lr || ud) holes.push([X, Y]);
    }
    return { set, holes };
  }
  function panel(ox, cell, fill, holes) {
    ctx.fillStyle = "#fff"; ctx.fillRect(ox, 0, cell * N, cell * N);
    ctx.strokeStyle = "rgba(0,0,0,.08)"; ctx.lineWidth = 1;
    for (let i = 0; i <= N; i++) { ctx.beginPath(); ctx.moveTo(ox + i * cell, 0); ctx.lineTo(ox + i * cell, N * cell); ctx.moveTo(ox, i * cell); ctx.lineTo(ox + N * cell, i * cell); ctx.stroke(); }
    ctx.fillStyle = "#2f5d8a";
    fill.forEach(([x, y]) => ctx.fillRect(ox + (x + H) * cell, (H - y) * cell, cell, cell));
    if (holes) { ctx.fillStyle = "#d4493a"; holes.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(ox + (x + H + 0.5) * cell, (H - y + 0.5) * cell, cell * 0.28, 0, 7); ctx.fill(); }); }
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const cell = Math.floor(Math.min((w - 24) / 2, h - 20) / N), gap = w - 2 * cell * N;
    const { set, holes } = result();
    panel(0, cell, src);
    panel(cell * N + gap, cell, [...set].map((k) => k.split(",").map(Number)), mode === "fwd" ? holes : null);
    ctx.fillStyle = C.ink2; ctx.font = `600 12px ${F.sans}`; ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillText("원본", (cell * N) / 2, cell * N + 4); ctx.fillText(`${a.value}° 회전 (${mode === "fwd" ? "정방향" : "역방향"})`, cell * N + gap + (cell * N) / 2, cell * N + 4);
    $(".n-src").textContent = src.length; $(".n-dst").textContent = set.size; $(".n-hole").textContent = mode === "fwd" ? holes.length : `${holes.length} (역방향)`;
  }
  a.addEventListener("input", () => { $(".a-out").textContent = a.value; draw(); });
  root.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m; root.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); draw();
  }));
  draw();
})();
