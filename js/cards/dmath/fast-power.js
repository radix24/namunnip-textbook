/* 카드: a¹⁰⁰을 곱셈 몇 번 만에 구할 수 있을까? — 제곱·한 번 곱하기로 지수 만들기, 재귀 알고리즘과 비교 */
(() => {
  const root = document.getElementById("card-dmath-fast-power");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", sup = (k) => String(k).split("").map((d) => SUP[d]).join("");
  let target, hist;
  /* 재귀 pow의 곱셈 횟수와 과정 */
  function rec(n) { if (n === 1) return { k: 0, path: [1] }; const r = n % 2 ? rec(n - 1) : rec(n / 2); return { k: r.k + 1, path: [...r.path, n] }; }
  const cur = () => hist[hist.length - 1];
  function render() {
    const e = cur(), steps = hist.length - 1, best = rec(target).k;
    $(".cur").textContent = `a${sup(e)}`;
    $(".chain").textContent = hist.map((x) => `a${sup(x)}`).join(" → ");
    const v = $(".verdict");
    if (e === target) { v.textContent = `도착! 곱셈 ${steps}번` + (steps <= best ? ` · 재귀 알고리즘(${best}번)과 같거나 더 적습니다.` : ` · 재귀 알고리즘은 ${best}번입니다.`) + ` 하나씩 곱하면 ${target - 1}번.`; v.className = "verdict " + (steps <= best ? "good" : ""); }
    else if (e > target) { v.textContent = "목표를 넘었습니다. 되돌리세요."; v.className = "verdict bad"; }
    else { v.textContent = `곱셈 ${steps}번 · 목표 a${sup(target)} (이진법 ${target.toString(2)})`; v.className = "verdict"; }
  }
  function load() { target = +$(".pick").value; hist = [1]; $(".calc").textContent = ""; render(); }
  $(".go-sq").addEventListener("click", () => { hist.push(cur() * 2); render(); });
  $(".go-mul").addEventListener("click", () => { hist.push(cur() + 1); render(); });
  $(".go-undo").addEventListener("click", () => { if (hist.length > 1) hist.pop(); render(); });
  $(".go-show").addEventListener("click", () => { const r = rec(target); $(".calc").textContent = `pow(a, ${target}): ` + r.path.map((x, i) => (i ? `${r.path[i - 1] * 2 === x ? "제곱" : "×a"} → a${sup(x)}` : `a${sup(x)}`)).join(" ") + ` · 곱셈 ${r.k}번`; });
  $(".pick").addEventListener("change", load);
  load();
})();
