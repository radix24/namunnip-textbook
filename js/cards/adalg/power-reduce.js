/* 카드: A¹⁰을 행렬 곱셈 아홉 번 없이 구할 수 있을까? — Aⁿ = aₙA + bₙI 점화식 */
(() => {
  const root = document.getElementById("card-adalg-power-reduce");
  if (!root) return;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  const AS = [[[1, 1], [1, 0]], [[2, 1], [-1, 0]], [[0, -1], [1, 0]], [[3, -2], [1, 0]]];
  const nIn = $(".n");
  const big = (x) => (Math.abs(x) >= 1e15 ? x.toExponential(4) : String(x)).replace("-", "−");
  function update() {
    const A = AS[+$(".pick").value], N = +nIn.value, t = A[0][0] + A[1][1], d = L.det(A);
    $(".n-out").textContent = N;
    $(".rule").textContent = `t = tr A = ${t}, d = det A = ${d} → A² = ${t}A ${d >= 0 ? "−" : "+"} ${Math.abs(d)}I · aₙ₊₁ = ${t}aₙ + bₙ, bₙ₊₁ = ${-d}aₙ`.replace(/-/g, "−");
    let a = 1, b = 0; const rows = [`<tr><th>n</th><th>aₙ</th><th>bₙ</th></tr>`, `<tr><td>1</td><td>1</td><td>0</td></tr>`];
    for (let k = 2; k <= N; k++) { [a, b] = [t * a + b, -d * a]; rows.push(`<tr><td>${k}</td><td>${big(a)}</td><td>${big(b)}</td></tr>`); }
    $(".st").innerHTML = rows.join("");
    const R = A.map((r, i) => r.map((x, j) => a * x + b * (i === j ? 1 : 0)));
    let P = L.eye(2); for (let k = 0; k < N; k++) P = L.mul(P, A);
    const same = R.every((r, i) => r.every((x, j) => Math.abs(x - P[i][j]) <= 1e-9 * Math.max(1, Math.abs(x))));
    $(".res").innerHTML = `A<sup>${N}</sup> = ${big(a)}·A + (${big(b)})·I = ${L.table(R, { f: big })} ${same ? "· 곱셈으로 직접 구한 값과 같음" : "· 차이 있음"}`;
    $(".cmp").textContent = `곱셈 횟수: 행렬을 ${N - 1}번 곱하면 ${8 * (N - 1)}번, 점화식은 ${2 * (N - 1)}번 + 마지막 ${4}번 = ${2 * (N - 1) + 4}번`;
  }
  $(".pick").addEventListener("change", update);
  nIn.addEventListener("input", update);
  update();
})();
