/* 고급 대수 카드 공용 도구 window.NMLin — 행렬·벡터 계산, 분수 표기, 2차원 격자 변환 그림, 고윳값(2×2).
   행렬은 행의 배열 [[a, b], [c, d]], 벡터는 배열 [x, y]. */
window.NMLin = (() => {
  "use strict";
  const { C, F } = NM;
  const EPS = 1e-9;

  const mul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, a, k) => s + a * B[k][j], 0)));
  const mv = (A, v) => A.map((r) => r.reduce((s, a, k) => s + a * v[k], 0));
  const T = (A) => A[0].map((_, j) => A.map((r) => r[j]));
  const eye = (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  function det(A) {
    const n = A.length;
    if (n === 1) return A[0][0];
    if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
    return A[0].reduce((s, a, j) => s + (j % 2 ? -1 : 1) * a * det(A.slice(1).map((r) => r.filter((_, k) => k !== j))), 0);
  }
  /* 역행렬(가우스-조르당). 특이행렬이면 null */
  function inv(A) {
    const n = A.length, M = A.map((r, i) => [...r, ...eye(n)[i]]);
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      if (Math.abs(M[p][c]) < EPS) return null;
      [M[c], M[p]] = [M[p], M[c]];
      const k = M[c][c]; M[c] = M[c].map((x) => x / k);
      for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c]; M[r] = M[r].map((x, j) => x - f * M[c][j]); }
    }
    return M.map((r) => r.slice(n));
  }
  /* 기약 행 사다리꼴: { R, piv: 피벗 열 번호들 } */
  function rref(A) {
    const R = A.map((r) => r.slice()), m = R.length, n = R[0].length, piv = [];
    let row = 0;
    for (let c = 0; c < n && row < m; c++) {
      let p = row; for (let r = row + 1; r < m; r++) if (Math.abs(R[r][c]) > Math.abs(R[p][c])) p = r;
      if (Math.abs(R[p][c]) < EPS) continue;
      [R[row], R[p]] = [R[p], R[row]];
      const k = R[row][c]; R[row] = R[row].map((x) => x / k);
      for (let r = 0; r < m; r++) if (r !== row) { const f = R[r][c]; R[r] = R[r].map((x, j) => x - f * R[row][j]); }
      piv.push(c); row++;
    }
    R.forEach((r) => r.forEach((x, j) => { if (Math.abs(x) < EPS) r[j] = 0; }));
    return { R, piv };
  }
  /* 벡터들(열)이 일차종속이면 계수 c (Σ cᵢvᵢ = 0, c ≠ 0)를, 독립이면 null */
  function relation(vs) {
    const A = vs[0].map((_, i) => vs.map((v) => v[i])), { R, piv } = rref(A), n = vs.length;
    const free = [...Array(n).keys()].find((j) => !piv.includes(j));
    if (free == null) return null;
    const c = Array(n).fill(0); c[free] = 1;
    piv.forEach((pc, r) => { c[pc] = -R[r][free]; });
    // 정수로 보기 좋게: 분모의 최소공배수 곱하기
    let den = 1; c.forEach((x) => { for (let q = 1; q <= 12; q++) if (Math.abs(x * q - Math.round(x * q)) < 1e-9) { den = den * q / gcd(den, q); break; } });
    return c.map((x) => Math.round(x * den * 1e9) / 1e9);
  }
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const dot = (u, v) => u.reduce((s, a, i) => s + a * v[i], 0);
  const norm = (u) => Math.sqrt(dot(u, u));
  const add = (u, v) => u.map((a, i) => a + v[i]), sub = (u, v) => u.map((a, i) => a - v[i]), scl = (u, k) => u.map((a) => a * k);

  /* 실수를 분모 50 이하 분수로(가까우면), 음수는 − */
  function frac(x, maxDen = 50) {
    if (!Number.isFinite(x)) return "—";
    if (Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x)).replace("-", "−");
    for (let q = 2; q <= maxDen; q++) { const p = Math.round(x * q); if (Math.abs(x - p / q) < 1e-9) return `${p < 0 ? "−" : ""}${Math.abs(p)}/${q}`; }
    return String(+x.toFixed(3)).replace("-", "−");
  }
  const n = (x, d = 3) => (Number.isFinite(x) ? String(+x.toFixed(d)).replace("-", "−") : "—").replace(/^−0$/, "0");
  const matStr = (A, f = frac) => `[${A.map((r) => r.map(f).join(", ")).join(" ; ")}]`;

  /* 2×2 실수 고윳값과 고유벡터. 복소수면 { complex: true } */
  function eig2(A) {
    const [[a, b], [c, d]] = A, tr = a + d, dt = a * d - b * c, D = tr * tr - 4 * dt;
    if (D < -EPS) return { complex: true, tr, det: dt };
    const s = Math.sqrt(Math.max(0, D)), l1 = (tr + s) / 2, l2 = (tr - s) / 2;
    const vec = (l) => {
      let v = Math.abs(b) > EPS ? [b, l - a] : Math.abs(c) > EPS ? [l - d, c] : (Math.abs(l - a) < EPS ? [1, 0] : [0, 1]);
      const L = Math.hypot(...v); return [v[0] / L, v[1] / L];
    };
    return { complex: false, vals: [l1, l2], vecs: [vec(l1), vec(l2)], tr, det: dt };
  }

  /* 2차원 좌표판: 상자 box = {x, y, w, h}, 보이는 반지름 R (가로세로 같은 축척). 반환: P(x, y) → 화면, inv(px, py) → 좌표 */
  function plane(ctx, box, R, o = {}) {
    const s = Math.min(box.w, box.h) / (2 * R), cx = box.x + box.w / 2 + (o.ox || 0) * s, cy = box.y + box.h / 2 - (o.oy || 0) * s;
    const P = (x, y) => [cx + x * s, cy - y * s];
    if (!o.bare) {
      ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip();
      ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
      const K = Math.ceil(R + Math.abs(o.ox || 0) + Math.abs(o.oy || 0)) + 1;
      for (let k = -K; k <= K; k++) { ctx.beginPath(); ctx.moveTo(...P(k, -K)); ctx.lineTo(...P(k, K)); ctx.moveTo(...P(-K, k)); ctx.lineTo(...P(K, k)); ctx.stroke(); }
      ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.moveTo(...P(-K, 0)); ctx.lineTo(...P(K, 0)); ctx.moveTo(...P(0, -K)); ctx.lineTo(...P(0, K)); ctx.stroke();
      ctx.restore();
    }
    return { P, s, cx, cy, inv: (px, py) => [(px - cx) / s, (cy - py) / s] };
  }
  /* 행렬 M으로 변환한 격자: 단위 정사각형을 칠하고 e₁, e₂의 상을 화살표로 */
  function grid(ctx, box, pl, M, o = {}) {
    const { P } = pl, K = o.K || 8, img = (x, y) => mv(M, [x, y]);
    ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip();
    ctx.strokeStyle = o.color || "rgba(63,111,163,.45)"; ctx.lineWidth = 1;
    for (let k = -K; k <= K; k++) {
      ctx.beginPath(); ctx.moveTo(...P(...img(k, -K))); ctx.lineTo(...P(...img(k, K))); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(...P(...img(-K, k))); ctx.lineTo(...P(...img(K, k))); ctx.stroke();
    }
    if (o.square !== false) {
      const d = det(M);
      ctx.fillStyle = d >= 0 ? "rgba(116,171,102,.35)" : "rgba(212,73,58,.3)";
      ctx.beginPath(); [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(([x, y], i) => (i ? ctx.lineTo(...P(...img(x, y))) : ctx.moveTo(...P(...img(x, y))))); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    if (o.axes !== false) {
      NMPm.arrow(ctx, ...P(0, 0), ...P(...img(1, 0)), C.warn, 2.6);
      NMPm.arrow(ctx, ...P(0, 0), ...P(...img(0, 1)), C.forest, 2.6);
    }
  }
  /* 다각형(점 목록)을 변환해 그리기 */
  function shape(ctx, pl, pts, M, fill, stroke) {
    const q = pts.map((p) => pl.P(...(M ? mv(M, p) : p)));
    ctx.save(); ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.restore();
  }
  /* 집 모양(비대칭이라 뒤집힘·회전이 잘 보임) */
  const HOUSE = [[0, 0], [1, 0], [1, 1], [0.5, 1.6], [0, 1], [0, 0.2], [-0.3, 0.2], [-0.3, 0]];

  /* 행렬 표 HTML(첨가행렬이면 bar = 세로줄 앞 열 수) */
  function table(A, o = {}) {
    const f = o.f || frac;
    return `<table class="lin-m">${A.map((r, i) => `<tr${o.hiRow === i ? ' class="hi"' : ""}>${r.map((x, j) => `<td${o.bar && j === o.bar ? ' class="bar"' : ""}>${f(x)}</td>`).join("")}</tr>`).join("")}</table>`;
  }

  return { EPS, mul, mv, T, eye, det, inv, rref, relation, dot, norm, add, sub, scl, frac, n, matStr, eig2, plane, grid, shape, HOUSE, table };
})();
