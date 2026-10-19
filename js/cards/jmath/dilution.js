/* 카드: 원액을 물에 얼마나 섞어야 원하는 농도가 될까? — c₀x = c₁V (가상 예시) */
(() => {
  const root = document.getElementById("card-jmath-dilution");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const c0In = $(".c0"), c1In = $(".c1"), vIn = $(".v"), xIn = $(".x");
  function update() {
    const c0 = +c0In.value, c1 = +c1In.value, V = +vIn.value;
    xIn.max = V; if (+xIn.value > V) xIn.value = V;
    const x = +xIn.value, water = V - x, conc = (c0 * x) / V, need = (c1 * V) / c0;
    $(".c0-out").textContent = c0; $(".c1-out").textContent = c1; $(".v-out").textContent = V; $(".x-out").textContent = x;
    $(".w1").style.height = `${(x / V) * 100}%`; $(".w2").style.height = `${(water / V) * 100}%`; $(".w2").style.background = "rgba(143,184,222,.35)";
    $(".w3").style.height = "100%"; $(".w3").style.background = `rgba(63,111,163,${Math.min(0.85, 0.08 + conc / 6)})`;
    $(".mix").textContent = `섞은 용액 ${V} mL · 농도 ${conc.toFixed(2)}%`;
    $(".say").textContent = c1 > c0 ? "원하는 농도가 원액보다 진해서 물을 섞어서는 만들 수 없습니다." : `지금: 원액 ${x} mL + 물 ${water} mL → 농도 ${conc.toFixed(3)}% (목표 ${c1}%) · 방정식 ${c0 / 100}x = ${c1 / 100} × ${V} → x = ${need.toFixed(1)} mL, 물 ${(V - need).toFixed(1)} mL`;
  }
  [c0In, c1In, vIn, xIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
