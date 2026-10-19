/* 카드: 정확도 99%인 진단 인공지능이 "양성"이라고 하면 정말 병이 있을 확률은? — 기저율과 베이즈 정리 (가상 검사) */
(() => {
  const root = document.getElementById("card-aimath-base-rate");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p"), sIn = $(".s"), SENS = 0.99, NN = 1000;
  const dots = $(".dots");
  dots.innerHTML = "<i></i>".repeat(NN);
  const post = (p, sp) => (SENS * p) / (SENS * p + (1 - sp) * (1 - p));
  function update() {
    const p = +pIn.value / 100, sp = +sIn.value / 100;
    $(".p-out").textContent = (+pIn.value).toFixed(1); $(".s-out").textContent = (+sIn.value).toFixed(1);
    const sick = Math.round(NN * p), tp = Math.round(sick * SENS), fn = sick - tp, fp = Math.round((NN - sick) * (1 - sp));
    [...dots.children].forEach((d, k) => { d.className = k < tp ? "tp" : k < sick ? "fn" : k < sick + fp ? "fp" : ""; });
    $(".say").textContent = `1000명 중 병 있음 ${sick}명 → 양성 ${tp}명 · 병 없음 ${NN - sick}명 → 잘못된 양성 ${fp}명 · 양성 ${tp + fp}명 중 실제 환자 ${tp}명 = ${(((tp / Math.max(1, tp + fp)) || 0) * 100).toFixed(1)}% (정확한 계산 ${(post(p, sp) * 100).toFixed(1)}%)`;
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const v = post(0.01, 0.95) * 100;
    $(".verdict").textContent = `${b.dataset.g === "17" ? "맞습니다." : "예측과 다릅니다."} 양성일 때 병이 있을 확률은 약 ${v.toFixed(1)}%입니다. 병이 드물어서, 병이 없는 많은 사람 중 5%가 만드는 잘못된 양성이 진짜 양성보다 훨씬 많기 때문입니다.`;
    $(".after").hidden = false; update();
  }));
  [pIn, sIn].forEach((el) => el.addEventListener("input", update));
})();
