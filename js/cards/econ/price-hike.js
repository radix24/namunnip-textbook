/* 카드: 값을 10% 올리면 매출이 늘어날까 줄어들까? — (1 + r)(1 − εr)로 예측 (가상 탄력성) */
(() => {
  const root = document.getElementById("card-econ-price-hike");
  if (!root) return;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const r = 0.1;
  const IT = [["소금", 0.2, "대신할 것이 거의 없는 생필품입니다."], ["영화관 관람권", 1.6, "집에서 보는 영상처럼 대신할 것이 많습니다."], ["휘발유(짧은 기간)", 0.4, "당장은 차를 덜 타기 어렵습니다."], ["특정 브랜드 운동화", 2.2, "비슷한 다른 브랜드가 많습니다."]];
  const box = $(".items"), ans = Array(IT.length).fill(null);
  IT.forEach(([nm, e], i) => box.insertAdjacentHTML("beforeend", `<div class="it" data-i="${i}"><b>${nm}</b> <span class="mono small">탄력성 ${e}</span><div class="row"><button class="chip" type="button" data-a="1">매출 증가</button><button class="chip" type="button" data-a="-1">매출 감소</button></div><p class="fb" hidden></p></div>`));
  box.querySelectorAll(".it").forEach((it) => it.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
    const i = +it.dataset.i, [nm, e, why] = IT[i], m = (1 + r) * (1 - e * r), truth = m > 1 ? 1 : -1, ok = +b.dataset.a === truth;
    ans[i] = ok; it.classList.toggle("ok", ok); it.classList.toggle("no", !ok);
    it.querySelectorAll("[data-a]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const fb = it.querySelector(".fb"); fb.hidden = false;
    fb.textContent = `${ok ? "맞습니다." : "다시 보세요."} 판매량 약 ${E.n(e * r * 100, 0)}% 감소 → 매출 1.1 × ${E.n(1 - e * r, 2)} = ${E.n(m, 3)}배(${m > 1 ? "+" : "−"}${E.n(Math.abs(m - 1) * 100, 1)}%). ${why}`;
    const done = ans.filter((x) => x !== null).length;
    $(".say").textContent = `예측 ${done}/${IT.length} · 맞힘 ${ans.filter((x) => x).length}` + (done === IT.length ? " · 탄력성이 1보다 작은 상품만 매출이 늘었습니다" : "");
  })));
  $(".say").textContent = `예측 0/${IT.length}`;
})();
