/* 카드: 주변 픽셀과 섞으면 사진에서 윤곽선을 찾을 수 있을까? — 3×3 합성곱 (가상 이미지) */
(() => {
  const root = document.getElementById("card-aimath-convolution");
  if (!root) return;
  const { fit } = NM;
  const I = NMImg;
  const $ = (s) => root.querySelector(s);
  const A = I.sample(24), N = 24;
  const F = { blur: [[[1, 1, 1], [1, 1, 1], [1, 1, 1]], 1 / 9, 0], sharp: [[[0, -1, 0], [-1, 5, -1], [0, -1, 0]], 1, 0], edgeH: [[[-1, -2, -1], [0, 0, 0], [1, 2, 1]], 1, 128], edgeV: [[[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], 1, 128] };
  let K = F.blur[0].map((r) => [...r]), sc = F.blur[1], off = F.blur[2], sel = [12, 12];
  const kb = $(".k");
  kb.innerHTML = [...Array(9)].map((_, t) => `<input type="number" step="1" data-t="${t}" aria-label="필터 ${Math.floor(t / 3) + 1}행 ${(t % 3) + 1}열">`).join("");
  const src = fit($(".src"), () => draw()), dst = fit($(".dst"), () => draw());
  function draw() {
    if (!src.size.w || !dst.size.w) return;
    const B = I.conv(A, K, sc, off), c1 = src.size.w / N, c2 = dst.size.w / N;
    I.draw(src.ctx, A, 0, 0, c1); I.draw(dst.ctx, B, 0, 0, c2);
    [[src.ctx, c1, 1], [dst.ctx, c2, 0]].forEach(([ctx, c, win]) => { ctx.save(); ctx.strokeStyle = "#e0a02a"; ctx.lineWidth = 2; ctx.strokeRect((sel[1] - win) * c, (sel[0] - win) * c, c * (2 * win + 1), c * (2 * win + 1)); ctx.restore(); });
  }
  function update() {
    kb.querySelectorAll("input").forEach((el) => { const t = +el.dataset.t; el.value = K[Math.floor(t / 3)][t % 3]; });
    const [i, j] = sel, at = (a, b) => A[Math.max(0, Math.min(N - 1, a))][Math.max(0, Math.min(N - 1, b))];
    let s = 0; const terms = [];
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const v = at(i + a, j + b), k = K[a + 1][b + 1]; s += k * v; if (k) terms.push(`${k}×${v}`); }
    const res = I.clamp(s * sc + off);
    $(".calc").textContent = `(${i + 1}행, ${j + 1}열)의 계산: [${terms.join(" + ")}]${sc !== 1 ? ` × ${sc === 1 / 9 ? "1/9" : sc.toFixed(3)}` : ""}${off ? ` + ${off}` : ""} = ${(s * sc + off).toFixed(1)} → ${res}`;
    draw();
  }
  root.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { const f = F[b.dataset.f]; K = f[0].map((r) => [...r]); sc = f[1]; off = f[2]; root.querySelectorAll("[data-f]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  kb.querySelectorAll("input").forEach((el) => el.addEventListener("input", () => { const t = +el.dataset.t; K[Math.floor(t / 3)][t % 3] = +el.value || 0; update(); }));
  $(".src").addEventListener("click", (e) => { const r = e.currentTarget.getBoundingClientRect(), c = r.width / N; sel = [Math.min(N - 1, Math.floor((e.clientY - r.top) / c)), Math.min(N - 1, Math.floor((e.clientX - r.left) / c))]; update(); });
  update();
})();
