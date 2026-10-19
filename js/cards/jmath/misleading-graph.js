/* 카드: 이 홍보물의 그래프는 무엇을 부풀렸을까? — 축 자르기, 그림 넓이, 고르지 않은 간격, 개수 비교 (가상 홍보물) */
(() => {
  const root = document.getElementById("card-jmath-misleading-graph");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const OPTS = ["세로축이 0에서 시작하지 않는다", "값이 아니라 그림의 넓이가 비례한다", "가로축 시간 간격이 고르지 않다", "크기가 다른 집단을 개수로 비교했다"];
  const CS = [
    { claim: "우리 매장 만족도가 경쟁 매장을 압도합니다!", ans: 0, why: "만족도 4.3점과 4.1점의 차이는 5% 정도인데, 세로축을 4.0부터 그려 막대가 3배 길이로 보입니다." },
    { claim: "판매량이 두 배로 뛰었습니다!", ans: 1, why: "판매량은 2배인데 상자 그림의 가로와 세로를 모두 2배로 그려 넓이가 4배로 보입니다." },
    { claim: "최근 회원 수가 폭발적으로 늘었습니다!", ans: 2, why: "가로축이 2010, 2015, 2020, 2021, 2022년인데 같은 간격으로 놓아 최근에 갑자기 늘어난 것처럼 보입니다." },
    { claim: "B 지역에서 사고가 가장 많습니다. B 지역이 가장 위험합니다!", ans: 3, why: "B 지역은 인구가 가장 많아 사고 수가 많을 뿐입니다. 인구 1만 명당 사고 수로 비교하면 A 지역이 더 높습니다." },
  ];
  let i = 0, fixed = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const c = i;
    if (c === 0) {
      const y0 = fixed ? 0 : 4, P = E.frame(ctx, size, { x0: -0.6, x1: 1.6, y0, y1: 4.4, xt: [[0, "우리 매장"], [1, "경쟁 매장"]], yt: (fixed ? [0, 1, 2, 3, 4] : [4, 4.1, 4.2, 4.3, 4.4]).map((v) => [v, v.toFixed(1)]), ylab: "만족도(5점 만점)", L: 36 });
      const bw = (P.X(1) - P.X(0)) * 0.5; [[0, 4.3, E.BLUE], [1, 4.1, C.ink3]].forEach(([x, v, col]) => { ctx.fillStyle = col; ctx.fillRect(P.X(x) - bw / 2, P.Y(v), bw, P.Y(y0) - P.Y(v)); E.text(ctx, P.X(x), P.Y(v) - 4, v.toFixed(1), C.ink, "center"); });
    } else if (c === 1) {
      const base = Math.min(size.w * 0.16, size.h * 0.32), cx1 = size.w * 0.3, cx2 = size.w * 0.65, by = size.h - 30, k = fixed ? Math.SQRT2 : 2;
      [[cx1, 1, "작년 1만 개"], [cx2, k, "올해 2만 개"]].forEach(([cx, s, lab]) => { const L = base * s; ctx.fillStyle = "rgba(224,160,42,.7)"; ctx.fillRect(cx - L / 2, by - L, L, L); ctx.strokeStyle = C.ink2; ctx.strokeRect(cx - L / 2, by - L, L, L); E.text(ctx, cx, by + 16, lab, C.ink2, "center"); });
      E.text(ctx, 10, 16, fixed ? "한 변 √2배 → 넓이 2배" : "한 변 2배 → 넓이 4배로 보임", C.warn);
    } else if (c === 2) {
      const yr = [2010, 2015, 2020, 2021, 2022], v = [12, 18, 24, 26, 28];
      const P = E.frame(ctx, size, { x0: fixed ? 2009 : -0.4, x1: fixed ? 2023 : 4.4, y0: 0, y1: 30, xt: fixed ? yr.map((y) => [y, String(y)]) : yr.map((y, k) => [k, String(y)]), yt: [0, 10, 20, 30], ylab: "회원(천 명)", L: 32 });
      E.line(ctx, P, v.map((y, k) => [fixed ? yr[k] : k, y]), E.BLUE, 2.4); v.forEach((y, k) => E.dot(ctx, P, fixed ? yr[k] : k, y, E.BLUE, 4));
    } else {
      const reg = ["A", "B", "C"], acc = [60, 150, 45], pop = [2, 10, 3];
      const vals = fixed ? acc.map((a, k) => a / pop[k]) : acc, top = fixed ? 40 : 160;
      const P = E.frame(ctx, size, { x0: -0.6, x1: 2.6, y0: 0, y1: top, xt: reg.map((r, k) => [k, `${r} 지역(${pop[k]}만 명)`]), yt: fixed ? [0, 10, 20, 30, 40] : [0, 50, 100, 150], ylab: fixed ? "1만 명당 사고(건)" : "사고(건)", L: 36 });
      const bw = (P.X(1) - P.X(0)) * 0.5; vals.forEach((v, k) => { ctx.fillStyle = E.BLUE; ctx.fillRect(P.X(k) - bw / 2, P.Y(v), bw, P.Y(0) - P.Y(v)); E.text(ctx, P.X(k), P.Y(v) - 4, fixed ? v.toFixed(0) : String(v), C.ink, "center"); });
    }
  }
  function load() {
    fixed = false; $(".no-out").textContent = `홍보물 ${i + 1} / ${CS.length} (가상)`; $(".claim").textContent = `"${CS[i].claim}"`; $(".verdict").textContent = ""; $(".go-fix").disabled = true;
    $(".opts").innerHTML = OPTS.map((o, k) => `<button class="chip" type="button" data-a="${k}">${o}</button>`).join("");
    $(".opts").querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
      $(".opts").querySelectorAll("[data-a]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const ok = +b.dataset.a === CS[i].ans;
      $(".verdict").textContent = `${ok ? "맞습니다." : "다시 보세요."} ${CS[i].why}`; $(".go-fix").disabled = false;
    }));
    draw();
  }
  $(".go-fix").addEventListener("click", () => { fixed = !fixed; $(".go-fix").textContent = fixed ? "홍보물대로 보기" : "바르게 그려 보기"; draw(); });
  $(".go-next").addEventListener("click", () => { i = (i + 1) % CS.length; $(".go-fix").textContent = "바르게 그려 보기"; load(); });
  load();
})();
