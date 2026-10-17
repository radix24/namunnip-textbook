/* 카드: 과자 한 봉지를 다 먹으면 하루 나트륨의 몇 %? — 1회 제공량 30 g 기준 표시를 먹은 양으로 비례 환산 */
(() => {
  const root = document.getElementById("card-mcult-nutrition-label");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const gIn = $(".g"), SERV = 30;
  /* [이름, 1회 제공량당 값, 단위, 1일 기준치] — 열량은 2000 kcal를 참고값으로 */
  const N = [["열량", 160, "kcal", 2000], ["나트륨", 240, "mg", 2000], ["당류", 9, "g", 100], ["포화지방", 2.4, "g", 15]];
  function update() {
    const g = +gIn.value, k = g / SERV;
    $(".g-out").textContent = g;
    $(".bars").innerHTML = N.map(([n, v, u, d]) => { const amt = v * k, pct = (100 * amt) / d; return `<div class="bar"><span>${n}</span><div><i class="${pct >= 100 ? "hi" : ""}" style="width:${Math.min(100, pct)}%"></i></div><span class="mono">${pct.toFixed(0)}%</span></div>`; }).join("");
    $(".say").textContent = `${g} g = 1회 제공량(30 g)의 ${k.toFixed(2)}배 · 나트륨 ${(240 * k).toFixed(0)} mg = 기준치 2000 mg의 ${((240 * k) / 20).toFixed(0)}% · 포화지방 ${(2.4 * k).toFixed(1)} g = 15 g의 ${((2.4 * k * 100) / 15).toFixed(0)}%`;
  }
  gIn.addEventListener("input", update);
  update();
})();
