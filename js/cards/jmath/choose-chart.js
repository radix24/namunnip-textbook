/* 카드: 같은 매출 자료로 보고서를 쓸 때 어떤 그래프를 골라야 할까? — 목적에 맞는 그래프 (가상 자료) */
(() => {
  const root = document.getElementById("card-jmath-choose-chart");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const MON = ["1월", "2월", "3월", "4월", "5월", "6월"], MENU = ["커피", "라테", "차", "케이크", "샌드위치"];
  /* 메뉴 × 달 매출(만 원) */
  const S = [[310, 290, 330, 360, 410, 470], [180, 170, 200, 230, 260, 300], [90, 95, 80, 70, 60, 55], [120, 150, 130, 140, 160, 150], [80, 85, 90, 110, 120, 130]];
  const TASK = [
    ["1~6월 동안 커피 매출이 어떻게 변했는지 보여 주세요.", "line", "시간에 따른 변화는 꺾은선그래프가 흐름을 가장 잘 보여 줍니다."],
    ["6월에 어떤 메뉴가 가장 많이 팔렸는지 비교해 주세요.", "bar", "항목끼리 크기 비교는 막대그래프가 가장 읽기 쉽습니다."],
    ["6월 전체 매출에서 메뉴별 비율을 보여 주세요.", "pie", "전체(100%)에 대한 부분의 비율은 원그래프가 알맞습니다."],
  ];
  const COL = ["#3f6fa3", "#e0a02a", "#3b7c2a", "#b5532f", "#7b5ea7"];
  let t = 0, ch = null;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    if (!ch) { E.text(ctx, size.w / 2, size.h / 2, "그래프 종류를 고르세요", C.ink3, "center"); return; }
    if (ch === "line") {
      const P = E.frame(ctx, size, { x0: -0.3, x1: 5.3, y0: 0, y1: 500, xt: MON.map((m, i) => [i, m]), yt: [0, 250, 500], ylab: "만 원", L: 36 });
      const rows = t === 0 ? [0] : [0, 1, 2, 3, 4];
      rows.forEach((r) => { E.line(ctx, P, S[r].map((v, i) => [i, v]), COL[r], 2.2); E.text(ctx, P.X(5) + 4, P.Y(S[r][5]) + 4, MENU[r], COL[r]); });
    } else if (ch === "bar") {
      const P = E.frame(ctx, size, { x0: -0.6, x1: 4.6, y0: 0, y1: 500, xt: MENU.map((m, i) => [i, m]), yt: [0, 250, 500], ylab: "6월(만 원)", L: 36 });
      const bw = (P.X(1) - P.X(0)) * 0.6;
      S.forEach((row, i) => { ctx.fillStyle = COL[i]; ctx.fillRect(P.X(i) - bw / 2, P.Y(row[5]), bw, P.Y(0) - P.Y(row[5])); E.text(ctx, P.X(i), P.Y(row[5]) - 4, String(row[5]), C.ink, "center"); });
    } else {
      const tot = S.reduce((s, r) => s + r[5], 0), cx = size.w * 0.38, cy = size.h / 2, R = Math.min(size.w * 0.3, size.h * 0.42);
      let a = -Math.PI / 2;
      S.forEach((row, i) => { const da = (row[5] / tot) * Math.PI * 2; ctx.fillStyle = COL[i]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a, a + da); ctx.closePath(); ctx.fill(); a += da; });
      S.forEach((row, i) => { ctx.fillStyle = COL[i]; ctx.fillRect(size.w * 0.72, 20 + i * 20, 10, 10); E.text(ctx, size.w * 0.72 + 14, 29 + i * 20, `${MENU[i]} ${((row[5] / tot) * 100).toFixed(0)}%`, C.ink2); });
    }
  }
  function load() {
    ch = null; $(".no-out").textContent = `과제 ${t + 1} / ${TASK.length}`; $(".task").textContent = TASK[t][0]; $(".verdict").textContent = "";
    root.querySelectorAll("[data-c]").forEach((x) => x.setAttribute("aria-pressed", "false")); draw();
  }
  root.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => {
    ch = b.dataset.c; root.querySelectorAll("[data-c]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const ok = ch === TASK[t][1];
    $(".verdict").textContent = `${ok ? "알맞습니다." : "이 과제에는 더 알맞은 그래프가 있습니다."} ${TASK[t][2]}`;
    draw();
  }));
  $(".go-next").addEventListener("click", () => { t = (t + 1) % TASK.length; load(); });
  load();
})();
