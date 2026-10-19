/* 카드: 이 행렬식 계산, 어디서 틀렸을까? — 풀이 넷에서 처음 틀린 줄 찾기, 찾으면 참값 확인 */
(() => {
  const root = document.getElementById("card-adalg-det-spot");
  if (!root) return;
  const L = NMLin;
  const chk = root.querySelector(".chk");
  const TRUE = [
    () => `확인: det A = ${L.frac(L.det([[2, 1, 3], [0, 4, 1], [5, 2, 0]]))}`,
    () => `확인: A = diag(5, 1, 1)이면 det(2A) = ${L.det([[10, 0, 0], [0, 2, 0], [0, 0, 2]])} = 2³ × 5`,
    () => `확인: det(I + I) = det(2I) = ${L.det([[2, 0], [0, 2]])}, det I + det I = 2`,
    () => `확인: det A = ${L.frac(L.det([[0, 2, 1], [1, 3, 2], [2, 6, 7]]))}`,
  ];
  const tabs = [...root.querySelectorAll("button[data-s]")], sols = [...root.querySelectorAll(".sol")];
  const found = new Set();
  sols.forEach((s, i) => NMPm.spot(s.querySelector(".spot"), () => { found.add(i); chk.textContent = TRUE[i](); }));
  tabs.forEach((b) => b.addEventListener("click", () => {
    const i = +b.dataset.s;
    tabs.forEach((t) => t.setAttribute("aria-pressed", String(t === b)));
    sols.forEach((s) => (s.hidden = +s.dataset.s !== i));
    chk.textContent = found.has(i) ? TRUE[i]() : "";
  }));
})();
