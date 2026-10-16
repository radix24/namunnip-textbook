/* 카드: 정규직교기저에서는 좌표를 왜 연립방정식 없이 구할까? — ±1/2 기저 넷으로 신호 만들기, 작은 계수 버리기 */
(() => {
  const root = document.getElementById("card-adalg-ortho-coords");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  const U = [[1, 1, 1, 1], [1, 1, -1, -1], [1, -1, 1, -1], [1, -1, -1, 1]].map((u) => u.map((x) => x / 2));
  const COL = [C.forest, C.warn, "#3f6fa3", "#7b5ea7"];
  const sl = [...root.querySelectorAll("[data-c]")], out = [...root.querySelectorAll("[data-o]")], verdict = $(".verdict");
  /* 목표 신호: 좌표가 0.5 간격 정수배가 되도록 성분은 정수, 넷의 합이 짝수 조합만 */
  const BANK = [[5, 3, 2, 4], [6, 6, 2, 2], [1, 3, 5, 7], [8, 2, 6, 0], [4, 5, 5, 4], [7, 1, 1, 7]];
  let bi = 0, x = BANK[0], done = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const cur = () => sl.reduce((s, el, k) => L.add(s, L.scl(U[k], +el.value)), [0, 0, 0, 0]);

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const top = h * 0.68, Lm = 30, R = 10, T = 10, ymin = -2, ymax = 10, bw = (w - Lm - R) / 4;
    const Y = (v) => T + ((ymax - v) / (ymax - ymin)) * (top - T);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.fillStyle = C.ink2; ctx.font = `11px ${F.mono}`; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (let v = ymin; v <= ymax; v += 2) { ctx.beginPath(); ctx.moveTo(Lm, Y(v)); ctx.lineTo(w - R, Y(v)); ctx.stroke(); ctx.fillText(String(v).replace("-", "−"), Lm - 4, Y(v)); }
    ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.moveTo(Lm, Y(0)); ctx.lineTo(w - R, Y(0)); ctx.stroke();
    const c = cur();
    c.forEach((v, i) => {
      const x0 = Lm + i * bw + bw * 0.18, ww = bw * 0.64;
      ctx.fillStyle = "rgba(63,111,163,.55)"; ctx.fillRect(x0, Math.min(Y(v), Y(0)), ww, Math.abs(Y(v) - Y(0)));
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.strokeRect(x0 - 3, Math.min(Y(x[i]), Y(0)), ww + 6, Math.abs(Y(x[i]) - Y(0))); ctx.setLineDash([]);
    });
    // 기저 모양 넷
    const bh = (h - top - 10) / 1, gw = (w - Lm - R) / 4;
    U.forEach((u, k) => {
      const gx = Lm + k * gw, mid = top + 10 + bh / 2, a = bh * 0.38;
      ctx.fillStyle = C.ink2; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = `600 11px ${F.sans}`; ctx.fillText(`u${"₁₂₃₄"[k]}`, gx + 2, top + 8);
      u.forEach((v, i) => { const xx = gx + 26 + i * ((gw - 34) / 4); ctx.fillStyle = COL[k]; ctx.fillRect(xx, v > 0 ? mid - a * 2 * v : mid, (gw - 34) / 4 - 3, a * 2 * Math.abs(v)); });
      ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.moveTo(gx + 24, mid); ctx.lineTo(gx + gw - 6, mid); ctx.stroke();
    });
  }
  function update() {
    const c = cur(), err = Math.hypot(...L.sub(c, x));
    sl.forEach((el, k) => (out[k].textContent = L.frac(+el.value)));
    $(".tgt").textContent = `목표 x = (${x.join(", ")}) · 지금 (${c.map((v) => L.n(v, 2)).join(", ")}) · 차이의 크기 ${L.n(err, 3)}`;
    if (!done && err < 1e-9) { done = true; verdict.textContent = `완성! 좌표 (${sl.map((el) => L.frac(+el.value)).join(", ")}). 각각 x·u₁, x·u₂, x·u₃, x·u₄와 같은지 계산해 보세요.`; verdict.className = "verdict good"; }
    draw();
  }
  $(".go-dot").addEventListener("click", () => {
    const c = U.map((u) => L.dot(x, u));
    sl.forEach((el, k) => (el.value = c[k]));
    verdict.textContent = `c = (x·u₁, x·u₂, x·u₃, x·u₄) = (${c.map((v) => L.frac(v)).join(", ")}). 제곱의 합 ${L.n(c.reduce((s, v) => s + v * v, 0), 2)} = |x|² = ${x.reduce((s, v) => s + v * v, 0)}`;
    verdict.className = "verdict"; done = true; update();
  });
  $(".go-drop").addEventListener("click", () => {
    const c = U.map((u) => L.dot(x, u)), nz = c.map((v, k) => [Math.abs(v), k]).filter(([a]) => a > 1e-9).sort((p, q) => p[0] - q[0]);
    if (!nz.length) return;
    const k = nz[0][1]; c[k] = 0;
    sl.forEach((el, j) => (el.value = c[j]));
    done = true; update();
    const lost = U.map((u) => L.dot(x, u))[k];
    verdict.textContent = `c${"₁₂₃₄"[k]} = ${L.frac(lost)}을 버렸습니다. 계수 3개만 저장하고, 차이의 크기는 |c${"₁₂₃₄"[k]}| = ${L.n(Math.abs(lost), 3)}입니다.`;
    verdict.className = "verdict";
  });
  $(".go-new").addEventListener("click", () => { bi = (bi + 1) % BANK.length; x = BANK[bi]; sl.forEach((el) => (el.value = 0)); done = false; verdict.textContent = ""; verdict.className = "verdict"; update(); });
  sl.forEach((el) => el.addEventListener("input", update));
  update();
})();
