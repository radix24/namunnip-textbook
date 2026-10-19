/* 카드: 책을 쌓아 맨 위 책을 탁자 밖으로 얼마나 내밀 수 있을까? — 조화급수 돌출 H_n/2 */
(() => {
  const root = document.getElementById("card-adcalc-overhang");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, seg } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn"), sg = $(".sg");
  let maxSeen = 0;
  const { ctx, size } = fit($("canvas"), () => draw());
  const H = (k) => { let s = 0; for (let i = 1; i <= k; i++) s += 1 / i; return s; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const N = +sn.value, edge = w * 0.38, S = (w - edge - 14) / 2.6;   // 책 길이 1 = S px (돌출 약 2.3까지)
    const bh = Math.min(16, (h - 40) / N), base = h - 18;
    // 탁자
    ctx.fillStyle = C.rule; ctx.fillRect(8, base, edge - 8, 14);
    seg(ctx, edge, base, edge, h, C.ink3, 1.5);
    // 아래에서 위로: 아래에서 j번째(위에서 n−j+1번째) 책의 오른쪽 끝 = 탁자 모서리 + ½(1 + … + 1/(N−j+1))의 누적
    // 위에서 k번째 책의 오른쪽 끝 x_k: x_N(맨 아래) = 1/(2N), x_k = x_{k+1} + 1/(2k)
    const right = new Array(N + 2).fill(0);
    let x = 0; for (let k = N; k >= 1; k--) { x += 1 / (2 * k); right[k] = x; }
    for (let k = N; k >= 1; k--) {
      const y = base - (N - k + 1) * bh, r = edge + right[k] * S;
      ctx.fillStyle = k === 1 ? "rgba(181,83,47,.85)" : (k % 2 ? "rgba(63,111,163,.75)" : "rgba(63,111,163,.55)");
      ctx.fillRect(r - S, y, S, bh - 0.5);
    }
    // 눈금: 돌출 1, 2
    [1, 2].forEach((d) => { const px = edge + d * S; seg(ctx, px, 8, px, base, C.ink3, 1, [3, 4]); label(ctx, `돌출 ${d}`, px, 10, C.ink2, "center", `10.5px ${F.sans}`); });
    label(ctx, "탁자", 14, base + 7, C.ink2, "left", `11px ${F.sans}`);
  }
  function nums() {
    const N = +sn.value; maxSeen = Math.max(maxSeen, N);
    $(".n-out").textContent = N; $(".g-out").textContent = sg.value;
    $(".n-o").textContent = n(H(N) / 2, 4);
    $(".n-h").textContent = n(H(N), 4);
    const m = $(".n-m");
    if (maxSeen >= 31) { m.textContent = `31권 (예측 ${sg.value}권)`; m.classList.toggle("good", +sg.value === 31); } else m.textContent = "?";
    draw();
  }
  [sn, sg].forEach((s) => s.addEventListener("input", nums));
  nums();
})();
