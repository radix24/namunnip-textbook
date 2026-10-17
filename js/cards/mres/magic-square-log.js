/* 카드: 3×3 마방진 도전 — 줄의 합 점검, 시도 기록, 완성 판정 */
(() => {
  const root = document.getElementById("card-mres-magic-square-log");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  $(".grid").innerHTML = Array.from({ length: 9 }, (_, i) => `<input inputmode="numeric" maxlength="1" data-i="${i}" aria-label="${Math.floor(i / 3) + 1}행 ${(i % 3) + 1}열">`).join("");
  const cells = [...root.querySelectorAll("[data-i]")];
  const LINES = [[[0, 1, 2], "1행"], [[3, 4, 5], "2행"], [[6, 7, 8], "3행"], [[0, 3, 6], "1열"], [[1, 4, 7], "2열"], [[2, 5, 8], "3열"], [[0, 4, 8], "대각 ↘"], [[2, 4, 6], "대각 ↙"]];
  let tries = 0;
  const vals = () => cells.map((c) => (/^[1-9]$/.test(c.value) ? +c.value : 0));
  function check() {
    const v = vals(), dup = new Set(v.filter((x, i) => x && v.indexOf(x) !== i));
    cells.forEach((c, i) => c.classList.toggle("bad", !!v[i] && dup.has(v[i])));
    const sums = LINES.map(([idx, n]) => [n, idx.every((i) => v[i]) ? idx.reduce((a, i) => a + v[i], 0) : null]);
    $(".sums").innerHTML = sums.map(([n, s]) => `${n}: ${s ?? "-"}${s === 15 ? " ✓" : ""}`).join("<br>");
    const full = v.every((x) => x) && dup.size === 0, ok = full && sums.every(([, s]) => s === 15);
    $(".verdict").textContent = ok ? `완성했습니다! (기록한 시도 ${tries}번)` : dup.size ? "같은 수가 두 번 쓰였습니다(빨간 칸)." : "";
    return { v, sums, ok };
  }
  cells.forEach((c) => c.addEventListener("input", () => { c.value = c.value.replace(/[^1-9]/g, "").slice(0, 1); check(); }));
  $(".rec").addEventListener("click", () => {
    const { v, sums } = check(); tries++;
    const good = sums.filter(([, s]) => s === 15).length, li = document.createElement("li");
    li.textContent = `시도 ${tries}: [${v.map((x) => x || "·").join("")}] 가운데 ${v[4] || "·"}, 합 15인 줄 ${good}/8`;
    $(".log").prepend(li);
  });
  $(".clear").addEventListener("click", () => { cells.forEach((c) => { c.value = ""; }); check(); });
  check();
})();
