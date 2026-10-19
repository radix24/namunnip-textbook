/* 카드: 점 여섯 개로 서로 다른 점자를 몇 가지 만들 수 있을까? — 2^6 − 1 = Σ 6Ck */
(() => {
  const root = document.getElementById("card-mcult-braille-count");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const ORDER = [1, 4, 2, 5, 3, 6];   // 점 번호: 왼쪽 세로줄 1·2·3, 오른쪽 4·5·6
  const comb = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
  $(".cell").innerHTML = ORDER.map((d) => `<button type="button" data-d="${d}" aria-pressed="false" aria-label="점 ${d}">${d}</button>`).join("");
  function update() {
    const on = [...root.querySelectorAll("[data-d]")].filter((b) => b.getAttribute("aria-pressed") === "true").map((b) => +b.dataset.d).sort();
    const k = on.length;
    $("table").innerHTML = `<tr><th>볼록한 점</th><th>모양 수</th></tr>` + [1, 2, 3, 4, 5, 6].map((j) => `<tr${j === k ? ' class="on"' : ""}><td>${j}개</td><td>₆C${j} = ${comb(6, j)}</td></tr>`).join("") + `<tr><td>합</td><td>63</td></tr>`;
    $(".say").textContent = k ? `지금 모양: 점 ${on.join("·")} (볼록 ${k}개) · 볼록한 점이 ${k}개인 모양은 ₆C${k} = ${comb(6, k)}가지` : "점을 눌러 볼록하게 만들어 보세요.";
  }
  root.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); update(); }));
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".verdict").textContent = `${b.dataset.g === "63" ? "맞습니다." : "예측과 다릅니다."} 점마다 2가지씩 2⁶ = 64가지, 빈 칸을 빼면 63가지입니다.`;
  }));
  update();
})();
