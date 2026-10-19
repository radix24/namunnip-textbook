/* 카드: 긴 부울 식을 그림으로 묶어 줄일 수 있을까? — 카르노 맵(3·4변수), 최소 곱의 합의 묶음 표시 */
(() => {
  const root = document.getElementById("card-dmath-karnaugh");
  if (!root) return;
  const Bo = NMBool;
  const $ = (s) => root.querySelector(s);
  const GRAY = [0, 1, 3, 2], COLS = ["#b5532f", "#3b7c2a", "#3f6fa3", "#7b5ea7", "#e0a02a", "#2a9d8f", "#d4493a", "#5d5d61"];
  const EX = { 4: { a: [5, 7, 13, 15], b: [0, 2, 8, 10, 5, 13], c: [1, 3, 5, 7, 9, 11, 12, 14] }, 3: { a: [5, 7, 4, 6], b: [0, 2, 4, 6, 7], c: [1, 2, 4, 7] } };
  let n = 4, f = Array(16).fill(0);
  function render() {
    const R = n === 4 ? 4 : 2, rlab = n === 4 ? "AB" : "A", clab = n === 4 ? "CD" : "BC";
    const { terms } = Bo.minimize(f, n);
    let h = `<tr><th>${rlab}＼${clab}</th>${GRAY.map((g) => `<th>${g.toString(2).padStart(2, "0")}</th>`).join("")}</tr>`;
    for (let r = 0; r < R; r++) {
      h += `<tr><th>${n === 4 ? GRAY[r].toString(2).padStart(2, "0") : r}</th>`;
      for (let c = 0; c < 4; c++) {
        const x = n === 4 ? (GRAY[r] << 2) | GRAY[c] : (r << 2) | GRAY[c];
        const dots = terms.map((t, k) => (Bo.covers(t, x) ? `<i style="background:${COLS[k % 8]}"></i>` : "")).join("");
        h += `<td><button type="button" data-x="${x}" class="${f[x] ? "one" : ""}" aria-label="입력 ${x.toString(2).padStart(n, "0")}: ${f[x]}">${f[x]}<span class="dots">${f[x] ? dots : ""}</span></button></td>`;
      }
      h += "</tr>";
    }
    $(".km").innerHTML = h;
    $(".km").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { f[+b.dataset.x] ^= 1; $(".ex").value = ""; render(); }));
    $(".groups").innerHTML = terms.map((t, k) => `<span style="background:${COLS[k % 8]}">${Bo.lit(t, n)}</span>`).join("");
    const can = Bo.canonical(f, n), mn = Bo.minimize(f, n).text;
    $(".say").textContent = `최소항의 합: ${can.length > 70 ? can.slice(0, 70) + " …" : can} (글자 ${Bo.literals(can)}개) → 간단한 식: ${mn} (글자 ${Bo.literals(mn)}개)`;
  }
  function load() { n = +$(".pn").value; f = Array(1 << n).fill(0); const e = $(".ex").value; if (e) EX[n][e].forEach((x) => (f[x] = 1)); render(); }
  $(".pn").addEventListener("change", load); $(".ex").addEventListener("change", load);
  load();
})();
