/* 카드: 띠 무늬는 몇 종류일까? — 7가지 띠 무늬, 기본 모양을 (가로 부호, 세로 부호, 이동)으로 되풀이 */
(() => {
  const root = document.getElementById("card-mcult-frieze");
  if (!root) return;
  const { C, fit } = NM;
  const $ = (s) => root.querySelector(s);
  /* 각 방법: 한 주기 안의 복사본 [sx, sy, dx(칸)], 주기(칸), 가진 대칭 */
  const M = [
    ["이동만", [[1, 1, 0]], 1, "t"],
    ["미끄럼 반사", [[1, 1, 0], [1, -1, 1]], 2, "tg"],
    ["좌우 반사", [[1, 1, 0], [-1, 1, 2]], 2, "tv"],
    ["180° 회전", [[1, 1, 0], [-1, -1, 2]], 2, "tr"],
    ["위아래 반사", [[1, 1, 0], [1, -1, 0]], 1, "thg"],
    ["좌우+위아래 반사", [[1, 1, 0], [1, -1, 0], [-1, 1, 2], [-1, -1, 2]], 2, "tvhrg"],
    ["좌우 반사+미끄럼", [[1, 1, 0], [-1, 1, 2], [1, -1, 2], [-1, -1, 4]], 4, "tvrg"],
  ];
  $(".presets").innerHTML = M.map((m, i) => `<button class="chip" type="button" data-m="${i}">${m[0]}</button>`).join("");
  let cur = 0;
  const { ctx, size } = fit($("canvas"), () => draw());
  /* 기본 모양: 칸의 위쪽 절반 안의 비대칭 깃발 모양(위아래 반사 때 겹치지 않도록) */
  function motif(u, hh) {
    ctx.beginPath(); ctx.moveTo(0.12 * u, -0.04 * hh); ctx.lineTo(0.12 * u, -0.46 * hh); ctx.lineTo(0.88 * u, -0.36 * hh); ctx.lineTo(0.3 * u, -0.24 * hh); ctx.lineTo(0.3 * u, -0.04 * hh); ctx.closePath();
    ctx.fill(); ctx.beginPath(); ctx.arc(0.62 * u, -0.13 * hh, 0.08 * u, 0, 7); ctx.fill();
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const [, cp, per] = M[cur], u = Math.min(h * 0.8, w / 12), hh = h * 0.9, n = Math.ceil(w / (u * per)) + 1;
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, h / 2 - hh / 2); ctx.lineTo(w, h / 2 - hh / 2); ctx.moveTo(0, h / 2 + hh / 2); ctx.lineTo(w, h / 2 + hh / 2); ctx.stroke();
    for (let k = 0; k < n; k++) cp.forEach(([sx, sy, dx], j) => {
      ctx.save(); ctx.translate(4 + (k * per + dx) * u, h / 2); ctx.scale(sx, sy);
      ctx.fillStyle = k === 0 && j === 0 ? C.warn : "#3f6fa3"; motif(u, hh); ctx.restore();
    });
  }
  function pick(i) {
    cur = i;
    root.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.m === i)));
    root.querySelectorAll("[data-s]").forEach((s) => s.classList.toggle("on", M[i][3].includes(s.dataset.s)));
    $(".say").textContent = `방법 ${i + 1}/7 "${M[i][0]}" · 빨간 것이 기본 모양 · 대칭: ${[...M[i][3]].map((c) => ({ t: "평행이동", v: "세로축 반사", h: "가로축 반사", r: "180° 회전", g: "미끄럼 반사" })[c]).join(", ")}`;
    draw();
  }
  root.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => pick(+b.dataset.m)));
  pick(0);
})();
