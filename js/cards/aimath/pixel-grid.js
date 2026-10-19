/* 카드: 그림을 숫자로 된 표, 곧 행렬로 바꿀 수 있을까? — 8×8 흑백 픽셀 행렬 만들기 */
(() => {
  const root = document.getElementById("card-aimath-pixel-grid");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const N = 8, HEART = ["11111111", "10011001", "00000000", "00000000", "00000000", "10000001", "11000011", "11100111"];
  let M = [...Array(N)].map(() => Array(N).fill(255)), cur = 0;
  const grid = $(".grid");
  grid.innerHTML = [...Array(N * N)].map((_, k) => `<button type="button" data-k="${k}" aria-label="${Math.floor(k / N) + 1}행 ${(k % N) + 1}열"></button>`).join("");
  function update() {
    grid.querySelectorAll("button").forEach((b) => { const k = +b.dataset.k, v = M[Math.floor(k / N)][k % N]; b.style.background = `rgb(${v},${v},${v})`; b.setAttribute("aria-label", `${Math.floor(k / N) + 1}행 ${(k % N) + 1}열, 밝기 ${v}`); });
    $(".mat").textContent = M.map((r) => r.map((v) => String(v).padStart(3)).join(" ")).join("\n");
    const dark = M.flat().filter((v) => v === 0).length, mean = M.flat().reduce((a, b) => a + b, 0) / (N * N);
    $(".say").textContent = `8 × 8 행렬, 성분 64개(64바이트) · 검정 픽셀 ${dark}개 · 평균 밝기 ${mean.toFixed(1)}`;
  }
  grid.addEventListener("click", (e) => { const b = e.target.closest("button[data-k]"); if (!b) return; const k = +b.dataset.k; M[Math.floor(k / N)][k % N] = cur; update(); });
  root.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => { cur = +b.dataset.v; root.querySelectorAll("[data-v]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); }));
  $(".go-heart").addEventListener("click", () => { M = HEART.map((r) => [...r].map((c) => (c === "1" ? 255 : 0))); M[1][1] = M[1][2] = 128; update(); });
  $(".go-clear").addEventListener("click", () => { M = [...Array(N)].map(() => Array(N).fill(255)); update(); });
  update();
})();
