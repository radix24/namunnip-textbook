/* 카드: 계산기 없이 1.01¹⁰을 소수 셋째 자리까지 구할 수 있을까? — 이항정리의 앞 몇 항으로 어림 */
(() => {
  const root = document.getElementById("card-pmath-binom-approx");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n: fm, label } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sx = $(".sx"), sn = $(".sn"), sk = $(".sk");
  const { ctx, size } = fit($("canvas"), () => draw());
  const Cn = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; };
  const terms = () => { const x = +sx.value, n = +sn.value; return Array.from({ length: Math.min(n, 9) + 1 }, (_, k) => Cn(n, k) * x ** k); };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const t = terms(), K = +sk.value, mx = Math.max(...t.map(Math.abs)), bw = (w - 20) / t.length, base = h - 26;
    // 로그 눈금 막대: 항의 크기 |항|을 10^−8 ~ 1로
    const lg = (v) => Math.max(0, (Math.log10(Math.abs(v) + 1e-12) + 8) / (Math.log10(mx) + 8));
    t.forEach((v, k) => {
      const bh = lg(v) * (base - 14), x = 10 + k * bw;
      ctx.fillStyle = k < K ? C.forest : "#c9cbc2"; ctx.fillRect(x + bw * 0.15, base - bh, bw * 0.7, bh);
      label(ctx, `${k}`, x + bw / 2, base + 10, C.ink3, "center", `10px ${F.mono}`);
      label(ctx, v === 0 ? "0" : Math.abs(v) >= 1e-3 ? fm(v, 4) : v.toExponential(1).replace("-", "−"), x + bw / 2, base - bh - 8, k < K ? C.forest : C.ink3, "center", `10px ${F.mono}`);
    });
    label(ctx, "k번째 항 ₙCₖxᵏ의 크기 (로그 눈금)", 10, 10, C.ink3, "left", `11px ${F.sans}`);
  }
  function update() {
    const x = +sx.value, n = +sn.value, K = Math.min(+sk.value, n + 1), t = terms();
    $(".x-out").textContent = fm(x, 2); $(".n-out").textContent = n; $(".k-out").textContent = K;
    const approx = t.slice(0, K).reduce((a, b) => a + b, 0), truth = (1 + x) ** n;
    $(".n-a").textContent = fm(approx, 6); $(".n-t").textContent = fm(truth, 6); $(".n-e").textContent = fm(truth - approx, 6);
    $(".terms").textContent = t.slice(0, K).map((v) => fm(v, 6)).join(" + ") + ` = ${fm(approx, 6)}`;
    draw();
  }
  root.querySelectorAll(".presets .chip").forEach((b) => b.addEventListener("click", () => {
    const [x, n] = b.dataset.p.split(","); sx.value = x; sn.value = n;
    root.querySelectorAll(".presets .chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b))); update();
  }));
  [sx, sn, sk].forEach((el) => el.addEventListener("input", update));
  update();
})();
