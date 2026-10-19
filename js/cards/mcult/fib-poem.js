/* 카드: 줄마다 글자 수가 1, 1, 2, 3, 5, 8인 시를 지어 볼까? — 피보나치 시 만들기 */
(() => {
  const root = document.getElementById("card-mcult-fib-poem");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const ta = $(".ta");
  ta.value = "달\n빛\n고요\n강물이\n천천히 흘러\n내 마음도 따라간다";
  const syl = (s) => (s.match(/[가-힣]/g) || []).length;
  function update() {
    const lines = ta.value.split("\n").filter((l) => l.trim() !== "").slice(0, 10);
    const fib = [1, 1]; while (fib.length < lines.length + 1) fib.push(fib.at(-1) + fib.at(-2));
    const max = Math.max(...fib.slice(0, lines.length), ...lines.map(syl), 1);
    let ok = 0;
    $(".rows").innerHTML = lines.map((l, i) => {
      const n = syl(l), t = fib[i], good = n === t; if (good) ok++;
      return `<div class="row"><span class="mono">${i + 1}행 ${n}/${t}</span><div class="track"><div class="bar${good ? " ok" : ""}" style="width:${(100 * n) / max}%"></div><i style="left:${(100 * t) / max}%"></i></div></div>`;
    }).join("");
    $(".say").textContent = `${lines.length}행 중 ${ok}행이 규칙에 맞음 · 목표: ${fib.slice(0, lines.length).join(", ")} · 다음 행은 ${fib[lines.length]}글자`;
  }
  ta.addEventListener("input", update);
  update();
})();
