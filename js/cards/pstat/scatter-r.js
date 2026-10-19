/* 카드: 상관계수가 0이면 관계가 없을까? — r, 회귀직선, 점 하나와 곡선 관계의 영향(가상 자료) */
(() => {
  const root = document.getElementById("card-pstat-scatter-r");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const cv = $("canvas"), r = NMStat.rng(7), g = () => NMStat.gauss(r);
  const GEN = {
    pos: () => Array.from({ length: 30 }, () => { const x = 1 + r() * 8; return [x, 1 + 0.8 * x + g() * 1.1]; }),
    neg: () => Array.from({ length: 30 }, () => { const x = 1 + r() * 8; return [x, 9 - 0.8 * x + g() * 1.1]; }),
    none: () => Array.from({ length: 30 }, () => [1 + r() * 8, 2 + r() * 6]),
    curve: () => Array.from({ length: 30 }, () => { const x = 1 + r() * 8; return [x, 1.5 + 0.35 * (x - 5) ** 2 + g() * 0.4]; }),
  };
  let P = GEN.pos(), base = P.length;
  function stats() {
    const n = P.length, mx = P.reduce((s, p) => s + p[0], 0) / n, my = P.reduce((s, p) => s + p[1], 0) / n;
    let sxx = 0, syy = 0, sxy = 0; P.forEach(([x, y]) => { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my); });
    const b = sxy / sxx; return { r: sxy / Math.sqrt(sxx * syy), b, a: my - b * mx };
  }
  const { ctx, size } = fit(cv, () => draw());
  const L = 30, R = 10, T = 10, B = 24;
  const X = (v) => L + ((size.w - L - R) * v) / 10, Y = (v) => T + (size.h - T - B) * (1 - v / 10);
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2;
    for (let v = 0; v <= 10; v += 2) { ctx.beginPath(); ctx.moveTo(X(0), Y(v)); ctx.lineTo(X(10), Y(v)); ctx.stroke(); ctx.textAlign = "right"; ctx.fillText(String(v), L - 4, Y(v) + 4); ctx.textAlign = "center"; ctx.fillText(String(v), X(v), h - 8); }
    const s = stats();
    ctx.save(); ctx.beginPath(); ctx.rect(X(0), Y(10), X(10) - X(0), Y(0) - Y(10)); ctx.clip();
    ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0), Y(s.a)); ctx.lineTo(X(10), Y(s.a + 10 * s.b)); ctx.stroke(); ctx.restore();
    P.forEach(([x, y], i) => { ctx.fillStyle = i >= base ? C.warn : "#3f6fa3"; ctx.beginPath(); ctx.arc(X(x), Y(y), i >= base ? 5.5 : 4, 0, 7); ctx.fill(); });
  }
  function update() {
    const s = stats();
    $(".say").textContent = `점 ${P.length}개 · 상관계수 r = ${s.r.toFixed(3)} · 회귀직선 y = ${s.b.toFixed(2)}x + ${s.a.toFixed(2)}` + (P.length > base ? ` · 더한 점 ${P.length - base}개(빨강)` : "");
    draw();
  }
  cv.addEventListener("click", (e) => {
    const rc = cv.getBoundingClientRect(), x = ((e.clientX - rc.left - L) * 10) / (size.w - L - R), y = 10 * (1 - (e.clientY - rc.top - T) / (size.h - T - B));
    if (x < 0 || x > 10 || y < 0 || y > 10) return; P.push([x, y]); update();
  });
  $(".undo").addEventListener("click", () => { if (P.length > base) { P.pop(); update(); } });
  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { P = GEN[b.dataset.p](); base = P.length; root.querySelectorAll("[data-p]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  update();
})();
