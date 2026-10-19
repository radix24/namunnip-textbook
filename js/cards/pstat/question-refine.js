/* 카드: 모호한 질문을 잴 수 있는 질문으로 — 대상·측정·기간·비교를 골라 질문 만들기 */
(() => {
  const root = document.getElementById("card-pstat-question-refine");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const WHO = ["학생들은", "우리 학교 1학년 학생들은", "전 세계 청소년들은"];
  const WHAT = ["스마트폰을 많이 쓸까", "하루에 스마트폰 화면을 몇 분 사용할까(설정 앱 기록)", "스마트폰이 좋은 물건이라고 생각할까"];
  const WHEN = ["", "시험이 없는 평범한 한 주 동안 평균적으로 "];
  const CMP = ["", ", 그리고 평일과 주말에 차이가 있을까"];
  const val = (n) => +root.querySelector(`input[name="${n}"]:checked`).value;
  function update() {
    const a = val("pq-who"), b = val("pq-what"), c = val("pq-when"), d = val("pq-cmp");
    $(".final").textContent = `"${WHO[a]} ${WHEN[c]}${WHAT[b]}${CMP[d]}?"`;
    const crit = [
      [a === 1, "대상이 분명하고 실제로 조사할 수 있다", a === 2 ? "전 세계 청소년은 우리가 직접 조사하기 어렵습니다." : a === 0 ? "\"학생들\"이 누구인지 모호합니다." : ""],
      [b === 1, "잴 수 있는 양과 단위가 정해져 있다", b === 0 ? "\"많이\"의 기준이 사람마다 다릅니다." : b === 2 ? "가치 판단은 자료만으로 답할 수 없습니다." : ""],
      [c === 1, "기간과 조건이 정해져 있다", c === 0 ? "시험 기간과 방학은 값이 크게 다를 수 있습니다." : ""],
      [b !== 2, "답이 자료의 변이를 다룬다", ""],
    ];
    $(".crit").innerHTML = crit.map(([ok, t, why]) => `<li class="${ok ? "ok" : ""}">${t}${!ok && why ? ` — ${why}` : ""}</li>`).join("");
  }
  root.querySelectorAll("input").forEach((x) => x.addEventListener("change", update));
  update();
})();
