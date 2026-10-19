/* 카드: √2가 무리수임의 증명 문장 순서 맞추기(귀류법) */
(() => {
  const root = document.getElementById("card-mres-proof-order");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const S = [
    "√2가 유리수라고 가정하면, 서로소인 자연수 p, q로 √2 = p/q라고 쓸 수 있다.",
    "양변을 제곱해 정리하면 p² = 2q²이다.",
    "따라서 p²은 짝수이고, 홀수의 제곱은 홀수이므로 p는 짝수이다. p = 2k로 놓는다.",
    "대입하면 4k² = 2q², 곧 q² = 2k²이므로 같은 까닭으로 q도 짝수이다.",
    "p, q가 모두 짝수이므로 p, q가 서로소라는 가정에 모순이다.",
    "그러므로 √2는 유리수가 아니다. 곧 √2는 무리수이다.",
  ];
  const SHUF = [3, 5, 1, 4, 0, 2];
  let k = 0;
  function render() {
    $(".done").innerHTML = S.slice(0, k).map((t, i) => `<div>${i + 1}. ${t}</div>`).join("");
    $(".pool").innerHTML = SHUF.filter((i) => i >= k).map((i) => `<button type="button" data-i="${i}">${S[i]}</button>`).join("");
    root.querySelectorAll(".pool [data-i]").forEach((b) => b.addEventListener("click", () => {
      if (+b.dataset.i === k) { k++; $(".verdict").textContent = k === S.length ? "증명을 완성했습니다. 가정 → 결과 → 모순 → 결론의 순서입니다." : "좋습니다. 다음 문장은 방금 쓴 문장에서 바로 나오는 것입니다."; render(); }
      else { b.classList.add("shake"); $(".verdict").textContent = "아직 그 문장의 근거가 앞에 나오지 않았습니다."; }
    }));
  }
  $(".reset").addEventListener("click", () => { k = 0; $(".verdict").textContent = ""; render(); });
  render();
})();
