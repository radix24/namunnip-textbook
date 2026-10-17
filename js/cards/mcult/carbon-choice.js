/* 카드: 텀블러는 몇 번 써야 일회용 컵보다 나을까? — cn 과 M + wn 의 교점 n = M/(c − w), 가상 값 */
(() => {
  const root = document.getElementById("card-mcult-carbon-choice");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const mIn = $(".m"), cIn = $(".c"), wIn = $(".w"), NMAX = 200;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const M = +mIn.value, c = +cIn.value, ww = +wIn.value, ymax = Math.max(c * NMAX, M + ww * NMAX) * 1.05, L = 52, R = 12, T = 12, B = 30;
    const X = (n) => L + ((w - L - R) * n) / NMAX, Y = (v) => T + (h - T - B) * (1 - v / ymax);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2;
    const step = ymax > 20000 ? 10000 : ymax > 8000 ? 4000 : 2000;
    for (let v = 0; v <= ymax; v += step) { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(w - R, Y(v)); ctx.stroke(); ctx.textAlign = "right"; ctx.fillText(`${v / 1000} kg`, L - 4, Y(v) + 4); }
    [0, 50, 100, 150, 200].forEach((n) => { ctx.textAlign = "center"; ctx.fillText(String(n), X(n), h - B + 14); });
    ctx.font = `11px ${F.sans}`; ctx.fillText("사용 횟수 n", (L + w - R) / 2, h - 3);
    const line = (f, col) => { ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X(0), Y(f(0))); ctx.lineTo(X(NMAX), Y(f(NMAX))); ctx.stroke(); };
    line((n) => c * n, C.warn); line((n) => M + ww * n, "#3f6fa3");
    /* 이름표: 일회용 컵은 선의 왼쪽 위, 텀블러는 오른쪽 끝 선 아래 */
    ctx.textAlign = "right"; ctx.fillStyle = C.warn; ctx.fillText("일회용 컵 cn", X(NMAX * 0.6) - 8, Math.max(T + 10, Y(c * NMAX * 0.6) - 6));
    ctx.textAlign = "left"; ctx.fillStyle = "#3f6fa3"; ctx.fillText("텀블러 M + wn", X(NMAX * 0.72), Math.min(h - B - 4, Y(M + ww * NMAX * 0.72) + 16));
    if (c > ww) {
      const n0 = M / (c - ww);
      if (n0 <= NMAX) { ctx.fillStyle = C.forest; ctx.beginPath(); ctx.arc(X(n0), Y(c * n0), 6, 0, 7); ctx.fill(); ctx.setLineDash([3, 3]); ctx.strokeStyle = C.forest; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(n0), Y(c * n0)); ctx.lineTo(X(n0), Y(0)); ctx.stroke(); ctx.setLineDash([]); }
    }
  }
  function update() {
    const M = +mIn.value, c = +cIn.value, ww = +wIn.value;
    $(".m-out").textContent = M; $(".c-out").textContent = c; $(".w-out").textContent = ww;
    $(".say").textContent = c > ww ? `손익분기점 n = M/(c − w) = ${M}/(${c} − ${ww}) = ${(M / (c - ww)).toFixed(1)}번 · ${Math.floor(M / (c - ww)) + 1}번째 사용부터 텀블러가 유리` + (M / (c - ww) > NMAX ? ` (그래프 범위 ${NMAX}번 밖)` : "") : `w ≥ c: 한 번 쓸 때마다 텀블러 쪽 배출이 같거나 많아 텀블러는 끝내 유리해지지 않습니다.`;
    draw();
  }
  [mIn, cIn, wIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
