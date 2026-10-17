/* 카드: 두 문장이 얼마나 비슷한지 수로 나타낼 수 있을까? — 낱말 집합과 자카드 유사도 */
(() => {
  const root = document.getElementById("card-aimath-jaccard");
  if (!root) return;
  const T = NMText;
  const $ = (s) => root.querySelector(s);
  const ta = $(".ta"), tb = $(".tb");
  const PRE = [
    ["로그인 비밀번호를 잊어버렸어요 어떻게 찾나요", "비밀번호를 잊어버렸는데 어떻게 바꾸나요"],
    ["고양이가 강아지를 쫓았다", "강아지가 고양이를 쫓았다"],
    ["오늘 급식 메뉴는 무엇인가요", "내일 수학 시험 범위를 알려 주세요"],
  ];
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function update() {
    const A = new Set(T.tokens(ta.value)), B = new Set(T.tokens(tb.value));
    const both = [...A].filter((w) => B.has(w)), onlyA = [...A].filter((w) => !B.has(w)), onlyB = [...B].filter((w) => !A.has(w)), uni = both.length + onlyA.length + onlyB.length;
    const show = (arr) => arr.map((w) => `<span>${esc(w)}</span>`).join("") || "<span>—</span>";
    $(".oa").innerHTML = show(onlyA); $(".oab").innerHTML = show(both); $(".ob").innerHTML = show(onlyB);
    $(".say").textContent = uni ? `n(A) = ${A.size}, n(B) = ${B.size}, n(A ∩ B) = ${both.length}, n(A ∪ B) = ${uni} → 자카드 유사도 ${both.length}/${uni} = ${(both.length / uni).toFixed(3)}` : "문장을 입력하세요.";
  }
  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { const [a, c] = PRE[+b.dataset.p]; ta.value = a; tb.value = c; root.querySelectorAll("[data-p]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  [ta, tb].forEach((el) => el.addEventListener("input", update));
  root.querySelector("[data-p='0']").click();
})();
