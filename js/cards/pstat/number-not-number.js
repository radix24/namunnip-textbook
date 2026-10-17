/* 카드: 등번호 평균의 뜻 — 숫자로 된 범주형 자료와 수치형 자료(가상 명단) */
(() => {
  const root = document.getElementById("card-pstat-number-not-number");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const POS = ["", "골키퍼", "수비수", "미드필더", "공격수"];
  /* [이름, 등번호, 포지션 번호, 키 cm, 골 수] */
  const D = [["가람", 1, 1, 181, 0], ["나래", 4, 2, 176, 1], ["다솜", 5, 2, 172, 0], ["라온", 6, 2, 178, 2], ["마루", 8, 3, 170, 4], ["바다", 10, 3, 168, 7], ["사랑", 14, 3, 174, 3], ["아라", 17, 4, 175, 9], ["자람", 23, 4, 171, 6], ["하늘", 38, 2, 183, 1]];
  const COL = [["등번호", 1, false, "등번호는 선수를 구별하는 이름표입니다. 평균 등번호인 선수는 없고, 어떤 성질도 나타내지 않습니다."], ["포지션 번호", 2, false, "1 = 골키퍼, 2 = 수비수처럼 정한 번호입니다. 평균 2.6은 '수비수와 미드필더 사이'라는 뜻이 아닙니다. 포지션별 인원(최빈값: 수비수)을 세어야 합니다."], ["키(cm)", 3, true, "키는 크기를 잰 값이라 평균이 팀의 체격을 요약합니다."], ["골 수", 4, true, "골 수는 센 값이라 평균이 선수당 득점을 나타냅니다."]];
  const avg = (k) => D.reduce((s, r) => s + r[k], 0) / D.length;
  $("table").innerHTML = `<tr><th>이름</th>${COL.map(([n], j) => `<th>${n}<br><button class="chip" type="button" data-j="${j}">평균 내기</button></th>`).join("")}</tr>`
    + D.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td title="${POS[r[2]]}">${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("")
    + `<tr class="avg"><td>평균</td>${COL.map((_, j) => `<td class="a${j}">?</td>`).join("")}</tr>`;
  root.querySelectorAll("[data-j]").forEach((b) => b.addEventListener("click", () => {
    const j = +b.dataset.j, [n, k, ok, why] = COL[j];
    root.querySelector(`.a${j}`).textContent = avg(k).toFixed(1);
    $(".verdict").textContent = `${n} 평균 ${avg(k).toFixed(1)} → ${ok ? "뜻이 있습니다." : "계산은 되지만 뜻이 없습니다."} ${why}`;
  }));
})();
