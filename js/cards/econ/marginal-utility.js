/* 카드: 용돈 1만 원으로 떡볶이와 음료를 어떻게 사야 가장 만족스러울까? — 한계효용 체감과 1원당 한계효용 (가상 효용) */
(() => {
  const root = document.getElementById("card-econ-marginal-utility");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const BUD = 10000;
  /* [이름, 가격, 한계효용 목록(1번째, 2번째, ...)] — 가상 값 */
  const G = [["떡볶이(1인분)", 2000, [60, 44, 30, 18, 8]], ["음료(1잔)", 1000, [26, 20, 14, 9, 5, 2, 0, 0, 0, 0]]];
  const cnt = [5, 0], COL = [C.warn, E.BLUE];
  const U = (i, k) => G[i][2].slice(0, k).reduce((s, v) => s + v, 0);
  const spent = () => cnt.reduce((s, k, i) => s + k * G[i][1], 0);
  const box = $(".goods");
  G.forEach(([nm, p], i) => box.insertAdjacentHTML("beforeend", `<div class="good"><b>${nm}</b> <span class="mono small">${E.n(p)}원</span><div class="row"><button class="chip" type="button" data-i="${i}" data-d="-1" aria-label="${nm} 하나 빼기">−</button><span class="cnt" data-c="${i}"></span><button class="chip" type="button" data-i="${i}" data-d="1" aria-label="${nm} 하나 더">+</button></div><span class="mono small" data-u="${i}"></span></div>`));
  /* 가능한 모든 조합 중 최대 */
  let best = 0; for (let a = 0; a <= 5; a++) for (let b = 0; b <= 10; b++) if (a * 2000 + b * 1000 <= BUD) best = Math.max(best, U(0, a) + U(1, b));
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    /* 1000원당 한계효용 막대: 왼쪽 떡볶이, 오른쪽 음료. 산 것은 진하게 */
    const half = w / 2, top = 32, L = 10, base = h - 22, sc = (base - 18) / top;
    G.forEach(([nm, p, mu], i) => {
      const x0 = i * half + L, bw = Math.min(28, (half - 2 * L) / mu.length - 4);
      E.text(ctx, x0, 12, `${nm.replace(/\(.*\)/, "")}: 1000원당 한계효용`, COL[i], "left", `600 11px ${F.sans}`);
      mu.forEach((m, k) => { const v = m / (p / 1000), x = x0 + k * (bw + 4); ctx.fillStyle = COL[i]; ctx.globalAlpha = k < cnt[i] ? 0.9 : 0.22; ctx.fillRect(x, base - v * sc, bw, v * sc); ctx.globalAlpha = 1; E.text(ctx, x + bw / 2, base + 13, String(k + 1), C.ink3, "center", `10px ${F.mono}`); if (bw > 18) E.text(ctx, x + bw / 2, base - v * sc - 3, E.n(v), C.ink2, "center", `10px ${F.mono}`); });
    });
  }
  function update() {
    G.forEach((g, i) => { root.querySelector(`[data-c="${i}"]`).textContent = cnt[i]; root.querySelector(`[data-u="${i}"]`).textContent = `효용 ${U(i, cnt[i])} · 다음 한 개의 한계효용 ${g[2][cnt[i]] ?? "—"}`; });
    const u = U(0, cnt[0]) + U(1, cnt[1]), left = BUD - spent();
    $(".verdict").textContent = `쓴 돈 ${E.n(spent())}원(남은 돈 ${E.n(left)}원) · 총효용 ${u}` + (u === best ? " · 가장 큰 총효용입니다!" : ` · 더 큰 조합이 있습니다(최대 ${best})`);
    draw();
  }
  root.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => {
    const i = +b.dataset.i, d = +b.dataset.d, k = cnt[i] + d;
    if (k < 0 || k > G[i][2].length) return;
    if (d > 0 && spent() + G[i][1] > BUD) { $(".verdict").textContent = "예산 1만 원을 넘습니다. 다른 것을 먼저 빼세요."; return; }
    cnt[i] = k; update();
  }));
  update();
})();
