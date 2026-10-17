/* 카드: 창밖은 뿌연데 등급은 왜 '보통'일까? — 1시간 값과 24시간 이동평균, PM2.5 등급(가상 측정값) */
(() => {
  const root = document.getElementById("card-mcult-pm-average");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const tIn = $(".t");
  /* 가상 48시간: 낮은 배경 + 출퇴근 무렵 조금 높음 + 둘째 날 30~38시에 짧게 치솟음 */
  const V = Array.from({ length: 48 }, (_, k) => {
    const hr = k % 24, base = 14 + 8 * Math.exp(-((hr - 8) ** 2) / 6) + 6 * Math.exp(-((hr - 19) ** 2) / 8), spike = k >= 30 && k <= 38 ? 70 * Math.sin((Math.PI * (k - 29)) / 10) : 0;
    return Math.round(base + spike + 3 * Math.sin(k * 1.7));
  });
  const MA = V.map((_, k) => (k < 23 ? null : V.slice(k - 23, k + 1).reduce((a, b) => a + b, 0) / 24));
  const grade = (v) => (v <= 15 ? "좋음" : v <= 35 ? "보통" : v <= 75 ? "나쁨" : "매우 나쁨");
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const t = +tIn.value, L = 34, R = 74, T = 8, B = 24, ymax = 100, bw = (w - L - R) / 48;
    const X = (k) => L + k * bw, Y = (v) => T + (h - T - B) * (1 - v / ymax);
    [[0, 15, "rgba(63,111,163,.10)", "좋음"], [15, 35, "rgba(116,171,102,.12)", "보통"], [35, 75, "rgba(224,160,42,.14)", "나쁨"], [75, 100, "rgba(181,83,47,.14)", "매우 나쁨"]].forEach(([a, b, col, n]) => {
      ctx.fillStyle = col; ctx.fillRect(L, Y(b), w - L - R, Y(a) - Y(b));
      ctx.fillStyle = C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "left"; ctx.fillText(n, w - R + 6, (Y(a) + Y(b)) / 2 + 4);
    });
    ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "right";
    [0, 35, 75].forEach((v) => ctx.fillText(String(v), L - 4, Y(v) + 4));
    ctx.textAlign = "center"; [0, 12, 24, 36, 47].forEach((k) => ctx.fillText(`${k % 24}시`, X(k) + bw / 2, h - B + 14));
    V.forEach((v, k) => { ctx.fillStyle = k === t ? C.warn : k >= t - 23 && k <= t ? "rgba(63,111,163,.55)" : "rgba(141,141,146,.35)"; ctx.fillRect(X(k) + 1, Y(v), bw - 2, Y(0) - Y(v)); });
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath();
    MA.forEach((m, k) => { if (m == null) return; const x = X(k) + bw / 2; k === 23 ? ctx.moveTo(x, Y(m)) : ctx.lineTo(x, Y(m)); });
    ctx.stroke();
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(X(t) + bw / 2, Y(MA[t]), 4.5, 0, 7); ctx.fill();
    ctx.fillStyle = C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "left"; ctx.fillText("검은 선: 24시간 이동평균 · 파란 막대: 평균에 들어간 24시간", L + 4, T + 12);
  }
  function update() {
    const t = +tIn.value, v = V[t], m = MA[t];
    $(".t-out").textContent = t - 24;
    $(".say").textContent = `둘째 날 ${t - 24}시 · 1시간 값 ${v} µg/m³ → ${grade(v)} · 24시간 이동평균 ${m.toFixed(1)} µg/m³ → ${grade(m)}`;
    draw();
  }
  tIn.addEventListener("input", update);
  update();
})();
