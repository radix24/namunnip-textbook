/* 카드: 완전5도를 12번 쌓으면 정확히 7옥타브 위의 음이 될까? — (3/2)^12 vs 2^7, 12평균율 */
(() => {
  const root = document.getElementById("card-mcult-equal-temperament");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const F0 = 220;
  const rows = [["완전5도 12번", (1.5 ** 12).toFixed(4)], ["7옥타브 2^7", "128"], ["차이(콤마)", (1.5 ** 12 / 128).toFixed(5)], ["순정 5도 3/2", "1.50000"], ["평균율 5도 2^(7/12)", (2 ** (7 / 12)).toFixed(5)], ["평균율 반음 2^(1/12)", (2 ** (1 / 12)).toFixed(5)], ["순정 장3도 5/4", "1.25000"], ["평균율 장3도 2^(4/12)", (2 ** (4 / 12)).toFixed(5)]];
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".verdict").textContent = `${b.dataset.g === "hi" ? "맞습니다." : "예측과 다릅니다."} (3/2)^12 ≈ 129.75로 2^7 = 128보다 약 1.36% 높습니다. 2^n과 3^m은 소인수가 달라 결코 같아질 수 없습니다.`;
    $("table").innerHTML = `<tr><th>항목</th><th>진동수 비</th></tr>` + rows.map(([a, v]) => `<tr><td>${a}</td><td>${v}</td></tr>`).join("");
    $(".after").hidden = false;
  }));
  $(".go-p5").addEventListener("click", () => NMTone.play([F0, F0 * 1.5], 1.6));
  $(".go-e5").addEventListener("click", () => NMTone.play([F0, F0 * 2 ** (7 / 12)], 1.6));
  $(".go-comma").addEventListener("click", () => NMTone.play([F0 * 2, F0 * 2 * (1.5 ** 12 / 128)], 2.2));
})();
