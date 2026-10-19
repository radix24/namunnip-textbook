/* 카드: 심프슨의 역설 — 상태별로는 A가 높고 합치면 B가 높다(환자 구성의 차이, 가상 자료) */
(() => {
  const root = document.getElementById("card-pstat-simpson-paradox");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const sIn = $(".s"), N = 500, RATE = { A: [0.95, 0.7], B: [0.9, 0.6] }, B_SEV = 0.2;
  const pct = (v) => `${(100 * v).toFixed(1)}%`;
  function update() {
    const aSev = +sIn.value / 100, nA = [Math.round(N * (1 - aSev)), Math.round(N * aSev)], nB = [Math.round(N * (1 - B_SEV)), Math.round(N * B_SEV)];
    const sA = nA.map((n, i) => Math.round(n * RATE.A[i])), sB = nB.map((n, i) => Math.round(n * RATE.B[i]));
    const totA = (sA[0] + sA[1]) / N, totB = (sB[0] + sB[1]) / N;
    const cell = (s, n, win) => `<td class="${win ? "win" : ""}">${s}/${n} = ${pct(s / n)}</td>`;
    $(".s-out").textContent = sIn.value;
    $("table").innerHTML = `<tr><th>환자 상태</th><th>A 병원</th><th>B 병원</th></tr>`
      + ["경증", "중증"].map((nm, i) => `<tr><td>${nm}</td>${cell(sA[i], nA[i], sA[i] / nA[i] > sB[i] / nB[i])}${cell(sB[i], nB[i], sB[i] / nB[i] > sA[i] / nA[i])}</tr>`).join("")
      + `<tr class="total"><td>전체</td>${cell(sA[0] + sA[1], N, totA > totB)}${cell(sB[0] + sB[1], N, totB > totA)}</tr>`;
    $(".say").textContent = `A는 중증 ${(aSev * 100).toFixed(0)}%, B는 중증 ${B_SEV * 100}%를 맡음 · 상태별로는 A가 모두 높지만 전체는 ${totA > totB ? "A" : totA < totB ? "B" : "같음"}가 높음` + (totA < totB ? " → 심프슨의 역설" : "");
  }
  sIn.addEventListener("input", update);
  update();
})();
