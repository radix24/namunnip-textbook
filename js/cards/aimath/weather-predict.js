/* 카드: 오늘 비가 오면 내일도 비가 올 확률은 얼마일까? — 기록의 상대도수로 구한 확률 (가상 기록) */
(() => {
  const root = document.getElementById("card-aimath-weather-predict");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const W = ["맑음", "흐림", "비"], N = [[18, 6, 2], [7, 8, 5], [3, 5, 6]];
  let t = 2;
  const tot = N.flat().reduce((a, b) => a + b, 0);
  const bestHit = N.reduce((s, r) => s + Math.max(...r), 0), sunHit = N.reduce((s, r) => s + r[0], 0);
  function update() {
    $("table").innerHTML = `<tr><th>오늘 \\ 다음 날</th>${W.map((w) => `<th>${w}</th>`).join("")}<th>합</th></tr>` + N.map((r, i) => `<tr class="${i === t ? "on" : ""}"><th>${W[i]}</th>${r.map((v) => `<td>${v}</td>`).join("")}<td>${r.reduce((a, b) => a + b, 0)}</td></tr>`).join("");
    const r = N[t], s = r.reduce((a, b) => a + b, 0), mx = Math.max(...r);
    $(".bars").innerHTML = r.map((v, j) => `<span>${W[j]}</span><div class="b ${v === mx ? "best" : ""}" style="width:${(v / s) * 100}%"></div><span class="mono">${((v / s) * 100).toFixed(0)}%</span>`).join("");
    $(".say").textContent = `오늘 ${W[t]}였던 ${s}일 중 내일 ${W[r.indexOf(mx)]} ${mx}일 → ${mx}/${s} ≈ ${((mx / s) * 100).toFixed(1)}%로 가장 큼 · 60일 기록에서 "가장 큰 확률로 예측" ${bestHit}/${tot}일 적중(${((bestHit / tot) * 100).toFixed(0)}%), "늘 맑음" ${sunHit}/${tot}일 적중(${((sunHit / tot) * 100).toFixed(0)}%)`;
  }
  root.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => { t = +b.dataset.t; root.querySelectorAll("[data-t]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  update();
})();
