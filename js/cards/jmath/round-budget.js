/* 카드: 올림, 버림, 반올림 중 어느 것을 써야 일이 틀어지지 않을까? — 상황별 어림 방법 (가상 상황) */
(() => {
  const root = document.getElementById("card-jmath-round-budget");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const OPT = ["올림", "버림", "반올림"];
  /* [상황, 계산, 정답 번호, 설명] */
  const CS = [
    ["여행사: 학생 412명을 45인승 버스로 태웁니다. 버스는 몇 대 필요할까요?", "412 ÷ 45 = 9.15…", 0, "9대로는 7명이 탈 자리가 없습니다. 모자라면 안 되므로 올림해 10대입니다."],
    ["물류센터: 상자 하나에 사과 24개를 담습니다. 사과 1000개로 꽉 찬 상자를 몇 개 만들까요?", "1000 ÷ 24 = 41.66…", 1, "42번째 상자는 다 채울 수 없습니다. 넘치면 안 되므로 버림해 41상자입니다."],
    ["회사 보고서: 이번 달 방문객 수 128,456명을 천 명 단위로 쓰려고 합니다.", "128,456명", 2, "대표값을 간단히 나타내는 경우라 반올림해 약 128,000명으로 씁니다."],
    ["가게 재고: 하루 3번, 한 번에 2개씩 7일 동안 쓰는 소모품을 20개 묶음으로 삽니다. 몇 묶음 필요할까요?", "3 × 2 × 7 ÷ 20 = 2.1", 0, "2묶음이면 2개가 모자랍니다. 모자라면 안 되므로 올림해 3묶음입니다."],
    ["행사 담당: 예산 50만 원으로 1개 7,800원인 기념품을 최대 몇 개 살 수 있을까요?", "500000 ÷ 7800 = 64.1…", 1, "65개를 사면 예산을 넘습니다. 넘치면 안 되므로 버림해 64개입니다."],
  ];
  const ans = Array(CS.length).fill(null);
  $(".cases").innerHTML = CS.map(([t, c], i) => `<li data-i="${i}"><span>${i + 1}. ${t}</span><br><span class="mono small">계산: ${c}</span><div class="row">${OPT.map((o, k) => `<button class="chip" type="button" data-a="${k}">${o}</button>`).join("")}</div><p class="fb" hidden></p></li>`).join("");
  root.querySelectorAll("li[data-i]").forEach((li) => li.querySelectorAll("[data-a]").forEach((b) => b.addEventListener("click", () => {
    const i = +li.dataset.i, ok = +b.dataset.a === CS[i][2];
    ans[i] = ok; li.classList.toggle("ok", ok); li.classList.toggle("no", !ok);
    li.querySelectorAll("[data-a]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const fb = li.querySelector(".fb"); fb.hidden = false; fb.textContent = `${ok ? "맞습니다." : "다시 보세요."} ${CS[i][3]}`;
    const right = ans.filter((x) => x).length, done = ans.filter((x) => x !== null).length;
    $(".say").textContent = `판단 ${done}/${CS.length} · 맞힘 ${right}` + (right === CS.length ? " · 도전 성공!" : "");
  })));
  $(".say").textContent = `판단 0/${CS.length}`;
})();
