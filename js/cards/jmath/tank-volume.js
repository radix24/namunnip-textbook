/* 카드: 원기둥 물탱크를 가득 채우려면 물이 몇 L 필요하고 몇 분이 걸릴까? — πr²h, m³와 L (수업용 가정) */
(() => {
  const root = document.getElementById("card-jmath-tank-volume");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const ins = ["d", "h", "w", "q"].map((k) => $(`.${k}`));
  const { ctx, size } = fit($("canvas"), () => draw());
  function cyl(cx, base, rx, ry, H, lvl) {
    /* 물 */
    if (lvl > 0) { ctx.fillStyle = "rgba(63,111,163,.4)"; ctx.beginPath(); ctx.ellipse(cx, base, rx, ry, 0, 0, Math.PI); ctx.lineTo(cx - rx, base - lvl); ctx.ellipse(cx, base - lvl, rx, ry, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill(); ctx.fillStyle = "rgba(63,111,163,.55)"; ctx.beginPath(); ctx.ellipse(cx, base - lvl, rx, ry, 0, 0, 7); ctx.fill(); }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(cx, base - H, rx, ry, 0, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - rx, base - H); ctx.lineTo(cx - rx, base); ctx.ellipse(cx, base, rx, ry, 0, Math.PI, 0, true); ctx.lineTo(cx + rx, base - H); ctx.stroke();
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const [d, H, wl] = ins.map((x) => +x.value), u = Math.min((w * 0.45) / 4.4, (h - 40) / 4.6), base = h - 22;
    cyl(w * 0.27, base, (d / 2) * u, (d / 2) * u * 0.28, H * u, H * u * (wl / 100));
    ctx.fillStyle = C.ink2; ctx.font = `11px ${F.mono}`; ctx.textAlign = "center";
    ctx.fillText(`지름 ${d.toFixed(1)} m`, w * 0.27, base + 16);
    /* 비교: 밑면이 한 변 d인 정사각형인 직육면체를 정면에서 */
    const bx = w * 0.7, bw = d * u;
    ctx.fillStyle = "rgba(141,141,146,.18)"; ctx.fillRect(bx - bw / 2, base - H * u, bw, H * u); ctx.strokeStyle = C.ink3; ctx.strokeRect(bx - bw / 2, base - H * u, bw, H * u);
    ctx.fillStyle = C.ink2; ctx.fillText(`같은 폭 직육면체`, bx, base + 16);
  }
  function update() {
    const [d, H, wl, q] = ins.map((x) => +x.value), r = d / 2, V = Math.PI * r * r * H, L = V * 1000, box = d * d * H * 1000;
    ["d", "h", "w", "q"].forEach((k, i) => ($(`.${k}-out`).textContent = k === "w" || k === "q" ? ins[i].value : (+ins[i].value).toFixed(1)));
    $(".say").textContent = `밑넓이 π × ${r.toFixed(2)}² = ${(Math.PI * r * r).toFixed(3)} m² · 부피 ${V.toFixed(3)} m³ = ${Math.round(L).toLocaleString()} L · 지금 물 ${Math.round((L * wl) / 100).toLocaleString()} L · 빈 탱크를 채우는 시간 ${(L / q).toFixed(1)}분 · 같은 폭 직육면체 ${Math.round(box).toLocaleString()} L (원기둥은 ${((L / box) * 100).toFixed(1)}%)`;
    draw();
  }
  ins.forEach((x) => x.addEventListener("input", update));
  update();
})();
