/* 카드: 세상의 모든 책이 있는 도서관에는 책이 몇 권 있을까? — a^n의 자릿수를 상용로그로 */
(() => {
  const root = document.getElementById("card-mcult-babel-library");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".a"), nIn = $(".n");
  const fmt = (x) => Math.round(x).toLocaleString("ko-KR");
  nIn.value = String(Math.log10(1312000));   // 기본값: 410쪽 × 40행 × 80자
  function update() {
    const a = +aIn.value, n = Math.max(1, Math.round(10 ** +nIn.value)), L = n * Math.log10(a), digits = Math.floor(L) + 1;
    $(".a-out").textContent = a; $(".n-out").textContent = fmt(n);
    const mant = 10 ** (L - Math.floor(L));
    $("table").innerHTML = `<tr><th>항목</th><th>값</th></tr>`
      + `<tr><td>책의 수  a^n</td><td>${a}^${fmt(n)}</td></tr>`
      + `<tr><td>log₁₀(a^n) = n log₁₀ a</td><td>${L.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}</td></tr>`
      + `<tr><td>어림값</td><td>${mant.toFixed(2)} × 10^${fmt(Math.floor(L))}</td></tr>`
      + `<tr><td>자릿수</td><td>${fmt(digits)}자리</td></tr>`
      + `<tr><td>우주의 원자 수(약 10^80)와 비교</td><td>${L > 80 ? `10^${fmt(Math.floor(L - 80))}배 이상 많음` : "원자 수 이하"}</td></tr>`;
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".verdict").textContent = `${b.dataset.g === "hi" ? "맞습니다." : "예측과 다릅니다."} 25^1312000은 약 183만 자리 수입니다. 원자 수는 81자리 수에 불과합니다.`;
    $(".after").hidden = false;
    update();
  }));
  [aIn, nIn].forEach((x) => x.addEventListener("input", update));
})();
