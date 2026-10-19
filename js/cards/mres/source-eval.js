/* 카드: 탐구 자료의 신뢰도 판단 — 근거로 인용 / 원출처 확인 후 사용 / 근거로 쓰지 않음 */
(() => {
  const root = document.getElementById("card-mres-source-eval");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const U = ["근거로 인용 가능", "원래 출처를 확인한 뒤 사용", "근거로 쓰지 않음"];
  /* [자료, 정답, 까닭] — 예시는 모두 가상의 자료 */
  const S = [
    ["동료 심사를 거친 수학 학술지 논문(저자, 연도, 학술지명 확인됨)", 0, "전문가 검증을 거쳤고 근거가 제시되어 있습니다."],
    ["대학 출판부의 정수론 교재", 0, "편집과 검토를 거친 책으로 출처가 분명합니다."],
    ["인터넷 백과사전의 '피보나치 수' 문서", 1, "출발점으로 좋지만 누구나 고칠 수 있으니, 문서가 인용한 원출처를 확인합니다."],
    ["\"해바라기 씨는 모두 피보나치 수!\"라는 개인 블로그 글(출처 없음)", 2, "근거와 출처가 없고 과장되었을 수 있습니다."],
    ["수학 질문 게시판의 추천을 많이 받은 답변", 1, "도움이 되지만 검증 절차가 없어 내용을 직접 확인해야 합니다."],
    ["생성형 인공지능이 알려 준 논문 제목과 저자", 1, "실제로 있는 논문인지 반드시 찾아 확인해야 합니다. 없는 논문을 지어낼 수 있습니다."],
  ];
  $("table").innerHTML = `<tr><th>자료</th><th>쓰는 방법</th></tr>` + S.map(([s], i) => `<tr data-i="${i}"><td>${s}<span class="why" hidden></span></td><td><select aria-label="${i + 1}번 자료를 쓰는 방법"><option value="-1">고르기</option>${U.map((u, k) => `<option value="${k}">${u}</option>`).join("")}</select></td></tr>`).join("");
  $(".check").addEventListener("click", () => {
    let ok = 0;
    root.querySelectorAll("tr[data-i]").forEach((tr) => {
      const i = +tr.dataset.i, v = +tr.querySelector("select").value, good = v === S[i][1]; if (good) ok++;
      tr.className = good ? "ok" : "no"; const w = tr.querySelector(".why"); w.hidden = false; w.textContent = `${U[S[i][1]]}: ${S[i][2]}`;
    });
    $(".verdict").textContent = `${S.length}개 중 ${ok}개 맞음.`;
  });
})();
