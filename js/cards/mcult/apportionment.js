/* 카드: 전체 의석을 늘렸는데 어떤 지역은 줄어들 수 있을까? — 최대 나머지(해밀턴)와 동트, 앨라배마 역설 */
(() => {
  const root = document.getElementById("card-mcult-apportionment");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const sIn = $(".s"), pIns = [...root.querySelectorAll("[data-r]")], NAME = ["가", "나", "다"], SMIN = 3, SMAX = 30;
  const pops = () => pIns.map((x) => Math.max(1, +x.value || 1));
  function hamilton(p, s) {
    const T = p.reduce((a, b) => a + b, 0), q = p.map((v) => (s * v) / T), a = q.map(Math.floor);
    let left = s - a.reduce((x, y) => x + y, 0);
    q.map((v, i) => [v - Math.floor(v), i]).sort((x, y) => y[0] - x[0] || x[1] - y[1]).forEach(([, i]) => { if (left > 0) { a[i]++; left--; } });
    return a;
  }
  function dhondt(p, s) {
    const a = p.map(() => 0);
    for (let k = 0; k < s; k++) { let b = 0; p.forEach((v, i) => { if (v / (a[i] + 1) > p[b] / (a[b] + 1)) b = i; }); a[b]++; }
    return a;
  }
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = pops(), r = p.indexOf(Math.min(...p)), T = p.reduce((a, b) => a + b, 0), s0 = +sIn.value;
    const hs = [], ds = []; for (let s = SMIN; s <= SMAX; s++) { hs.push(hamilton(p, s)[r]); ds.push(dhondt(p, s)[r]); }
    const ymax = Math.max(...hs, ...ds, (SMAX * p[r]) / T) + 1, L = 28, R = 10, T0 = 10, B = 28;
    const X = (s) => L + ((w - L - R) * (s - SMIN)) / (SMAX - SMIN), Y = (v) => T0 + (h - T0 - B) * (1 - v / ymax);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2;
    for (let v = 0; v <= ymax; v += Math.max(1, Math.round(ymax / 4))) { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(w - R, Y(v)); ctx.stroke(); ctx.textAlign = "right"; ctx.fillText(String(v), L - 4, Y(v) + 4); }
    [5, 10, 15, 20, 25, 30].forEach((s) => { ctx.textAlign = "center"; ctx.fillText(String(s), X(s), h - B + 14); });
    ctx.font = `11px ${F.sans}`; ctx.fillText(`전체 의석 · ${NAME[r]} 지역(인구 최소)이 받는 의석`, (L + w - R) / 2, h - 3);
    ctx.setLineDash([4, 4]); ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.moveTo(X(SMIN), Y((SMIN * p[r]) / T)); ctx.lineTo(X(SMAX), Y((SMAX * p[r]) / T)); ctx.stroke(); ctx.setLineDash([]);
    const step = (arr, col, off) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); arr.forEach((v, i) => { const x = X(SMIN + i), y = Y(v) + off; i ? (ctx.lineTo(x, Y(arr[i - 1]) + off), ctx.lineTo(x, y)) : ctx.moveTo(x, y); }); ctx.stroke(); };
    step(ds, C.forest, 2); step(hs, "#3f6fa3", -2);
    hs.forEach((v, i) => { if (i && v < hs[i - 1]) { ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(X(SMIN + i), Y(v) - 2, 5, 0, 7); ctx.fill(); } });
    ctx.strokeStyle = C.warn; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(s0), T0); ctx.lineTo(X(s0), h - B); ctx.stroke();
    ctx.font = `11px ${F.sans}`; ctx.textAlign = "left";
    const lx = w - R - 180, ly = h - B - 8;   // 범례: 오른쪽 아래(선이 높아 비어 있는 곳)
    ctx.fillStyle = "#3f6fa3"; ctx.fillText("최대 나머지", lx, ly); ctx.fillStyle = C.forest; ctx.fillText("동트", lx + 80, ly); ctx.fillStyle = C.ink3; ctx.fillText("몫(점선)", lx + 118, ly);
  }
  function update() {
    const p = pops(), s = +sIn.value, T = p.reduce((a, b) => a + b, 0), hm = hamilton(p, s), dh = dhondt(p, s), prev = s > SMIN ? hamilton(p, s - 1) : null;
    $(".s-out").textContent = s;
    $("table").innerHTML = `<tr><th>지역</th><th>인구</th><th>몫</th><th>최대 나머지</th><th>동트</th></tr>`
      + p.map((v, i) => `<tr><td>${NAME[i]}</td><td>${v}</td><td>${((s * v) / T).toFixed(3)}</td><td>${hm[i]}${prev && hm[i] < prev[i] ? " ▼" : ""}</td><td>${dh[i]}</td></tr>`).join("");
    const lost = prev ? hm.map((v, i) => (v < prev[i] ? NAME[i] : "")).filter(Boolean) : [];
    $(".say").textContent = lost.length ? `앨라배마 역설: ${s - 1}석 → ${s}석으로 늘렸는데 최대 나머지 방식에서 ${lost.join(", ")} 지역이 줄었습니다(▼).` : `${s - 1}석 → ${s}석: 줄어든 지역이 없습니다. 빨간 점이 역설이 생기는 의석 수입니다.`;
    draw();
  }
  [sIn, ...pIns].forEach((x) => x.addEventListener("input", update));
  update();
})();
