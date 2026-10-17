/* 카드: 간판 시안을 3배로 키우면 페인트와 재료는 몇 배가 들까? — 길이 k배, 넓이 k²배, 부피 k³배 (수업용 가정) */
(() => {
  const root = document.getElementById("card-jmath-sign-enlarge");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const kIn = $(".k"), W0 = 40, H0 = 15, T0 = 2;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const k = +kIn.value, u = Math.min((w - 40) / (W0 * (1 + 5)), (h - 30) / (H0 * 5));
    const box = (x, y, kk, col) => { const bw = W0 * kk * u, bh = H0 * kk * u; ctx.fillStyle = col; ctx.fillRect(x, y, bw, bh); ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1; for (let i = 1; i < kk; i++) { ctx.beginPath(); ctx.moveTo(x + W0 * i * u, y); ctx.lineTo(x + W0 * i * u, y + bh); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y + H0 * i * u); ctx.lineTo(x + bw, y + H0 * i * u); ctx.stroke(); } };
    box(10, 20, 1, "#e0a02a"); box(10 + W0 * u + 20, 20, k, "#3f6fa3");
    ctx.fillStyle = C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "left";
    ctx.fillText("시안", 10, 14); ctx.fillText(`${k}배 간판(시안 크기 칸 ${Number.isInteger(k) ? k * k + "개" : (k * k).toFixed(2) + "개 분량"})`, 10 + W0 * u + 20, 14);
  }
  function update() {
    const k = +kIn.value;
    $(".k-out").textContent = k;
    $(".say").textContent = `가로 ${W0} → ${W0 * k} cm (${k}배) · 칠할 넓이 ${W0 * H0} → ${W0 * H0 * k * k} cm² (${k * k}배) · 입체 글자 부피 ${W0 * H0 * T0} → ${W0 * H0 * T0 * k ** 3} cm³ (${k ** 3}배) · 두께를 그대로 두면 부피 ${k * k}배`;
    draw();
  }
  kIn.addEventListener("input", update);
  update();
})();
