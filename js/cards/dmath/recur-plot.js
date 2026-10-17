/* 카드: 점화식만 보고 수열이 어디로 갈지 알 수 있을까? — aₙ₊₁ = paₙ + q의 거미줄 그림과 항 그래프 */
(() => {
  const root = document.getElementById("card-dmath-recur-plot");
  if (!root) return;
  const { C, F, fit } = NM;
  const D = NMDm;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p"), qIn = $(".q"), aIn = $(".a"), N = 15;
  const A = fit($(".cw"), () => draw()), B = fit($(".sq"), () => draw());
  const seq = () => { const p = +pIn.value, q = +qIn.value, s = [+aIn.value]; for (let k = 1; k < N; k++) s.push(p * s[k - 1] + q); return s; };
  function axes(ctx, w, h, X, Y, lo, hi, xl, yl) {
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.fillStyle = C.ink2; ctx.font = `10px ${F.mono}`;
    ctx.beginPath(); ctx.moveTo(X(xl[0]), Y(0)); ctx.lineTo(X(xl[1]), Y(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0), Y(lo)); ctx.lineTo(X(0), Y(hi)); ctx.stroke();
  }
  function draw() {
    const s = seq(), p = +pIn.value, q = +qIn.value, lo = -6, hi = 10, clamp = (v) => Math.max(lo - 5, Math.min(hi + 5, v));
    { const { ctx, size: { w, h } } = A; if (w) {
      ctx.clearRect(0, 0, w, h);
      const X = (x) => 10 + ((x - lo) / (hi - lo)) * (w - 20), Y = (y) => h - 10 - ((y - lo) / (hi - lo)) * (h - 20);
      axes(ctx, w, h, X, Y, lo, hi, [lo, hi]);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      ctx.strokeStyle = C.ink3; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(X(lo), Y(lo)); ctx.lineTo(X(hi), Y(hi)); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = C.forest; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(lo), Y(p * lo + q)); ctx.lineTo(X(hi), Y(p * hi + q)); ctx.stroke();
      ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(X(clamp(s[0])), Y(0));
      for (let k = 0; k < N - 1; k++) { ctx.lineTo(X(clamp(s[k])), Y(clamp(s[k + 1]))); ctx.lineTo(X(clamp(s[k + 1])), Y(clamp(s[k + 1]))); }
      ctx.stroke();
      if (Math.abs(1 - p) > 1e-9) { const al = q / (1 - p); ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(X(al), Y(al), 5, 0, 7); ctx.fill(); }
      ctx.restore();
      ctx.fillStyle = C.ink2; ctx.font = `600 11px ${F.sans}`; ctx.fillText("y = x", X(hi) - 34, Y(hi) + 14); ctx.fillStyle = C.forest; ctx.fillText("y = px + q", 14, 14);
    } }
    { const { ctx, size: { w, h } } = B; if (w) {
      ctx.clearRect(0, 0, w, h);
      const X = (k) => 24 + (k / (N - 1)) * (w - 34), Y = (y) => h - 14 - ((y - lo) / (hi - lo)) * (h - 24);
      ctx.strokeStyle = C.rule; ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(N - 1), Y(0)); ctx.stroke();
      if (Math.abs(1 - p) > 1e-9) { const al = q / (1 - p); ctx.strokeStyle = C.warn; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X(0), Y(al)); ctx.lineTo(X(N - 1), Y(al)); ctx.stroke(); ctx.setLineDash([]); }
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      ctx.strokeStyle = "rgba(63,111,163,.4)"; ctx.beginPath(); s.forEach((v, k) => (k ? ctx.lineTo(X(k), Y(clamp(v))) : ctx.moveTo(X(k), Y(clamp(v))))); ctx.stroke();
      ctx.fillStyle = "#3f6fa3"; s.forEach((v, k) => { ctx.beginPath(); ctx.arc(X(k), Y(clamp(v)), 3.5, 0, 7); ctx.fill(); });
      ctx.restore();
      ctx.fillStyle = C.ink2; ctx.font = `600 11px ${F.sans}`; ctx.fillText("n →", w - 34, Y(0) - 6); ctx.fillText("aₙ", 4, 12);
    } }
  }
  function update() {
    const p = +pIn.value, q = +qIn.value, a1 = +aIn.value, s = seq();
    $(".p-out").textContent = D.n(p, 1); $(".q-out").textContent = D.n(q, 1); $(".a-out").textContent = D.n(a1, 1);
    let msg;
    if (Math.abs(1 - p) < 1e-9) msg = `p = 1: 공차 ${D.n(q, 1)}인 등차수열 aₙ = ${D.n(a1, 1)} + ${D.n(q, 1)}(n − 1)`;
    else { const al = q / (1 - p); msg = `α = q/(1 − p) = ${D.n(al, 3)} · aₙ = ${D.n(al, 3)} + (${D.n(a1 - al, 3)})·(${D.n(p, 1)})ⁿ⁻¹ · ` + (Math.abs(a1 - al) < 1e-9 ? "처음부터 α에 머묾" : Math.abs(p) < 1 ? `α로 수렴${p < 0 ? "(번갈아 오가며)" : ""}` : Math.abs(p) > 1 ? `α에서 멀어짐${p < 0 ? "(번갈아 오가며)" : ""}` : "진동"); }
    $(".say").textContent = msg + ` · a₁~a₆: ${s.slice(0, 6).map((v) => D.n(v, 2)).join(", ")}`;
    draw();
  }
  [pIn, qIn, aIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
