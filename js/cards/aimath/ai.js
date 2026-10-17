/* 인공지능 수학 도구 window.NMAi — 재현되는 난수, 거리, 점 끌기, 2차원 점 자료 그림판 (그래프 틀은 NMEcon을 쓴다) */
window.NMAi = (() => {
  "use strict";
  /* 씨앗이 있는 난수(mulberry32): 같은 씨앗이면 같은 자료 */
  const rng = (seed = 1) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const gauss = (r) => { const u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
  const norm = (a) => Math.sqrt(dot(a, a));
  const cos = (a, b) => { const d = norm(a) * norm(b); return d ? dot(a, b) / d : 0; };
  /* 캔버스 좌표 → 그래프 좌표, 포인터 끌기: pick(x, y) → 핸들 번호 또는 −1, move(i, gx, gy) */
  function drag(cv, getP, pick, move, end) {
    let cur = -1;
    const at = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener("pointerdown", (e) => { const P = getP(); if (!P) return; const [x, y] = at(e); cur = pick(x, y, P); if (cur >= 0) { cv.setPointerCapture(e.pointerId); e.preventDefault(); } });
    cv.addEventListener("pointermove", (e) => { if (cur < 0) return; const P = getP(), [x, y] = at(e); move(cur, ...P.inv(x, y)); });
    const stop = () => { if (cur >= 0 && end) end(cur); cur = -1; };
    cv.addEventListener("pointerup", stop); cv.addEventListener("pointercancel", stop);
  }
  const n = (x, d = 2) => NMEcon.n(x, d);
  return { rng, gauss, dist, dot, norm, cos, drag, n };
})();
