/* 카드: 구의 겉넓이를 띠로 어림하면 4πr²이 나올까? — 원기둥 띠와 원뿔대 띠 비교 (예측 후 조작) */
(() => {
  const root = document.getElementById("card-adcalc-band-area");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn"), verdict = $(".verdict");
  let guessed = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const y = (x) => Math.sqrt(Math.max(0, 1 - x * x));

  function sums(k) {
    let c = 0, f = 0;
    for (let i = 0; i < k; i++) {
      const a = -1 + 2 * i / k, b = a + 2 / k, m = (a + b) / 2;
      c += 2 * Math.PI * y(m) * (b - a);
      f += Math.PI * (y(a) + y(b)) * Math.hypot(b - a, y(b) - y(a));
    }
    return { c, f };
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const k = +sn.value, half = w / 2;
    [["원기둥 띠", 0, C.warn], ["원뿔대 띠", 1, C.forest]].forEach(([name, j, col]) => {
      const cx = half * j + half / 2, cy = h / 2 + 6, R = Math.min(half * 0.42, h * 0.4);
      const X = (x) => cx + x * R, Y = (v) => cy - v * R;
      // 참 원 (회색)
      ctx.strokeStyle = C.rule; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      ctx.strokeStyle = C.ink3; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(-1.15), cy); ctx.lineTo(X(1.15), cy); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = col; ctx.lineWidth = 2;
      [1, -1].forEach((sg) => {
        ctx.beginPath();
        for (let i = 0; i < k; i++) {
          const a = -1 + 2 * i / k, b = a + 2 / k, m = (a + b) / 2;
          if (j === 0) { if (i === 0) ctx.moveTo(X(a), Y(sg * y(m))); else ctx.lineTo(X(a), Y(sg * y(m))); ctx.lineTo(X(b), Y(sg * y(m))); }
          else { if (i === 0) ctx.moveTo(X(a), Y(sg * y(a))); ctx.lineTo(X(b), Y(sg * y(b))); }
        }
        ctx.stroke();
      });
      if (k <= 24) { ctx.save(); ctx.strokeStyle = col; ctx.globalAlpha = 0.35; ctx.lineWidth = 1; for (let i = 1; i < k; i++) { const a = -1 + 2 * i / k; ctx.beginPath(); ctx.moveTo(X(a), Y(y(a))); ctx.lineTo(X(a), Y(-y(a))); ctx.stroke(); } ctx.restore(); }
      label(ctx, name, cx, 12, col, "center", `600 12px ${F.sans}`);
    });
    label(ctx, "회전축", w / 2 - 6, h / 2 + 18, C.ink3, "right", `10px ${F.sans}`);
  }
  function nums() {
    const k = +sn.value, { c, f } = sums(k);
    $(".n-out").textContent = k;
    $(".n-c").textContent = guessed ? n(c, 4) : "?";
    $(".n-f").textContent = guessed ? n(f, 4) : "?";
    draw();
  }
  root.querySelectorAll(".guess .chip").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll(".guess .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    guessed = true; sn.disabled = false;
    const ok = b.dataset.g === "fru";
    verdict.textContent = ok ? "예측이 맞는지 띠를 늘려 확인하세요." : "띠를 늘려 두 합이 어디로 가는지 확인하세요.";
    verdict.className = "verdict";
    nums();
  }));
  sn.addEventListener("input", () => {
    nums();
    if (+sn.value >= 100) {
      const g = root.querySelector('.guess .chip[aria-pressed="true"]');
      const ok = g && g.dataset.g === "fru";
      verdict.textContent = ok ? "예측이 맞았습니다. 원기둥 띠는 π² ≈ 9.87로 갑니다." : "원뿔대 띠만 4π로 갑니다. 원기둥 띠는 π² ≈ 9.87로 갑니다.";
      verdict.className = "verdict " + (ok ? "good" : "bad");
    }
  });
  nums();
})();
