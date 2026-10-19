/* 카드: 매장 대시보드를 보고 회의에서 무엇이라고 보고할까? — 합계·평균·비율 구별 (가상 자료) */
(() => {
  const root = document.getElementById("card-jmath-dashboard");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const DAY = ["월", "화", "수", "목", "금", "토", "일"];
  const VIS = { 역전점: [180, 170, 175, 190, 260, 340, 300], 대학가점: [220, 230, 240, 235, 250, 150, 120] };
  const SALES = { 역전점: 1350, 대학가점: 1300 };   // 주간 매출(만 원): 객단가 역전점 약 8359원, 대학가점 약 8997원
  const PAY = { 역전점: [62, 30, 8], 대학가점: [48, 45, 7] }, PAYN = ["카드", "간편결제", "현금"];
  const sum = (a) => a.reduce((s, v) => s + v, 0);
  const st = Object.keys(VIS).map((k) => { const v = sum(VIS[k]); return [k, v, SALES[k], Math.round((SALES[k] * 10000) / v)]; });
  $("table").innerHTML = `<tr><th>매장</th><th>주간 방문객</th><th>주간 매출</th><th>객단가</th></tr>` + st.map(([k, v, s, a]) => `<tr><td>${k}</td><td>${v.toLocaleString()}명</td><td>${s.toLocaleString()}만 원</td><td>${a.toLocaleString()}원</td></tr>`).join("");
  const Q = [
    ["매출이 많은 역전점이 손님 한 명당 매출(객단가)도 더 높다.", false, `객단가는 역전점 ${st[0][3].toLocaleString()}원, 대학가점 ${st[1][3].toLocaleString()}원으로 대학가점이 더 높습니다. 역전점은 손님이 많아서 매출이 많습니다.`],
    ["역전점의 토요일 방문객은 월요일의 약 1.9배이다.", true, "340 ÷ 180 ≈ 1.89배이고, 세로축이 0에서 시작해 그래프로도 그렇게 보입니다."],
    ["대학가점은 주말에 방문객이 줄어든다.", true, "평일 220~250명에서 토요일 150명, 일요일 120명으로 줄어듭니다."],
    ["두 매장 모두 현금 결제가 가장 적고, 간편결제 비율은 역전점이 더 높다.", false, "현금이 가장 적은 것은 맞지만, 간편결제 비율은 대학가점(45%)이 역전점(30%)보다 높습니다."],
  ];
  const ans = Array(Q.length).fill(null);
  $(".qs").innerHTML = Q.map(([t], i) => `<li data-i="${i}">${i + 1}. ${t}<div class="row"><button class="chip" type="button" data-a="1">맞다</button><button class="chip" type="button" data-a="0">틀리다</button></div><p class="fb small" hidden></p></li>`).join("");
  $(".qs").querySelectorAll("li").forEach((li) => li.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
    const i = +li.dataset.i, ok = (b.dataset.a === "1") === Q[i][1]; ans[i] = ok;
    li.classList.toggle("ok", ok); li.classList.toggle("no", !ok);
    li.querySelectorAll("[data-a]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const fb = li.querySelector(".fb"); fb.hidden = false; fb.textContent = `${ok ? "맞게 읽었습니다." : "다시 보세요."} ${Q[i][2]}`;
    $(".say").textContent = `판단 ${ans.filter((x) => x !== null).length}/${Q.length} · 맞힘 ${ans.filter((x) => x).length}`;
  })));
  const g1 = fit($(".g1"), () => draw()), g2 = fit($(".g2"), () => draw());
  function draw() {
    if (g1.size.w) {
      const { ctx, size } = g1; ctx.clearRect(0, 0, size.w, size.h);
      const P = E.frame(ctx, size, { x0: -0.3, x1: 6.3, y0: 0, y1: 400, xt: DAY.map((d, i) => [i, d]), yt: [0, 200, 400], ylab: "방문객(명)", L: 32 });
      [["역전점", E.BLUE], ["대학가점", C.warn]].forEach(([k, col], j) => { E.line(ctx, P, VIS[k].map((v, i) => [i, v]), col, 2.2); E.text(ctx, P.X(0), P.T + 12 + j * 14, k, col); });
    }
    if (g2.size.w) {
      const { ctx, size: { w, h } } = g2; ctx.clearRect(0, 0, w, h);
      const COL = ["#3f6fa3", "#e0a02a", "#8d8d92"], bh = 26;
      Object.keys(PAY).forEach((k, j) => { const y = 24 + j * (bh + 30); let x = 10; E.text(ctx, 10, y - 6, `${k} 결제 방법(%)`, C.ink2); PAY[k].forEach((p, i) => { const ww = ((w - 20) * p) / 100; ctx.fillStyle = COL[i]; ctx.fillRect(x, y, ww, bh); if (ww > 34) E.text(ctx, x + ww / 2, y + 17, `${PAYN[i]} ${p}`, "#fff", "center"); x += ww; }); });
    }
  }
  $(".say").textContent = `판단 0/${Q.length}`;
})();
