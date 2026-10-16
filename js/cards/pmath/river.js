/* 카드: 물살이 센 강에서 맞은편 선착장에 닿으려면 뱃머리를 어디로 돌려야 할까? — 속도 벡터의 합 */
(() => {
  const root = document.getElementById("card-pmath-river");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, rad, label, dot, seg, arrow, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sc = $(".sc"), sv = $(".sv"), st = $(".st"), verdict = $(".verdict");
  const W = 60;   // 강폭 m
  let prog = null, raf = 0;   // 애니메이션 시간(s)
  const { ctx, size } = fit($("canvas"), () => draw());
  /* 좌표: x = 강을 가로지르는 방향(오른쪽 = 건너편), y = 강을 따라(위 = 상류). 물살은 아래로 */
  const vel = () => { const th = rad(+st.value), v = +sv.value, c = +sc.value; return { b: [v * Math.cos(th), v * Math.sin(th)], c: [0, -c], r: [v * Math.cos(th), v * Math.sin(th) - c] }; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const L = 30, R = w - 30, s = (R - L) / W, cy = h / 2;
    const P = (x, y) => [L + x * s, cy - y * s];
    ctx.fillStyle = "#d9e8f3"; ctx.fillRect(L, 0, R - L, h);
    seg(ctx, L, 0, L, h, C.forest, 3); seg(ctx, R, 0, R, h, C.forest, 3);
    for (let i = 0; i < 6; i++) arrow(ctx, L + (R - L) * (0.15 + 0.14 * i), 18 + (i % 2) * 20, L + (R - L) * (0.15 + 0.14 * i), 44 + (i % 2) * 20, "#9bb7cc", 1.4, 6);
    // 선착장
    ctx.fillStyle = C.ink2; ctx.fillRect(R - 2, cy - 8, 14, 16); label(ctx, "선착장", R + 4, cy - 18, C.ink2, "center", `600 11px ${F.sans}`);
    const { b, c, r } = vel(), k = 10;   // 벡터 그림 배율(px per m/s = k·s/…)
    const o = P(0, 0), vs = s * 4;
    arrow(ctx, ...o, o[0] + b[0] * vs, o[1] - b[1] * vs, BLUE, 2.4);
    arrow(ctx, o[0] + b[0] * vs, o[1] - b[1] * vs, o[0] + r[0] * vs, o[1] - r[1] * vs, "#6d9bc0", 2.4);
    arrow(ctx, ...o, o[0] + r[0] * vs, o[1] - r[1] * vs, C.warn, 3);
    label(ctx, "배", o[0] + b[0] * vs / 2 - 6, o[1] - b[1] * vs / 2 - 10, BLUE, "right", `600 11px ${F.sans}`);
    label(ctx, "실제", o[0] + r[0] * vs / 2 + 6, o[1] - r[1] * vs / 2 + 12, C.warn, "left", `600 11px ${F.sans}`);
    // 지나간 길
    if (prog != null && r[0] > 0) {
      const T = W / r[0], t = Math.min(prog, T);
      seg(ctx, ...o, ...P(r[0] * t, r[1] * t), C.warn, 1.5, [4, 3]);
      const bp = P(r[0] * t, r[1] * t), hd = Math.atan2(b[1], b[0]);
      ctx.save(); ctx.translate(...bp); ctx.rotate(-hd); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(-8, -5); ctx.lineTo(-8, 5); ctx.closePath(); ctx.fill(); ctx.restore();
    } else dot(ctx, ...o, C.ink, 5);
  }
  function update() {
    const { r } = vel();
    $(".c-out").textContent = n(+sc.value, 1); $(".v-out").textContent = n(+sv.value, 1); $(".t-out").textContent = `${st.value}°`;
    $(".n-s").textContent = `${n(Math.hypot(...r), 2)} m/s`;
    if (r[0] <= 1e-9) { $(".n-t").textContent = "건널 수 없음"; $(".n-x").textContent = "—"; }
    else { const T = W / r[0], dy = r[1] * T; $(".n-t").textContent = `${n(T, 1)} s`; $(".n-x").textContent = Math.abs(dy) < 0.5 ? "정확히 도착!" : `${n(Math.abs(dy), 1)} m ${dy < 0 ? "하류" : "상류"}`; }
    const c = +sc.value, v = +sv.value;
    verdict.textContent = c < v ? `정면으로 건너는 각: sin θ = ${n(c, 1)}/${n(v, 1)} → θ ≈ ${n(Math.asin(c / v) * 180 / Math.PI, 1)}°` : "물살이 배보다 빨라 정면으로 건널 수 없습니다.";
    verdict.className = "verdict";
    draw();
  }
  $(".go-run").addEventListener("click", () => {
    cancelAnimationFrame(raf); prog = 0; let last = performance.now();
    const { r } = vel(), T = r[0] > 0 ? W / r[0] : 0;
    const step = (now) => { prog += (now - last) / 1000 * Math.max(4, T / 3); last = now; draw(); if (prog < T) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  });
  [sc, sv, st].forEach((el) => el.addEventListener("input", () => { prog = null; update(); }));
  update();
})();
