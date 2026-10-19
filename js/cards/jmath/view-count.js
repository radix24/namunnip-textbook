/* 카드: 앞과 옆에서 찍은 사진만 있을 때 상자는 몇 개일까? — 두 모습에 맞는 쌓기의 최소·최대 */
(() => {
  const root = document.getElementById("card-jmath-view-count");
  if (!root) return;
  const { C, F, fit } = NM;
  const B = NMBlocks;
  const $ = (s) => root.querySelector(s);
  const FR = [2, 3, 1], SD = [3, 1, 2];   // 앞(왼→오 열), 옆(왼 = 앞쪽 행)
  const H = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  /* 모든 경우(각 자리 0~3)를 찾아 최소·최대 */
  const ok = (h) => B.front(h).every((v, i) => v === FR[i]) && B.side(h).every((v, i) => v === SD[i]);
  let MIN = Infinity, MAX = -Infinity;
  for (let code = 0; code < 4 ** 9; code++) { const h = [0, 1, 2].map((r) => [0, 1, 2].map((c) => Math.floor(code / 4 ** (r * 3 + c)) % 4)); if (ok(h)) { const n = B.count(h); MIN = Math.min(MIN, n); MAX = Math.max(MAX, n); } }
  const hit = new Set();
  const g = $(".hgrid");
  g.innerHTML = [...Array(9)].map((_, k) => `<button class="chip" type="button" data-k="${k}"></button>`).join("");
  const tg = fit($(".target"), () => draw()), iso = fit($(".iso"), () => draw());
  function draw() {
    if (tg.size.w) {
      const { ctx, size: { w, h } } = tg; ctx.clearRect(0, 0, w, h);
      const s = Math.min((w - 40) / 7.5, (h - 22) / 3);
      ctx.fillStyle = C.ink2; ctx.font = `600 11px ${F.sans}`; ctx.textAlign = "left";
      ctx.fillText("목표: 앞에서", 10, 12); ctx.fillText("목표: 옆(오른쪽)에서", 10 + 4 * s, 12);
      B.bars(ctx, FR, 10, 18, s, 3, "#5f8fbf"); B.bars(ctx, SD, 10 + 4 * s, 18, s, 3, "#3f6fa3");
    }
    if (iso.size.w) { const { ctx, size: { w, h } } = iso; ctx.clearRect(0, 0, w, h); const s = Math.min(w / 5.8, (h - 12) / 6.2); B.iso(ctx, H, w / 2, 3.1 * s + 6, s); }
  }
  function update() {
    g.querySelectorAll("button").forEach((b) => { const k = +b.dataset.k; b.textContent = H[Math.floor(k / 3)][k % 3]; });
    const n = B.count(H), good = ok(H);
    if (good) hit.add(n);
    const fr = B.front(H), sd = B.side(H);
    $(".verdict").textContent = good ? `두 사진과 똑같습니다. 상자 ${n}개.` : `아직 다릅니다. 지금 앞 ${fr.join(", ")} (목표 ${FR.join(", ")}), 옆 ${sd.join(", ")} (목표 ${SD.join(", ")})`;
    const found = [...hit].sort((a, b) => a - b);
    $(".score").textContent = `찾은 개수: ${found.join(", ") || "없음"}` + (hit.has(MIN) && hit.has(MAX) ? ` · 도전 성공! 최소 ${MIN}개, 최대 ${MAX}개` : hit.size ? " · 최소와 최대를 모두 찾아보세요" : "");
    draw();
  }
  g.addEventListener("click", (e) => { const b = e.target.closest("button[data-k]"); if (!b) return; const k = +b.dataset.k, r = Math.floor(k / 3), c = k % 3; H[r][c] = (H[r][c] + 1) % 4; update(); });
  $(".go-clear").addEventListener("click", () => { H.forEach((row) => row.fill(0)); update(); });
  update();
})();
