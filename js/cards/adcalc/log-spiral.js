/* 카드: 목표를 늘 같은 각도로 보며 날면 어떤 길이 될까? — 일정한 각으로 다가가는 추적 시뮬레이션과 로그나선 */
(() => {
  const root = document.getElementById("card-adcalc-log-spiral");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, rad, label, seg, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa"), bOv = $(".ov");
  let path = [], shown = 0, raf = 0, len = 0, turns = 0;
  const { ctx, size } = fit($("canvas"), () => draw());

  /* 한 걸음 ds마다 목표 방향에서 α만큼 돌린 방향으로 간다 (반시계로 돌며 다가감) */
  function simulate() {
    const al = rad(+sa.value);
    let x = 1, y = 0, s = 0, ang = 0, prevA = 0;
    path = [[x, y]];
    for (let i = 0; i < 400000; i++) {
      const r = Math.hypot(x, y); if (r < 1e-3) break;
      const ds = Math.min(0.002, r * 0.01);
      const tx = -x / r, ty = -y / r;                 // 목표 방향
      const c = Math.cos(-al), sn = Math.sin(-al);    // 시계 방향으로 α 돌리면 반시계로 돈다
      const vx = tx * c - ty * sn, vy = tx * sn + ty * c;
      x += vx * ds; y += vy * ds; s += ds;
      const a = Math.atan2(y, x); let d = a - prevA; if (d < -Math.PI) d += 2 * Math.PI; if (d > Math.PI) d -= 2 * Math.PI; ang += d; prevA = a;
      if (i % 4 === 0) path.push([x, y]);
    }
    path.push([x, y]); len = s; turns = ang / (2 * Math.PI);
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, S = Math.min(w, h) * 0.42;
    const X = (x) => cx + x * S, Y = (y) => cy - y * S;
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, S, 0, 7); ctx.stroke();
    if (bOv.getAttribute("aria-pressed") === "true") {
      const k = 1 / Math.tan(rad(+sa.value));
      ctx.save(); ctx.strokeStyle = C.warn; ctx.lineWidth = 1.4; ctx.setLineDash([5, 4]); ctx.beginPath();
      for (let i = 0; i <= 3000; i++) { const t = i / 3000 * Math.min(400, 6.9 / Math.max(k, 1e-3)), r = Math.exp(-t * k); const px = X(r * Math.cos(t)), py = Y(r * Math.sin(t)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.stroke(); ctx.restore();
    }
    const m = Math.min(shown, path.length);
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let i = 0; i < m; i++) { const [x, y] = path[i]; i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); }
    ctx.stroke();
    // 목표와 나는 점
    ctx.fillStyle = C.forest; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fill();
    label(ctx, "목표", cx + 8, cy + 12, C.forest, "left", `600 11px ${F.sans}`);
    if (m > 1) {
      const [x, y] = path[m - 1], [x0, y0] = path[Math.max(0, m - 2)];
      seg(ctx, X(x), Y(y), cx, cy, C.ink3, 1, [3, 3]);
      const d = Math.hypot(x - x0, y - y0) || 1;
      seg(ctx, X(x), Y(y), X(x + (x - x0) / d * 0.25), Y(y + (y - y0) / d * 0.25), C.ink, 1.6);
      dot(ctx, X(x), Y(y), C.ink, 4.5);
    }
    label(ctx, "출발", X(1) + 4, Y(0) - 10, C.ink2, "left", `11px ${F.sans}`);
  }
  function nums() {
    $(".a-out").textContent = `${sa.value}°`;
    const done = shown >= path.length;
    $(".n-s").textContent = done ? n(len, 3) : "—";
    $(".n-f").textContent = n(1 / Math.cos(rad(+sa.value)), 3);
    $(".n-k").textContent = done ? `${n(turns, 1)}바퀴` : "—";
    draw();
  }
  function fly() {
    cancelAnimationFrame(raf); simulate();
    if (NM.reduce) { shown = path.length; nums(); return; }
    shown = 0; const t0 = performance.now();
    const tick = (t) => { shown = Math.floor(path.length * Math.min(1, (t - t0) / 3000)); nums(); if (shown < path.length) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
  }
  sa.addEventListener("input", () => { cancelAnimationFrame(raf); simulate(); shown = path.length; nums(); });
  bOv.addEventListener("click", () => { bOv.setAttribute("aria-pressed", String(bOv.getAttribute("aria-pressed") !== "true")); draw(); });
  $(".go-fly").addEventListener("click", fly);
  simulate(); shown = path.length; nums();
})();
