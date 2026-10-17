/* 카드: 이 경제 기사 문장은 숫자를 바르게 읽었을까? — %와 %p, 지수의 변화율, 실질값 (가상 문장) */
(() => {
  const root = document.getElementById("card-econ-index-trap");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const CL = [
    ["물가 상승률이 작년 5%에서 올해 3%로 낮아졌으니, 올해 물가는 작년보다 내렸다.", false, "상승률 3%도 양수라 물가는 계속 올랐습니다. 오르는 속도가 느려졌을 뿐입니다."],
    ["실업률이 3.0%에서 3.5%로 0.5% 올랐다.", false, "0.5%p(퍼센트포인트) 올랐습니다. 변화율로는 0.5/3.0 ≈ 16.7% 상승입니다."],
    ["물가지수가 작년 115에서 올해 120이 되었으니 물가 상승률은 5%다.", false, "지수의 차 5포인트를 처음 값 115로 나눠야 합니다. 5/115 ≈ 4.3%입니다."],
    ["명목 임금이 4% 오르고 물가가 5% 올랐으니 실질 임금은 약 1% 줄었다.", true, "1.04/1.05 ≈ 0.990, 약 1% 감소가 맞습니다."],
    ["국내총생산이 2% 늘고 인구가 3% 늘었으니 1인당 국내총생산은 약 1% 줄었다.", true, "1.02/1.03 ≈ 0.990, 약 1% 감소가 맞습니다."],
  ];
  const ol = $(".claims");
  CL.forEach(([t], i) => ol.insertAdjacentHTML("beforeend", `<li data-i="${i}"><span>${i + 1}. ${t}</span><div class="row"><button class="chip" type="button" data-a="1">바르게 읽었다</button><button class="chip" type="button" data-a="0">잘못 읽었다</button></div><p class="fb" hidden></p></li>`));
  const ans = Array(CL.length).fill(null);
  ol.querySelectorAll("li").forEach((li) => li.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
    const i = +li.dataset.i, pick = b.dataset.a === "1", ok = pick === CL[i][1];
    ans[i] = ok; li.classList.toggle("ok", ok); li.classList.toggle("no", !ok);
    li.querySelectorAll("[data-a]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const fb = li.querySelector(".fb"); fb.hidden = false; fb.textContent = `${ok ? "맞게 판단했습니다." : "다시 보세요."} 이 문장은 ${CL[i][1] ? "바르게" : "잘못"} 읽었습니다. ${CL[i][2]}`;
    const done = ans.filter((x) => x !== null).length, right = ans.filter((x) => x).length;
    $(".say").textContent = `판단 ${done}/${CL.length} · 맞힘 ${right}` + (done === CL.length ? (right === CL.length ? " · 모두 맞혔습니다" : " · 틀린 문장의 설명을 다시 읽어 보세요") : "");
  })));
  $(".say").textContent = `판단 0/${CL.length}`;
})();
