/* 카드: 쌓기나무를 위, 앞, 옆에서 보면 어떤 모양일까? — 높이 격자와 세 방향 모습 */
(() => {
  const root = document.getElementById("card-jmath-three-views");
  if (!root) return;
  const { C, F, fit } = NM;
  const B = NMBlocks;
  const $ = (s) => root.querySelector(s);
  const H = [[1, 0, 2], [2, 1, 0], [3, 1, 1]];
  const g = $(".hgrid");
  g.innerHTML = [...Array(9)].map((_, k) => `<button class="chip" type="button" data-k="${k}"></button>`).join("");
  const iso = fit($(".iso"), () => draw()), vw = fit($(".views"), () => draw());
  function draw() {
    if (iso.size.w) { const { ctx, size: { w, h } } = iso; ctx.clearRect(0, 0, w, h); const s = Math.min(w / 5.8, (h - 12) / 6.2); B.iso(ctx, H, w / 2, 3.1 * s + 6, s); }
    if (vw.size.w) {
      const { ctx, size: { w, h } } = vw; ctx.clearRect(0, 0, w, h);
      const s = Math.min((w - 40) / 10.5, (h - 24) / 3), y0 = 18;
      ctx.fillStyle = C.ink2; ctx.font = `600 11px ${F.sans}`; ctx.textAlign = "left";
      [["위", 0], ["앞", 3.75], ["옆(오른쪽)", 7.5]].forEach(([t, k]) => ctx.fillText(t, 10 + k * s, 12));
      B.grid01(ctx, B.top(H), 10, y0, s);
      B.bars(ctx, B.front(H), 10 + 3.75 * s, y0, s, 3, "#5f8fbf");
      B.bars(ctx, B.side(H), 10 + 7.5 * s, y0, s, 3, "#3f6fa3");
    }
  }
  function update() {
    g.querySelectorAll("button").forEach((b) => { const k = +b.dataset.k, v = H[Math.floor(k / 3)][k % 3]; b.textContent = v; b.setAttribute("aria-label", `${Math.floor(k / 3) + 1}행 ${(k % 3) + 1}열, ${v}개`); });
    $(".say").textContent = `쌓기나무 ${B.count(H)}개 · 앞에서 본 높이 ${B.front(H).join(", ")} · 옆에서 본 높이 ${B.side(H).join(", ")}`;
    draw();
  }
  g.addEventListener("click", (e) => { const b = e.target.closest("button[data-k]"); if (!b) return; const k = +b.dataset.k, r = Math.floor(k / 3), c = k % 3; H[r][c] = (H[r][c] + 1) % 4; update(); });
  update();
})();
