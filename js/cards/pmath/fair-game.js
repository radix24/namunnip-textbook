/* 카드: 학교 축제 주사위 게임, 상금을 얼마로 해야 공정할까? — 기댓값·표준편차와 많이 했을 때의 평균 */
(() => {
  const root = document.getElementById("card-pmath-fair-game");
  if (!root) return;
  const { C, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa"), sbb = $(".sbb"), sc = $(".sc"), verdict = $(".verdict");
  let n = 0, sum = 0;
  const rec = NMSim.recorder();
  const { ctx, size } = fit($("canvas"), () => draw());
  const stats = () => {
    const A = +sa.value, B = +sbb.value, c = +sc.value, xs = [A - c, B - c, -c], ps = [1 / 6, 1 / 6, 4 / 6];
    const E = xs.reduce((s, x, i) => s + x * ps[i], 0), V = xs.reduce((s, x, i) => s + x * x * ps[i], 0) - E * E;
    return { E, sd: Math.sqrt(Math.max(0, V)), xs };
  };
  const won = (v) => `${Math.round(v).toLocaleString("ko-KR")}원`.replace("-", "−");

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const { E, sd } = stats(), lim = Math.max(500, Math.ceil((Math.abs(E) + sd) / 500) * 500);
    NMSim.trend(ctx, { x0: 50, y0: 10, w: w - 58, h: h - 44 }, rec.pts, { target: E, yr: [-lim, lim], ylabel: "한 판당 평균 이익(원)", color: C.forest });
  }
  function nums() {
    const { E, sd } = stats();
    $(".a-out").textContent = (+sa.value).toLocaleString("ko-KR"); $(".b-out").textContent = (+sbb.value).toLocaleString("ko-KR"); $(".c-out").textContent = (+sc.value).toLocaleString("ko-KR");
    $(".n-e").textContent = won(E); $(".n-s").textContent = won(sd);
    $(".n-m").textContent = n ? `${won(sum / n)} (${n}판)` : "—";
    const fair = Math.abs(E) < 1e-9, chal = +sc.value === 1000 && +sa.value === 2 * +sbb.value;
    verdict.textContent = fair ? (chal ? "도전 성공! 공정한 게임입니다." : "공정한 게임입니다(기댓값 0).") : E > 0 ? "참가자에게 유리합니다(부스가 손해)." : "부스에게 유리합니다.";
    verdict.className = "verdict " + (fair ? "good" : "");
  }
  const resetSim = () => { n = 0; sum = 0; rec.clear(); };
  NMSim.runner(root, {
    trial(k) { const { xs } = stats(); for (let i = 0; i < k; i++) { const d = 1 + Math.floor(Math.random() * 6); sum += d === 6 ? xs[0] : d === 5 ? xs[1] : xs[2]; n++; rec.push(n, sum / n); } },
    draw() { nums(); draw(); }, reset: resetSim, rate: 60,
  });
  [sa, sbb, sc].forEach((el) => el.addEventListener("input", () => { resetSim(); nums(); draw(); }));
  nums();
})();
