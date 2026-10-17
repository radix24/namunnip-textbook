/* 카드: 골문이 가장 넓게 보이는 슛 위치 — θ(y) = atan(b/y) − atan(a/y), 최대는 y = √(ab) */
(() => {
  const root = document.getElementById("card-mcult-shot-angle");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const cIn = $(".c"), yIn = $(".y"), G = 3.66, YMAX = 30;
  const { ctx, size } = fit($("canvas"), () => draw());
  const th = (c, y) => Math.atan((c + G) / y) - Math.atan((c - G) / y);
  const deg = (r) => (r * 180) / Math.PI;
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const c = +cIn.value, y = +yIn.value, ys = Math.sqrt((c - G) * (c + G));
    /* 왼쪽: 위에서 본 경기장. 가로 −6~22 m, 세로 0~31 m */
    const pw = w * 0.5, s = Math.min((pw - 16) / 28, (h - 24) / 31), ox = 8 + 6 * s, oy = 14;
    const P = (x, yy) => [ox + x * s, oy + yy * s];
    ctx.fillStyle = "rgba(116,171,102,.18)"; ctx.fillRect(...P(-6, 0), 28 * s, 31 * s);
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(...P(-6, 0)); ctx.lineTo(...P(22, 0)); ctx.stroke();
    ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(...P(c, 0)); ctx.lineTo(...P(c, 31)); ctx.stroke(); ctx.setLineDash([]);
    const [sx, sy] = P(c, y), [l0, l1] = P(-G, 0), [r0, r1] = P(G, 0);
    ctx.fillStyle = "rgba(181,83,47,.22)"; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(l0, l1); ctx.lineTo(r0, r1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.warn; ctx.beginPath(); ctx.moveTo(l0, l1); ctx.lineTo(sx, sy); ctx.lineTo(r0, r1); ctx.stroke();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(l0, l1); ctx.lineTo(r0, r1); ctx.stroke();
    ctx.fillStyle = C.forest; ctx.beginPath(); ctx.arc(...P(c, ys), 4, 0, 7); ctx.fill();
    ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(sx, sy, 6, 0, 7); ctx.fill();
    ctx.fillStyle = C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText("골문 7.32 m", (l0 + r0) / 2, oy - 4);
    /* 오른쪽: θ(y) 그래프 */
    const gx0 = w * 0.58, gx1 = w - 10, gy0 = h - 24, gy1 = 18, tmax = deg(th(c, ys)) * 1.15;
    const X = (v) => gx0 + ((gx1 - gx0) * v) / YMAX, Y = (v) => gy0 - ((gy0 - gy1) * v) / tmax;
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx0, gy1); ctx.lineTo(gx0, gy0); ctx.lineTo(gx1, gy0); ctx.stroke();
    ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 1; i <= 200; i++) { const v = (YMAX * i) / 200, px = X(v), py = Y(deg(th(c, v))); i > 1 ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke();
    ctx.setLineDash([3, 3]); ctx.strokeStyle = C.forest; ctx.beginPath(); ctx.moveTo(X(ys), gy0); ctx.lineTo(X(ys), Y(deg(th(c, ys)))); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(X(y), Y(deg(th(c, y))), 5, 0, 7); ctx.fill();
    ctx.fillStyle = C.ink2; ctx.textAlign = "center"; ctx.fillText("골라인까지 거리 y (m)", (gx0 + gx1) / 2, h - 6);
    ctx.textAlign = "left"; ctx.fillText("보이는 각 θ (°)", gx0 + 4, gy1 - 6);
    ctx.fillStyle = C.forest; ctx.fillText(`√(ab) = ${ys.toFixed(1)}`, Math.min(X(ys) + 4, gx1 - 70), gy0 - 6);
  }
  function update() {
    const c = +cIn.value, y = +yIn.value, a = c - G, b = c + G, ys = Math.sqrt(a * b);
    $(".c-out").textContent = c.toFixed(1); $(".y-out").textContent = y.toFixed(1);
    $(".say").textContent = `a = ${a.toFixed(2)} m, b = ${b.toFixed(2)} m · 지금 각 ${deg(th(c, y)).toFixed(1)}° · 가장 큰 각은 y = √(ab) = ${ys.toFixed(2)} m에서 ${deg(th(c, ys)).toFixed(1)}°`;
    draw();
  }
  [cIn, yIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
