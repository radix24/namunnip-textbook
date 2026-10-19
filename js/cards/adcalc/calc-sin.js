/* 카드: 계산기는 sin 1000°를 어떻게 계산할까? — 각 줄이기와 테일러다항식, 오차 비교 */
(() => {
  const root = document.getElementById("card-adcalc-calc-sin");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, seg, dot, arc, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sd = $(".sd"), sk = $(".sk"), PI = Math.PI, R = PI / 180;
  const { ctx, size } = fit($("canvas"), () => draw());
  const tsin = (x, k) => { let s = 0, t = x; for (let i = 0; i < k; i++) { s += t; t *= -x * x / ((2 * i + 2) * (2 * i + 3)); } return s; };
  const tcos = (x, k) => { let s = 0, t = 1; for (let i = 0; i < k; i++) { s += t; t *= -x * x / ((2 * i + 1) * (2 * i + 2)); } return s; };
  function reduce(deg) {
    const lines = []; let th = deg % 360, sg = 1;
    lines.push(`${deg}° → ${deg - th}°를 빼면 ${th}°`);
    if (th >= 180) { sg = -1; th -= 180; lines.push(`sin(180° + θ) = −sin θ → −sin ${th}°`); }
    if (th > 90) { th = 180 - th; lines.push(`sin(180° − θ) = sin θ → ${sg < 0 ? "−" : ""}sin ${th}°`); }
    let useCos = false;
    if (th > 45) { useCos = true; lines.push(`sin θ = cos(90° − θ) → ${sg < 0 ? "−" : ""}cos ${90 - th}°`); }
    const x = (useCos ? 90 - th : th) * R;
    return { sg, th, useCos, x, lines };
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const deg = +sd.value, r = reduce(deg), lw = w * 0.5, cx = lw / 2, cy = h / 2, Rr = Math.min(lw, h) * 0.38;
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, 7); ctx.stroke();
    seg(ctx, cx - Rr - 6, cy, cx + Rr + 6, cy, C.rule, 1); seg(ctx, cx, cy - Rr - 6, cx, cy + Rr + 6, C.rule, 1);
    ctx.save(); ctx.fillStyle = "rgba(59,124,42,.15)"; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, Rr, 0, -PI / 4, true); ctx.closePath(); ctx.fill(); ctx.restore();
    const a0 = (deg % 360) * R, [px, py] = [cx + Rr * Math.cos(a0), cy - Rr * Math.sin(a0)];
    seg(ctx, cx, cy, px, py, BLUE, 1.6); dot(ctx, px, py, BLUE);
    arc(ctx, cx, cy, Rr * 0.25, 0, a0, BLUE, 1.2);
    const a1 = r.x, [qx, qy] = [cx + Rr * Math.cos(a1), cy - Rr * Math.sin(a1)];
    seg(ctx, cx, cy, qx, qy, C.forest, 2); dot(ctx, qx, qy, C.forest);
    label(ctx, "0°~45° 영역", cx + Rr * 0.6, cy - Rr * 0.15, C.forest, "left", `10.5px ${F.sans}`);
    label(ctx, `${deg}°`, px + 6, py - 8, BLUE, "left", `600 11px ${F.mono}`);
    // 오른쪽: 오차 막대 (log)
    const k = +sk.value, truth = Math.sin(deg * R);
    const eR = Math.abs(r.sg * (r.useCos ? tcos(r.x, k) : tsin(r.x, k)) - truth), eD = Math.abs(tsin(deg * R, k) - truth);
    const bx = lw + 30, bw = w - bx - 26, Lg = (e) => NM.clamp(Math.log10(Math.max(e, 1e-16)), -16, 8), X = (v) => bx + (v + 16) / 24 * bw;
    [["옮겨서", eR, C.forest, h * 0.35], ["옮기지 않고", eD, C.warn, h * 0.62]].forEach(([nm, e, col, y]) => {
      ctx.fillStyle = col; ctx.fillRect(bx, y - 9, X(Lg(e)) - bx, 18);
      label(ctx, nm, bx, y - 18, col, "left", `600 11px ${F.sans}`);
    });
    [-16, -8, 0, 8].forEach((v) => { seg(ctx, X(v), h * 0.78, X(v), h * 0.8, C.ink3, 1); label(ctx, v === 0 ? "1" : `10^${v}`, X(v), h * 0.86, C.ink3, "center", `10px ${F.mono}`); });
    label(ctx, "오차 (로그 눈금)", bx + bw / 2, h * 0.94, C.ink3, "center", `10.5px ${F.sans}`);
  }
  function nums() {
    const deg = +sd.value, k = +sk.value, r = reduce(deg), truth = Math.sin(deg * R);
    $(".d-out").textContent = deg; $(".k-out").textContent = k;
    const v = r.sg * (r.useCos ? tcos(r.x, k) : tsin(r.x, k));
    $(".stepsx").innerHTML = r.lines.join("<br>") + `<br>${r.useCos ? "cos" : "sin"} 테일러 ${k}항, x = ${n(r.x, 4)} → ${n(v, 10)}`;
    $(".n-t").textContent = n(truth, 10);
    $(".n-r").textContent = NMAdcSci(Math.abs(v - truth));
    $(".n-d").textContent = NMAdcSci(Math.abs(tsin(deg * R, k) - truth));
    draw();
  }
  const NMAdcSci = (e) => (e < 1e-15 ? "< 10⁻¹⁵" : e.toExponential(1).replace("e", " × 10^"));
  [sd, sk].forEach((s) => s.addEventListener("input", nums));
  nums();
})();
