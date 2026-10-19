/* 카드: 공정한 주사위 게임 개발 — 갑이 이기는 합의 경우의 수 18/36 맞추기, 1000판 모의 시험과 기록 */
(() => {
  const root = document.getElementById("card-mres-fair-game-design");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const W = (s) => 6 - Math.abs(s - 7);   // 합 s의 경우의 수
  $(".sums").innerHTML = Array.from({ length: 11 }, (_, i) => i + 2).map((s) => `<button type="button" data-s="${s}" aria-pressed="false">${s}<small>${W(s)}</small></button>`).join("");
  const chosen = () => [...root.querySelectorAll("[data-s]")].filter((b) => b.getAttribute("aria-pressed") === "true").map((b) => +b.dataset.s);
  function update() {
    const S = chosen(), k = S.reduce((a, s) => a + W(s), 0);
    $(".verdict").textContent = S.length ? `갑의 합 {${S.join(", ")}} · 경우의 수 ${k}/36 · 갑이 이길 확률 ${(k / 36).toFixed(3)} → ${k === 18 ? "공정합니다!" : k < 18 ? `을에게 유리(${18 - k}가지 부족)` : `갑에게 유리(${k - 18}가지 많음)`}` : "갑이 이기는 합을 골라 보세요.";
  }
  root.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => { b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); update(); }));
  $(".clear").addEventListener("click", () => { root.querySelectorAll("[data-s]").forEach((b) => b.setAttribute("aria-pressed", "false")); update(); });
  $(".test").addEventListener("click", () => {
    const S = new Set(chosen()); if (!S.size) return;
    let win = 0; for (let i = 0; i < 1000; i++) { const s = 2 + Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6); if (S.has(s)) win++; }
    const k = [...S].reduce((a, s) => a + W(s), 0), li = document.createElement("li");
    li.textContent = `{${[...S].sort((a, b) => a - b).join(", ")}}: 이론 ${(k / 36 * 100).toFixed(1)}%, 시험 1000판 중 갑 ${win}승(${(win / 10).toFixed(1)}%)${k === 18 ? " · 공정" : ""}`;
    $(".log").prepend(li);
  });
  update();
})();
