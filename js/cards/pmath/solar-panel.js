/* 카드: 태양광 패널은 몇 도로 세워야 햇빛을 가장 많이 받을까? — 받는 빛 ∝ cos γ = sin(α + β) */
(() => {
  const root = document.getElementById("card-pmath-solar-panel");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, rad, label, seg, arrow, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa"), sb = $(".sb");
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const a = rad(+sa.value), b = rad(+sb.value);
    // 왼쪽: 옆모습. 남쪽이 오른쪽(해가 오른쪽 위)
    const lw = w * 0.5, gy = h - 22, L = Math.min(lw * 0.42, h * 0.5), px = lw * 0.42;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, lw, h); ctx.clip();   // 햇빛 선이 오른쪽 그래프로 넘어가지 않게
    seg(ctx, 8, gy, lw - 8, gy, C.ink3, 1.5);
    // 화면 좌표(x 오른쪽 = 남쪽, y 아래). 해를 향하는 방향 sun, 패널 아래 끝 p0(남쪽)과 위 끝 p1(북쪽)
    const sun = [Math.cos(a), -Math.sin(a)];
    const p0 = [px + L * Math.cos(b) / 2, gy - 6], p1 = [p0[0] - L * Math.cos(b), p0[1] - L * Math.sin(b)];
    // 패널이 가로막는 빛줄기: 패널 위 여러 점에서 해 쪽으로 그은 평행선
    for (let k = 0; k <= 8; k++) {
      const t = k / 8, q = [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t];
      seg(ctx, q[0], q[1], q[0] + sun[0] * 400, q[1] + sun[1] * 400, "#e8c25a", 1);
    }
    // 빛줄기의 단면: 햇빛에 수직인 방향으로 패널을 정사영한 길이
    const perp = [Math.sin(a), Math.cos(a)];
    const wsec = (p1[0] - p0[0]) * perp[0] + (p1[1] - p0[1]) * perp[1];
    const c0 = [p0[0] + sun[0] * 110, p0[1] + sun[1] * 110];
    seg(ctx, c0[0], c0[1], c0[0] + perp[0] * wsec, c0[1] + perp[1] * wsec, C.warn, 3.2);
    label(ctx, "빛줄기 단면", c0[0] + perp[0] * wsec / 2 + 8, c0[1] + perp[1] * wsec / 2 - 10, C.warn, "left", `600 11px ${F.sans}`);
    seg(ctx, ...p0, ...p1, BLUE, 5);
    // 패널 법선(해를 향하는 쪽)
    const nrm = [Math.sin(b), -Math.cos(b)], mid = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
    arrow(ctx, ...mid, mid[0] + nrm[0] * 42, mid[1] + nrm[1] * 42, BLUE, 1.6, 7);
    label(ctx, "법선", mid[0] + nrm[0] * 50, mid[1] + nrm[1] * 50, BLUE, "center", `600 11px ${F.sans}`);
    label(ctx, "해 →", lw - 14, 16, C.amber, "right", `600 12px ${F.sans}`);
    ctx.restore();
    // 오른쪽: 받는 빛 비율 vs β
    ctx.save(); ctx.translate(lw + 8, 0);
    const g = G.frame(ctx, w - lw - 8, h, { xr: [0, 90], yr: [0, 1.05], xs: 15, ys: 0.25, xf: (v) => `${n(v, 0)}°`, yf: (v) => `${n(v * 100, 0)}%` });
    G.curve(ctx, g, (bb) => Math.max(0, Math.sin(a + rad(bb))), C.forest, { width: 2.4 });
    const best = Math.max(0, 90 - +sa.value);
    G.guide(ctx, g, best, Math.sin(a + rad(best)), C.forest, "x");
    G.dot(ctx, g, +sb.value, Math.max(0, Math.sin(a + b)), C.warn);
    G.tag(ctx, g, "패널 기울기 β", g.x0 + g.w - 4, g.y0 + g.h - 10, C.ink3, "right");
    ctx.restore();
  }
  function update() {
    const a = +sa.value, b = +sb.value;
    $(".a-out").textContent = `${n(a, 1)}°`; $(".b-out").textContent = `${b}°`;
    $(".n-p").textContent = `${n(Math.max(0, Math.sin(rad(a + b))) * 100, 1)} %`;
    $(".n-g").textContent = `${n(Math.abs(90 - a - b), 1)}°`;
    $(".n-best").textContent = `${n(90 - a, 1)}°`;
    draw();
  }
  root.querySelectorAll(".presets .chip").forEach((bt) => bt.addEventListener("click", () => {
    sa.value = bt.dataset.a; root.querySelectorAll(".presets .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === bt))); update();
  }));
  [sa, sb].forEach((el) => el.addEventListener("input", update));
  update();
})();
