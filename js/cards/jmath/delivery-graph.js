/* 카드: 배달 기사의 거리–시간 그래프에서 무엇을 읽을 수 있을까? — 평평한 구간, 기울기, 되돌아옴 (가상 기록) */
(() => {
  const root = document.getElementById("card-jmath-delivery-graph");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const tIn = $(".t");
  /* [분, 가게로부터 km] 꺾은선 */
  const PTS = [[0, 0], [8, 3], [12, 3], [20, 7], [25, 7], [45, 0], [60, 0]];
  const at = (t) => { for (let i = 1; i < PTS.length; i++) if (t <= PTS[i][0]) { const [a, x] = PTS[i - 1], [b, y] = PTS[i]; return x + ((t - a) / (b - a)) * (y - x); } return 0; };
  const gr = fit($(".gr"), () => drawG()), rd = fit($(".road"), () => drawR());
  function drawG() {
    const { ctx, size } = gr; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const t = +tIn.value, P = E.frame(ctx, size, { x0: 0, x1: 60, y0: 0, y1: 8, xt: [0, 10, 20, 30, 40, 50, 60], yt: [0, 2, 4, 6, 8], xlab: "시간(분)", ylab: "가게로부터 거리(km)", L: 32 });
    E.line(ctx, P, PTS, E.BLUE, 2.6);
    E.fn(ctx, P, () => 3, 0, 60, "rgba(141,141,146,.4)", 1, [3, 4]); E.fn(ctx, P, () => 7, 0, 60, "rgba(141,141,146,.4)", 1, [3, 4]);
    E.text(ctx, P.X(60) - 2, P.Y(3) - 4, "손님 1", C.ink3, "right"); E.text(ctx, P.X(60) - 2, P.Y(7) - 4, "손님 2", C.ink3, "right");
    E.dot(ctx, P, t, at(t), C.warn, 5.5);
  }
  function drawR() {
    const { ctx, size: { w, h } } = rd; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const L = 30, R = 30, X = (km) => L + (km / 7) * (w - L - R), y = h / 2;
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(X(0), y); ctx.lineTo(X(7), y); ctx.stroke();
    [[0, "가게"], [3, "손님 1"], [7, "손님 2"]].forEach(([k, n]) => { ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(X(k), y, 5, 0, 7); ctx.fill(); E.text(ctx, X(k), y + 22, n, C.ink2, "center", `11px ${F.sans}`); });
    const d = at(+tIn.value); ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(X(d), y - 12, 8, 0, 7); ctx.fill();
  }
  function update() {
    const t = +tIn.value, i = PTS.findIndex((p) => p[0] >= t), seg = i > 0 ? [PTS[i - 1], PTS[i]] : [PTS[0], PTS[1]], v = (seg[1][1] - seg[0][1]) / (seg[1][0] - seg[0][0]);
    $(".t-out").textContent = t;
    $(".say").textContent = `${t}분: 가게에서 ${at(t).toFixed(2)} km · 이 구간 ${seg[0][0]}~${seg[1][0]}분의 기울기 ${v.toFixed(3)} km/분 → ${v === 0 ? "멈춤" : v > 0 ? "가게에서 멀어짐" : "가게 쪽으로 돌아옴"}`;
    drawG(); drawR();
  }
  $(".go-check").addEventListener("click", () => {
    const a = [+$(".q1").value, +$(".q2").value, +$(".q3").value], ok = [a[0] === 4, Math.abs(a[1] - 0.5) < 0.01, a[2] === 45];
    $(".say").textContent = `① ${ok[0] ? "맞음" : "다시: 8~12분 평평한 구간"} · ② ${ok[1] ? "맞음" : "다시: 12~20분에 4 km를 8분, 0.5 km/분(돌아올 때는 7 km를 20분)"} · ③ ${ok[2] ? "맞음" : "다시: 거리가 다시 0이 되는 때"}`;
  });
  tIn.addEventListener("input", update);
  update();
})();
