/* 카드: 사인 그래프만 보고 코시컨트 그래프를 그릴 수 있을까? — 점 여덟 개와 점근선을 예측한 뒤 정답과 겹친다 */
(() => {
  const root = document.getElementById("card-pmath-csc-predict");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, piLab, drag, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const verdict = $(".verdict");
  const PI = Math.PI;
  const MODE = {
    csc: { base: Math.sin, xs: [1, 2, 3, 4, 5, 7, 9, 11].map((k) => k * PI / 6), asy: [0, 2, 4], name: "csc x", bname: "sin x" },
    sec: { base: Math.cos, xs: [1, 2, 4, 5, 7, 8, 10, 11].map((k) => k * PI / 6), asy: [1, 3], name: "sec x", bname: "cos x" },
  };
  let mk = "csc", guess = [], shown = false, g = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const reset = () => { guess = MODE[mk].xs.map(() => 0); shown = false; verdict.textContent = ""; verdict.className = "verdict"; root.querySelectorAll(".asy .chip").forEach((b) => b.setAttribute("aria-pressed", "false")); draw(); };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const m = MODE[mk];
    g = G.frame(ctx, w, h, { xr: [0, 2 * PI], yr: [-4, 4], xs: PI / 2, ys: 1, xf: piLab, yf: (v) => n(v, 0) });
    G.curve(ctx, g, m.base, "#b9bbb2", { width: 2 });
    G.tag(ctx, g, `회색: y = ${m.bname}`, g.x0 + 4, g.y0 + 10, C.ink3);
    // 고른 점근선
    root.querySelectorAll(".asy .chip").forEach((b) => {
      if (b.getAttribute("aria-pressed") !== "true") return;
      const x = +b.dataset.x * PI / 2;
      ctx.save(); ctx.strokeStyle = C.warn; ctx.lineWidth = 1.6; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(g.X(x), g.y0); ctx.lineTo(g.X(x), g.y0 + g.h); ctx.stroke(); ctx.restore();
    });
    if (shown) {
      G.curve(ctx, g, (x) => 1 / m.base(x), BLUE, { width: 2.4, N: 900 });
      m.asy.forEach((k) => { const x = k * PI / 2; ctx.save(); ctx.strokeStyle = BLUE; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(g.X(x), g.y0); ctx.lineTo(g.X(x), g.y0 + g.h); ctx.stroke(); ctx.restore(); });
      G.tag(ctx, g, `파랑: y = ${m.name}`, g.x0 + 4, g.y0 + 28, BLUE);
    }
    // 안내선과 예측 점
    m.xs.forEach((x, i) => {
      ctx.save(); ctx.strokeStyle = C.rule; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(g.X(x), g.y0); ctx.lineTo(g.X(x), g.y0 + g.h); ctx.stroke(); ctx.restore();
      const truth = 1 / m.base(x), ok = Math.abs(guess[i] - truth) < 0.25;
      G.dot(ctx, g, x, guess[i], shown ? (ok ? C.forest : C.warn) : C.ink, false, 6);
    });
  }

  function check() {
    const m = MODE[mk];
    const okPts = m.xs.filter((x, i) => Math.abs(guess[i] - 1 / m.base(x)) < 0.25).length;
    const picked = [...root.querySelectorAll(".asy .chip")].filter((b) => b.getAttribute("aria-pressed") === "true").map((b) => +b.dataset.x);
    const okAsy = picked.length === m.asy.length && m.asy.every((k) => picked.includes(k));
    shown = true;
    verdict.textContent = `점 ${okPts}/8개가 0.25 안쪽 · 점근선 ${okAsy ? "모두 맞음" : `틀림 (정답: ${m.asy.map((k) => piLab(k * PI / 2)).join(", ")})`}`;
    verdict.className = "verdict " + (okPts === 8 && okAsy ? "good" : "bad");
    draw();
  }

  drag(cv, (x, y) => {
    if (!g || shown) return null;
    const m = MODE[mk];
    let best = null, bd = 22;
    m.xs.forEach((xv, i) => { const d = Math.hypot(x - g.X(xv), y - g.Y(guess[i])); if (d < bd) { bd = d; best = i; } });
    if (best == null) m.xs.forEach((xv, i) => { if (Math.abs(x - g.X(xv)) < 12) best = i; });   // 안내선 어디를 눌러도 그 점을 잡는다
    return best;
  }, (i, x, y) => { guess[i] = Math.round(NM.clamp(g.iy(y), -4, 4) * 20) / 20; draw(); }, null, "none");

  root.querySelectorAll(".asy .chip").forEach((b) => b.addEventListener("click", () => { if (shown) return; b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); draw(); }));
  G.chips(root, ".mode .chip", (b) => { mk = b.dataset.m; reset(); });
  $(".go-check").addEventListener("click", check);
  $(".go-reset").addEventListener("click", reset);
  reset();
})();
