/* 카드: 창고 바깥을 칠하려면 칠할 넓이는 얼마일까? — 겉넓이에서 칠하지 않는 면 빼기 (수업용 가정) */
(() => {
  const root = document.getElementById("card-jmath-paint-surface");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".a"), bIn = $(".b"), cIn = $(".c"), DOOR = 6, COVER = 8, COATS = 2, CAN = 18;
  let s = 0;
  const { ctx, size } = fit($("canvas"), () => draw());
  const rect = (x, y, w, h, col, lab) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); ctx.strokeStyle = C.ink2; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h); if (lab && w > 34 && h > 14) { ctx.fillStyle = C.ink; ctx.font = `11px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText(lab, x + w / 2, y + h / 2 + 4); } };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const a = +aIn.value, b = +bIn.value, c = +cIn.value, PAINT = "rgba(63,111,163,.35)", NO = "rgba(141,141,146,.2)";
    if (s === 0) {
      /* 펼친 그림: 가로로 [옆 b][앞 a][옆 b][뒤 a], 앞면 위에 지붕(a × b), 아래에 바닥 */
      const u = Math.min((w - 20) / (2 * (a + b)), (h - 20) / (2 * b + c)), x0 = 10, y0 = 10 + b * u;
      rect(x0, y0, b * u, c * u, PAINT, "옆"); rect(x0 + b * u, y0, a * u, c * u, PAINT, "앞"); rect(x0 + (a + b) * u, y0, b * u, c * u, PAINT, "옆"); rect(x0 + (a + 2 * b) * u, y0, a * u, c * u, PAINT, "뒤");
      rect(x0 + b * u, y0 - b * u, a * u, b * u, PAINT, "지붕"); rect(x0 + b * u, y0 + c * u, a * u, b * u, NO, "바닥(안 칠함)");
      const dw = Math.min(a * 0.3, 1.5) * u, dh = Math.min(c * 0.8, 2) * u; [0.2, 0.6].forEach((t) => rect(x0 + b * u + a * u * t, y0 + c * u - dh, dw, dh, "#fbfbf8", ""));
    } else {
      const r = a / 2, u = Math.min((w - 20) / (2 * Math.PI * r + 2 * r + 1), (h - 20) / (c + 4 * r)), x0 = 10, y0 = 10;
      rect(x0, y0 + 2 * r * u, 2 * Math.PI * r * u, c * u, PAINT, "옆면(펼침)");
      ctx.fillStyle = PAINT; ctx.beginPath(); ctx.arc(x0 + Math.PI * r * u, y0 + r * u, r * u, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = NO; ctx.beginPath(); ctx.arc(x0 + Math.PI * r * u, y0 + (2 * r + c + r) * u, r * u, 0, 7); ctx.fill();
      ctx.fillStyle = C.ink; ctx.font = `11px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText("지붕", x0 + Math.PI * r * u, y0 + r * u + 4);
    }
  }
  function update() {
    const a = +aIn.value, b = +bIn.value, c = +cIn.value;
    $(".a-out").textContent = a; $(".b-out").textContent = s ? "—" : b; $(".c-out").textContent = c; bIn.disabled = s === 1;
    let area, txt;
    if (s === 0) { area = a * b + 2 * (a + b) * c - DOOR; txt = `지붕 ${a}×${b} + 벽 2(${a} + ${b})×${c} − 문 ${DOOR} = ${area.toFixed(1)} m²`; }
    else { const r = a / 2; area = 2 * Math.PI * r * c + Math.PI * r * r; txt = `옆면 2π×${r}×${c} + 지붕 π×${r}² = ${area.toFixed(1)} m²`; }
    const L = (area * COATS) / COVER;
    $(".say").textContent = `칠할 넓이 ${txt} · 두 번 칠하면 ${(area * COATS).toFixed(1)} m² ÷ ${COVER} = ${L.toFixed(1)} L → 18 L 통 ${Math.ceil(L / CAN - 1e-9)}통`;
    draw();
  }
  [aIn, bIn, cIn].forEach((x) => x.addEventListener("input", update));
  root.querySelectorAll("[data-s]").forEach((btn) => btn.addEventListener("click", () => { s = +btn.dataset.s; root.querySelectorAll("[data-s]").forEach((x) => x.setAttribute("aria-pressed", String(x === btn))); update(); }));
  update();
})();
