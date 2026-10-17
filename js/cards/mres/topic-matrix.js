/* 카드: 탐구 주제 가중치 점수표 — 기준별 점수(1~5) × 가중치, 1위 표시 */
(() => {
  const root = document.getElementById("card-mres-topic-matrix");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const CR = ["흥미", "수학적 깊이", "자료·도구", "기간 안 완성"];
  /* [주제, 기본 점수] — 예시 */
  const TP = [["리만 가설 증명하기", [5, 5, 1, 1]], ["우리 학교 급식 대기 줄 모형", [4, 3, 5, 4]], ["종이접기로 만드는 다면체", [4, 4, 4, 3]], ["주사위 게임의 공정성", [3, 3, 5, 5]]];
  const W0 = [3, 3, 2, 2];
  $("table").innerHTML = `<tr><th>후보 주제</th>${CR.map((c) => `<th>${c}</th>`).join("")}<th>가중 점수</th></tr>` + TP.map(([t, s], i) => `<tr data-i="${i}"><td>${t}</td>${s.map((v, j) => `<td><select data-j="${j}" aria-label="${t} ${CR[j]} 점수">${[1, 2, 3, 4, 5].map((k) => `<option${k === v ? " selected" : ""}>${k}</option>`).join("")}</select></td>`).join("")}<td class="tot mono"></td></tr>`).join("");
  $(".w").innerHTML = CR.map((c, j) => `<label>${c} 가중치 <output>${W0[j]}</output><input type="range" min="0" max="5" step="1" value="${W0[j]}" data-w="${j}" aria-label="${c} 가중치"></label>`).join("");
  function update() {
    const w = [...root.querySelectorAll("[data-w]")].map((x) => +x.value), sw = w.reduce((a, b) => a + b, 0) || 1;
    root.querySelectorAll("[data-w]").forEach((x) => { x.previousElementSibling.textContent = x.value; });
    const tots = [...root.querySelectorAll("tr[data-i]")].map((tr) => [...tr.querySelectorAll("select")].reduce((a, s, j) => a + (+s.value * w[j]) / sw, 0));
    const best = tots.indexOf(Math.max(...tots));
    root.querySelectorAll("tr[data-i]").forEach((tr, i) => { tr.querySelector(".tot").textContent = tots[i].toFixed(2); tr.classList.toggle("best", i === best); });
    $(".say").textContent = `가중치 비율 ${w.map((v, j) => `${CR[j]} ${((100 * v) / sw).toFixed(0)}%`).join(", ")} · 1위: ${TP[best][0]}(${tots[best].toFixed(2)}점)`;
  }
  root.querySelectorAll("select, input").forEach((x) => x.addEventListener("input", update));
  update();
})();
