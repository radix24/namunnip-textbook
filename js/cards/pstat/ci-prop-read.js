/* 카드: 모비율 신뢰구간 바르게 읽기 — p̂ ± 1.96√(p̂(1−p̂)/n) 계산기와 해석 판단 */
(() => {
  const root = document.getElementById("card-pstat-ci-prop-read");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p"), nIn = $(".n");
  /* [해석, 옳은가, 해설] — 54%, 1000명, 구간 50.9~57.1% 기준 */
  const S = [
    ["같은 방법으로 조사를 여러 번 하면, 그렇게 만든 구간의 약 95%가 실제 찬성률을 포함한다.", true, "95%는 구간을 만드는 방법의 성공률입니다."],
    ["실제 찬성률이 50.9%와 57.1% 사이에 있을 확률이 95%이다.", false, "실제 찬성률은 정해진 값이라 이 구간 안에 있거나 없거나 둘 중 하나입니다. 95%는 방법에 대한 말입니다."],
    ["응답자의 95%가 50.9%~57.1% 사이의 의견을 가졌다.", false, "구간은 모집단의 찬성 비율에 대한 추정이지 개인 응답의 범위가 아닙니다."],
    ["이 조사로 보면 찬성이 과반일 가능성이 높다고 말할 수 있다.", true, "구간 전체가 50%보다 위에 있으므로 과반이라는 판단을 뒷받침합니다. 단, 표본의 편향이 없다는 가정에서입니다."],
    ["조사 인원을 4배로 늘리면 구간의 폭은 약 절반이 된다.", true, "폭은 1/√n에 비례합니다."],
  ];
  $(".st").innerHTML = S.map(([t], i) => `<div data-i="${i}">${i + 1}. ${t}<br><button class="chip" type="button" data-a="1">옳다</button><button class="chip" type="button" data-a="0">옳지 않다</button><span class="fb"></span></div>`).join("");
  root.querySelectorAll(".st [data-a]").forEach((b) => b.addEventListener("click", () => {
    const box = b.parentElement, i = +box.dataset.i, ans = b.dataset.a === "1", ok = ans === S[i][1], fb = box.querySelector(".fb");
    box.querySelectorAll("[data-a]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    fb.className = `fb ${ok ? "ok" : "no"}`; fb.textContent = `${ok ? "맞습니다." : "다시 생각해 보세요."} ${S[i][2]}`;
  }));
  function update() {
    const p = +pIn.value / 100, n = +nIn.value, e = 1.96 * Math.sqrt((p * (1 - p)) / n), lo = p - e, hi = p + e;
    $(".p-out").textContent = Math.round(p * 100); $(".n-out").textContent = n;
    const verdict = lo > 0.5 ? "구간 전체가 50%보다 위: 과반이라는 판단을 뒷받침" : hi < 0.5 ? "구간 전체가 50%보다 아래" : "구간이 50%를 포함: 과반 여부를 판단하기 어려움";
    $(".ci").textContent = `${(100 * p).toFixed(0)}% ± ${(100 * e).toFixed(1)}%p → ${(100 * lo).toFixed(1)}% ~ ${(100 * hi).toFixed(1)}% · ${verdict}`;
  }
  [pIn, nIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
