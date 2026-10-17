/* 카드: 가로와 세로로 따로 흔들리는 점은 어떤 무늬를 그릴까? — 리사주 곡선 목표 맞히기 */
(() => {
  const root = document.getElementById("card-adgeo-lissajous");
  if (!root) return;
  const { C, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".a"), bIn = $(".b"), pIn = $(".p");
  /* 목표: [a, b, φ°] (같은 그림의 다른 표현도 그림 비교로 인정) */
  const TG = [[1, 1, 90], [1, 2, 0], [1, 2, 90], [3, 2, 90], [1, 3, 90]];
  let q = 0, done = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const curve = (a, b, ph, N = 600) => [...Array(N + 1)].map((_, k) => { const t = (2 * Math.PI * k) / N; return [Math.sin(a * t), Math.sin(b * t + (ph * Math.PI) / 180)]; });
  /* 두 곡선의 그림이 같은지: 한쪽의 모든 점이 다른 쪽에 가까운지(양방향) */
  function same(c1, c2) { const near = (p, c) => c.some((r) => Math.hypot(p[0] - r[0], p[1] - r[1]) < 0.03); return c1.filter((_, i) => i % 5 === 0).every((p) => near(p, c2)) && c2.filter((_, i) => i % 5 === 0).every((p) => near(p, c1)); }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = Math.min(w, h) * 0.44, X = (x) => w / 2 + x * s, Y = (y) => h / 2 - y * s;
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.strokeRect(X(-1), Y(1), 2 * s, 2 * s); ctx.beginPath(); ctx.moveTo(X(-1), Y(0)); ctx.lineTo(X(1), Y(0)); ctx.moveTo(X(0), Y(-1)); ctx.lineTo(X(0), Y(1)); ctx.stroke();
    const line = (c, col, lw, dash) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath(); c.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])))); ctx.stroke(); ctx.setLineDash([]); };
    line(curve(...TG[q]), "#e0a02a", 5, [8, 6]);
    line(curve(+aIn.value, +bIn.value, +pIn.value), "#3f6fa3", 2.2);
  }
  function update() {
    $(".a-out").textContent = aIn.value; $(".b-out").textContent = bIn.value; $(".p-out").textContent = pIn.value;
    const ok = same(curve(+aIn.value, +bIn.value, +pIn.value, 300), curve(...TG[q], 300)), v = $(".verdict");
    if (ok && !done) done = true;
    v.textContent = ok ? `맞았습니다! x = sin ${aIn.value}t, y = sin(${bIn.value}t + ${pIn.value}°)` : `x = sin ${aIn.value}t, y = sin(${bIn.value}t + ${pIn.value}°)`;
    v.className = "verdict " + (ok ? "good" : "");
    draw();
  }
  $(".pick").addEventListener("change", () => { q = +$(".pick").value; done = false; update(); });
  [aIn, bIn, pIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
