/* 카드: 소수 찾기 개선 — 방법 1(n−1까지 나눔), 방법 2(√n까지, 약수 찾으면 멈춤), 방법 3(에라토스테네스의 체) 연산 횟수 */
(() => {
  const root = document.getElementById("card-mres-prime-algorithm");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n");
  const N = () => Math.round(10 ** +nIn.value);
  function count(n) {
    let m1 = 0, m2 = 0, m3 = 0, primes = 0;
    for (let k = 2; k <= n; k++) {
      m1 += k - 2;   // 2 … k−1을 모두 나눔(약수를 찾아도 끝까지 나눈다고 봄)
      let p = true; for (let d = 2; d * d <= k; d++) { m2++; if (k % d === 0) { p = false; break; } }
      if (p) primes++;
    }
    const sv = new Uint8Array(n + 1);
    for (let p = 2; p * p <= n; p++) if (!sv[p]) for (let q = p * p; q <= n; q += p) { sv[q] = 1; m3++; }
    return { m1, m2, m3, primes };
  }
  let res = count(N());
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const L = 150, R = 80, lg = (v) => Math.log10(Math.max(1, v)), top = 10, rowH = (h - 26) / 3, X = (v) => L + ((w - L - R) * lg(v)) / top;
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "center";
    for (let e = 0; e <= top; e += 2) { ctx.beginPath(); ctx.moveTo(X(10 ** e), 4); ctx.lineTo(X(10 ** e), h - 22); ctx.stroke(); ctx.fillText(`10^${e}`, X(10 ** e), h - 8); }
    [["방법 1: 모두 나누기", res.m1, C.warn], ["방법 2: √n까지", res.m2, "#3f6fa3"], ["방법 3: 체", res.m3, C.forest]].forEach(([n, v, col], i) => {
      const y = 4 + i * rowH + rowH * 0.2;
      ctx.fillStyle = col; ctx.globalAlpha = 0.7; ctx.fillRect(L, y, X(v) - L, rowH * 0.6); ctx.globalAlpha = 1;
      ctx.fillStyle = C.ink2; ctx.font = `12px ${F.sans}`; ctx.textAlign = "right"; ctx.fillText(n, L - 6, y + rowH * 0.38);
      ctx.font = `11px ${F.mono}`; ctx.textAlign = "left"; ctx.fillText(v.toLocaleString("ko-KR"), X(v) + 4, y + rowH * 0.38);
    });
  }
  function update() {
    res = count(N());
    $(".n-out").textContent = N().toLocaleString("ko-KR");
    $(".say").textContent = `${N().toLocaleString("ko-KR")} 이하의 소수 ${res.primes}개 · 계산 횟수 방법 1 ${res.m1.toLocaleString("ko-KR")}, 방법 2 ${res.m2.toLocaleString("ko-KR")}(1의 ${((100 * res.m2) / Math.max(1, res.m1)).toFixed(2)}%), 방법 3 ${res.m3.toLocaleString("ko-KR")}`;
    draw();
  }
  nIn.addEventListener("input", update);
  update();
})();
