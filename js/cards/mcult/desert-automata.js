/* 카드: 비가 줄면 초원도 조금씩 줄까? — 세포 자동자(모식): 자람 0.5R·n/8, 죽음 0.1(1 − 0.7·n/8), 둘레가 이어진 격자 */
(() => {
  const root = document.getElementById("card-mcult-desert-automata");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const rIn = $(".r"), W = 60, H = 40, HIST = 200;
  let G = new Uint8Array(W * H), hist = [], year = 0, playing = true, seen = false;
  const cover = () => G.reduce((a, b) => a + b, 0) / (W * H);
  function seed() { for (let i = 0; i < W * H; i++) G[i] = Math.random() < 0.6 ? 1 : 0; hist = [cover()]; year = 0; }
  function step() {
    const R = +rIn.value, N = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) n += G[((y + dy + H) % H) * W + ((x + dx + W) % W)];
      const i = y * W + x, f = n / 8;
      N[i] = G[i] ? (Math.random() < 0.1 * (1 - 0.7 * f) ? 0 : 1) : (Math.random() < 0.5 * R * f ? 1 : 0);
    }
    G = N; year++; hist.push(cover()); if (hist.length > HIST) hist.shift();
  }
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const gw = w * 0.55, s = Math.min(gw / W, (h - 4) / H);
    for (let i = 0; i < W * H; i++) { ctx.fillStyle = G[i] ? "#5f9a4f" : "#cdb48a"; ctx.fillRect((i % W) * s, Math.floor(i / W) * s, s + 0.3, s + 0.3); }
    const x0 = W * s + 36, x1 = w - 6, y0 = h - 22, y1 = 10, X = (k) => x0 + ((x1 - x0) * k) / (HIST - 1), Y = (v) => y0 - (y0 - y1) * v;
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "right";
    [0, 0.5, 1].forEach((v) => { ctx.beginPath(); ctx.moveTo(x0, Y(v)); ctx.lineTo(x1, Y(v)); ctx.stroke(); ctx.fillText(`${v * 100}%`, x0 - 4, Y(v) + 4); });
    ctx.strokeStyle = C.forest; ctx.lineWidth = 2; ctx.beginPath(); hist.forEach((v, k) => (k ? ctx.lineTo(X(k), Y(v)) : ctx.moveTo(X(k), Y(v)))); ctx.stroke();
    ctx.fillStyle = C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText(`최근 ${HIST}년 덮개 비율`, (x0 + x1) / 2, h - 6);
  }
  function say() { $(".r-out").textContent = (+rIn.value).toFixed(2); $(".say").textContent = `${year}년째 · 식물 덮개 ${(100 * cover()).toFixed(1)}% · R = ${(+rIn.value).toFixed(2)}${cover() === 0 ? " · 모두 사라졌습니다" : ""}`; }
  setInterval(() => { if (playing && seen && !document.hidden) { step(); say(); draw(); } }, 120);
  new IntersectionObserver(([e]) => { seen = e.isIntersecting; }).observe($("canvas"));
  $(".play").addEventListener("click", (e) => { playing = !playing; e.target.textContent = playing ? "멈춤" : "계속"; e.target.setAttribute("aria-pressed", String(playing)); });
  $(".seed").addEventListener("click", () => { seed(); say(); draw(); });
  rIn.addEventListener("input", () => { say(); });
  seed(); for (let k = 0; k < 30; k++) step(); say(); draw();
})();
