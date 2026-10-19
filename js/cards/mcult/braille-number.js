/* 카드: 엘리베이터 버튼의 점자 숫자는 어떻게 읽을까? — 수표(3456) + 위쪽 네 점으로 만든 숫자 */
(() => {
  const root = document.getElementById("card-mcult-braille-number");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const DIG = { 1: [1], 2: [1, 2], 3: [1, 4], 4: [1, 4, 5], 5: [1, 5], 6: [1, 2, 4], 7: [1, 2, 4, 5], 8: [1, 2, 5], 9: [2, 4], 0: [2, 4, 5] };
  const SIGN = [3, 4, 5, 6], ORDER = [1, 4, 2, 5, 3, 6];
  const cell = (dots, label, sign) => `<span class="bc${sign ? " sign" : ""}" role="img" aria-label="${label}">${ORDER.map((d) => `<i class="${dots.includes(d) ? "on" : ""}"></i>`).join("")}${label ? `<small>${label}</small>` : ""}</span>`;
  const line = (s, show) => cell(SIGN, show ? "수표" : "", true) + [...s].map((c) => cell(DIG[c], show ? c : "")).join("");
  function write() {
    const s = $(".num").value.replace(/\D/g, "").slice(0, 8); $(".num").value = s;
    $(".write").innerHTML = s ? line(s, true) : "";
  }
  let q = "";
  function next() { q = String(10 + Math.floor(Math.random() * 9990)); $(".read").innerHTML = line(q, false); $(".ans").value = ""; $(".verdict").textContent = ""; }
  $(".go").addEventListener("click", () => {
    const a = $(".ans").value.replace(/\D/g, "");
    $(".verdict").textContent = a === q ? `맞습니다. ${q}입니다.` : `다시 보세요. 수표 다음 칸부터 읽습니다. (정답 ${q})`;
    if (a !== q) $(".read").innerHTML = line(q, true);
  });
  $(".ans").addEventListener("keydown", (e) => { if (e.key === "Enter") $(".go").click(); });
  $(".next").addEventListener("click", next);
  $(".num").addEventListener("input", write);
  write(); next();
})();
