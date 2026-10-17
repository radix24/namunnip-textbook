/* 카드: 같은 원을 그리는데 왜 점마다 빠르기가 다를까? — 같은 원의 세 매개변수, 속력 그래프 */
(() => {
  const root = document.getElementById("card-adgeo-speed-param");
  if (!root) return;
  const { C, F, fit } = NM;
  const K = NMCurve;
  const $ = (s) => root.querySelector(s);
  const uIn = $(".u"), R = 2, L = 2 * Math.PI * R;
  /* 공통 시각 u ∈ [0, 1]에서 끝나도록 매개변수 범위를 맞춤 */
  const P = [
    { name: "(2cos t, 2sin t)", col: "#3f6fa3", f: (t) => [R * Math.cos(t), R * Math.sin(t)], T: 2 * Math.PI },
    { name: "(2cos t², 2sin t²)", col: C.warn, f: (t) => [R * Math.cos(t * t), R * Math.sin(t * t)], T: Math.sqrt(2 * Math.PI) },
    { name: "(2cos(s/2), 2sin(s/2))", col: C.forest, f: (s) => [R * Math.cos(s / R), R * Math.sin(s / R)], T: L },
  ];
  let timer = 0;
  const cv = fit($(".c"), () => drawC()), gv = fit($(".g"), () => drawG());
  function drawC() {
    const { ctx, size: { w, h } } = cv; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = Math.min(w, h) * 0.18, X = (x) => w / 2 + x * s, Y = (y) => h / 2 - y * s;
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(w / 2, h / 2, R * s, 0, 7); ctx.stroke();
    P.forEach((p, i) => { const q = p.f(p.T * +uIn.value), rr = R + (i - 1) * 0.28; ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(X((q[0] * rr) / R), Y((q[1] * rr) / R), 7, 0, 7); ctx.fill(); });
    ctx.fillStyle = C.ink2; ctx.font = `600 11px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText("세 점은 같은 원 위(보이게 조금씩 떨어뜨려 그림)", w / 2, h - 8);
  }
  function drawG() {
    const { ctx, size: { w, h } } = gv; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const series = P.map((p) => ({ col: p.col, name: p.name, data: [...Array(101)].map((_, k) => [k / 100, K.len(K.d1(p.f, (p.T * k) / 100))]) }));
    K.graph(ctx, { x: 0, y: 0, w, h }, series, { t0: 0, t1: 1, v0: 0, v1: 11, mark: +uIn.value });
  }
  function update() {
    const u = +uIn.value; $(".u-out").textContent = u.toFixed(2);
    $(".say").textContent = P.map((p) => { const t = p.T * u, sp = K.len(K.d1(p.f, t)); return `${p.name}: 매개변수 ${K.n(t, 2)}, 속력 ${K.n(sp, 2)}`; }).join(" · ") + ` · 원 둘레 4π ≈ ${K.n(L, 2)}`;
    drawC(); drawG();
  }
  $(".go-play").addEventListener("click", () => { clearInterval(timer); uIn.value = 0; timer = setInterval(() => { uIn.value = Math.min(1, +uIn.value + 0.004); update(); if (+uIn.value >= 1) clearInterval(timer); }, 30); });
  uIn.addEventListener("input", () => { clearInterval(timer); update(); });
  update();
})();
