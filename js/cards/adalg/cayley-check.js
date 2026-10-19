/* 카드: A² + pA + qI가 영행렬이 되는 p, q를 찾을 수 있을까? — 케일리-해밀턴 정리를 찾아내기 */
(() => {
  const root = document.getElementById("card-adalg-cayley-check");
  if (!root) return;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  const sl = [...root.querySelectorAll("[data-m]")], out = [...root.querySelectorAll("[data-o]")], p = $(".p"), q = $(".q");
  const BANK = [[2, 1, 3, -1], [1, 2, 0, 3], [0, -1, 1, 0], [3, 1, 1, 3], [-2, 3, 1, 1], [1, 1, 1, 1]];
  let bi = 0, wins = 0, done = false;
  function update() {
    const v = sl.map((el) => +el.value), A = [[v[0], v[1]], [v[2], v[3]]], P = +p.value, Q = +q.value;
    sl.forEach((el, i) => (out[i].textContent = L.frac(+el.value)));
    $(".p-out").textContent = L.frac(P); $(".q-out").textContent = L.frac(Q);
    const A2 = L.mul(A, A), R = A2.map((r, i) => r.map((x, j) => x + P * A[i][j] + Q * (i === j ? 1 : 0)));
    $(".show").innerHTML = `A² ${L.table(A2)} + (${L.frac(P)})A + (${L.frac(Q)})I = ${L.table(R)}`;
    const zero = R.every((r) => r.every((x) => Math.abs(x) < 1e-9)), tr = v[0] + v[3], dt = L.det(A), v2 = $(".verdict");
    if (zero) {
      if (!done) { done = true; wins++; }
      v2.textContent = `영행렬! (${wins}번째 성공) 대각합 a + d = ${L.frac(tr)}, 행렬식 ad − bc = ${L.frac(dt)}. ` + (wins >= 2 ? `p = −(a + d), q = ad − bc 규칙이 보이나요?` : "다른 행렬에서도 해 보세요.");
      v2.className = "verdict good";
    } else { done = false; v2.textContent = ""; v2.className = "verdict"; }
  }
  $(".go-new").addEventListener("click", () => { bi = (bi + 1) % BANK.length; BANK[bi].forEach((x, i) => (sl[i].value = x)); p.value = 0; q.value = 0; update(); });
  [...sl, p, q].forEach((el) => el.addEventListener("input", update));
  update();
})();
