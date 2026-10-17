/* 카드: 원 위 n점을 모두 이은 조각 수 — 1 + nC2 + nC4(1, 2, 4, 8, 16, 31, 57 …), 점은 고르지 않게 배치 */
(() => {
  const root = document.getElementById("card-mres-circle-regions");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n");
  const comb = (n, k) => { if (k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
  const reg = (n) => 1 + comb(n, 2) + comb(n, 4);
  /* 세 현이 한 점에서 만나지 않도록 각도를 조금씩 흐트러뜨림 */
  const ANG = [0.1, 1.05, 1.9, 2.75, 3.4, 4.3, 4.95, 5.55, 6.0];
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const n = +nIn.value, r = Math.min(w, h) / 2 - 14, cx = w / 2, cy = h / 2;
    const P = ANG.slice(0, n).map((a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    ctx.fillStyle = "rgba(116,171,102,.12)"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill();
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 1.2;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { ctx.beginPath(); ctx.moveTo(...P[i]); ctx.lineTo(...P[j]); ctx.stroke(); }
    ctx.fillStyle = C.warn; P.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 7); ctx.fill(); });
    ctx.fillStyle = C.ink; ctx.font = `13px ${F.mono}`; ctx.textAlign = "left"; ctx.fillText(`n = ${n}: ${reg(n)}조각`, 6, 16);
  }
  function update() {
    const n = +nIn.value; $(".n-out").textContent = n;
    $("table").innerHTML = `<tr><th>n</th>${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => `<th>${k}</th>`).join("")}</tr><tr><td>조각</td>${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => `<td>${k <= n ? reg(k) : "?"}</td>`).join("")}</tr><tr><td>2ⁿ⁻¹</td>${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => `<td>${2 ** (k - 1)}</td>`).join("")}</tr>`;
    draw();
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".verdict").textContent = `${b.dataset.g === "31" ? "맞습니다." : "예측과 다릅니다."} 6개면 31조각입니다. 1 + ₆C₂ + ₆C₄ = 1 + 15 + 15 = 31. 2의 거듭제곱 규칙은 여기서 깨집니다.`;
    $("table").hidden = false; nIn.value = 6; update();
  }));
  nIn.addEventListener("input", update);
  update();
})();
