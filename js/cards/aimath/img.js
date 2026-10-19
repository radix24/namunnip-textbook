/* 이미지 카드 공용 window.NMImg — 흑백 행렬(0~255) 만들기·그리기, 합성곱, 5×7 숫자 글꼴 */
window.NMImg = (() => {
  "use strict";
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  /* 수업용 가상 이미지 n×n: 비스듬한 밝기 + 밝은 원 + 어두운 네모 + 가로줄 */
  function sample(n = 24) {
    const M = [];
    for (let i = 0; i < n; i++) { const row = []; for (let j = 0; j < n; j++) {
      let v = 60 + (110 * (i + j)) / (2 * n);
      if ((i - n * 0.35) ** 2 + (j - n * 0.62) ** 2 < (n * 0.2) ** 2) v = 235;
      if (i > n * 0.58 && i < n * 0.85 && j > n * 0.12 && j < n * 0.42) v = 25;
      if (i === Math.round(n * 0.12)) v = 200;
      row.push(clamp(v));
    } M.push(row); }
    return M;
  }
  const map = (M, f) => M.map((r, i) => r.map((v, j) => f(v, i, j)));
  const T = (M) => M[0].map((_, j) => M.map((r) => r[j]));
  /* 합성곱(가장자리는 가장 가까운 값으로 채움) */
  function conv(M, K, k = 1, off = 0) {
    const n = M.length, m = M[0].length, h = (K.length - 1) / 2, at = (i, j) => M[Math.max(0, Math.min(n - 1, i))][Math.max(0, Math.min(m - 1, j))];
    return M.map((r, i) => r.map((_, j) => { let s = 0; for (let a = -h; a <= h; a++) for (let b = -h; b <= h; b++) s += K[a + h][b + h] * at(i + a, j + b); return clamp(s * k + off); }));
  }
  function draw(ctx, M, x, y, cell, grid = false, rgb = null) {
    M.forEach((r, i) => r.forEach((v, j) => { ctx.fillStyle = rgb ? `rgb(${rgb[0][i][j]},${rgb[1][i][j]},${rgb[2][i][j]})` : `rgb(${v},${v},${v})`; ctx.fillRect(x + j * cell, y + i * cell, cell + 0.5, cell + 0.5); }));
    if (grid) { ctx.save(); ctx.strokeStyle = "rgba(141,141,146,.45)"; ctx.lineWidth = 1; for (let k = 0; k <= M.length; k++) { ctx.beginPath(); ctx.moveTo(x, y + k * cell); ctx.lineTo(x + M[0].length * cell, y + k * cell); ctx.stroke(); } for (let k = 0; k <= M[0].length; k++) { ctx.beginPath(); ctx.moveTo(x + k * cell, y); ctx.lineTo(x + k * cell, y + M.length * cell); ctx.stroke(); } ctx.restore(); }
  }
  const DIGITS = ["01110100011001110101110011000101110", "00100011000010000100001000010001110", "01110100010000100010001000100011111", "11111000100010000010000011000101110", "00010001100101010010111110001000010", "11111100001111000001000011000101110", "00110010001000011110100011000101110", "11111000010001000100010000100001000", "01110100011000101110100011000101110", "01110100011000101111000010001001100"].map((s) => [...Array(7)].map((_, i) => [...s.slice(i * 5, i * 5 + 5)].map(Number)));
  return { clamp, sample, map, T, conv, draw, DIGITS };
})();
