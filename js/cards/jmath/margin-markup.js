/* 카드: "원가에 30%를 붙여 판다"와 "마진율 30%"는 같은 말일까? — 기준량이 다른 두 비율 (가상 가격) */
(() => {
  const root = document.getElementById("card-jmath-margin-markup");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const cIn = $(".c"), pIn = $(".p");
  const won = (x) => `${Math.round(x).toLocaleString("ko-KR")}원`;
  function update() {
    const c = +cIn.value, p = +pIn.value, g = p - c;
    $(".c-out").textContent = c.toLocaleString("ko-KR"); $(".p-out").textContent = p.toLocaleString("ko-KR");
    const sc = $(".sc"), sm = $(".sm");
    if (g >= 0) { sc.style.width = `${(c / p) * 100}%`; sm.style.width = `${(g / p) * 100}%`; sc.textContent = `원가 ${won(c)}`; sm.textContent = g ? `이익 ${won(g)}` : ""; }
    else { sc.style.width = "100%"; sm.style.width = "0"; sc.textContent = `판매가가 원가보다 ${won(-g)} 낮음`; }
    $(".say").textContent = `이익 ${won(g)} · 원가 대비 이익률 ${won(g)} ÷ ${won(c)} = ${((g / c) * 100).toFixed(1)}% · 마진율 ${won(g)} ÷ ${won(p)} = ${((g / p) * 100).toFixed(1)}%`;
  }
  [cIn, pIn].forEach((x) => x.addEventListener("input", update));
  const setP = (v) => { pIn.value = Math.min(+pIn.max, Math.round(v / 100) * 100); update(); };
  $(".go-mk").addEventListener("click", () => setP(+cIn.value * 1.3));
  $(".go-mg").addEventListener("click", () => setP(+cIn.value / 0.7));
  update();
})();
