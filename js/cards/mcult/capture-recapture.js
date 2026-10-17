/* 카드: 연못의 물고기를 모두 잡지 않고 셀 수 있을까? — 표지 재포획법 N ≈ MC/R, 가상 연못 */
(() => {
  const root = document.getElementById("card-mcult-capture-recapture");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const mIn = $(".m"), cIn = $(".c");
  let N = 0, fish = [], last = null, ests = [], shown = false;
  function newPond() { N = 150 + Math.floor(Math.random() * 350); fish = Array.from({ length: N }, () => [Math.random(), Math.random()]); last = null; ests = []; shown = false; }
  /* C마리를 비복원 추출해 표시된 수 R을 셈(처음 M마리를 표시, 고루 섞였다고 가정) */
  function survey() {
    const M = Math.min(+mIn.value, N), Cn = Math.min(+cIn.value, N), idx = Array.from({ length: N }, (_, i) => i);
    for (let i = 0; i < Cn; i++) { const j = i + Math.floor(Math.random() * (N - i)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    const caught = idx.slice(0, Cn), R = caught.filter((i) => i < M).length;
    return { M, Cn, R, caught, est: R ? (M * Cn) / R : Infinity };
  }
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pw = w * 0.48, M = +mIn.value, caught = new Set(last ? last.caught : []);
    ctx.fillStyle = "rgba(111,159,200,.18)"; ctx.beginPath(); ctx.ellipse(pw / 2, h / 2, pw / 2 - 4, h / 2 - 4, 0, 0, 7); ctx.fill();
    fish.forEach(([u, v], i) => {
      const a = 2 * Math.PI * u, rr = Math.sqrt(v) * 0.92, x = pw / 2 + (pw / 2 - 8) * rr * Math.cos(a), y = h / 2 + (h / 2 - 8) * rr * Math.sin(a);
      ctx.fillStyle = i < M ? C.warn : "#5d7d9a"; ctx.globalAlpha = last && !caught.has(i) ? 0.3 : 1;
      ctx.beginPath(); ctx.arc(x, y, caught.has(i) ? 3.2 : 2.2, 0, 7); ctx.fill();
    });
    ctx.globalAlpha = 1;
    const x0 = pw + 30, x1 = w - 20, y0 = h - 32, y1 = 12, LO = 0, HI = 1000, X = (v) => x0 + ((x1 - x0) * (v - LO)) / (HI - LO);
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
    ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "center"; [0, 250, 500, 750, 1000].forEach((v) => ctx.fillText(String(v), X(v), y0 + 13));
    ctx.font = `11px ${F.sans}`; ctx.fillText("추정값 MC/R 분포", (x0 + x1) / 2, h - 2);
    if (ests.length) {
      const bins = new Array(40).fill(0); ests.forEach((e) => { const b = Math.min(39, Math.floor(e / 25)); bins[b]++; });
      const mx = Math.max(...bins), bw = (x1 - x0) / 40;
      ctx.fillStyle = "rgba(116,171,102,.7)"; bins.forEach((c, b) => { const bh = ((y0 - y1) * c) / mx; ctx.fillRect(x0 + b * bw + 0.5, y0 - bh, bw - 1, bh); });
    }
    if (shown) { ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(N), y1); ctx.lineTo(X(N), y0); ctx.stroke(); ctx.fillStyle = C.warn; ctx.textAlign = "left"; ctx.fillText(`실제 ${N}`, Math.min(X(N) + 4, x1 - 50), y1 + 10); }
  }
  let msg = "";
  function say(extra) {
    if (extra !== undefined) msg = extra;
    $(".m-out").textContent = mIn.value; $(".c-out").textContent = cIn.value;
    $(".say").textContent = (msg || "빨간 점은 표시한 물고기입니다.") + (shown ? ` · 실제 ${N}마리` : "");
  }
  $(".once").addEventListener("click", () => { last = survey(); say(`다시 잡은 ${last.Cn}마리 중 표시 R = ${last.R}마리 → N ≈ ${last.M}×${last.Cn}/${last.R} = ${isFinite(last.est) ? last.est.toFixed(0) : "계산 불가(R = 0)"}`); draw(); });
  $(".many").addEventListener("click", () => {
    const res = Array.from({ length: 100 }, survey), ok = res.filter((r) => isFinite(r.est)).map((r) => r.est).sort((a, b) => a - b);
    ests = ok; last = res[99];
    if (!ok.length) { say("100번 모두 표시된 물고기가 잡히지 않아(R = 0) 추정할 수 없습니다. M이나 C를 늘려 보세요."); draw(); return; }
    say(`100번 조사: 가운데값 ${ok[Math.floor(ok.length / 2)].toFixed(0)}, 가운데 80%가 ${ok[Math.floor(ok.length * 0.1)].toFixed(0)}~${ok[Math.floor(ok.length * 0.9)].toFixed(0)} 사이${ok.length < 100 ? ` (R = 0인 조사 ${100 - ok.length}번 제외)` : ""}`); draw();
  });
  $(".reveal").addEventListener("click", () => { shown = true; say(); draw(); });
  $(".newpond").addEventListener("click", () => { newPond(); say(""); draw(); });
  [mIn, cIn].forEach((x) => x.addEventListener("input", () => { last = null; ests = []; say(""); draw(); }));
  newPond(); say();
})();
