/* 고급 미적분 카드 공용 도구 window.NMAdc — 극좌표 판·극곡선, 방향장, 수치 적분(심프슨)·룽게–쿠타, 쌍곡선함수.
   좌표판·곡선은 미적분Ⅰ의 NMCalc(js/cards/calc1/plot.js), 끌기·글자는 NMPm(js/cards/pmath/pm.js)을 함께 쓴다. */
window.NMAdc = (() => {
  "use strict";
  const { C, F } = NM;

  /* 극좌표 판: 중심 (cx, cy), 반지름 R(화면)이 극좌표 rmax에 대응. o = {rmax, rings, rays, cx, cy, R}
     반환: {cx, cy, S(1단위의 화면 길이), P(r, θ) → [px, py], inv(px, py) → [r(≥0), θ(0~2π)]} */
  function pframe(ctx, w, h, o = {}) {
    const rmax = o.rmax || 2, cx = o.cx ?? w / 2, cy = o.cy ?? h / 2;
    const R = o.R || Math.min(w, h) / 2 - 14, S = R / rmax;
    const P = (r, t) => [cx + r * Math.cos(t) * S, cy - r * Math.sin(t) * S];
    const inv = (px, py) => { const x = (px - cx) / S, y = (cy - py) / S; let t = Math.atan2(y, x); if (t < 0) t += 2 * Math.PI; return [Math.hypot(x, y), t]; };
    ctx.save();
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
    const rings = o.rings || 4;
    for (let i = 1; i <= rings; i++) { ctx.beginPath(); ctx.arc(cx, cy, R * i / rings, 0, 7); ctx.stroke(); }
    const rays = o.rays || 12;
    for (let i = 0; i < rays; i++) { const t = 2 * Math.PI * i / rays; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.cos(t), cy - R * Math.sin(t)); ctx.stroke(); }
    ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
    ctx.font = `10px ${F.mono}`; ctx.fillStyle = C.ink3; ctx.textAlign = "center"; ctx.textBaseline = "top";
    if (o.ringLabels !== false) for (let i = 1; i <= rings; i++) ctx.fillText(String(+(rmax * i / rings).toFixed(2)), cx + R * i / rings, cy + 3);
    ctx.restore();
    return { cx, cy, R, S, P, inv, rmax };
  }

  /* 극곡선 r = f(θ), θ ∈ [a, b]. 음의 r은 반대쪽으로 그린다(극좌표의 약속). 화면 밖으로 크게 튀면 끊는다 */
  function pcurve(ctx, pf, f, a, b, col, o = {}) {
    const N = o.N || 720;
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = o.width || 2.4; if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); let pen = false;
    for (let i = 0; i <= N; i++) {
      const t = a + (b - a) * i / N, r = f(t);
      if (!Number.isFinite(r) || Math.abs(r) > pf.rmax * 3) { pen = false; continue; }
      const [x, y] = pf.P(r, t);
      pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = true;
    }
    ctx.stroke(); ctx.restore();
  }

  /* 방향장: NMCalc 좌표판 g 위에 y′ = f(x, y)의 짧은 선분. nx × ny 격자 */
  function field(ctx, g, f, o = {}) {
    const nx = o.nx || 17, ny = o.ny || 11, col = o.color || "#9aa093";
    const [x0, x1] = g.xr, [y0, y1] = g.yr, L = Math.min(g.w / nx, g.h / ny) * 0.36;
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = o.width || 1.3; ctx.beginPath();
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const x = x0 + (x1 - x0) * (i + 0.5) / nx, y = y0 + (y1 - y0) * (j + 0.5) / ny;
      const m = f(x, y); if (!Number.isFinite(m)) continue;
      // 화면에서의 기울기
      const dx = g.w / (x1 - x0), dy = g.h / (y1 - y0);
      const ux = dx, uy = -m * dy, k = L / Math.hypot(ux, uy);
      const px = g.X(x), py = g.Y(y);
      ctx.moveTo(px - ux * k, py - uy * k); ctx.lineTo(px + ux * k, py + uy * k);
    }
    ctx.stroke(); ctx.restore();
  }

  /* 4차 룽게–쿠타로 y′ = f(x, y)를 x0에서 x1까지(뒤로도 가능). 반환: [[x, y], …] (값이 크게 튀면 멈춤) */
  function rk4(f, x0, y0, x1, h = 0.01, lim = 1e6) {
    const pts = [[x0, y0]], s = Math.sign(x1 - x0) || 1; h = Math.abs(h) * s;
    let x = x0, y = y0;
    while ((x1 - x) * s > 1e-12) {
      const hh = Math.abs(x1 - x) < Math.abs(h) ? x1 - x : h;
      const k1 = f(x, y), k2 = f(x + hh / 2, y + hh * k1 / 2), k3 = f(x + hh / 2, y + hh * k2 / 2), k4 = f(x + hh, y + hh * k3);
      y += hh * (k1 + 2 * k2 + 2 * k3 + k4) / 6; x += hh;
      if (!Number.isFinite(y) || Math.abs(y) > lim) break;
      pts.push([x, y]);
    }
    return pts;
  }

  /* 점 목록으로 꺾은선 */
  function path(ctx, g, pts, col, o = {}) {
    ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
    ctx.strokeStyle = col; ctx.lineWidth = o.width || 2.2; if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(g.X(x), g.Y(y)) : ctx.moveTo(g.X(x), g.Y(y)))); ctx.stroke();
    ctx.restore();
  }

  /* 심프슨 공식 (n은 짝수로 올림) */
  function simpson(f, a, b, n = 400) {
    n += n % 2; const h = (b - a) / n; let s = f(a) + f(b);
    for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
    return s * h / 3;
  }

  const cosh = Math.cosh, sinh = Math.sinh, tanh = Math.tanh;
  const asinh = (x) => Math.log(x + Math.sqrt(x * x + 1));
  const acosh = (x) => Math.log(x + Math.sqrt(x * x - 1));
  const atanh = (x) => 0.5 * Math.log((1 + x) / (1 - x));

  /* 지수 표기: 1.23 × 10⁻⁵ */
  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  function sci(v, d = 2) {
    if (!Number.isFinite(v)) return "—";
    if (v === 0) return "0";
    const e = Math.floor(Math.log10(Math.abs(v)));
    if (e >= -3 && e <= 4) return String(+v.toPrecision(d + 1)).replace("-", "−");
    const m = v / 10 ** e;
    return `${m.toFixed(d).replace("-", "−")} × 10${String(e).split("").map((c) => SUP[c]).join("")}`;
  }

  return { pframe, pcurve, field, rk4, path, simpson, cosh, sinh, tanh, asinh, acosh, atanh, sci };
})();
