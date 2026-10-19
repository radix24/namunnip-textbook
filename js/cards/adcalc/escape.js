/* 카드: 무한히 멀리 가는 데 드는 일은 유한할까? — 중력 1/r² 아래 넓이(일)와 탈출 속도 */
(() => {
  const root = document.getElementById("card-adcalc-escape");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, seg, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sr = $(".sr");
  const GM = 3.986004e14, R = 6.371e6, VE = Math.sqrt(2 * GM / R);
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const k = 10 ** +sr.value;    // r / R
    // 위: 힘 F ∝ 1/r² (r/R: 1~12 선형)
    const x0 = 34, y0 = 10, gw = w - 44, gh = h * 0.56;
    const XM = 12, X = (r) => x0 + (r - 1) / (XM - 1) * gw, Y = (f) => y0 + gh - f * gh;
    NM.axes(ctx, { x0, y0, w: gw, h: gh, X, Y, xt: [1, 2, 4, 6, 8, 10, 12].map((v) => [v, `${v}R`]), yt: [[0, "0"], [0.5, "½"], [1, "1"]] });
    ctx.save(); ctx.fillStyle = "rgba(59,124,42,.22)"; ctx.beginPath(); ctx.moveTo(X(1), Y(0));
    const kk = Math.min(k, XM);
    for (let i = 0; i <= 200; i++) { const r = 1 + (kk - 1) * i / 200; ctx.lineTo(X(r), Y(1 / (r * r))); }
    ctx.lineTo(X(kk), Y(0)); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.beginPath();
    for (let i = 0; i <= 300; i++) { const r = 1 + (XM - 1) * i / 300; i ? ctx.lineTo(X(r), Y(1 / (r * r))) : ctx.moveTo(X(r), Y(1 / (r * r))); }
    ctx.stroke();
    label(ctx, "중력 (지표면 = 1)", x0 + gw - 4, y0 + 10, BLUE, "right", `600 11px ${F.sans}`);
    if (k > XM) label(ctx, `→ ${n(k, 0)}R까지 계속`, x0 + gw - 4, Y(0.12), C.forest, "right", `600 11px ${F.sans}`);
    // 아래: 필요한 속도 막대
    const by = y0 + gh + 30, bw = gw, bh = 16;
    const v = VE * Math.sqrt(1 - 1 / k);
    ctx.fillStyle = C.rule; ctx.fillRect(x0, by, bw, bh);
    ctx.fillStyle = C.forest; ctx.fillRect(x0, by, bw * v / VE, bh);
    seg(ctx, x0 + bw, by - 6, x0 + bw, by + bh + 6, C.warn, 2);
    label(ctx, `필요한 발사 속도 ${n(v / 1000, 2)} km/s`, x0, by - 10, C.forest, "left", `600 11px ${F.sans}`);
    label(ctx, `탈출 속도 ${n(VE / 1000, 2)} km/s`, x0 + bw, by + bh + 14, C.warn, "right", `600 11px ${F.sans}`);
    dot(ctx, x0 + bw * v / VE, by + bh / 2, C.forest, 3);
  }
  function nums() {
    const k = 10 ** +sr.value;
    $(".r-out").textContent = k < 100 ? n(k, 1) : n(k, 0);
    $(".n-f").textContent = `${n((1 - 1 / k) * 100, 1)}%`;
    $(".n-v").textContent = `${n(VE * Math.sqrt(1 - 1 / k) / 1000, 2)} km/s`;
    $(".n-e").textContent = `${n(VE / 1000, 2)} km/s`;
    draw();
  }
  root.querySelectorAll(".presets .chip").forEach((b) => b.addEventListener("click", () => { sr.value = b.dataset.r; nums(); }));
  sr.addEventListener("input", nums);
  nums();
})();
