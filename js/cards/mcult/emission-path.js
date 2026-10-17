/* 카드: 같은 비율로 줄이기 vs 같은 양씩 줄이기 — Σ100(1−r)^k = 100/r, 등차 경로 합 100(N+1)/2, 가상 예산 1500 */
(() => {
  const root = document.getElementById("card-mcult-emission-path");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const rIn = $(".r"), nIn = $(".n"), BUD = 1500, YRS = 60;
  const { ctx, size } = fit($("canvas"), () => draw());
  const geo = (r) => 100 / r, lin = (n) => (100 * (n + 1)) / 2;
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const r = +rIn.value / 100, n = +nIn.value, L = 34, R = 10, T = 10, B = 26;
    const X = (k) => L + ((w - L - R) * k) / YRS, Y = (v) => T + (h - T - B) * (1 - v / 105);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2;
    [0, 50, 100].forEach((v) => { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(w - R, Y(v)); ctx.stroke(); ctx.textAlign = "right"; ctx.fillText(String(v), L - 4, Y(v) + 4); });
    [0, 10, 20, 30, 40, 50, 60].forEach((k) => { ctx.textAlign = "center"; ctx.fillText(String(k), X(k), h - B + 14); });
    ctx.font = `11px ${F.sans}`; ctx.fillText("몇 년 뒤", (L + w - R) / 2, h - 3);
    const path = (f, fill, line) => {
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); for (let k = 0; k <= YRS; k++) ctx.lineTo(X(k), Y(f(k))); ctx.lineTo(X(YRS), Y(0)); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
      ctx.beginPath(); for (let k = 0; k <= YRS; k++) (k ? ctx.lineTo(X(k), Y(f(k))) : ctx.moveTo(X(k), Y(f(k)))); ctx.strokeStyle = line; ctx.lineWidth = 2; ctx.stroke();
    };
    path((k) => 100 * (1 - r) ** k, "rgba(63,111,163,.15)", "#3f6fa3");
    path((k) => Math.max(0, 100 * (1 - k / n)), "rgba(181,83,47,.12)", C.warn);
    ctx.textAlign = "right"; ctx.fillStyle = "#3f6fa3"; ctx.fillText(`같은 비율: 총 ${geo(r).toFixed(0)}`, w - R - 4, T + 14);
    ctx.fillStyle = C.warn; ctx.fillText(`같은 양: 총 ${lin(n).toFixed(0)}`, w - R - 4, T + 30);
  }
  function update() {
    const r = +rIn.value / 100, n = +nIn.value, g = geo(r), l = lin(n);
    $(".r-out").textContent = (r * 100).toFixed(1); $(".n-out").textContent = n;
    const ok = (v) => (v <= BUD ? "예산 안" : `예산 초과 ${(v - BUD).toFixed(0)}`);
    $(".say").textContent = `같은 비율(${(r * 100).toFixed(1)}%): 총 100/r = ${g.toFixed(0)} (${ok(g)}) · 같은 양(${n}년에 0): 총 100(N + 1)/2 = ${l.toFixed(0)} (${ok(l)}) · 가상 예산 ${BUD}`;
    draw();
  }
  [rIn, nIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
