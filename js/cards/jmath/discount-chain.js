/* 카드: "20% 할인에 10% 추가 할인"은 30% 할인과 같을까? — 백분율의 연속 적용은 곱셈 (가상 상황) */
(() => {
  const root = document.getElementById("card-jmath-discount-chain");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".a"), bIn = $(".b"), P0 = 50000;
  const won = (x) => `${Math.round(x).toLocaleString("ko-KR")}원`;
  function update() {
    const a = +aIn.value / 100, b = +bIn.value / 100, p1 = P0 * (1 - a), p2 = p1 * (1 - b), tot = 1 - p2 / P0;
    $(".a-out").textContent = aIn.value; $(".b-out").textContent = bIn.value;
    const rows = [["원래 값", P0], [`첫 할인 뒤`, p1], [`추가 할인 뒤`, p2], [`(합으로 잘못 계산)`, Math.max(0, P0 * (1 - a - b))]];
    $(".bars").innerHTML = rows.map(([n, v], i) => `<span>${n}</span><div><div class="b" style="width:${(v / P0) * 100}%;${i === 3 ? "background:#b5532f;opacity:.6" : ""}"></div><span class="mono small">${won(v)}</span></div>`).join("");
    $(".say").textContent = `${won(P0)} × ${(1 - a).toFixed(2)} × ${(1 - b).toFixed(2)} = ${won(p2)} → 최종 할인율 ${(tot * 100).toFixed(1)}% (더하면 ${Math.round((a + b) * 100)}%로 ${((a + b - tot) * 100).toFixed(1)}%p 과장)`;
  }
  root.querySelectorAll("[data-g]").forEach((btn) => btn.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
    $(".verdict").textContent = `${btn.dataset.g === "28" ? "맞습니다." : "예측과 다릅니다."} 50,000원 × 0.8 = 40,000원, 다시 × 0.9 = 36,000원이므로 원래 값의 72%, 곧 28% 할인입니다. 추가 10%는 이미 깎인 40,000원의 10%라 4,000원만 더 깎입니다.`;
    $(".after").hidden = false; update();
  }));
  [aIn, bIn].forEach((x) => x.addEventListener("input", update));
})();
