/* 카드: n×n 테두리 타일 세기 — 4n−4, 4(n−2)+4, 2n+2(n−2), n²−(n−2)² 를 색으로 묶어 보이기 */
(() => {
  const root = document.getElementById("card-mres-border-tiles");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), COL = ["rgba(181,83,47,.7)", "rgba(63,111,163,.7)", "rgba(116,171,102,.8)", "rgba(224,160,42,.8)", "rgba(141,141,146,.35)"];
  let m = 0;
  /* 칸 (r, c)의 묶음 번호(−1: 안쪽 빈칸) */
  function group(r, c, n) {
    const edge = r === 0 || c === 0 || r === n - 1 || c === n - 1;
    if (m === 3) return edge ? 0 : 4;
    if (!edge) return -1;
    const corner = (r === 0 || r === n - 1) && (c === 0 || c === n - 1);
    if (m === 0) return r === 0 ? 0 : c === n - 1 ? 1 : r === n - 1 ? 2 : 3;   // 위, 오른쪽, 아래, 왼쪽(모서리는 앞 변에)
    if (m === 1) return corner ? 2 : 1;
    return r === 0 || r === n - 1 ? 0 : 1;   // m === 2: 위·아래는 n개, 양옆은 n−2개
  }
  const EXPR = [(n) => `4 × ${n} − 4 = ${4 * n - 4} (네 변을 ${n}개씩, 겹친 모서리 4개 빼기)`, (n) => `4 × (${n} − 2) + 4 = ${4 * (n - 2) + 4} (파랑: 모서리 뺀 변, 초록: 모서리)`, (n) => `2 × ${n} + 2 × (${n} − 2) = ${2 * n + 2 * (n - 2)} (빨강: 위아래, 파랑: 양옆)`, (n) => `${n}² − (${n} − 2)² = ${n * n - (n - 2) ** 2} (전체 − 회색 안쪽)`];
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const n = +nIn.value, s = (Math.min(w, h) - 8) / n;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const g = group(r, c, n); if (g < 0) continue;
      ctx.fillStyle = COL[g]; ctx.fillRect(4 + c * s + 1, 4 + r * s + 1, s - 2, s - 2);
    }
    if (m === 0) { ctx.strokeStyle = C.ink; ctx.lineWidth = 2; [[0, 0], [0, n - 1], [n - 1, 0], [n - 1, n - 1]].forEach(([r, c]) => ctx.strokeRect(4 + c * s + 2, 4 + r * s + 2, s - 4, s - 4)); }
  }
  function update() {
    const n = +nIn.value; $(".n-out").textContent = n;
    root.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.m === m)));
    $(".say").textContent = `${EXPR[m](n)} · 네 식 모두 4n − 4 = ${4 * n - 4}`;
    draw();
  }
  root.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { m = +b.dataset.m; update(); }));
  nIn.addEventListener("input", update);
  update();
})();
