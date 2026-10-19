/* 카드: 자료가 많은데도 인공지능이 틀리는 이유는 무엇일까? — 편향 사례 판단 (가상 사례) */
(() => {
  const root = document.getElementById("card-aimath-data-bias");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  /* [상황, [항목, 학습 비율, 실제 비율]...], 보기, 정답 번호, 설명 */
  const CS = [
    ["얼굴 사진 100만 장으로 학습한 출입 인식기가 어르신 얼굴을 자주 못 알아봅니다.", [["20~30대", 0.82, 0.35], ["40~50대", 0.15, 0.35], ["60대 이상", 0.03, 0.3]], ["사진 수가 부족하다", "학습 자료의 연령 구성이 실제 사용자와 다르다", "카메라 화질이 나쁘다"], 1, "사진은 많지만 60대 이상이 3%뿐이라, 실제 사용자의 30%인 어르신 얼굴을 거의 배우지 못했습니다."],
    ["낮에 찍은 도로 사진으로 학습한 표지판 인식기가 밤과 비 오는 날에 자주 틀립니다.", [["맑은 낮", 0.95, 0.55], ["밤", 0.03, 0.3], ["비·눈", 0.02, 0.15]], ["학습 자료의 촬영 조건이 한쪽으로 치우쳤다", "표지판 모양이 너무 다양하다", "인공지능은 원래 밤에 쓸 수 없다"], 0, "실제 주행의 절반 가까이가 밤이나 궂은 날씨인데, 학습 자료에는 거의 없습니다."],
    ["지난 20년간의 합격·불합격 기록을 정답으로 삼아 학습한 서류 심사 프로그램이 특정 학교 출신을 계속 낮게 평가합니다.", [["과거 합격자 중 그 학교", 0.02, 0.15]], ["지원자가 너무 많다", "과거의 치우친 판단을 정답으로 배웠다", "학습 기간이 짧다"], 1, "과거 심사에 있던 치우침이 그대로 '정답'이 되어, 학습한 프로그램이 같은 판단을 되풀이합니다."],
    ["앱 리뷰 50만 건으로 '전 국민의 서비스 만족도'를 추정했더니 실제 조사보다 훨씬 낮게 나왔습니다.", [["리뷰를 쓰는 사람", 1, 0.08]], ["리뷰를 쓰는 사람만 표본이 되었다(선택 편향)", "리뷰 50만 건은 너무 적다", "만족도는 수로 나타낼 수 없다"], 0, "리뷰를 스스로 쓰는 사람은 이용자 중 일부이고, 특히 불만이 큰 사람이 더 많이 쓸 수 있어 이용자 전체를 대표하지 못합니다. 자료가 많아도 치우침은 그대로입니다."],
  ];
  const ol = $(".cases"), ans = Array(CS.length).fill(null);
  const bar = (v, col) => `<div class="bar" aria-hidden="true"><span style="width:${v * 100}%;background:${col}"></span><span style="width:${(1 - v) * 100}%;background:rgba(141,141,146,.2)"></span></div>`;
  CS.forEach(([t, rows, opts], i) => ol.insertAdjacentHTML("beforeend", `<li data-i="${i}"><p>${i + 1}. ${t}</p><div class="bars">${rows.map(([nm, a, b]) => `<span>${nm}</span><div class="pair">${bar(a, "#3f6fa3")}<span class="small mono">학습 ${Math.round(a * 100)}%</span>${bar(b, "#e0a02a")}<span class="small mono">실제 ${Math.round(b * 100)}%</span></div>`).join("")}</div><div class="row">${opts.map((o, k) => `<button class="chip" type="button" data-a="${k}">${o}</button>`).join("")}</div><p class="fb" hidden></p></li>`));
  ol.querySelectorAll("li[data-i]").forEach((li) => li.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
    const i = +li.dataset.i, ok = +b.dataset.a === CS[i][3];
    ans[i] = ok; li.classList.toggle("ok", ok); li.classList.toggle("no", !ok);
    li.querySelectorAll("[data-a]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const fb = li.querySelector(".fb"); fb.hidden = false; fb.textContent = `${ok ? "맞습니다." : "다시 보세요."} ${CS[i][4]}`;
    const done = ans.filter((x) => x !== null).length;
    $(".say").textContent = `판단 ${done}/${CS.length} · 맞힘 ${ans.filter((x) => x).length}`;
  })));
  $(".say").textContent = `판단 0/${CS.length}`;
})();
