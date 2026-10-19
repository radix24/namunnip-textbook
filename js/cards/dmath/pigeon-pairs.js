/* 카드: 서로 나누어떨어지지 않게 수를 몇 개까지 고를 수 있을까? — 1~2n에서 고르기, 홀수 부분 상자 */
(() => {
  const root = document.getElementById("card-dmath-pigeon-pairs");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  let n = 5, pick = new Set(), showBox = false, best = 0;
  const odd = (x) => { while (x % 2 === 0) x /= 2; return x; };
  function render() {
    const nums = $(".nums"); nums.innerHTML = "";
    const sel = [...pick].sort((a, b) => a - b), bad = new Set();
    sel.forEach((a) => sel.forEach((b) => { if (a < b && b % a === 0) { bad.add(a); bad.add(b); } }));
    for (let x = 1; x <= 2 * n; x++) {
      const b = document.createElement("button"); b.type = "button"; b.textContent = x;
      b.setAttribute("aria-pressed", String(pick.has(x))); if (bad.has(x)) b.className = "bad";
      b.addEventListener("click", () => { pick.has(x) ? pick.delete(x) : pick.add(x); render(); });
      nums.append(b);
    }
    if (!bad.size) best = Math.max(best, pick.size);
    const pairs = []; sel.forEach((a) => sel.forEach((b) => { if (a < b && b % a === 0) pairs.push(`${a} | ${b}`); }));
    $(".say").textContent = `고른 수 ${pick.size}개` + (bad.size ? ` · 나누어떨어지는 쌍: ${pairs.join(", ")}` : " · 나누어떨어지는 쌍 없음") + ` · 최고 기록 ${best}개 (상자 ${n}개)`;
    const boxes = $(".boxes"); boxes.innerHTML = "";
    if (showBox) for (let m = 1; m < 2 * n; m += 2) {
      const mem = []; for (let x = m; x <= 2 * n; x *= 2) mem.push(pick.has(x) ? `[${x}]` : String(x));
      const s = document.createElement("span"); s.textContent = `홀수 ${m}: ${mem.join(" ")}`;
      if ([...pick].filter((x) => odd(x) === m).length > 1) s.className = "two";
      boxes.append(s);
    }
  }
  $(".go-box").addEventListener("click", (e) => { showBox = !showBox; e.target.setAttribute("aria-pressed", String(showBox)); render(); });
  $(".go-clr").addEventListener("click", () => { pick.clear(); render(); });
  $(".pick").addEventListener("change", () => { n = +$(".pick").value; pick.clear(); best = 0; render(); });
  render();
})();
