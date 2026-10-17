/* 카드: 뷔퐁의 바늘 — P(걸침) = 2l/(πd), π ≈ 2lN/(dH) */
(() => {
  const root = document.getElementById("card-mres-buffon-needle");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const lIn = $(".l"), LINES = 6;
  let N = [], hits = 0;   // N: [x, y, θ] (선 간격 1 단위 좌표, y 0~LINES)
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const d = h / LINES, l = +lIn.value, show = N.slice(-400);
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.2;
    for (let k = 0; k <= LINES; k++) { ctx.beginPath(); ctx.moveTo(0, k * d); ctx.lineTo(w, k * d); ctx.stroke(); }
    show.forEach(([x, y, t, hit]) => {
      const dx = ((l * d) / 2) * Math.cos(t), dy = ((l * d) / 2) * Math.sin(t), px = x * w, py = y * d;
      ctx.strokeStyle = hit ? C.warn : "#3f6fa3"; ctx.lineWidth = hit ? 1.8 : 1.2; ctx.beginPath(); ctx.moveTo(px - dx, py - dy); ctx.lineTo(px + dx, py + dy); ctx.stroke();
    });
    if (N.length > 400) { ctx.fillStyle = C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "right"; ctx.fillText(`최근 400개만 그림`, w - 6, 14); }
  }
  function drop(k) {
    const l = +lIn.value;
    for (let i = 0; i < k; i++) {
      const x = Math.random(), y = Math.random() * LINES, t = Math.random() * Math.PI, half = (l / 2) * Math.abs(Math.sin(t));
      const hit = Math.floor(y - half) !== Math.floor(y + half) || Math.abs(y - Math.round(y)) <= half;
      if (hit) hits++; N.push([x, y, t, hit]);
    }
    update();
  }
  function update() {
    const l = +lIn.value, n = N.length;
    $(".l-out").textContent = l.toFixed(2);
    $(".say").textContent = n ? `떨어뜨린 바늘 ${n}개 · 걸친 바늘 ${hits}개(비율 ${(hits / n).toFixed(3)}, 이론 ${((2 * l) / Math.PI).toFixed(3)}) · π ≈ 2lN/(dH) = ${hits ? ((2 * l * n) / hits).toFixed(4) : "?"} (참값 3.1416)` : "바늘을 떨어뜨려 보세요.";
    draw();
  }
  root.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => drop(+b.dataset.k)));
  $(".reset").addEventListener("click", () => { N = []; hits = 0; update(); });
  lIn.addEventListener("input", () => { N = []; hits = 0; update(); });
  update();
})();
