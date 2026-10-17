/* 카드: 1+1, 대용량, 할인 상품 중 어느 것이 가장 쌀까? — 100 g당 단위 가격, 연속 할인은 곱 */
(() => {
  const root = document.getElementById("card-mcult-unit-price");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  /* 가상 상품: [이름, 용량 g, 가격 원, 할인 %, 1+1] */
  const P = [["기본 1 kg", 1000, 8900, 0, false], ["1+1 750 g", 750, 12900, 0, true], ["대용량 3 kg", 3000, 26900, 15, false]];
  const won = (v) => Math.round(v).toLocaleString("ko-KR");
  $("table").innerHTML = `<tr><th>상품</th><th>용량(g)</th><th>가격(원)</th><th>할인 %</th><th>1+1</th><th>100 g당</th></tr>`
    + P.map((p, i) => `<tr data-i="${i}"><td>${p[0]}</td><td><input type="number" min="1" step="50" value="${p[1]}" data-k="1" aria-label="${p[0]} 용량"></td><td><input type="number" min="0" step="100" value="${p[2]}" data-k="2" aria-label="${p[0]} 가격"></td><td><input type="number" min="0" max="90" value="${p[3]}" data-k="3" aria-label="${p[0]} 할인율"></td><td><input type="checkbox" data-k="4"${p[4] ? " checked" : ""} aria-label="${p[0]} 1+1"></td><td class="u"></td></tr>`).join("");
  const rows = [...root.querySelectorAll("tr[data-i]")];
  function update() {
    const U = rows.map((r) => {
      const v = (k) => r.querySelector(`[data-k="${k}"]`), g = Math.max(1, +v(1).value || 1), pr = +v(2).value || 0, d = Math.min(90, +v(3).value || 0), two = v(4).checked;
      return { pay: pr * (1 - d / 100), get: g * (two ? 2 : 1) };
    }).map((o) => ({ ...o, u: (o.pay / o.get) * 100 }));
    const best = U.reduce((b, o, i) => (o.u < U[b].u ? i : b), 0), mx = Math.max(...U.map((o) => o.u));
    rows.forEach((r, i) => { r.classList.toggle("best", i === best); r.querySelector(".u").innerHTML = `${won(U[i].u)}원<span class="bar" style="width:${(1.6 * U[i].u) / mx}rem"></span>`; });
    $(".say").textContent = U.map((o, i) => `${P[i][0]}: ${won(o.pay)}원 ÷ ${o.get} g`).join(" · ") + ` → 가장 싼 것: ${P[best][0]}`;
    const d1 = +$(".d1").value || 0, d2 = +$(".d2").value || 0, f = (1 - d1 / 100) * (1 - d2 / 100);
    $(".dd").textContent = `원래 가격의 ${(100 * f).toFixed(1)}%를 냄 = 모두 ${(100 * (1 - f)).toFixed(1)}% 할인 (${d1 + d2}%가 아님)`;
  }
  root.querySelectorAll("input").forEach((x) => x.addEventListener("input", update));
  update();
})();
