/* 카드: 두루마리 휴지를 풀지 않고 길이를 잴 수 있을까? — 카디오이드 꺾은선 어림(길이 8)과 아르키메데스 나선의 길이 */
(() => {
  const root = document.getElementById("card-adcalc-roll-length");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, label, seg, dot, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn"), sR = $(".sR"), sd = $(".sd"), PI = Math.PI, R0 = 2;
  let mode = "card";
  const { ctx, size } = fit($("canvas"), () => draw());
  const card = (t) => 1 + Math.cos(t);

  function polyLen(k) {
    let s = 0, px = 2, py = 0;
    for (let i = 1; i <= k; i++) { const t = 2 * PI * i / k, r = card(t), x = r * Math.cos(t), y = r * Math.sin(t); s += Math.hypot(x - px, y - py); px = x; py = y; }
    return s;
  }
  function roll() {
    const R = +sR.value, d = +sd.value / 10;      // cm
    const T = 2 * PI * (R - R0) / d, k = d / (2 * PI);
    const L = A.simpson((t) => Math.hypot(R0 + k * t, k), 0, T, Math.max(2000, Math.ceil(T * 4)));
    return { R, d, T, L, est: PI * (R * R - R0 * R0) / d, turns: (R - R0) / d };
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    if (mode === "card") {
      const pf = A.pframe(ctx, w, h, { rmax: 2.1, rings: 2, rays: 12, ringLabels: false });
      A.pcurve(ctx, pf, card, 0, 2 * PI, C.rule, { width: 4 });
      const k = +sn.value;
      ctx.strokeStyle = BLUE; ctx.lineWidth = 1.8; ctx.beginPath();
      for (let i = 0; i <= k; i++) { const t = 2 * PI * i / k, [x, y] = pf.P(card(t), t); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
      if (k <= 40) for (let i = 0; i < k; i++) { const t = 2 * PI * i / k, [x, y] = pf.P(card(t), t); dot(ctx, x, y, BLUE, 2.6); }
    } else {
      const { R, turns } = roll(), cx = w / 2, cy = h / 2, S = Math.min(w, h) * 0.45 / 7;
      const vt = Math.min(turns, 24), k = (R - R0) / (2 * PI * vt);   // 그림용: 감은 수를 줄인다
      ctx.fillStyle = "rgba(63,111,163,.08)"; ctx.beginPath(); ctx.arc(cx, cy, R * S, 0, 7); ctx.fill();
      ctx.strokeStyle = BLUE; ctx.lineWidth = 1.2; ctx.beginPath();
      for (let i = 0; i <= 3000; i++) { const t = 2 * PI * vt * i / 3000, r = (R0 + k * t) * S; i ? ctx.lineTo(cx + r * Math.cos(t), cy - r * Math.sin(t)) : ctx.moveTo(cx + r * Math.cos(t), cy - r * Math.sin(t)); }
      ctx.stroke();
      ctx.strokeStyle = C.ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R0 * S, 0, 7); ctx.stroke();
      seg(ctx, cx, cy, cx + R * S, cy, C.warn, 1.2, [3, 3]);
      label(ctx, `R = ${n(R, 1)} cm`, cx + R * S / 2 + 6, cy - 10, C.warn, "center", `600 11px ${F.sans}`);
      label(ctx, "심 2 cm", cx, cy + R0 * S + 12, C.ink2, "center", `11px ${F.sans}`);
    }
  }
  function nums() {
    $(".n-out").textContent = sn.value; $(".R-out").textContent = n(+sR.value, 1); $(".d-out").textContent = n(+sd.value, 2);
    if (mode === "card") {
      $(".l1").textContent = "꺾은선의 길이"; $(".l3").textContent = "참값";
      $(".n-1").textContent = n(polyLen(+sn.value), 4);
      $(".n-2").textContent = n(A.simpson((t) => Math.hypot(card(t), Math.sin(t)), 0, 2 * PI, 4000), 4);
      $(".n-3").textContent = "8";
    } else {
      const r = roll();
      $(".l1").textContent = "감긴 바퀴 수"; $(".l3").textContent = "넓이 ÷ 두께 어림";
      $(".n-1").textContent = `${n(r.turns, 0)}바퀴`;
      $(".n-2").textContent = `${n(r.L / 100, 2)} m`;
      $(".n-3").textContent = `${n(r.est / 100, 2)} m`;
    }
    draw();
  }
  G.chips(root, ".pk .chip", (b) => { mode = b.dataset.p; root.querySelectorAll(".mode").forEach((m) => { m.hidden = m.dataset.m !== mode; }); nums(); });
  [sn, sR, sd].forEach((s) => s.addEventListener("input", nums));
  nums();
})();
