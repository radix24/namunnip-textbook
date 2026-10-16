/* 카드: 출발점에서 가장 가까운 근으로 갈까? — x³ − x에 뉴턴의 방법, 도착점 예측과 끌림 영역 띠 */
(() => {
  const root = document.getElementById("card-adcalc-newton-basin");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE, PURPLE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const f = (x) => x ** 3 - x, step = (x) => x - f(x) / (3 * x * x - 1);
  const ROOTS = [-1, 0, 1], COL = { "-1": BLUE, 0: C.warn, 1: C.forest };
  const verdict = $(".verdict"), bBasin = $(".go-basin");
  let x0 = 2, shown = false, score = 0, tried = 0;
  const done = new Set();
  const { ctx, size } = fit($("canvas"), () => draw());

  function run(x) {
    const pts = [x];
    for (let i = 0; i < 60; i++) {
      const d = 3 * x * x - 1; if (Math.abs(d) < 1e-14) return { pts, r: null };
      x = step(x); pts.push(x);
      const r = ROOTS.find((q) => Math.abs(x - q) < 1e-10); if (r != null) return { pts, r };
    }
    return { pts, r: null };
  }
  const dest = (x) => { for (let i = 0; i < 80; i++) { const d = 3 * x * x - 1; if (Math.abs(d) < 1e-14) return null; x = step(x); if (Math.abs(x) > 1e6) return null; } return ROOTS.find((q) => Math.abs(x - q) < 1e-6) ?? null; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const g = G.frame(ctx, w, h, { xr: [-2, 2.2], yr: [-1.6, 3], xs: 0.5, ys: 1, B: 40, xf: (v) => n(v, 1), yf: (v) => n(v, 0) });
    G.curve(ctx, g, f, C.ink2, { width: 2 });
    ROOTS.forEach((r) => G.dot(ctx, g, r, 0, COL[r], false, 5));
    // 띠
    const by = g.y0 + g.h + 20;
    if (shown) {
      for (let px = 0; px < g.w; px++) {
        const r = dest(g.ix(g.x0 + px + 0.5));
        ctx.fillStyle = r == null ? C.ink3 : COL[r];
        ctx.fillRect(g.x0 + px, by, 1, 12);
      }
    } else { ctx.fillStyle = C.rule; ctx.fillRect(g.x0, by, g.w, 12); }
    // 길
    if (done.has(x0)) {
      const { pts } = run(x0);
      ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
      for (let i = 0; i + 1 < pts.length && i < 12; i++) {
        const a = pts[i], b = pts[i + 1];
        ctx.strokeStyle = C.ink3; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(g.X(a), g.Y(0)); ctx.lineTo(g.X(a), g.Y(f(a))); ctx.stroke();
        ctx.setLineDash([]); ctx.strokeStyle = PURPLE; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(g.X(a), g.Y(f(a))); ctx.lineTo(g.X(b), g.Y(0)); ctx.stroke();
      }
      ctx.restore();
    }
    G.dot(ctx, g, x0, 0, C.ink, true, 6);
    ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(g.X(x0), by - 4); ctx.lineTo(g.X(x0), by + 16); ctx.stroke(); ctx.restore();
    G.tag(ctx, g, "파랑 → −1 · 주황 → 0 · 초록 → 1", g.x0 + 4, g.y0 + 10, C.ink3);
  }
  function nums() {
    $(".n-s").textContent = `${score} / ${tried}`;
    if (done.has(x0)) { const { pts, r } = run(x0); $(".n-p").textContent = pts.slice(1, 4).map((v) => n(v, 3)).join(", ") + (pts.length > 4 ? " …" : ""); $(".n-r").textContent = r == null ? "없음" : n(r, 0); }
    else { $(".n-p").textContent = "—"; $(".n-r").textContent = "?"; }
    draw();
  }
  G.chips(root, ".q-pick .chip", (b) => { x0 = +b.dataset.x; verdict.textContent = done.has(x0) ? "이미 확인한 문제입니다." : ""; verdict.className = "verdict"; nums(); });
  root.querySelectorAll(".guess .chip").forEach((b) => b.addEventListener("click", () => {
    if (done.has(x0)) return;
    const { r } = run(x0), g = +b.dataset.r;
    done.add(x0); tried++; if (g === r) score++;
    const near = ROOTS.reduce((a, q) => (Math.abs(q - x0) < Math.abs(a - x0) ? q : a));
    verdict.textContent = g === r ? `맞습니다. ${n(r, 0)}에 도착합니다.` : `${n(r, 0)}에 도착합니다.${r !== near ? ` 가장 가까운 근 ${n(near, 0)}이 아닙니다.` : ""}`;
    verdict.className = "verdict " + (g === r ? "good" : "bad");
    nums();
  }));
  bBasin.addEventListener("click", () => { shown = !shown; bBasin.setAttribute("aria-pressed", String(shown)); draw(); });
  nums();
})();
