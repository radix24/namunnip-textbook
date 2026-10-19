/* 카드: 세 집합을 합칠 때 왜 더하고 빼고 다시 더할까? — 벤 다이어그램 영역별로 센 횟수 배지 */
(() => {
  const root = document.getElementById("card-dmath-venn-count");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  /* 영역: 비트 마스크 1=A, 2=B, 4=C (1~7) */
  let cnt = { 1: 6, 2: 5, 3: 2, 4: 4, 5: 3, 6: 1, 7: 2 }, stage = 0, geo = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const bits = (m) => (m & 1) + ((m >> 1) & 1) + ((m >> 2) & 1);
  /* 단계까지 센 횟수: ① 소속 집합 수 k, ② − C(k,2), ③ + C(k,3) */
  const times = (m) => { const k = bits(m); return [0, k, k - (k * (k - 1)) / 2, k - (k * (k - 1)) / 2 + (k === 3 ? 1 : 0)][stage]; };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const r = Math.min(w, h) * 0.26, cx = w / 2, cy = h / 2 + r * 0.12;
    const cen = [[cx - r * 0.55, cy - r * 0.35], [cx + r * 0.55, cy - r * 0.35], [cx, cy + r * 0.5]];
    geo = { cen, r };
    const fills = ["rgba(181,83,47,.16)", "rgba(59,124,42,.16)", "rgba(63,111,163,.16)"], strokes = [C.warn, C.forest, "#3f6fa3"];
    cen.forEach((c, i) => { ctx.beginPath(); ctx.arc(...c, r, 0, 7); ctx.fillStyle = fills[i]; ctx.fill(); ctx.strokeStyle = strokes[i]; ctx.lineWidth = 2; ctx.stroke(); });
    ctx.font = `700 15px ${F.sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    [["A", cen[0][0] - r * 0.75, cen[0][1] - r * 0.75], ["B", cen[1][0] + r * 0.75, cen[1][1] - r * 0.75], ["C", cen[2][0], cen[2][1] + r * 1.12]].forEach(([t, x, y], i) => { ctx.fillStyle = strokes[i]; ctx.fillText(t, x, y); });
    regionPts().forEach(([m, x, y]) => {
      ctx.fillStyle = C.ink; ctx.font = `700 16px ${F.sans}`; ctx.fillText(cnt[m], x, y);
      if (stage) {
        const t = times(m);
        ctx.beginPath(); ctx.arc(x + 15, y - 13, 9, 0, 7); ctx.fillStyle = t === 1 ? C.forest : C.warn; ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = `700 11px ${F.sans}`; ctx.fillText(t, x + 15, y - 13);
      }
    });
  }
  function regionPts() {
    const { cen, r } = geo, [a, b, c] = cen, mid = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
    const away = (p, s) => [p[0] + (p[0] - mid[0]) * s, p[1] + (p[1] - mid[1]) * s];
    const m2 = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    return [[1, ...away(a, 1.0)], [2, ...away(b, 1.0)], [4, ...away(c, 1.0)], [3, ...away(m2(a, b), 0.9)], [5, ...away(m2(a, c), 0.9)], [6, ...away(m2(b, c), 0.9)], [7, ...mid]].map(([m, x, y]) => [m, x, y + (m === 4 ? r * 0.05 : 0)]);
  }
  function update() {
    root.querySelectorAll("[data-s]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.s === stage)));
    const S = (f) => Object.keys(cnt).reduce((s, m) => s + (f(+m) ? cnt[m] : 0), 0);
    const nA = S((m) => m & 1), nB = S((m) => m & 2), nC = S((m) => m & 4), nAB = S((m) => (m & 3) === 3), nBC = S((m) => (m & 6) === 6), nCA = S((m) => (m & 5) === 5), nABC = cnt[7];
    const union = S(() => true);
    const terms = [`${nA} + ${nB} + ${nC} = ${nA + nB + nC}`, `${nA + nB + nC} − (${nAB} + ${nBC} + ${nCA}) = ${nA + nB + nC - nAB - nBC - nCA}`, `${nA + nB + nC - nAB - nBC - nCA} + ${nABC} = ${nA + nB + nC - nAB - nBC - nCA + nABC}`];
    $(".say").textContent = (stage ? `${terms[stage - 1]} · ` : "") + `실제 합집합의 원소 수 ${union}`;
    draw();
  }
  root.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => { stage = +b.dataset.s; update(); }));
  $(".go-new").addEventListener("click", () => { Object.keys(cnt).forEach((m) => (cnt[m] = 1 + Math.floor(Math.random() * 7))); update(); });
  cv.addEventListener("click", (e) => {
    if (!geo) return; const b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
    let m = 0; geo.cen.forEach((c, i) => { if (Math.hypot(x - c[0], y - c[1]) < geo.r) m |= 1 << i; });
    if (m) { cnt[m] = Math.min(20, cnt[m] + 1); update(); }
  });
  update();
})();
