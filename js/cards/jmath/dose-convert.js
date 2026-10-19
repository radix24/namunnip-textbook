/* 카드: "체중 1 kg당 15 mg"을 주사기 눈금 몇 mL로 바꿀까? — 환산 인자의 사슬 (가상 예시) */
(() => {
  const root = document.getElementById("card-jmath-dose-convert");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const wIn = $(".w"), dIn = $(".d"), cIn = $(".c");
  const cancel = (u) => `\\cancel{\\text{${u}}}`;
  function update() {
    const w = +wIn.value, d = +dIn.value, c = +cIn.value, mg = w * d, ml = (mg * 5) / c;
    $(".w-out").textContent = w; $(".d-out").textContent = d; $(".c-out").textContent = c;
    const el = $(".chain");
    el.innerHTML = `\\(${w}\\,${cancel("kg")} \\times \\dfrac{${d}\\,${cancel("mg")}}{1\\,${cancel("kg")}} \\times \\dfrac{5\\text{ mL}}{${c}\\,${cancel("mg")}} = ${+ml.toFixed(2)}\\text{ mL}\\)<br><span class="mono small">필요한 양 ${w} × ${d} = ${mg} mg → ${mg} × 5 ÷ ${c} = ${+ml.toFixed(3)} mL (눈금 0.1 mL로 읽으면 ${ml.toFixed(1)} mL)</span><br><span class="small">잘못 뒤집은 예: \\(${mg}\\text{ mg} \\times \\dfrac{${c}\\text{ mg}}{5\\text{ mL}} = ${(mg * c) / 5}\\ \\text{mg}^2/\\text{mL}\\) → 단위가 이상하므로 틀린 식</span>`;
    if (window.NMMath) NMMath.render(el);
  }
  [wIn, dIn, cIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
