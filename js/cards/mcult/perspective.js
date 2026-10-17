/* 카드: 같은 간격으로 선 전봇대를 그림에서는 어떤 간격으로 그려야 할까? — 한 점 원근법, 크기 ∝ 1/거리 */
(() => {
  const root = document.getElementById("card-mcult-perspective");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const eIn = $(".e"), gIn = $(".g"), POLE = 8, ROADW = 6, D0 = 10;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const eye = +eIn.value, gap = +gIn.value, f = h * 0.45, cx = w / 2, hy = h * 0.42;
    /* 화면 좌표: 세계 (x 옆, y 높이, d 거리) → (cx + f x/d, hy + f (eye − y)/d) */
    const P = (x, y, d) => [cx + (f * x) / d, hy + (f * (eye - y)) / d];
    ctx.fillStyle = "rgba(143,184,222,.25)"; ctx.fillRect(0, 0, w, hy);
    ctx.fillStyle = "rgba(116,171,102,.2)"; ctx.fillRect(0, hy, w, h - hy);
    const road = [P(-ROADW / 2, 0, 2), P(ROADW / 2, 0, 2), P(ROADW / 2, 0, 4000), P(-ROADW / 2, 0, 4000)];
    ctx.fillStyle = "rgba(93,93,97,.35)"; ctx.beginPath(); road.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.warn; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(w, hy); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.warn; ctx.font = `11px ${F.sans}`; ctx.textAlign = "left"; ctx.fillText(`지평선(눈높이 ${eye.toFixed(1)} m)`, 6, hy - 4);
    ctx.beginPath(); ctx.arc(cx, hy, 3.5, 0, 7); ctx.fill();
    for (let k = 0; k < 12; k++) {
      const d = D0 + k * gap, [x0, y0] = P(ROADW / 2 + 1, 0, d), [, y1] = P(ROADW / 2 + 1, POLE, d);
      ctx.strokeStyle = "#5d4a2a"; ctx.lineWidth = Math.max(1, (f * 0.25) / d); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
      if (k < 2) { ctx.fillStyle = C.ink2; ctx.textAlign = "center"; ctx.fillText(`${d} m`, x0, y0 + 13); ctx.textAlign = "left"; }
    }
  }
  function update() {
    const eye = +eIn.value, gap = +gIn.value, f = size.h * 0.45 || 150, h1 = (f * POLE) / D0, h2 = (f * POLE) / (D0 + gap);
    $(".e-out").textContent = eye.toFixed(1); $(".g-out").textContent = gap;
    $(".say").textContent = `전봇대 높이 8 m · 그림 속 높이: ${D0} m → ${h1.toFixed(0)}px, ${D0 + gap} m → ${h2.toFixed(0)}px (비 ${(h2 / h1).toFixed(3)} = ${D0}/${D0 + gap}) · 그림 속 간격은 갈수록 좁아짐`;
    draw();
  }
  [eIn, gIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
