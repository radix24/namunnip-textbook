/* 카드: 손으로 쓴 숫자를 컴퓨터는 어떻게 알아볼까? — 5×7 행렬과 본보기의 거리 */
(() => {
  const root = document.getElementById("card-aimath-digit-distance");
  if (!root) return;
  const I = NMImg;
  const $ = (s) => root.querySelector(s);
  const R = 7, Cc = 5;
  let X = [...Array(R)].map(() => Array(Cc).fill(0));
  const NOISY7 = ["11110", "00010", "00100", "00100", "01000", "01000", "10000"].map((r) => [...r].map(Number));
  const grid = $(".grid");
  grid.innerHTML = [...Array(R * Cc)].map((_, k) => `<button type="button" data-k="${k}" aria-pressed="false" aria-label="${Math.floor(k / Cc) + 1}행 ${(k % Cc) + 1}열"></button>`).join("");
  const dist = (A, B) => A.reduce((s, r, i) => s + r.reduce((t, v, j) => t + Math.abs(v - B[i][j]), 0), 0);
  function update() {
    grid.querySelectorAll("button").forEach((b) => { const k = +b.dataset.k, on = X[Math.floor(k / Cc)][k % Cc] === 1; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
    const d = I.DIGITS.map((T) => dist(X, T)), mn = Math.min(...d), best = d.map((v, k) => (v === mn ? k : -1)).filter((k) => k >= 0);
    $(".bars").innerHTML = d.map((v, k) => `<span>${k}</span><div class="b ${v === mn ? "best" : ""}" style="width:${(v / 35) * 100}%"></div><span>${v}</span>`).join("");
    const ink = X.flat().reduce((a, b) => a + b, 0);
    $(".verdict").textContent = ink ? `거리가 가장 작은 본보기: ${best.join(", ")}(다른 칸 ${mn}개) → ${best.length > 1 ? "동점이라 하나로 정할 수 없습니다" : `"${best[0]}"(으)로 분류`}` : "칸을 눌러 숫자를 쓰세요. 오른쪽 막대는 본보기 0~9와 다른 칸의 수입니다.";
  }
  grid.addEventListener("click", (e) => { const b = e.target.closest("button[data-k]"); if (!b) return; const k = +b.dataset.k, i = Math.floor(k / Cc), j = k % Cc; X[i][j] = 1 - X[i][j]; update(); });
  $(".go-clear").addEventListener("click", () => { X = [...Array(R)].map(() => Array(Cc).fill(0)); update(); });
  $(".go-noisy").addEventListener("click", () => { X = NOISY7.map((r) => [...r]); update(); });
  update();
})();
