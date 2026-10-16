/* 카드: 원 위의 점이 (cos t, sin t)라면, 쌍곡선 위의 점은? — 단위원과 단위쌍곡선, 넓이 t/2 */
(() => {
  const root = document.getElementById("card-adcalc-hyp-unit");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, dot, seg, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const st = $(".st");
  const { ctx, size } = fit($("canvas"), () => draw());

  /* 쌍곡 부채꼴의 넓이 (부호 있음): O → (1,0) → 곡선 → P → O 신발끈 공식 */
  function hypArea(t) {
    const N = 400; let s = 0, px = 1, py = 0;
    for (let i = 1; i <= N; i++) { const u = t * i / N, x = Math.cosh(u), y = Math.sinh(u); s += px * y - x * py; px = x; py = y; }
    return s / 2;   // O에서 시작하고 O로 돌아오는 두 변은 기여가 0
  }

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const t = +st.value;
    // 왼쪽: 원
    const lw = w * 0.42, R = Math.min(lw, h) * 0.38, cx = lw / 2, cy = h / 2;
    seg(ctx, cx - R * 1.25, cy, cx + R * 1.25, cy, C.ink3, 1); seg(ctx, cx, cy - R * 1.25, cx, cy + R * 1.25, C.ink3, 1);
    ctx.save(); ctx.fillStyle = "rgba(63,111,163,.18)"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, 0, -t, t > 0); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    const px = cx + R * Math.cos(t), py = cy - R * Math.sin(t);
    seg(ctx, cx, cy, px, py, BLUE, 1.6); dot(ctx, px, py, BLUE);
    label(ctx, "x² + y² = 1", cx, 12, C.ink2, "center", `italic 600 12px ${F.serif}`);
    label(ctx, "(cos t, sin t)", px + (Math.cos(t) >= 0 ? 8 : -8), py + (Math.sin(t) >= 0 ? -12 : 12), BLUE, Math.cos(t) >= 0 ? "left" : "right", `600 11px ${F.sans}`);
    label(ctx, `넓이 ${n(t / 2, 2)}`, cx, h - 10, BLUE, "center", `600 11.5px ${F.sans}`);
    // 오른쪽: 쌍곡선 (같은 축척)
    const ox = lw + 22, ow = w - ox - 6, S = Math.min(ow / 5.3, h / 9.6), hx = ox + 0.4 * S, hy = h / 2;
    const X = (x) => hx + x * S, Y = (y) => hy - y * S;
    seg(ctx, ox, hy, w - 4, hy, C.ink3, 1); seg(ctx, hx, 4, hx, h - 4, C.ink3, 1);
    // 점근선 y = ±x
    seg(ctx, X(0), Y(0), X(4.8), Y(4.8), C.rule, 1, [4, 3]); seg(ctx, X(0), Y(0), X(4.8), Y(-4.8), C.rule, 1, [4, 3]);
    ctx.save(); ctx.fillStyle = "rgba(59,124,42,.2)"; ctx.beginPath(); ctx.moveTo(X(0), Y(0));
    for (let i = 0; i <= 120; i++) { const u = t * i / 120; ctx.lineTo(X(Math.cosh(u)), Y(Math.sinh(u))); }
    ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.6; ctx.beginPath();
    for (let i = 0; i <= 200; i++) { const u = -2.3 + 4.6 * i / 200; const x = X(Math.cosh(u)), y = Y(Math.sinh(u)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
    const qx = X(Math.cosh(t)), qy = Y(Math.sinh(t));
    seg(ctx, X(0), Y(0), qx, qy, C.forest, 1.6);
    seg(ctx, qx, qy, qx, Y(0), C.ink3, 1, [3, 3]);
    dot(ctx, qx, qy, C.forest); dot(ctx, X(1), Y(0), C.ink, 3);
    label(ctx, "x² − y² = 1", w - 8, 12, C.ink2, "right", `italic 600 12px ${F.serif}`);
    label(ctx, "(cosh t, sinh t)", Math.min(qx + 8, w - 96), qy + (t >= 0 ? -12 : 12), C.forest, "left", `600 11px ${F.sans}`);
    label(ctx, `넓이 ${n(hypArea(t), 2)}`, ox + ow / 2, h - 10, C.forest, "center", `600 11.5px ${F.sans}`);
  }
  function nums() {
    const t = +st.value, c = Math.cosh(t), s = Math.sinh(t);
    $(".t-out").textContent = n(t, 2);
    $(".n-c").textContent = n(c, 4); $(".n-s").textContent = n(s, 4);
    $(".n-i").textContent = n(c * c - s * s, 6);
    $(".n-a").textContent = n(hypArea(t), 4);
    draw();
  }
  st.addEventListener("input", nums);
  nums();
})();
