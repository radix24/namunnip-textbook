/* 카드: 안개 낀 산에서 가장 낮은 곳을 찾아 내려가려면? — 1변수 경사하강법과 학습률 (가상 자료) */
(() => {
  const root = document.getElementById("card-aimath-gradient-descent");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const lrIn = $(".lr"), w0In = $(".w0");
  const D = [[1, 4.6], [2, 6.1], [3, 7.9], [5, 10.6], [7, 13.4], [9, 16.8]], n = D.length;
  const L = (w) => D.reduce((s, [x, y]) => s + (y - w * x) ** 2, 0) / n, dL = (w) => (-2 / n) * D.reduce((s, [x, y]) => s + x * (y - w * x), 0);
  const WS = D.reduce((s, [x, y]) => s + x * y, 0) / D.reduce((s, [x]) => s + x * x, 0), CURV = (2 / n) * D.reduce((s, [x]) => s + x * x, 0);
  let path = [];
  const { ctx, size } = fit($("canvas"), () => draw());
  const reset = () => { path = [+w0In.value]; };
  const step = () => { const w = path[path.length - 1]; if (Math.abs(w) > 1e6) return; path.push(w - +lrIn.value * dL(w)); };
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: -1, x1: 4.5, y0: 0, y1: 130, xt: [[-1, "−1"], [0, "0"], [1, "1"], [2, "2"], [3, "3"], [4, "4"]], yt: [0, 40, 80, 120], xlab: "w", ylab: "손실 L(w)", L: 36 });
    P.clip();
    E.fn(ctx, P, L, -1, 4.5, C.ink, 2.2);
    ctx.save(); ctx.strokeStyle = E.BLUE; ctx.lineWidth = 1.4; ctx.beginPath(); path.forEach((w, k) => { const x = P.X(w), y = P.Y(L(w)); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.restore();
    path.forEach((w, k) => E.dot(ctx, P, w, L(w), k === path.length - 1 ? C.warn : E.BLUE, k === path.length - 1 ? 5.5 : 3.5));
    ctx.restore();
    E.dot(ctx, P, WS, L(WS), C.forest, 3.5, "최소", 6, 14);
  }
  function update() {
    $(".lr-out").textContent = (+lrIn.value).toFixed(3); $(".w0-out").textContent = (+w0In.value).toFixed(1);
    const k = path.length - 1, w = path[k], show = path.slice(-6);
    $("table").innerHTML = `<tr><th>걸음</th><th>w</th><th>L'(w)</th><th>L(w)</th></tr>` + show.map((v, i) => `<tr><td>${k - show.length + 1 + i}</td><td>${Math.abs(v) > 1e5 ? "발산" : v.toFixed(4)}</td><td>${Math.abs(v) > 1e5 ? "—" : dL(v).toFixed(3)}</td><td>${Math.abs(v) > 1e5 ? "—" : L(v).toFixed(3)}</td></tr>`).join("");
    const lim = 2 / CURV;
    $(".say").textContent = `${k}걸음 뒤 w = ${Math.abs(w) > 1e5 ? "발산" : w.toFixed(4)} (목표 ${WS.toFixed(4)}) · 이 손실에서는 학습률이 ${lim.toFixed(4)}보다 크면 발산합니다`;
    draw();
  }
  $(".go-1").addEventListener("click", () => { step(); update(); });
  $(".go-10").addEventListener("click", () => { for (let i = 0; i < 10; i++) step(); update(); });
  $(".go-reset").addEventListener("click", () => { reset(); update(); });
  [lrIn, w0In].forEach((el) => el.addEventListener("input", () => { reset(); update(); }));
  reset(); update();
})();
