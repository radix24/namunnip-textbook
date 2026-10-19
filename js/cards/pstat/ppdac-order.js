/* 카드: 매점 줄 탐구의 순서 — 문제 설정 → 수집 계획 → 수집 → 분석 → 해석 쌓기 */
(() => {
  const root = document.getElementById("card-pstat-ppdac-order");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const S = [
    ["문제 설정", "\"점심시간 매점 대기 시간은 얼마이고, 언제 가장 긴가?\"로 질문을 정한다."],
    ["자료 수집 계획", "2주 동안 점심시간 10분 간격으로 줄 선 인원과 대기 시간을 재기로 하고, 기록표를 만든다."],
    ["자료 수집", "계획대로 날마다 대기 인원과 시간을 기록한다."],
    ["자료 분석", "시간대별 평균 대기 시간을 구하고 꺾은선그래프로 나타낸다."],
    ["결과 해석", "종이 울린 직후 10분에 대기가 몰린다는 결과로 학년별 시차 이용을 제안하고, 새 질문을 정리한다."],
  ];
  const SHUF = [3, 0, 4, 2, 1];
  let k = 0;
  function render() {
    $(".done").innerHTML = S.slice(0, k).map(([n, t], i) => `<div><b>${i + 1}. ${n}</b> ${t}</div>`).join("");
    $(".pool").innerHTML = SHUF.filter((i) => i >= k).map((i) => `<button type="button" data-i="${i}">${S[i][1]}</button>`).join("");
    root.querySelectorAll(".pool [data-i]").forEach((b) => b.addEventListener("click", () => {
      if (+b.dataset.i === k) { k++; $(".verdict").textContent = k === S.length ? "완성했습니다. 질문 → 계획 → 수집 → 분석 → 해석의 순서입니다." : `좋습니다. ${k}단계 '${S[k - 1][0]}'입니다. 다음은?`; render(); }
      else { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); $(".verdict").textContent = `아직 아닙니다. 이 활동을 하려면 먼저 '${S[k][0]}'이 필요합니다.`; }
    }));
  }
  $(".reset").addEventListener("click", () => { k = 0; $(".verdict").textContent = ""; render(); });
  render();
})();
