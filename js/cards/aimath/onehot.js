/* 카드: 문장을 숫자들의 줄, 곧 벡터로 바꿀 수 있을까? — 원-핫 벡터와 낱말 주머니 */
(() => {
  const root = document.getElementById("card-aimath-onehot");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const V = ["나", "강아지", "고양이", "좋아한다", "싫어한다", "산책", "간식", "매일"];
  const S = [["나", "강아지", "좋아한다"], ["나", "고양이", "싫어한다"], ["강아지", "산책", "좋아한다", "매일", "산책"]];
  let mine = [];
  const vec = (ws) => V.map((w) => ws.filter((x) => x === w).length);
  const dist = (a, b) => Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));
  $(".words").innerHTML = V.map((w, i) => `<button class="chip" type="button" data-w="${i}">${w}</button>`).join("");
  function update() {
    const mv = vec(mine), d = S.map((s) => dist(vec(s), mv)), best = mine.length ? d.indexOf(Math.min(...d)) : -1;
    $(".mine").textContent = mine.length ? `내 문장: ${mine.join(" ")}` : "내 문장: (낱말을 눌러 만드세요)";
    const row = (lab, v, cls) => `<tr class="${cls || ""}"><td>${lab}</td>${v.map((x) => `<td>${x}</td>`).join("")}${cls === "me" ? "<td></td>" : `<td>${mine.length ? d[+lab.slice(-1) - 1].toFixed(2) : ""}</td>`}</tr>`;
    $("table").innerHTML = `<tr><th>문장</th>${V.map((w) => `<th class="w">${w}</th>`).join("")}<th>내 문장과 거리</th></tr>` +
      S.map((s, k) => row(`문장 ${k + 1}`, vec(s), k === best ? "near" : "")).join("") + row("내 문장", mv, "me");
    $(".say").textContent = `문장 1: "${S[0].join(" ")}" · 문장 2: "${S[1].join(" ")}" · 문장 3: "${S[2].join(" ")}"` + (best >= 0 ? ` → 내 문장과 가장 가까운 문장은 ${best + 1}번(거리 ${d[best].toFixed(2)})` : "");
  }
  root.querySelectorAll("[data-w]").forEach((b) => b.addEventListener("click", () => { if (mine.length < 12) mine.push(V[+b.dataset.w]); update(); }));
  $(".go-clear").addEventListener("click", () => { mine = []; update(); });
  update();
})();
