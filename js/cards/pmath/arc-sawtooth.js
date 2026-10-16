/* 카드: arcsin(sin x)는 언제나 x일까? — 역삼각함수 합성의 톱니 그래프, 오류 찾기 */
(() => {
  const root = document.getElementById("card-pmath-arc-sawtooth");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, piLab, spot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sx = $(".sx"), PI = Math.PI;
  const FN = {
    as: { inner: Math.sin, outer: Math.asin, xr: [-2 * PI, 2 * PI], yr: [-PI, PI], inName: "sin x", band: [-PI / 2, PI / 2] },
    ac: { inner: Math.cos, outer: Math.acos, xr: [-2 * PI, 2 * PI], yr: [-PI, 2 * PI], inName: "cos x", band: [0, PI] },
    at: { inner: Math.tan, outer: Math.atan, xr: [-2 * PI, 2 * PI], yr: [-PI, PI], inName: "tan x", band: [-PI / 2, PI / 2] },
    sa: { inner: (x) => (Math.abs(x) <= 1 ? Math.asin(x) : NaN), outer: Math.sin, xr: [-1.6, 1.6], yr: [-1.6, 1.6], inName: "arcsin x", band: [-1, 1] },
  };
  let fk = "as";
  const { ctx, size } = fit($("canvas"), () => draw());
  const comp = (x) => { const F_ = FN[fk], v = F_.inner(x); return Number.isFinite(v) && Math.abs(v) < 1e8 ? F_.outer(v) : NaN; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const F_ = FN[fk], isPi = fk !== "sa";
    const g = G.frame(ctx, w, h, { xr: F_.xr, yr: F_.yr, xs: isPi ? PI / 2 : 0.5, ys: isPi ? PI / 2 : 0.5, xf: isPi ? (v) => (Math.abs(v % PI) < 1e-6 || Math.abs(v) < 1e-6 ? piLab(v) : "") : (v) => n(v, 1), yf: isPi ? piLab : (v) => n(v, 1) });
    // y = x와 겹치는 구간
    ctx.save(); ctx.globalAlpha = 0.1; ctx.fillStyle = C.forest; ctx.fillRect(g.X(F_.band[0]), g.y0, g.X(F_.band[1]) - g.X(F_.band[0]), g.h); ctx.restore();
    G.curve(ctx, g, (x) => x, C.ink3, { width: 1.3, dash: [5, 4] });
    G.curve(ctx, g, comp, BLUE, { width: 2.6, N: 1200 });
    const x = +sx.value, y = comp(x);
    if (Number.isFinite(y)) {
      G.guide(ctx, g, x, y, BLUE, "xy");
      G.dot(ctx, g, x, x, C.ink3, true, 4);
      G.dot(ctx, g, x, y, Math.abs(y - x) < 1e-6 ? C.forest : C.warn);
    }
    G.tag(ctx, g, "점선: y = x · 초록 띠: 둘이 겹치는 구간", g.x0 + 4, g.y0 + 10, C.ink3);
  }

  function update() {
    const F_ = FN[fk], x = +sx.value, inn = F_.inner(x), y = comp(x);
    const fx = fk === "sa" ? n(x, 2) : `${n(x, 2)} (${n(x * 180 / PI, 0)}°)`;
    $(".x-out").textContent = fx;
    $(".n-in").textContent = Number.isFinite(inn) ? `${F_.inName} = ${n(inn, 3)}` : "정의 안 됨";
    $(".n-out").textContent = Number.isFinite(y) ? n(y, 3) : "정의 안 됨";
    const eq = Number.isFinite(y) && Math.abs(y - x) < 1e-6;
    $(".n-eq").textContent = Number.isFinite(y) ? (eq ? "같다" : "다르다") : "—"; $(".n-eq").className = `n-eq ${eq ? "good" : "bad"}`;
    draw();
  }
  G.chips(root, ".presets .chip", (b) => {
    fk = b.dataset.f; const F_ = FN[fk];
    sx.min = F_.xr[0]; sx.max = F_.xr[1]; sx.step = fk === "sa" ? 0.01 : 0.01;
    sx.value = fk === "sa" ? 0.5 : 2.62; update();
  });
  sx.addEventListener("input", update);
  spot($(".spot"));
  update();
})();
