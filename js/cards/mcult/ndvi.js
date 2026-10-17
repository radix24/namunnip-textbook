/* 카드: 위성 사진으로 사막화를 어떻게 잴까? — NDVI = (NIR − Red)/(NIR + Red), 가상 두 시점 16×10 칸 */
(() => {
  const root = document.getElementById("card-mcult-ndvi");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const kIn = $(".k"), W = 16, H = 10, cv = $("canvas");
  /* 고정 난수로 가상 장면 생성: 왼쪽 아래 사막이 두 번째 해에 넓어짐, 오른쪽 위에 호수 */
  let s = 11; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const TYPE = { veg: [0.48, 0.07], sparse: [0.32, 0.16], bare: [0.33, 0.24], water: [0.03, 0.06] };
  function scene(edge) {
    return Array.from({ length: W * H }, (_, i) => {
      const x = i % W, y = Math.floor(i / W), d = x + (H - 1 - y) * 1.1 + rnd() * 2.5;
      const t = x >= 12 && y <= 2 ? "water" : d < edge ? "bare" : d < edge + 3 ? "sparse" : "veg";
      const [n, r] = TYPE[t]; return [Math.max(0.01, n + (rnd() - 0.5) * 0.08), Math.max(0.01, r + (rnd() - 0.5) * 0.04)];
    });
  }
  const S = [scene(5), scene(10)], YEAR = ["2005년(가상)", "2025년(가상)"];
  const nd = ([n, r]) => (n - r) / (n + r);
  let pick = null;
  const col = (v) => { const t = Math.max(0, Math.min(1, (v + 0.1) / 0.8)); return v < -0.05 ? "#6f9fc8" : `rgb(${Math.round(205 - 120 * t)},${Math.round(180 - 20 * t)},${Math.round(138 - 70 * t)})`; };
  const { ctx, size } = fit(cv, () => draw());
  const geom = () => { const { w, h } = size, s2 = Math.min((w - 30) / (2 * W), (h - 22) / H); return { s2, ox: [8, 8 + W * s2 + 14], oy: 18 }; };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const { s2, ox, oy } = geom(), k = +kIn.value;
    S.forEach((sc, j) => {
      sc.forEach((p, i) => { const v = nd(p); ctx.fillStyle = col(v); ctx.fillRect(ox[j] + (i % W) * s2, oy + Math.floor(i / W) * s2, s2 - 0.5, s2 - 0.5); if (v >= k) { ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(ox[j] + (i % W + 0.42) * s2, oy + (Math.floor(i / W) + 0.42) * s2, s2 * 0.16, s2 * 0.16); } });
      ctx.fillStyle = C.ink2; ctx.font = `12px ${F.sans}`; ctx.textAlign = "left"; ctx.fillText(YEAR[j], ox[j], oy - 5);
    });
    if (pick) { const [j, i] = pick; ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.strokeRect(ox[j] + (i % W) * s2, oy + Math.floor(i / W) * s2, s2, s2); }
  }
  function update() {
    const k = +kIn.value, f = S.map((sc) => sc.filter((p) => nd(p) >= k).length / (W * H));
    $(".k-out").textContent = k.toFixed(2);
    $(".say").textContent = `NDVI ≥ ${k.toFixed(2)}인 칸(흰 점): ${YEAR[0]} ${(100 * f[0]).toFixed(0)}% → ${YEAR[1]} ${(100 * f[1]).toFixed(0)}% · 변화 ${(100 * (f[1] - f[0])).toFixed(0)}%p`;
    draw();
  }
  cv.addEventListener("click", (e) => {
    const r = cv.getBoundingClientRect(), { s2, ox, oy } = geom(), x = e.clientX - r.left, y = e.clientY - r.top;
    for (let j = 0; j < 2; j++) {
      const cx = Math.floor((x - ox[j]) / s2), cy = Math.floor((y - oy) / s2);
      if (cx >= 0 && cx < W && cy >= 0 && cy < H) {
        const i = cy * W + cx, [n, rd] = S[j][i]; pick = [j, i];
        $(".pick").textContent = `${YEAR[j]} (${cx + 1}, ${cy + 1})칸 · NIR ${n.toFixed(2)}, Red ${rd.toFixed(2)} → NDVI = (${n.toFixed(2)} − ${rd.toFixed(2)}) / (${n.toFixed(2)} + ${rd.toFixed(2)}) = ${nd(S[j][i]).toFixed(2)}`;
        draw(); return;
      }
    }
  });
  kIn.addEventListener("input", update);
  update();
})();
