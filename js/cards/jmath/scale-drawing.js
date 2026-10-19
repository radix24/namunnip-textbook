/* 카드: 도면 위 6 cm는 실제로 몇 m일까? — 축척, 길이비와 넓이비 (가상 도면) */
(() => {
  const root = document.getElementById("card-jmath-scale-drawing");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const scIn = $(".sc");
  /* 도면 길이(cm): 방 8 × 6, 욕실 3 × 2.4 (방의 오른쪽 위 모서리 안) */
  const ROOM = [8, 6], BATH = [3, 2.4];
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const u = Math.min((w - 90) / ROOM[0], (h - 70) / ROOM[1]), x0 = 50, y0 = 30, s = +scIn.value;
    const m = (cm) => `${((cm * s) / 100).toFixed(2).replace(/\.?0+$/, "")} m`;
    ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.strokeRect(x0, y0, ROOM[0] * u, ROOM[1] * u);
    ctx.fillStyle = "rgba(63,111,163,.12)"; ctx.lineWidth = 2; ctx.fillRect(x0 + (ROOM[0] - BATH[0]) * u, y0, BATH[0] * u, BATH[1] * u); ctx.strokeRect(x0 + (ROOM[0] - BATH[0]) * u, y0, BATH[0] * u, BATH[1] * u);
    ctx.fillStyle = C.ink2; ctx.font = `12px ${F.mono}`; ctx.textAlign = "center";
    ctx.fillText(`${ROOM[0]} cm → ${m(ROOM[0])}`, x0 + (ROOM[0] * u) / 2, y0 + ROOM[1] * u + 20);
    ctx.save(); ctx.translate(x0 - 16, y0 + (ROOM[1] * u) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(`${ROOM[1]} cm → ${m(ROOM[1])}`, 0, 0); ctx.restore();
    ctx.fillText("욕실", x0 + (ROOM[0] - BATH[0] / 2) * u, y0 + (BATH[1] * u) / 2);
    ctx.fillText(`${BATH[0]} × ${BATH[1]} cm`, x0 + (ROOM[0] - BATH[0] / 2) * u, y0 + (BATH[1] * u) / 2 + 16);
  }
  function update() {
    const s = +scIn.value, aR = ROOM[0] * ROOM[1], aB = BATH[0] * BATH[1], real = (cm2) => (cm2 * s * s) / 10000;
    $(".say").textContent = `축척 1 : ${s} → 길이 ${s}배, 넓이 ${s * s}배 · 방 전체 도면 ${aR} cm² → 실제 ${real(aR).toFixed(2)} m² · 욕실 ${aB.toFixed(1)} cm² → ${real(aB).toFixed(2)} m² · 욕실을 뺀 바닥 ${(real(aR) - real(aB)).toFixed(2)} m²`;
    draw();
  }
  scIn.addEventListener("change", update);
  update();
})();
