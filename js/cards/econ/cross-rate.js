/* 카드: 100만 원을 엔화로 바꿀 때 어느 길이 가장 유리할까? — 교차 환율과 수수료 (모의 값) */
(() => {
  const root = document.getElementById("card-econ-cross-rate");
  if (!root) return;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const fIn = $(".f"), W = 1e6, KRW_USD = 1350, KRW_100JPY = 900, JPY_USD = 151;
  let guess = null;
  const res = (f) => [W / KRW_100JPY * 100 * (1 - f), (W / KRW_USD) * (1 - f) * JPY_USD * (1 - f)];
  /* 두 길이 같아지는 수수료: (1 − f) = (900/100)·151/1350 의 역수 → f = 1 − 1350·100/(900·151) */
  const fEq = 1 - (KRW_USD * 100) / (KRW_100JPY * JPY_USD);
  function show() {
    const f = +fIn.value / 100, [a, b] = res(f), best = Math.abs(a - b) < 1 ? 2 : a > b ? 0 : 1;
    $(".f-out").textContent = E.n(+fIn.value, 1);
    if (guess === null) return;
    const box = $(".routes"); box.hidden = false;
    box.innerHTML = `<div class="route ${best === 0 ? "best" : ""}"><span class="mono small">원 → 엔</span><br>100만 원 ÷ 9원/엔 × (1 − ${E.n(f * 100, 1)}%) = <span class="res">${E.n(a)}엔</span></div>` +
      `<div class="route ${best === 1 ? "best" : ""}"><span class="mono small">원 → 달러 → 엔</span><br>100만 원 ÷ 1350원/달러 × (1 − ${E.n(f * 100, 1)}%) = ${E.n((W / KRW_USD) * (1 - f), 2)}달러 → × 151엔/달러 × (1 − ${E.n(f * 100, 1)}%) = <span class="res">${E.n(b)}엔</span></div>`;
    /* 예측은 처음 수수료 1.5%에 대한 것: 그때는 직접 환전이 유리 */
    const ok = guess === 0;
    $(".verdict").textContent = `수수료 1.5%에서 ${ok ? "예측이 맞았습니다" : "예측과 달리 직접 환전이 유리합니다"}. 지금 수수료 ${E.n(f * 100, 1)}%에서는 ${best === 2 ? "두 길이 같습니다" : `${best === 0 ? "직접 환전이" : "경유 환전이"} ${E.n(Math.abs(a - b))}엔 더 많습니다`}. 교차 환율 100엔 ≈ ${E.n((KRW_USD * 100) / JPY_USD, 1)}원 → 경유하면 환율에서 ${E.pct(KRW_100JPY * JPY_USD / (KRW_USD * 100) - 1, 2)} 이득, 대신 수수료를 한 번 더 냄 · 두 길이 같아지는 수수료 약 ${E.n(fEq * 100, 2)}%`;
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => { guess = +b.dataset.g; fIn.disabled = false; root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); show(); }));
  fIn.addEventListener("input", show);
  show();
})();
