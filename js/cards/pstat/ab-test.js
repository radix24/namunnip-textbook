/* 카드: A/B 테스트로 결정하기 — 두 비율의 z검정(합동 비율), 차이의 95% 신뢰구간, 방문자 배수(가상 자료) */
(() => {
  const root = document.getElementById("card-pstat-ab-test");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const num = (c) => Math.max(0, +$(c).value || 0);
  function update() {
    const k = +$(".k").value, na = num(".na") * k, nb = num(".nb") * k, xa = Math.min(num(".xa"), num(".na")) * k, xb = Math.min(num(".xb"), num(".nb")) * k;
    $(".k-out").textContent = k;
    if (!na || !nb) return;
    const pa = xa / na, pb = xb / nb, p = (xa + xb) / (na + nb), se0 = Math.sqrt(p * (1 - p) * (1 / na + 1 / nb)), z = se0 ? (pb - pa) / se0 : 0, pv = 2 * (1 - NMStat.ncdf(Math.abs(z)));
    const se = Math.sqrt((pa * (1 - pa)) / na + (pb * (1 - pb)) / nb), lo = pb - pa - 1.96 * se, hi = pb - pa + 1.96 * se;
    $(".ra").textContent = `${(100 * pa).toFixed(2)}%`; $(".rb").textContent = `${(100 * pb).toFixed(2)}%`;
    $(".say").textContent = `방문자 A ${na.toLocaleString("ko-KR")}, B ${nb.toLocaleString("ko-KR")} · 차이 ${(100 * (pb - pa)).toFixed(2)}%p · z = ${z.toFixed(2)} · 유의확률 ${pv.toFixed(3)} · 차이의 95% 신뢰구간 ${(100 * lo).toFixed(2)}%p ~ ${(100 * hi).toFixed(2)}%p`;
    $(".dec").textContent = pv < 0.05 ? (pb > pa ? "유의수준 5%에서 B의 구매율이 높다고 판단할 근거가 있습니다. 바꾸는 비용과 함께 결정하세요." : "유의수준 5%에서 A의 구매율이 높다고 판단할 근거가 있습니다.") : "유의수준 5%에서 차이가 있다고 판단하기 어렵습니다. 미리 정한 크기만큼 자료를 더 모으거나 다른 근거를 찾으세요.";
  }
  root.querySelectorAll("input").forEach((x) => x.addEventListener("input", update));
  update();
})();
