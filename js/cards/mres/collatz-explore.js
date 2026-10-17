/* 카드: 콜라츠 수열 따라가기와 1~300 조사 — 관찰·추측·검증, 탐구 기록 */
(() => {
  const root = document.getElementById("card-mres-collatz-explore");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const seq = (n) => { const a = [n]; while (n !== 1 && a.length < 2000) { n = n % 2 ? 3 * n + 1 : n / 2; a.push(n); } return a; };
  let mode = "seq", data = seq(27);
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const L = 48, R = 10, T = 10, B = 26, ys = mode === "seq" ? data : data.map((d) => d[1]), xs = mode === "seq" ? data.map((_, i) => i) : data.map((d) => d[0]);
    const xmax = Math.max(...xs, 1), ymax = Math.max(...ys, 1), X = (v) => L + ((w - L - R) * v) / xmax, Y = (v) => T + (h - T - B) * (1 - v / ymax);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2;
    [0, 0.5, 1].forEach((f) => { ctx.beginPath(); ctx.moveTo(L, Y(ymax * f)); ctx.lineTo(w - R, Y(ymax * f)); ctx.stroke(); ctx.textAlign = "right"; ctx.fillText(String(Math.round(ymax * f)), L - 4, Y(ymax * f) + 4); });
    ctx.textAlign = "center"; [0, 0.5, 1].forEach((f) => ctx.fillText(String(Math.round(xmax * f)), X(xmax * f), h - 10));
    ctx.font = `11px ${F.sans}`; ctx.fillText(mode === "seq" ? "단계" : "시작 수", (L + w - R) / 2, h - 1);
    if (mode === "seq") { ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 1.6; ctx.beginPath(); data.forEach((v, i) => (i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)))); ctx.stroke(); }
    else { const mx = Math.max(...ys); data.forEach(([n, s]) => { ctx.fillStyle = s === mx ? C.warn : "#3f6fa3"; ctx.fillRect(X(n) - 1, Y(s) - 1, 2.5, 2.5); }); }
  }
  const log = (t) => { const li = document.createElement("li"); li.textContent = t; $(".log").prepend(li); };
  $(".go").addEventListener("click", () => {
    const n = Math.max(1, Math.min(1e6, Math.floor(+$(".n").value || 1))); mode = "seq"; data = seq(n);
    const mx = Math.max(...data), msg = `${n}: ${data.length - 1}단계, 최댓값 ${mx.toLocaleString("ko-KR")}` + (data.length > 12 ? "" : ` (${data.join(" → ")})`);
    $(".say").textContent = msg; log(msg); draw();
  });
  $(".scan").addEventListener("click", () => {
    mode = "scan"; data = Array.from({ length: 300 }, (_, i) => [i + 1, seq(i + 1).length - 1]);
    const best = data.reduce((b, d) => (d[1] > b[1] ? d : b));
    const msg = `1~300 조사: 모두 1에 도착 · 가장 오래 걸린 수 ${best[0]}(${best[1]}단계, 빨간 점)`;
    $(".say").textContent = msg; log(msg); draw();
  });
  $(".say").textContent = `27: ${data.length - 1}단계, 최댓값 ${Math.max(...data).toLocaleString("ko-KR")}`;
})();
