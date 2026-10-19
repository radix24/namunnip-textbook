/* 카드: 울타리 24 m로 둘러싼 직사각형 텃밭은 어떤 모양일 때 가장 넓을까? — x(12 − x), 벽을 쓰면 x(24 − 2x) */
(() => {
  const root = document.getElementById("card-jmath-fence");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const xIn = $(".x"), L = 24;
  let wall = 0, shown = [false, false];
  const other = (x) => (wall ? L - 2 * x : L / 2 - x), area = (x) => Math.max(0, x * other(x));
  const pl = fit($(".plot"), () => drawP()), gr = fit($(".gr"), () => drawG());
  function drawP() {
    const { ctx, size: { w, h } } = pl; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const x = +xIn.value, y = other(x), u = Math.min((w - 30) / 24, (h - 30) / 12), x0 = 15, y0 = 22;
    if (wall) { ctx.fillStyle = "#8d8d92"; ctx.fillRect(x0 - 2, y0 - 10, Math.max(y, 0) * u + 4, 8); ctx.fillStyle = C.ink2; ctx.font = `10px ${F.sans}`; ctx.fillText("건물 벽", x0, y0 - 13); }
    ctx.fillStyle = "rgba(59,124,42,.25)"; ctx.fillRect(x0, y0, Math.max(y, 0) * u, x * u);
    ctx.strokeStyle = "#7a4f1d"; ctx.lineWidth = 3; ctx.beginPath();
    if (wall) { ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + x * u); ctx.lineTo(x0 + y * u, y0 + x * u); ctx.lineTo(x0 + y * u, y0); } else ctx.rect(x0, y0, Math.max(y, 0) * u, x * u);
    ctx.stroke();
    ctx.fillStyle = C.ink2; ctx.font = `11px ${F.mono}`; ctx.fillText(`${y.toFixed(1)} m`, x0 + 4, y0 + x * u + 14); ctx.fillText(`${x.toFixed(1)} m`, x0 + Math.max(y, 0) * u + 4, y0 + (x * u) / 2);
  }
  function drawG() {
    const { ctx, size } = gr; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const xm = wall ? 12 : 12, P = E.frame(ctx, size, { x0: 0, x1: xm, y0: 0, y1: 80, xt: [0, 3, 6, 9, 12], yt: [0, 20, 40, 60, 80], xlab: "가로 x(m)", ylab: "넓이(m²)", L: 30 });
    if (!shown[wall]) { E.text(ctx, P.L + P.w / 2, P.T + P.h / 2, "예측하면 그래프가 나타납니다", C.ink3, "center"); return; }
    E.fn(ctx, P, area, 0, wall ? 12 : 12, E.BLUE, 2.4);
    E.dot(ctx, P, 6, area(6), C.forest, 4, `최대 ${area(6)}`, 6, -6);
    E.dot(ctx, P, +xIn.value, area(+xIn.value), C.warn, 5);
  }
  function update() {
    xIn.max = wall ? 11.5 : 11.5;
    const x = +xIn.value;
    $(".x-out").textContent = x.toFixed(1);
    if (shown[wall]) $(".verdict").textContent = `넓이 = ${x.toFixed(1)} × ${other(x).toFixed(1)} = ${area(x).toFixed(2)} m² · 최대는 가로 6 m, ${other(6)} m일 때 ${area(6)} m²`;
    drawP(); drawG();
  }
  root.querySelectorAll("[data-w]").forEach((b) => b.addEventListener("click", () => { wall = +b.dataset.w; root.querySelectorAll("[data-w]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", "false")); $(".verdict").textContent = ""; update(); }));
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    shown[wall] = true; update();
    $(".verdict").textContent = `${+b.dataset.g === 6 ? "맞습니다." : "예측과 다릅니다."} ${wall ? "벽을 쓰면 넓이 x(24 − 2x)는 x = 6일 때 72 m²로 가장 큽니다(6 m × 12 m, 정사각형이 아님)." : "넓이 x(12 − x)는 x = 6일 때 36 m²로 가장 큽니다(정사각형)."}`;
  }));
  xIn.addEventListener("input", update);
  update();
})();
