/* 카드: 디자인 프로그램은 점 네 개로 어떻게 매끄러운 곡선을 그릴까? — 드 카스텔조 작도, 3차 베지에 */
(() => {
  const root = document.getElementById("card-mcult-bezier-path");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const cv = $("canvas"), tIn = $(".t"), show = $(".show");
  const P = [[0.1, 0.8], [0.25, 0.15], [0.75, 0.15], [0.9, 0.8]];   // 화면 비율 좌표
  const { ctx, size } = fit(cv, () => draw());
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const steps = (pts, t) => { const out = [pts]; while (out.at(-1).length > 1) { const q = out.at(-1); out.push(q.slice(1).map((p, i) => lerp(q[i], p, t))); } return out; };
  let drag = -1;
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const S = (p) => [p[0] * w, p[1] * h], t = +tIn.value;
    ctx.strokeStyle = C.rule || "#ccc"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.beginPath(); P.map(S).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = C.accent || "#3f6fa3"; ctx.lineWidth = 3; ctx.beginPath();
    for (let i = 0; i <= 120; i++) { const [x, y] = S(steps(P, i / 120).at(-1)[0]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
    const lv = steps(P, t), cols = ["#7a8a4a", "#b4562f"];
    if (show.checked) lv.slice(1, 3).forEach((pts, j) => {
      ctx.strokeStyle = cols[j]; ctx.fillStyle = cols[j]; ctx.lineWidth = 1.5; ctx.beginPath(); pts.map(S).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      pts.map(S).forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 7); ctx.fill(); });
    });
    const [bx, by] = S(lv.at(-1)[0]); ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(bx, by, 6, 0, 7); ctx.fill();
    ctx.font = `12px ${F.mono}`; ctx.textAlign = "center";
    P.map(S).forEach(([x, y], i) => { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill(); ctx.fillStyle = C.ink2; ctx.fillText(`P${i}`, x, y + (y > h - 24 ? -12 : 20)); });
  }
  function update() {
    const t = +tIn.value, B = steps(P, t).at(-1)[0], c = [(1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t ** 2, t ** 3];
    $(".t-out").textContent = t.toFixed(2);
    $(".say").textContent = `t = ${t.toFixed(2)} · 가중치 ${c.map((v) => v.toFixed(3)).join(" + ")} = 1 · B(t) = (${(B[0] * 10).toFixed(2)}, ${((1 - B[1]) * 10).toFixed(2)}) (가로·세로 0~10 눈금) · 점을 끌어 보세요`;
    draw();
  }
  const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  cv.addEventListener("pointerdown", (e) => {
    const [x, y] = pos(e), { w, h } = size;
    drag = P.findIndex((p) => Math.hypot((p[0] - x) * w, (p[1] - y) * h) < 16);
    if (drag >= 0) { cv.setPointerCapture(e.pointerId); cv.style.cursor = "grabbing"; }
  });
  cv.addEventListener("pointermove", (e) => {
    if (drag < 0) return;
    const [x, y] = pos(e); P[drag] = [Math.min(0.97, Math.max(0.03, x)), Math.min(0.95, Math.max(0.05, y))]; update();
  });
  const end = () => { drag = -1; cv.style.cursor = ""; };
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
  [tIn, show].forEach((x) => x.addEventListener("input", update));
  update();
})();
