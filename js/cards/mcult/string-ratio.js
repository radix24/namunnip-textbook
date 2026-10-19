/* 카드: 현의 길이를 어떻게 나누면 두 소리가 잘 어울릴까? — 진동수는 길이에 반비례, 간단한 비와 협화음 */
(() => {
  const root = document.getElementById("card-mcult-string-ratio");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const rIn = $(".r"), F0 = 220;
  const NAMES = [[1 / 2, "1 : 2", "옥타브"], [2 / 3, "2 : 3", "완전5도"], [3 / 4, "3 : 4", "완전4도"], [4 / 5, "4 : 5", "장3도"], [5 / 6, "5 : 6", "단3도"], [3 / 5, "3 : 5", "장6도"], [1, "1 : 1", "같은 음"]];
  const near = (r) => NAMES.find(([v]) => Math.abs(v - r) < 0.004);
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const r = +rIn.value, L = 20, Rr = w - 20, y = 26, x = L + (Rr - L) * (1 - r);
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(Rr, y); ctx.stroke();
    ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k <= 60; k++) { const t = k / 60; ctx.lineTo(x + (Rr - x) * t, y - 7 * Math.sin(Math.PI * t)); } ctx.stroke();
    ctx.fillStyle = C.ink; [L, Rr].forEach((xx) => ctx.fillRect(xx - 3, y - 10, 6, 20));
    ctx.fillStyle = C.warn; ctx.beginPath(); ctx.moveTo(x, y + 4); ctx.lineTo(x - 6, y + 14); ctx.lineTo(x + 6, y + 14); ctx.closePath(); ctx.fill();
    /* 두 파형: 기본음(회색)과 누른 소리(파랑), 기본음 3주기 동안 */
    const y0 = h * 0.68, A = h * 0.18, f = 1 / r;
    [[1, "rgba(141,141,146,.8)"], [f, "#3f6fa3"]].forEach(([fr, col]) => { ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.beginPath(); for (let k = 0; k <= 400; k++) { const t = (k / 400) * 3; ctx.lineTo(L + (Rr - L) * (k / 400), y0 - A * Math.sin(2 * Math.PI * fr * t)); } ctx.stroke(); });
    ctx.fillStyle = C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "left"; ctx.fillText("회색: 기본음 · 파랑: 누른 소리 (기본음 3번 진동하는 동안)", L, h - 6);
  }
  function update() {
    const r = +rIn.value, f = F0 / r, nm = near(r);
    $(".r-out").textContent = r.toFixed(3);
    $(".say").textContent = `울리는 길이 ${r.toFixed(3)} → 진동수 ${F0} ÷ ${r.toFixed(3)} = ${f.toFixed(1)} Hz (기본음의 ${(1 / r).toFixed(3)}배)` + (nm ? ` · 진동수의 비 ${nm[1]}: ${nm[2]}` : " · 간단한 자연수의 비가 아닙니다");
    draw();
  }
  rIn.addEventListener("input", update);
  root.querySelectorAll("[data-r]").forEach((b) => b.addEventListener("click", () => { rIn.value = b.dataset.r; update(); }));
  $(".go-play").addEventListener("click", () => NMTone.play([F0, F0 / +rIn.value]));
  $(".go-one").addEventListener("click", () => NMTone.play([F0 / +rIn.value]));
  update();
})();
