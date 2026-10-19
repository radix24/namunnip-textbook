/* 카드: 통계적 질문 고르기 — 자료를 모아야 하고 변이성이 있는가 */
(() => {
  const root = document.getElementById("card-pstat-stat-question");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  /* [질문, 통계적인가, 까닭] */
  const Q = [
    ["우리 반 학생들은 하루에 몇 시간 자는가?", true, "학생마다 다른 수면 시간을 모아 분포로 답합니다."],
    ["나는 어젯밤 몇 시간 잤는가?", false, "한 사람의 한 값이라 답이 하나입니다."],
    ["우리 지역 시내버스는 보통 몇 분 늦게 오는가?", true, "날마다, 버스마다 늦는 시간이 다릅니다."],
    ["에베레스트산의 높이는 얼마인가?", false, "찾아보면 값 하나로 정해집니다."],
    ["우리 학교 학생들의 통학 시간은 학년에 따라 다른가?", true, "학생마다 다른 자료를 모아 집단끼리 비교합니다."],
    ["올해 1월 1일은 무슨 요일이었나?", false, "달력에서 바로 정해지는 사실입니다."],
    ["우리 반 학생들이 가장 좋아하는 급식 메뉴는?", true, "학생마다 답이 다른 범주형 자료를 모읍니다."],
    ["이 교실의 넓이는 몇 m²인가?", false, "한 번 재면 답이 정해집니다."],
  ];
  const order = [0, 3, 2, 5, 1, 6, 7, 4];
  $(".qs").innerHTML = order.map((i) => `<button type="button" data-i="${i}" aria-pressed="false"><span class="tag2">선택 안 함</span><span>${Q[i][0]}<span class="why2" hidden>${Q[i][2]}</span></span></button>`).join("");
  const btns = [...root.querySelectorAll("[data-i]")];
  btns.forEach((b) => b.addEventListener("click", () => {
    const on = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(on)); b.dataset.c = on ? "1" : "0";
    b.querySelector(".tag2").textContent = on ? "통계적 질문" : "선택 안 함";
  }));
  $(".check").addEventListener("click", () => {
    let right = 0;
    btns.forEach((b) => {
      const i = +b.dataset.i, on = b.getAttribute("aria-pressed") === "true", ok = on === Q[i][1];
      if (ok) right++; b.classList.toggle("bad", !ok); b.querySelector(".why2").hidden = false;
    });
    $(".verdict").textContent = `${Q.length}개 중 ${right}개를 바르게 판단했습니다. 빨간 테두리를 다시 보세요. 통계적 질문은 4개입니다.`;
  });
  $(".reset").addEventListener("click", () => {
    btns.forEach((b) => { b.setAttribute("aria-pressed", "false"); b.dataset.c = "0"; b.classList.remove("bad"); b.querySelector(".tag2").textContent = "선택 안 함"; b.querySelector(".why2").hidden = true; });
    $(".verdict").textContent = "";
  });
})();
