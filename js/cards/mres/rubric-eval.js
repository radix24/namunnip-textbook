/* 카드: 평가 기준표 — 기준별 수준(1~4) × 가중치, 자기 평가 vs 동료 평가(가상) 차이 */
(() => {
  const root = document.getElementById("card-mres-rubric-eval");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  /* [기준, 가중치, 수준 4의 모습, 동료 평균(가상), 자기 평가 기본값] */
  const R = [
    ["문제 설정", 0.2, "탐구 질문이 분명하고 수학적으로 의미가 있다.", 3.3, 4],
    ["탐구 방법", 0.3, "방법이 질문에 알맞고 과정이 기록되어 있다.", 2.7, 3],
    ["결과와 해석", 0.3, "결과를 근거로 해석하고 한계를 밝혔다.", 2.3, 4],
    ["의사소통", 0.2, "보고서와 발표가 정확하고 이해하기 쉽다.", 3.0, 3],
  ];
  $("table").innerHTML = `<tr><th>기준(가중치)</th><th>자기</th><th>동료</th><th>차이</th></tr>` + R.map(([c, w, d, p, s], i) => `<tr data-i="${i}"><td>${c} (${Math.round(w * 100)}%)<span class="desc">수준 4: ${d}</span></td><td><select aria-label="${c} 자기 평가">${[1, 2, 3, 4].map((k) => `<option${k === s ? " selected" : ""}>${k}</option>`).join("")}</select></td><td class="mono">${p.toFixed(1)}</td><td class="mono df"></td></tr>`).join("");
  function update() {
    let st = 0, pt = 0, big = -1, bd = -1;
    root.querySelectorAll("tr[data-i]").forEach((tr) => {
      const i = +tr.dataset.i, s = +tr.querySelector("select").value, d = s - R[i][3];
      st += s * R[i][1]; pt += R[i][3] * R[i][1];
      tr.querySelector(".df").textContent = `${d >= 0 ? "+" : ""}${d.toFixed(1)}`;
      if (Math.abs(d) > bd) { bd = Math.abs(d); big = i; }
    });
    root.querySelectorAll("tr[data-i]").forEach((tr) => tr.classList.toggle("gap", +tr.dataset.i === big && bd >= 1));
    $(".say").textContent = `가중 점수(4점 만점): 자기 ${st.toFixed(2)}, 동료 ${pt.toFixed(2)} · 차이가 가장 큰 기준: ${R[big][0]}(${bd.toFixed(1)}점)` + (bd >= 1 ? " → 그 까닭을 이야기해 보세요" : "");
  }
  root.querySelectorAll("select").forEach((x) => x.addEventListener("input", update));
  update();
})();
