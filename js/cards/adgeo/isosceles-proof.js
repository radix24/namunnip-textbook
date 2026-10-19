/* 카드: 두 변이 같으면 두 밑각도 같다는 것을 어떻게 증명할까? — 이등변삼각형 그림과 증명 조립 */
(() => {
  const root = document.getElementById("card-adgeo-isosceles-proof");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  let ax = 0.15, ay = 0.82, stage = -1; // A의 위치(정규화), B, C는 고정이 아닌 AB = AC가 되도록 A 기준 대칭
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const pts = () => { const { w, h } = size, s = Math.min(w, h * 1.33) * 0.42, cx = w / 2, by = h * 0.86, A = [cx + ax * s * 0.6, by - ay * s * 1.4]; const half = s * 0.75, mid = A[0]; return { A, B: [mid - half, by], Cc: [mid + half, by] }; };
  const angle = (P, Q, R) => { const u = [Q[0] - P[0], Q[1] - P[1]], v = [R[0] - P[0], R[1] - P[1]]; return (Math.acos((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))) * 180) / Math.PI; };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const { A, B, Cc } = pts(), D = [(B[0] + Cc[0]) / 2, B[1]];
    if (stage >= 2) { ctx.fillStyle = "rgba(63,111,163,.18)"; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...D); ctx.fill(); ctx.fillStyle = "rgba(181,83,47,.16)"; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...Cc); ctx.lineTo(...D); ctx.fill(); }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...Cc); ctx.closePath(); ctx.stroke();
    if (stage >= 0) { ctx.setLineDash([6, 4]); ctx.strokeStyle = C.forest; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...D); ctx.stroke(); ctx.setLineDash([]); }
    // 같은 변 표시
    const tick = (P, Q, n) => { const m = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], t = Math.atan2(Q[1] - P[1], Q[0] - P[0]) + Math.PI / 2; for (let k = 0; k < n; k++) { const o = (k - (n - 1) / 2) * 5, c = [m[0] + o * Math.cos(t - Math.PI / 2), m[1] + o * Math.sin(t - Math.PI / 2)]; ctx.beginPath(); ctx.moveTo(c[0] - 6 * Math.cos(t), c[1] - 6 * Math.sin(t)); ctx.lineTo(c[0] + 6 * Math.cos(t), c[1] + 6 * Math.sin(t)); ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.stroke(); } };
    tick(A, B, 1); tick(A, Cc, 1);
    const arcAt = (P, Q, R, col) => { const a1 = Math.atan2(Q[1] - P[1], Q[0] - P[0]), a2 = Math.atan2(R[1] - P[1], R[0] - P[0]); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(...P, 22, Math.min(a1, a2), Math.max(a1, a2)); ctx.stroke(); };
    if (stage >= 1) { arcAt(A, B, D, "#3f6fa3"); arcAt(A, D, Cc, "#b5532f"); }
    if (stage >= 3) { arcAt(B, A, Cc, C.forest); arcAt(Cc, B, A, C.forest); }
    ctx.fillStyle = C.ink; ctx.font = `italic 700 15px ${F.serif}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("A", A[0], A[1] - 14); ctx.fillText("B", B[0] - 12, B[1] + 6); ctx.fillText("C", Cc[0] + 12, Cc[1] + 6); if (stage >= 0) ctx.fillText("D", D[0], D[1] + 14);
    ctx.beginPath(); ctx.arc(...A, 6, 0, 7); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.stroke();
    $(".say").textContent = `∠B = ${angle(B, A, Cc).toFixed(1)}°, ∠C = ${angle(Cc, B, A).toFixed(1)}° · A를 끌어 보세요`;
  }
  let drag = false;
  cv.addEventListener("pointerdown", (e) => { const b = cv.getBoundingClientRect(), { A } = pts(); if (Math.hypot(e.clientX - b.left - A[0], e.clientY - b.top - A[1]) < 20) { drag = true; cv.setPointerCapture(e.pointerId); } });
  cv.addEventListener("pointermove", (e) => { if (!drag) return; const b = cv.getBoundingClientRect(), { w, h } = size, s = Math.min(w, h * 1.33) * 0.42, by = h * 0.86; ax = Math.max(-0.6, Math.min(0.6, (e.clientX - b.left - w / 2) / (s * 0.6))); ay = Math.max(0.15, Math.min(1.1, (by - (e.clientY - b.top)) / (s * 1.4))); draw(); });
  cv.addEventListener("pointerup", () => (drag = false));
  NMProof.mount($(".pf"), { order: ["a", "b", "c", "d"], onStep(i) { stage = i; draw(); } });
  draw();
})();
