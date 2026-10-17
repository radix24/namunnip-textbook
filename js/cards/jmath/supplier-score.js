/* 카드: 세 납품 업체 중 어디를 고를까? — 가중 점수표 (가상 점수) */
(() => {
  const root = document.getElementById("card-jmath-supplier-score");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const W = [0, 1, 2].map((i) => $(`.w${i}`)), ITEM = ["가격", "품질", "배송"];
  const SUP = [["A 업체", [9, 5, 6]], ["B 업체", [5, 9, 6]], ["C 업체", [6, 6, 9]]];
  const PRE = [[7, 2, 1], [2, 7, 1], [2, 3, 5]];
  function update() {
    const raw = W.map((x) => +x.value), tot = raw.reduce((a, b) => a + b, 0) || 1, w = raw.map((v) => v / tot);
    W.forEach((x, i) => ($(`.w${i}-out`).textContent = Math.round(w[i] * 100)));
    const sc = SUP.map(([, s]) => s.reduce((a, v, i) => a + v * w[i], 0)), best = sc.indexOf(Math.max(...sc));
    $("table").innerHTML = `<tr><th>업체</th>${ITEM.map((t, i) => `<th>${t} (×${(w[i]).toFixed(2)})</th>`).join("")}<th>가중 점수</th></tr>` + SUP.map(([n, s], j) => `<tr class="${j === best ? "best" : ""}"><td>${n}</td>${s.map((v) => `<td>${v}</td>`).join("")}<td>${sc[j].toFixed(2)}</td></tr>`).join("");
    const order = sc.map((v, j) => [v, SUP[j][0]]).sort((a, b) => b[0] - a[0]);
    $(".say").textContent = `순위: ${order.map(([v, n]) => `${n} ${v.toFixed(2)}`).join(" > ")}` + (order[0][0] - order[1][0] < 0.15 ? " · 1, 2위 차이가 아주 작아 가중치에 민감합니다" : "");
  }
  W.forEach((x) => x.addEventListener("input", update));
  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { PRE[+b.dataset.p].forEach((v, i) => (W[i].value = v)); root.querySelectorAll("[data-p]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  update();
})();
