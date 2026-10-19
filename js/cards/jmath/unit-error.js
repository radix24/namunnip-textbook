/* 카드: 이 작업 지시서의 단위 환산은 맞을까? — 단위 환산 오류 찾기 (가상 지시서) */
(() => {
  const root = document.getElementById("card-jmath-unit-error");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  /* [지시서, 맞음 여부, 설명] */
  const CS = [
    ["가구 공방: 도면의 선반 너비 30 inch → 76.2 cm로 재단", true, "30 × 2.54 = 76.2 cm로 맞습니다."],
    ["택배: 상자 무게 11 lb → 24.2 kg으로 송장 작성", false, "lb를 kg으로 바꿀 때는 2.2로 나눠야 합니다. 11 ÷ 2.2 = 5 kg입니다. 곱하는 바람에 거의 5배가 되었습니다."],
    ["제과점: 미국 레시피 350 °F → 오븐 약 177 °C로 설정", true, "(350 − 32) ÷ 1.8 ≈ 176.7 °C로 맞습니다."],
    ["인테리어: 30평 아파트 바닥 → 약 9.1 m²로 장판 주문", false, "평을 m²로 바꿀 때는 3.3을 곱해야 합니다. 30 × 3.3 ≈ 99 m²입니다. 9.1 m²는 방 하나도 안 되는 넓이라 어림으로도 이상합니다."],
    ["실험실: 시약 0.25 g → 2.5 mg 측정", false, "1 g = 1000 mg이므로 0.25 g = 250 mg입니다. 100배 적게 잡았습니다."],
  ];
  const ans = Array(CS.length).fill(null);
  $(".cases").innerHTML = CS.map(([t], i) => `<li data-i="${i}"><span>${i + 1}. ${t}</span><div class="row"><button class="chip" type="button" data-a="1">맞음</button><button class="chip" type="button" data-a="0">틀림</button></div><p class="fb" hidden></p></li>`).join("");
  root.querySelectorAll("li[data-i]").forEach((li) => li.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
    const i = +li.dataset.i, ok = (b.dataset.a === "1") === CS[i][1];
    ans[i] = ok; li.classList.toggle("ok", ok); li.classList.toggle("no", !ok);
    li.querySelectorAll("[data-a]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const fb = li.querySelector(".fb"); fb.hidden = false; fb.textContent = `${ok ? "맞게 판단했습니다." : "다시 보세요."} ${CS[i][2]}`;
    $(".say").textContent = `판단 ${ans.filter((x) => x !== null).length}/${CS.length} · 맞힘 ${ans.filter((x) => x).length}`;
  })));
  $(".say").textContent = `판단 0/${CS.length}`;
})();
