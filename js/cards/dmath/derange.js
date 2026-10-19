/* 카드: 모자를 섞어 돌려주면 아무도 제 것을 못 받을 확률은? — 무작위 순열 시행과 Dₙ/n! → 1/e */
(() => {
  const root = document.getElementById("card-dmath-derange");
  if (!root) return;
  const { F, fit } = NM;
  const D = NMDm;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), COLS = ["#b5532f", "#3b7c2a", "#3f6fa3", "#7b5ea7", "#e0a02a", "#2a9d8f", "#d4493a", "#5d5d61", "#8b5a2b", "#c2185b", "#00838f", "#6d8b2b"];
  let n = 6, last = null, trials = 0, hits = 0, hist = [];
  const { ctx, size } = fit($("canvas"), () => draw());
  const exact = (k) => { let s = 0, f = 1; for (let i = 0; i <= k; i++) { if (i) f *= i; s += (i % 2 ? -1 : 1) / f; } return s; };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
    const top = h * 0.36, cw = Math.min(42, (w - 20) / n);
    ctx.font = `600 11px ${F.sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let i = 0; i < n; i++) {
      const x = w / 2 + (i - (n - 1) / 2) * cw;
      ctx.fillStyle = COLS[i]; ctx.fillRect(x - cw * 0.35, top * 0.62, cw * 0.7, top * 0.28); // 사람
      ctx.fillStyle = "#fff"; ctx.fillText(i + 1, x, top * 0.76);
      if (last) { ctx.fillStyle = COLS[last[i]]; ctx.beginPath(); ctx.moveTo(x - cw * 0.32, top * 0.58); ctx.lineTo(x + cw * 0.32, top * 0.58); ctx.lineTo(x, top * 0.18); ctx.closePath(); ctx.fill(); if (last[i] === i) { ctx.strokeStyle = "#d4493a"; ctx.lineWidth = 3; ctx.strokeRect(x - cw * 0.42, top * 0.12, cw * 0.84, top * 0.84); } }
    }
    // 비율 그래프
    const L = 40, R = 10, T = top + 14, B = 22, X = (k) => L + (k / Math.max(1, hist.length - 1)) * (w - L - R), Y = (v) => T + (1 - v / 0.7) * (h - T - B);
    ctx.strokeStyle = "#d9dad2"; ctx.lineWidth = 1; ctx.fillStyle = "#5d5d61"; ctx.textAlign = "right"; ctx.font = `11px ${F.mono}`;
    [0, 0.2, 0.4, 0.6].forEach((v) => { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(w - R, Y(v)); ctx.stroke(); ctx.fillText(v.toFixed(1), L - 4, Y(v)); });
    ctx.setLineDash([6, 4]); ctx.strokeStyle = "#3b7c2a"; ctx.beginPath(); ctx.moveTo(L, Y(1 / Math.E)); ctx.lineTo(w - R, Y(1 / Math.E)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#3b7c2a"; ctx.textAlign = "left"; ctx.fillText("1/e", L + 4, Y(1 / Math.E) - 8);
    if (hist.length > 1) { ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 2; ctx.beginPath(); hist.forEach((v, k) => (k ? ctx.lineTo(X(k), Y(v)) : ctx.moveTo(X(k), Y(v)))); ctx.stroke(); }
  }
  function trial() { last = D.shuffle([...Array(n).keys()]); trials++; if (last.every((v, i) => v !== i)) hits++; }
  function update() {
    $(".n-out").textContent = n;
    const p = exact(n);
    $(".say").textContent = `${trials}번 중 아무도 제 것을 못 받은 경우 ${hits}번 (비율 ${trials ? D.n(hits / trials, 4) : "—"}) · 이론값 D${n}/${n}! = ${D.n(p, 4)} · 1/e = ${D.n(1 / Math.E, 4)}` + (last ? ` · 마지막 시행: ${last.some((v, i) => v === i) ? "제 모자를 받은 사람 있음(빨간 테두리)" : "아무도 못 받음"}` : "");
    draw();
  }
  function table() {
    let rows = "<tr><th>n</th><th>n!</th><th>Dₙ</th><th>Dₙ/n!</th></tr>", Dm2 = 1n, Dm1 = 0n;
    for (let k = 1; k <= 10; k++) { const Dk = k === 1 ? 0n : BigInt(k - 1) * (Dm1 + Dm2); if (k > 1) { Dm2 = Dm1; Dm1 = Dk; } rows += `<tr><td>${k}</td><td>${D.big(D.fact(k))}</td><td>${D.big(Dk)}</td><td>${D.n(exact(k), 5)}</td></tr>`; }
    $(".st").innerHTML = rows;
  }
  $(".go-1").addEventListener("click", () => { trial(); hist.push(hits / trials); update(); });
  $(".go-1000").addEventListener("click", () => { for (let k = 0; k < 1000; k++) { trial(); if (k % 20 === 19) hist.push(hits / trials); } update(); });
  const reset = () => { trials = hits = 0; hist = []; last = null; update(); };
  $(".go-reset").addEventListener("click", reset);
  nIn.addEventListener("input", () => { n = +nIn.value; reset(); });
  table(); update();
})();
