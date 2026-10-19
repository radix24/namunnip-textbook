/* 카드: 배달 시간 자료를 도수분포표로 정리할 때 계급을 몇 분 단위로 나눌까? — 계급의 크기와 히스토그램 (가상 자료) */
(() => {
  const root = document.getElementById("card-jmath-class-width");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const wIn = $(".w"), sIn = $(".s");
  /* 가까운 주문(평균 22분)과 먼 주문(평균 44분)이 섞인 가상 자료 60개 */
  const D = [14, 16, 17, 18, 18, 19, 19, 20, 20, 21, 21, 21, 22, 22, 22, 23, 23, 23, 24, 24, 25, 25, 26, 26, 27, 28, 29, 30, 31, 33, 35, 36, 38, 39, 40, 40, 41, 41, 42, 42, 43, 43, 44, 44, 44, 45, 45, 46, 46, 47, 48, 48, 49, 50, 51, 52, 53, 55, 57, 58];
  const { ctx, size } = fit($("canvas"), () => draw());
  const bins = () => { const w = +wIn.value, s = Math.min(+sIn.value, Math.min(...D)), out = []; for (let a = s; a <= Math.max(...D); a += w) out.push([a, a + w, D.filter((x) => x >= a && x < a + w).length]); return out; };
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const B = bins(), top = Math.max(...B.map((b) => b[2])), yt = []; for (let y = 0; y <= top; y += Math.max(1, Math.ceil(top / 5))) yt.push(y);
    const P = E.frame(ctx, size, { x0: 10, x1: 70, y0: 0, y1: top * 1.1, xt: [10, 20, 30, 40, 50, 60, 70], yt, xlab: "배달 시간(분)", ylab: "도수(건)", L: 32 });
    B.forEach(([a, b, f]) => { ctx.fillStyle = a < 30 ? "rgba(63,111,163,.6)" : "rgba(224,160,42,.6)"; ctx.fillRect(P.X(a), P.Y(f), P.X(b) - P.X(a), P.Y(0) - P.Y(f)); ctx.strokeStyle = "#fff"; ctx.strokeRect(P.X(a), P.Y(f), P.X(b) - P.X(a), P.Y(0) - P.Y(f)); });
  }
  function update() {
    $(".w-out").textContent = wIn.value; $(".s-out").textContent = sIn.value;
    const B = bins();
    $("table").innerHTML = `<tr><th>계급(분)</th>${B.map(([a, b]) => `<th>${a}~${b}</th>`).join("")}</tr><tr><th>도수</th>${B.map((x) => `<td>${x[2]}</td>`).join("")}</tr>`;
    const in30 = D.filter((x) => x < 30).length;
    $(".say").textContent = `계급 ${B.length}개 · 30분 미만 ${in30}건(${((in30 / D.length) * 100).toFixed(0)}%) · 평균 ${(D.reduce((a, b) => a + b, 0) / D.length).toFixed(1)}분` + (B.length > 15 ? " · 계급이 너무 많아 들쭉날쭉합니다" : B.length < 4 ? " · 계급이 너무 적어 모양이 잘 안 보입니다" : "");
    draw();
  }
  [wIn, sIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
