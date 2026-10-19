/* 카드: "모든 삼각형은 이등변삼각형이다"의 증명은 어디가 틀렸을까? — 오류 찾기, 찾으면 정확한 그림 */
(() => {
  const root = document.getElementById("card-adgeo-fallacy");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const cv = $("canvas");
  let A = [-0.55, 0.75]; const B = [-0.8, -0.45], Cc = [0.85, -0.45]; // 단위 좌표
  const { ctx, size } = fit(cv, () => draw());
  const sub = (p, q) => [p[0] - q[0], p[1] - q[1]], add = (p, q) => [p[0] + q[0], p[1] + q[1]], mul = (p, k) => [p[0] * k, p[1] * k], len = (p) => Math.hypot(...p), unit = (p) => mul(p, 1 / len(p)), dot = (p, q) => p[0] * q[0] + p[1] * q[1];
  const foot = (P, X, Y) => { const d = unit(sub(Y, X)); return add(X, mul(d, dot(sub(P, X), d))); };
  function geom() {
    const u = add(unit(sub(B, A)), unit(sub(Cc, A))); // 이등분선 방향
    const M = mul(add(B, Cc), 0.5), n = [-(Cc[1] - B[1]), Cc[0] - B[0]]; // 수직이등분선: M + s n
    const den = u[0] * n[1] - u[1] * n[0]; if (Math.abs(den) < 1e-9) return null;
    const t = ((M[0] - A[0]) * n[1] - (M[1] - A[1]) * n[0]) / den, P = add(A, mul(u, t));
    return { P, M, E: foot(P, A, B), Fp: foot(P, A, Cc) };
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = Math.min(w, h) * 0.38, T = (p) => [w / 2 + p[0] * s, h * 0.42 - p[1] * s];
    const g = geom(), line = (p, q, col, lw = 2, dash) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(...T(p)); ctx.lineTo(...T(q)); ctx.stroke(); ctx.setLineDash([]); };
    if (g) {
      const O = (() => { const a = A, b = B, c = Cc, d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])); const ux = ((a[0] ** 2 + a[1] ** 2) * (b[1] - c[1]) + (b[0] ** 2 + b[1] ** 2) * (c[1] - a[1]) + (c[0] ** 2 + c[1] ** 2) * (a[1] - b[1])) / d, uy = ((a[0] ** 2 + a[1] ** 2) * (c[0] - b[0]) + (b[0] ** 2 + b[1] ** 2) * (a[0] - c[0]) + (c[0] ** 2 + c[1] ** 2) * (b[0] - a[0])) / d; return [ux, uy]; })();
      ctx.strokeStyle = "rgba(141,141,146,.6)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(...T(O), len(sub(A, O)) * s, 0, 7); ctx.stroke();
      line(A, g.P, C.forest, 1.6, [6, 4]); line(g.M, g.P, "#3f6fa3", 1.6, [6, 4]);
      line(A, add(A, mul(sub(g.E, A), 1.3)), C.ink3, 1); line(A, add(A, mul(sub(g.Fp, A), 1.3)), C.ink3, 1);
      line(g.P, g.E, C.warn, 1.6); line(g.P, g.Fp, C.warn, 1.6); line(g.P, B, "#7b5ea7", 1.2); line(g.P, Cc, "#7b5ea7", 1.2);
    }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(...T(A)); ctx.lineTo(...T(B)); ctx.lineTo(...T(Cc)); ctx.closePath(); ctx.stroke();
    ctx.font = `italic 700 14px ${F.serif}`; ctx.fillStyle = C.ink; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const lab = (t, p, dx = 0, dy = -12) => { const q = T(p); ctx.fillText(t, q[0] + dx, q[1] + dy); };
    lab("A", A); lab("B", B, -10, 10); lab("C", Cc, 10, 10);
    if (g) { lab("P", g.P, 12, 6); lab("E", g.E, -12, 0); lab("F", g.Fp, 12, 0); [g.P, g.E, g.Fp].forEach((p) => { ctx.beginPath(); ctx.arc(...T(p), 3.5, 0, 7); ctx.fill(); }); }
    ctx.beginPath(); ctx.arc(...T(A), 7, 0, 7); ctx.lineWidth = 1.5; ctx.stroke();
    if (g) { const onSeg = (X, Y, Q) => dot(sub(Q, X), sub(Y, X)) >= 0 && dot(sub(Q, Y), sub(X, Y)) >= 0; ctx.font = `600 12px ${F.sans}`; ctx.textAlign = "left"; ctx.fillStyle = C.ink2; ctx.fillText(`E는 변 AB ${onSeg(A, B, g.E) ? "위" : "밖"}, F는 변 AC ${onSeg(A, Cc, g.Fp) ? "위" : "밖"}에 있음`, 8, h - 14); }
  }
  let drag = false;
  const toU = (e) => { const b = cv.getBoundingClientRect(), { w, h } = size, s = Math.min(w, h) * 0.38; return [(e.clientX - b.left - w / 2) / s, (h * 0.42 - (e.clientY - b.top)) / s]; };
  cv.addEventListener("pointerdown", (e) => { const p = toU(e); if (len(sub(p, A)) < 0.12) { drag = true; cv.setPointerCapture(e.pointerId); } });
  cv.addEventListener("pointermove", (e) => { if (!drag) return; const p = toU(e); A = [Math.max(-1.1, Math.min(1.1, p[0])), Math.max(0.1, Math.min(1.1, p[1]))]; draw(); });
  cv.addEventListener("pointerup", () => (drag = false));
  NMPm.spot($(".spot"), () => { cv.classList.remove("hidden"); draw(); });
})();
