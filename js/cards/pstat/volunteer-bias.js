/* 카드: 온라인 투표 vs 무작위 100명 — 자발적 응답의 편향 0.4a/(0.4a + 0.6b), 가상 학교 1만 명 */
(() => {
  const root = document.getElementById("card-pstat-volunteer-bias");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".a"), bIn = $(".b"), P = 0.4, POP = 10000;
  let rs = 0;
  const draw100 = () => { let k = 0; for (let i = 0; i < 100; i++) if (Math.random() < P) k++; rs = k / 100; };
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const a = +aIn.value / 100, b = +bIn.value / 100, on = (P * a) / (P * a + (1 - P) * b), nOn = Math.round(POP * (P * a + (1 - P) * b));
    const L = 150, R = 50, rowH = (h - 24) / 3, X = (v) => L + (w - L - R) * v;
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "center";
    [0, 0.25, 0.5, 0.75, 1].forEach((v) => { ctx.beginPath(); ctx.moveTo(X(v), 4); ctx.lineTo(X(v), h - 22); ctx.stroke(); ctx.fillText(`${v * 100}%`, X(v), h - 8); });
    const moe = 1.96 * Math.sqrt((rs * (1 - rs)) / 100);
    [["실제(1만 명 전체)", P, C.ink, null], [`온라인 투표(${nOn.toLocaleString("ko-KR")}명)`, on, C.warn, null], ["무작위 100명", rs, "#3f6fa3", moe]].forEach(([n, v, col, m], i) => {
      const y = 4 + i * rowH + rowH * 0.25, bh = rowH * 0.5;
      ctx.fillStyle = col; ctx.globalAlpha = 0.75; ctx.fillRect(X(0), y, X(v) - X(0), bh); ctx.globalAlpha = 1;
      if (m) { ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(v - m), y + bh / 2); ctx.lineTo(X(v + m), y + bh / 2); ctx.moveTo(X(v - m), y + 3); ctx.lineTo(X(v - m), y + bh - 3); ctx.moveTo(X(v + m), y + 3); ctx.lineTo(X(v + m), y + bh - 3); ctx.stroke(); }
      ctx.fillStyle = C.ink2; ctx.font = `12px ${F.sans}`; ctx.textAlign = "right"; ctx.fillText(n, L - 6, y + bh / 2 + 4);
      ctx.font = `11px ${F.mono}`; ctx.textAlign = "left"; ctx.fillText(`${(v * 100).toFixed(0)}%`, Math.min(X(Math.max(v, m ? v + m : v)) + 4, w - R + 4), y + bh / 2 + 4);
    });
    ctx.setLineDash([4, 3]); ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(P), 4); ctx.lineTo(X(P), h - 22); ctx.stroke(); ctx.setLineDash([]);
  }
  function update() {
    const a = +aIn.value / 100, b = +bIn.value / 100, on = (P * a) / (P * a + (1 - P) * b);
    $(".a-out").textContent = aIn.value; $(".b-out").textContent = bIn.value;
    $(".say").textContent = `온라인 투표 찬성률 = 0.4×${a.toFixed(2)} / (0.4×${a.toFixed(2)} + 0.6×${b.toFixed(2)}) = ${(on * 100).toFixed(1)}% · 무작위 100명 ${(rs * 100).toFixed(0)}% ± ${(196 * Math.sqrt((rs * (1 - rs)) / 100)).toFixed(1)}%p`;
    draw();
  }
  $(".again").addEventListener("click", () => { draw100(); update(); });
  [aIn, bIn].forEach((x) => x.addEventListener("input", update));
  draw100(); update();
})();
