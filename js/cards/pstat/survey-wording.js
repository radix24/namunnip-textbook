/* 카드: 설문 문항의 함정 찾기 — 유도, 이중, 모호, 치우친 선택지 */
(() => {
  const root = document.getElementById("card-pstat-survey-wording");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const P = ["유도 질문", "이중 질문", "모호한 질문", "치우친 선택지", "문제 없음"];
  /* [문항, 정답, 해설(고친 예)] */
  const Q = [
    ["환경을 생각하는 많은 학생이 찬성하는 '일회용품 없는 날'에 찬성합니까? (예 / 아니오)", 0, "\"환경을 생각하는 많은 학생이 찬성하는\"이 찬성을 유도합니다. → '일회용품 없는 날'에 찬성합니까, 반대합니까?"],
    ["급식의 맛과 양에 만족합니까? (예 / 아니오)", 1, "맛과 양을 한 번에 묻습니다. → 맛과 양을 따로 묻습니다."],
    ["도서관을 자주 이용합니까? (예 / 아니오)", 2, "\"자주\"의 기준이 사람마다 다릅니다. → 지난 한 달 동안 도서관을 몇 번 이용했습니까?"],
    ["축제 공연은 어땠습니까? ① 최고였다 ② 아주 좋았다 ③ 좋았다 ④ 별로였다", 3, "좋은 쪽 선택지만 3개입니다. → 매우 좋음 / 좋음 / 보통 / 나쁨 / 매우 나쁨"],
    ["지난 일주일 동안 등교한 날 중 아침을 먹은 날은 며칠입니까? (0~5일)", 4, "대상 기간과 답의 범위가 분명하고 중립적입니다."],
  ];
  $(".items").innerHTML = Q.map(([q], i) => `<div data-i="${i}">${i + 1}. ${q}<br><select aria-label="${i + 1}번 문항의 문제"><option value="-1">문제 고르기</option>${P.map((p, k) => `<option value="${k}">${p}</option>`).join("")}</select><span class="fb"></span></div>`).join("");
  root.querySelectorAll("[data-i] select").forEach((s) => s.addEventListener("change", () => {
    const box = s.parentElement, i = +box.dataset.i, v = +s.value, fb = box.querySelector(".fb");
    if (v < 0) { fb.textContent = ""; return; }
    const ok = v === Q[i][1];
    fb.className = `fb ${ok ? "ok" : "no"}`; fb.textContent = `${ok ? "맞습니다." : `다시 보세요. 정답은 '${P[Q[i][1]]}'.`} ${Q[i][2]}`;
    const done = [...root.querySelectorAll("[data-i] select")].filter((x, k) => +x.value === Q[k][1]).length;
    $(".verdict").textContent = `${Q.length}문항 중 ${done}문항을 바르게 찾았습니다.`;
  }));
})();
