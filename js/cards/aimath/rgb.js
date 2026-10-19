/* 카드: 색이 있는 사진은 행렬 몇 개로 나타낼까? — R, G, B 세 행렬 (가상 6×6 이미지) */
(() => {
  const root = document.getElementById("card-aimath-rgb");
  if (!root) return;
  const { fit } = NM;
  const I = NMImg;
  const $ = (s) => root.querySelector(s);
  const N = 6, cv = $("canvas"), rIn = $(".r"), gIn = $(".g"), bIn = $(".b");
  /* 하늘(파랑) 배경, 가운데 노란 꽃잎, 갈색 씨앗, 아래 초록 줄기 — 가상 */
  const PIX = (i, j) => { if (i >= 4 && (j === 2 || j === 3)) return [40, 150, 40]; const d = Math.hypot(i - 2, j - 2.5); if (d < 0.9) return [110, 60, 20]; if (d < 2.1) return [255, 205, 0]; return [120, 180, 240]; };
  const RGB = [0, 1, 2].map((c) => [...Array(N)].map((_, i) => [...Array(N)].map((_, j) => PIX(i, j)[c])));
  const on = [true, true, true];
  let sel = [2, 1];
  const { ctx, size } = fit(cv, () => draw());
  function draw() {
    const { w } = size; if (!w) return;
    const cell = w / N, shown = RGB.map((M, c) => (on[c] ? M : I.map(M, () => 0)));
    ctx.clearRect(0, 0, w, w);
    I.draw(ctx, RGB[0], 0, 0, cell, true, shown);
    ctx.save(); ctx.strokeStyle = "#232326"; ctx.lineWidth = 3; ctx.strokeRect(sel[1] * cell + 1.5, sel[0] * cell + 1.5, cell - 3, cell - 3); ctx.restore();
  }
  function update() {
    const [i, j] = sel;
    [rIn, gIn, bIn].forEach((el, c) => { el.value = RGB[c][i][j]; root.querySelector(`.${"rgb"[c]}-out`).textContent = RGB[c][i][j]; });
    $(".mats").textContent = ["R", "G", "B"].map((nm, c) => `${nm} ${i + 1}행: ${RGB[c][i].map((v) => String(v).padStart(3)).join(" ")}${on[c] ? "" : "  (꺼짐 → 0으로 보임)"}`).join("\n");
    $(".say").textContent = `고른 픽셀 (${i + 1}행, ${j + 1}열) = (R ${RGB[0][i][j]}, G ${RGB[1][i][j]}, B ${RGB[2][i][j]}) · 이미지 전체는 6 × 6 행렬 3개, 수 108개`;
    draw();
  }
  cv.addEventListener("click", (e) => { const r = cv.getBoundingClientRect(), cell = r.width / N; sel = [Math.min(N - 1, Math.floor((e.clientY - r.top) / cell)), Math.min(N - 1, Math.floor((e.clientX - r.left) / cell))]; update(); });
  [rIn, gIn, bIn].forEach((el, c) => el.addEventListener("input", () => { RGB[c][sel[0]][sel[1]] = +el.value; update(); }));
  root.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => { const c = +b.dataset.c; on[c] = !on[c]; b.setAttribute("aria-pressed", String(on[c])); update(); }));
  update();
})();
