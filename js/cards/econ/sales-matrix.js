/* 카드: 세 지점의 하루 매출을 한 번에 계산할 수 있을까? — 판매량 행렬 × 가격 행렬 (모의 값) */
(() => {
  const root = document.getElementById("card-econ-sales-matrix");
  if (!root) return;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const ST = ["강남점", "신촌점", "역전점"], IT = ["식빵", "크루아상", "케이크"];
  const A = [[40, 25, 6], [30, 50, 2], [60, 15, 10]], B = [3500, 2800, 6000];
  let sel = 0;
  const qa = $(".qa"), pb = $(".pb"), rc = $(".rc");
  qa.innerHTML = `<tr><td></td>${IT.map((t) => `<td class="small">${t}</td>`).join("")}</tr>` + ST.map((s, i) => `<tr><td class="small">${s}</td>${A[i].map((v, j) => `<td data-r="${i}" data-c="${j}"><input type="number" min="0" max="999" value="${v}" data-a="${i},${j}" aria-label="${s} ${IT[j]} 판매량"></td>`).join("")}</tr>`).join("");
  pb.innerHTML = `<tr><td class="small">가격</td></tr>` + IT.map((t, j) => `<tr><td data-b="${j}"><input type="number" min="0" max="99999" step="100" value="${B[j]}" data-p="${j}" aria-label="${t} 가격"></td></tr>`).join("");
  rc.innerHTML = `<tr><td class="small">매출</td></tr>` + ST.map((s, i) => `<tr><td><button class="chip" type="button" data-s="${i}" aria-label="${s} 매출 계산 보기"></button></td></tr>`).join("");
  const rev = () => A.map((row) => row.reduce((s, v, j) => s + v * B[j], 0));
  function update() {
    const R = rev();
    rc.querySelectorAll("[data-s]").forEach((b) => { const i = +b.dataset.s; b.textContent = E.n(R[i]); b.setAttribute("aria-pressed", String(i === sel)); });
    qa.querySelectorAll("td[data-r]").forEach((td) => td.classList.toggle("on", +td.dataset.r === sel));
    pb.querySelectorAll("td[data-b]").forEach((td) => td.classList.add("on"));
    $(".say").textContent = `${ST[sel]} = ${A[sel].map((v, j) => `${v}×${E.n(B[j])}`).join(" + ")} = ${E.n(R[sel])}원 · 세 지점 합계 ${E.n(R.reduce((s, v) => s + v, 0))}원`;
  }
  root.querySelectorAll("[data-a]").forEach((el) => el.addEventListener("input", () => { const [i, j] = el.dataset.a.split(",").map(Number); A[i][j] = Math.max(0, +el.value || 0); update(); }));
  root.querySelectorAll("[data-p]").forEach((el) => el.addEventListener("input", () => { B[+el.dataset.p] = Math.max(0, +el.value || 0); update(); }));
  rc.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => { sel = +b.dataset.s; update(); }));
  update();
})();
