/* 카드: 사인함수의 어디를 잘라야 역함수가 생길까? — 구간을 끌어 고르고 y = x에 대한 대칭 그래프로 확인 */
(() => {
  const root = document.getElementById("card-pmath-arc-restrict");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { n, piLab, drag, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const PI = Math.PI, U = PI / 12;
  const FN = {
    sin: { f: Math.sin, lo: -1, hi: 1, std: [-6, 6], name: "sin" },
    cos: { f: Math.cos, lo: -1, hi: 1, std: [0, 12], name: "cos" },
    tan: { f: Math.tan, lo: -Infinity, hi: Infinity, std: [-6, 6], name: "tan" },
  };
  let fk = "sin", ab = [0, 4];   // 구간 끝(π/12 단위)
  const found = { sin: new Set(), cos: new Set(), tan: new Set() };
  let gL = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());

  /* 구간 [a, b]에서 단조인지, 모든 값을 갖는지 (tan은 점근선을 포함하면 안 됨) */
  function judge() {
    const F_ = FN[fk], a = ab[0] * U, b = ab[1] * U;
    if (b - a < 1e-9) return { one: false, all: false };
    if (fk === "tan") {
      // 점근선 π/2 + kπ가 구간 안(끝점 포함)에 있으면 끊긴다. 끝점이 점근선이면 열린 구간으로 본다
      const inside = [];
      for (let k = -3; k <= 3; k++) { const p = PI / 2 + k * PI; if (p > a - 1e-9 && p < b + 1e-9) inside.push(p); }
      const openEnds = inside.filter((p) => Math.abs(p - a) < 1e-9 || Math.abs(p - b) < 1e-9);
      if (inside.length !== openEnds.length) return { one: false, all: false };
      return { one: true, all: openEnds.length === 2 };
    }
    let inc = true, dec = true, prev = F_.f(a), mn = prev, mx = prev;
    for (let i = 1; i <= 400; i++) {
      const y = F_.f(a + (b - a) * i / 400);
      if (y < prev - 1e-12) inc = false; if (y > prev + 1e-12) dec = false;
      prev = y; mn = Math.min(mn, y); mx = Math.max(mx, y);
    }
    return { one: inc || dec, all: mn <= F_.lo + 1e-9 && mx >= F_.hi - 1e-9 };
  }

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const F_ = FN[fk], a = ab[0] * U, b = ab[1] * U, J = judge();
    const lw = w * 0.6;
    gL = G.frame(ctx, lw, h, { xr: [-2 * PI, 2 * PI], yr: [-3, 3], xs: PI / 2, ys: 1, B: 34, xf: (v) => (Math.abs(v) % PI < 1e-6 ? piLab(v) : ""), yf: (v) => n(v, 0) });
    G.curve(ctx, gL, F_.f, "#b9bbb2", { width: 1.8, N: 900 });
    const col = J.one && J.all ? C.forest : J.one ? C.amber : C.warn;
    G.curve(ctx, gL, F_.f, col, { width: 3.2, from: a, to: b, N: 400 });
    // 구간 띠와 손잡이
    ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = col; ctx.fillRect(gL.X(a), gL.y0, gL.X(b) - gL.X(a), gL.h); ctx.restore();
    [a, b].forEach((x) => {
      const px = gL.X(x), py = gL.y0 + gL.h + 22;
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(px, py - 9); ctx.lineTo(px - 8, py + 5); ctx.lineTo(px + 8, py + 5); ctx.closePath(); ctx.fill();
    });
    G.tag(ctx, gL, `y = ${F_.name} x`, gL.x0 + 4, gL.y0 + 10, C.ink2);
    // 오른쪽: 고른 부분을 y = x에 대하여 뒤집은 그래프
    ctx.save(); ctx.translate(lw + 6, 0);
    const gR = G.frame(ctx, w - lw - 6, h, { xr: [-3, 3], yr: [-2 * PI, 2 * PI], xs: 1, ys: PI, L: 30, B: 34, xf: (v) => n(v, 0), yf: piLab });
    ctx.save(); ctx.beginPath(); ctx.rect(gR.x0, gR.y0, gR.w, gR.h); ctx.clip();
    ctx.strokeStyle = C.rule; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(gR.X(-3), gR.Y(-3)); ctx.lineTo(gR.X(3), gR.Y(3)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = col; ctx.lineWidth = 2.6; ctx.beginPath();
    let pen = false, py0 = 0;
    for (let i = 0; i <= 400; i++) {
      const x = a + (b - a) * i / 400, y = F_.f(x);
      if (!Number.isFinite(y) || Math.abs(y) > 50) { pen = false; continue; }
      const X = gR.X(NM.clamp(y, -10, 10)), Y = gR.Y(x);
      if (pen && Math.abs(X - py0) < gR.w) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
      pen = true; py0 = X;
    }
    ctx.stroke(); ctx.restore();
    G.tag(ctx, gR, J.one ? "뒤집은 그래프: 함수 ✓" : "뒤집은 그래프: 함수가 아님", gR.x0 + 4, gR.y0 + 10, J.one ? C.forest : C.warn, "left", 10.5);
    ctx.restore();
  }

  function update() {
    if (ab[0] > ab[1]) ab = [ab[1], ab[0]];
    const J = judge(), a = ab[0] * U, b = ab[1] * U, open = fk === "tan";
    const iv = (x) => piLab(x);
    $(".n-iv").textContent = `${open && J.all ? "(" : "["}${iv(a)}, ${iv(b)}${open && J.all ? ")" : "]"}`;
    $(".n-one").textContent = J.one ? "예" : "아니요"; $(".n-one").className = `n-one ${J.one ? "good" : "bad"}`;
    $(".n-all").textContent = J.all ? "예" : "아니요"; $(".n-all").className = `n-all ${J.all ? "good" : "bad"}`;
    const v = $(".verdict");
    if (J.one && J.all) {
      found[fk].add(ab.join(","));
      const std = ab[0] === FN[fk].std[0] && ab[1] === FN[fk].std[1];
      v.textContent = `역함수가 생깁니다. 찾은 구간 ${found[fk].size}개${std ? " — 이것이 약속한 구간입니다." : ""}`;
      v.className = "verdict good";
    } else { v.textContent = J.one ? "일대일이지만 값이 모자랍니다." : "같은 값이 두 번 나와 역함수가 생기지 않습니다."; v.className = "verdict bad"; }
    draw();
  }

  drag(cv, (x, y) => {
    if (!gL) return null;
    const ys = gL.y0 + gL.h + 22;
    if (Math.abs(y - ys) > 24 && y < gL.y0 + gL.h) return null;
    const da = Math.abs(x - gL.X(ab[0] * U)), db = Math.abs(x - gL.X(ab[1] * U));
    return Math.min(da, db) < 26 ? (da <= db ? 0 : 1) : null;
  }, (i, x) => { ab[i] = Math.round(NM.clamp(gL.ix(x), -2 * PI, 2 * PI) / U); update(); });
  G.chips(root, ".presets .chip", (b) => { fk = b.dataset.f; ab = fk === "cos" ? [-3, 3] : [0, 4]; update(); });
  update();
})();
