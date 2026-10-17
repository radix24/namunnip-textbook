/* 쌓기나무 카드 공용 window.NMBlocks — 높이 격자(행 = 앞→뒤가 아니라 위에서 본 행, 0행이 뒤쪽)를 등각으로 그리고 세 방향 모습 구하기 */
window.NMBlocks = (() => {
  "use strict";
  /* H[r][c]: r = 0이 뒤쪽, 마지막 행이 앞쪽 / c = 0이 왼쪽 */
  const top = (H) => H.map((row) => row.map((h) => (h > 0 ? 1 : 0)));
  const front = (H) => H[0].map((_, c) => Math.max(...H.map((row) => row[c])));   // 앞에서 본 모습: 열마다 가장 높은 것
  const side = (H) => H.map((row) => Math.max(...row)).reverse();                 // 오른쪽에서 본 모습: 앞쪽 행이 왼쪽으로
  const count = (H) => H.flat().reduce((a, b) => a + b, 0);
  /* 등각 그림: 정육면체 한 개의 화면 크기 s */
  function iso(ctx, H, cx, cy, s, colTop = "#8fb8de", colL = "#5f8fbf", colR = "#3f6fa3") {
    const R = H.length, Cn = H[0].length;
    const P = (x, y, z) => [cx + (x - y) * s * 0.866, cy + (x + y) * s * 0.5 - z * s];
    const face = (pts, col) => { ctx.beginPath(); pts.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "rgba(35,35,38,.55)"; ctx.lineWidth = 1; ctx.stroke(); };
    /* x = 열, y = 행(0이 뒤) → 뒤쪽부터, 아래부터 그리기 */
    const cells = []; for (let r = 0; r < R; r++) for (let c = 0; c < Cn; c++) cells.push([r, c]);
    cells.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
    for (const [r, c] of cells) for (let z = 0; z < H[r][c]; z++) {
      const x = c, y = r;
      face([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], colTop);
      face([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], colL);
      face([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], colR);
    }
  }
  /* 칸 그림: cols 개의 막대 높이 또는 0/1 격자 */
  function bars(ctx, arr, x0, y0, s, maxH, col = "#3f6fa3") {
    arr.forEach((h, i) => { for (let z = 0; z < h; z++) { ctx.fillStyle = col; ctx.fillRect(x0 + i * s + 1, y0 + (maxH - 1 - z) * s + 1, s - 2, s - 2); } });
    ctx.strokeStyle = "rgba(141,141,146,.6)"; ctx.strokeRect(x0, y0, arr.length * s, maxH * s);
  }
  function grid01(ctx, G, x0, y0, s, col = "#3f6fa3") {
    G.forEach((row, r) => row.forEach((v, c) => { ctx.fillStyle = v ? col : "rgba(141,141,146,.12)"; ctx.fillRect(x0 + c * s + 1, y0 + r * s + 1, s - 2, s - 2); }));
  }
  return { top, front, side, count, iso, bars, grid01 };
})();
