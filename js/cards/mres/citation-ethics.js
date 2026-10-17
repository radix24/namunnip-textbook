/* 카드: 모둠 탐구에서 생긴 일들 — 위조·변조·표절·부당한 저자 표시·문제없음 판단 */
(() => {
  const root = document.getElementById("card-mres-citation-ethics");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const T = ["문제없음", "위조", "변조", "표절", "부당한 저자 표시"];
  const Q = [
    ["설문 응답이 20명뿐이라 비슷한 응답 30개를 직접 만들어 50명으로 보고했다.", 1, "없는 자료를 만들어 낸 위조입니다."],
    ["인터넷에서 찾은 증명을 우리 말투로 조금 바꿔 쓰고 출처는 적지 않았다.", 3, "표현을 바꾸어도 아이디어의 출처를 밝히지 않으면 표절입니다."],
    ["측정값 하나가 기록 실수로 확인되어, 그 사실과 까닭을 보고서에 적고 분석에서 뺐다.", 0, "까닭을 밝히고 투명하게 처리했으므로 정당합니다."],
    ["탐구에 참여하지 않은 친구의 이름을 친하다는 이유로 보고서 저자에 넣었다.", 4, "기여하지 않은 사람을 저자로 넣는 부당한 저자 표시입니다."],
    ["그래프의 눈금을 바꿔 차이가 커 보이게 하고, 원래 결과보다 강한 결론을 썼다.", 2, "결과를 왜곡해 나타낸 변조에 해당합니다."],
    ["교과서의 공식을 쓰면서 '교과서 ○○쪽'이라고 출처를 밝혔다.", 0, "출처를 밝힌 정당한 인용입니다."],
  ];
  $(".cases").innerHTML = Q.map(([q], i) => `<div data-i="${i}">${i + 1}. ${q}<br><select aria-label="${i + 1}번 상황 판단"><option value="-1">판단 고르기</option>${T.map((t, k) => `<option value="${k}">${t}</option>`).join("")}</select><span class="fb"></span></div>`).join("");
  const sels = [...root.querySelectorAll(".cases select")];
  sels.forEach((s) => s.addEventListener("change", () => {
    const box = s.parentElement, i = +box.dataset.i, v = +s.value, fb = box.querySelector(".fb");
    if (v < 0) { fb.textContent = ""; return; }
    const ok = v === Q[i][1]; fb.className = `fb ${ok ? "ok" : "no"}`; fb.textContent = `${ok ? "맞습니다." : `다시 보세요. 정답: ${T[Q[i][1]]}.`} ${Q[i][2]}`;
    $(".verdict").textContent = `${Q.length}개 중 ${sels.filter((x, k) => +x.value === Q[k][1]).length}개를 바르게 판단했습니다.`;
  }));
})();
