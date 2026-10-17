/* 카드: 자료의 종류 나누기 — 범주형(명목·순서), 수치형(이산·연속) */
(() => {
  const root = document.getElementById("card-pstat-data-types");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const T = ["범주형 · 명목", "범주형 · 순서", "수치형 · 이산", "수치형 · 연속"];
  /* [문항, 예시 응답, 정답, 까닭] */
  const Q = [
    ["혈액형", "A, B, O, AB", 0, "범주에 순서가 없습니다."],
    ["키(cm)", "163.4, 171.0", 3, "구간의 어떤 값도 가질 수 있습니다."],
    ["형제자매 수", "0, 1, 2, 3", 2, "셀 수 있는 정수 값만 가집니다."],
    ["급식 만족도", "매우 불만 ~ 매우 만족(5단계)", 1, "범주에 순서가 있지만 간격이 같다고 보장되지 않습니다."],
    ["통학 수단", "도보, 버스, 지하철, 자전거", 0, "범주에 순서가 없습니다."],
    ["50 m 달리기 기록(초)", "7.82, 8.15", 3, "시간은 연속적인 양입니다."],
    ["지난달 읽은 책의 수", "0, 2, 5", 2, "권 수를 셉니다."],
    ["체육 실기 등급", "A, B, C, D", 1, "등급에 순서가 있습니다."],
  ];
  $("table").innerHTML = `<tr><th>문항</th><th>자료의 종류</th></tr>` + Q.map(([q, ex], i) => `<tr data-i="${i}"><td>${q}<span class="ex">예: ${ex}</span><span class="ex why" hidden></span></td><td><select aria-label="${q}의 자료 종류"><option value="-1">고르기</option>${T.map((t, k) => `<option value="${k}">${t}</option>`).join("")}</select></td></tr>`).join("");
  $(".check").addEventListener("click", () => {
    let ok = 0;
    root.querySelectorAll("tr[data-i]").forEach((tr) => {
      const i = +tr.dataset.i, v = +tr.querySelector("select").value, good = v === Q[i][2]; if (good) ok++;
      tr.className = good ? "ok" : "no";
      const w = tr.querySelector(".why"); w.hidden = false; w.textContent = `${T[Q[i][2]]}: ${Q[i][3]}`;
    });
    $(".verdict").textContent = `${Q.length}개 중 ${ok}개 맞음.` + (ok === Q.length ? " 모두 맞혔습니다." : " 틀린 문항의 까닭을 읽어 보세요.");
  });
})();
