/* 카드: 흑백 그림을 더 짧은 숫자로 저장할 수 있을까? — 런 길이 부호화(런 하나 5비트) */
(() => {
  const root = document.getElementById("card-mcult-run-length");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const W = 32, H = 24, BITS = 6, cv = $("canvas");
  const grid = (f) => Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => (f(x + 0.5 - W / 2, y + 0.5 - H / 2) ? 1 : 0)));
  const P = {
    disc: () => grid((x, y) => x * x + y * y < 90),
    face: () => grid((x, y) => { const r = x * x + y * y; return (r < 110 && r > 72) || (x + 4) ** 2 + (y + 3) ** 2 < 3 || (x - 4) ** 2 + (y + 3) ** 2 < 3 || (y > 2.5 && y < 5 && Math.abs(x) < 5 - (y - 2.5)); }),
    stripe: () => Array.from({ length: H }, () => Array.from({ length: W }, (_, x) => (x % 2))),
    noise: () => Array.from({ length: H }, () => Array.from({ length: W }, () => (Math.random() < 0.5 ? 1 : 0))),
    clear: () => Array.from({ length: H }, () => new Array(W).fill(0)),
  };
  let G = P.disc(), paint = -1;
  const runs = (row) => { const r = []; let c = 0, n = 0; row.forEach((v) => { if (v === c) n++; else { r.push(n); c = v; n = 1; } }); r.push(n); return r; };
  const { ctx, size } = fit(cv, () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    const s = Math.min(w / W, h / H), ox = (w - s * W) / 2;
    ctx.clearRect(0, 0, w, h);
    G.forEach((row, y) => row.forEach((v, x) => { ctx.fillStyle = v ? C.ink : "#fff"; ctx.fillRect(ox + x * s, y * s, s, s); }));
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x++) { ctx.beginPath(); ctx.moveTo(ox + x * s, 0); ctx.lineTo(ox + x * s, H * s); ctx.stroke(); }
    for (let y = 0; y <= H; y++) { ctx.beginPath(); ctx.moveTo(ox, y * s); ctx.lineTo(ox + W * s, y * s); ctx.stroke(); }
  }
  function update() {
    const R = G.map(runs), n = R.reduce((a, r) => a + r.length, 0), bits = n * BITS, raw = W * H;
    $(".say").textContent = `칸마다 1비트: ${raw}비트 · 런 ${n}개 × ${BITS}비트 = ${bits}비트 → 원래의 ${((100 * bits) / raw).toFixed(0)}% ${bits < raw ? "(줄었음)" : "(오히려 늘었음)"}`;
    $(".rle").textContent = R.slice(0, 8).map((r, i) => `${String(i + 1).padStart(2)}행: ${r.join(", ")}`).join("\n") + `\n… (${H}행 중 앞의 8행)`;
    draw();
  }
  const cell = (e) => {
    const r = cv.getBoundingClientRect(), { w, h } = size, s = Math.min(w / W, h / H), ox = (w - s * W) / 2;
    const x = Math.floor((e.clientX - r.left - ox) / s), y = Math.floor((e.clientY - r.top) / s);
    return x >= 0 && x < W && y >= 0 && y < H ? [x, y] : null;
  };
  cv.addEventListener("pointerdown", (e) => { const c = cell(e); if (!c) return; paint = 1 - G[c[1]][c[0]]; G[c[1]][c[0]] = paint; cv.setPointerCapture(e.pointerId); update(); });
  cv.addEventListener("pointermove", (e) => { if (paint < 0) return; const c = cell(e); if (c && G[c[1]][c[0]] !== paint) { G[c[1]][c[0]] = paint; update(); } });
  ["pointerup", "pointercancel"].forEach((t) => cv.addEventListener(t, () => { paint = -1; }));
  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { G = P[b.dataset.p](); update(); }));
  update();
})();
