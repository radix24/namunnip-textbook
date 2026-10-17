/* 카드: 반으로 접어도 닮은 종이 — x : 1 → 1 : x/2, x = √2, A4 210 × 297 mm */
(() => {
  const root = document.getElementById("card-mres-paper-ratio");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const rIn = $(".r");
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const r = +rIn.value, H0 = h - 30, W0 = H0 / r;   // 원래 종이: 세로(긴 변) H0, 가로 W0
    const x0 = w * 0.08, y0 = 10;
    ctx.fillStyle = "rgba(63,111,163,.18)"; ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 2; ctx.fillRect(x0, y0, W0, H0); ctx.strokeRect(x0, y0, W0, H0);
    ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x0, y0 + H0 / 2); ctx.lineTo(x0 + W0, y0 + H0 / 2); ctx.stroke(); ctx.setLineDash([]);
    /* 접은 종이(긴 변 W0, 짧은 변 H0/2)를 세워서 같은 높이로 확대해 겹침 */
    const longF = Math.max(W0, H0 / 2), shortF = Math.min(W0, H0 / 2), k = H0 / longF, x1 = w * 0.55;
    ctx.fillStyle = "rgba(181,83,47,.15)"; ctx.strokeStyle = C.warn; ctx.fillRect(x1, y0, shortF * k, H0); ctx.strokeRect(x1, y0, shortF * k, H0);
    ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.strokeRect(x1, y0, W0, H0); ctx.setLineDash([]);
    ctx.fillStyle = C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "left";
    ctx.fillText("원래 종이(점선: 접는 선)", x0, h - 6); ctx.fillText("접은 종이 확대(점선: 원래 모양)", x1, h - 6);
  }
  function update() {
    const r = +rIn.value, fr = Math.max(1, r / 2) / Math.min(1, r / 2);
    $(".r-out").textContent = r.toFixed(3);
    $(".say").textContent = `원래 비 ${r.toFixed(3)} : 1 → 접은 종이 비 ${fr.toFixed(3)} : 1 · ${Math.abs(fr - r) < 0.005 ? "같은 모양(닮음)!" : `차이 ${Math.abs(fr - r).toFixed(3)}`} · √2 = 1.41421…`;
    draw();
  }
  $(".a4").addEventListener("click", () => { rIn.value = (297 / 210).toFixed(3); update(); });
  rIn.addEventListener("input", update);
  update();
})();
