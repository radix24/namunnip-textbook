/* 카드: 배합비 1 : 2 : 4로 콘크리트 재료를 섞으려면 각각 얼마나 필요할까? — 비례배분 (수업용 값) */
(() => {
  const root = document.getElementById("card-jmath-mix-ratio");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const sIn = $(".s"), gIn = $(".g"), vIn = $(".v"), BAG = 0.03, NAME = ["시멘트", "모래", "자갈"], COL = ["#5d5d61", "#c58a1c", "#8d8d92"];
  function update() {
    const r = [1, +sIn.value, +gIn.value], tot = r[0] + r[1] + r[2], v = +vIn.value, part = v / tot, amt = r.map((x) => x * part);
    $(".s-out").textContent = r[1]; $(".g-out").textContent = r[2]; $(".v-out").textContent = v.toFixed(2);
    $(".ratio").textContent = `시멘트 : 모래 : 자갈 = ${r.join(" : ")} (합 ${tot})`;
    $(".bar").innerHTML = amt.map((a, i) => `<span style="width:${(r[i] / tot) * 100}%;background:${COL[i]}">${NAME[i]} ${r[i]}</span>`).join("");
    $(".say").textContent = `한 조각 = ${v.toFixed(2)} ÷ ${tot} = ${part.toFixed(4)} m³ · ${NAME.map((n, i) => `${n} ${amt[i].toFixed(3)} m³`).join(", ")} · 시멘트 ${amt[0].toFixed(3)} ÷ ${BAG} = ${(amt[0] / BAG).toFixed(2)}포대 → 올림 ${Math.ceil(amt[0] / BAG - 1e-9)}포대`;
  }
  [sIn, gIn, vIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
