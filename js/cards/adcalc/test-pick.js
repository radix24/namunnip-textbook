/* 카드: 이 급수에는 어떤 판정법이 통할까? — 여섯 급수의 판정법과 결론 고르기, 부분합 그래프 */
(() => {
  const root = document.getElementById("card-adcalc-test-pick");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const verdict = $(".verdict"), NMAX = 100000;
  const lnf = (k) => { let s = 0; for (let i = 2; i <= k; i++) s += Math.log(i); return s; };
  const Q = [
    { a: (k) => 1 / (k * k + 1), conv: 1, ok: ["cmp", "lim", "int"], why: "1/(n² + 1) < 1/n²이고 Σ1/n²이 수렴합니다." },
    { a: (k) => k / 2 ** k, conv: 1, ok: ["ratio", "root"], why: "a(n+1)/a(n) = (n + 1)/(2n) → 1/2 < 1입니다." },
    { a: (k) => k * k / (k ** 3 + 1), conv: 0, ok: ["lim", "cmp", "int"], why: "a(n) ÷ (1/n) → 1이고 Σ1/n이 발산합니다." },
    { a: (k) => Math.exp(lnf(k) - k * Math.log(k)), conv: 1, ok: ["ratio", "cmp"], why: "a(n+1)/a(n) = (n/(n + 1))ⁿ → 1/e < 1입니다." },
    { a: (k) => (k / (2 * k + 1)) ** k, conv: 1, ok: ["root", "cmp"], why: "ⁿ√a(n) = n/(2n + 1) → 1/2 < 1입니다." },
    { a: (k) => (k < 2 ? 0 : 1 / (k * Math.log(k))), conv: 0, ok: ["int"], why: "∫ dx/(x ln x) = ln(ln x) → ∞입니다." },
  ];
  const NOTE = {
    ratio: "비판정법의 극한이 1이라 판정할 수 없습니다.", root: "근판정법의 극한이 1이라 판정할 수 없습니다.",
    int: "적분하기 어려운 함수라 이 판정법은 불편합니다.", cmp: "알맞은 비교 대상을 찾기 어렵습니다. 다른 판정법을 생각해 보세요.", lim: "극한비교할 알맞은 급수를 찾기 어렵습니다.",
  };
  let qk = 0, test = null;
  const solved = new Set(), cache = {};
  const { ctx, size } = fit($("canvas"), () => draw());
  function partial(k) {
    if (cache[k]) return cache[k];
    const q = Q[k], pts = []; let s = 0, next = 1;
    // 계승 꼴은 로그를 누적해 계산
    let lf = 0;
    for (let i = 1; i <= NMAX; i++) {
      let v;
      if (k === 3) { lf += Math.log(i); v = Math.exp(lf - i * Math.log(i)); } else v = q.a(i);
      s += v;
      if (i >= next || i === NMAX) { pts.push([i, s]); next = Math.ceil(i * 1.08) + 1; }
    }
    return (cache[k] = pts);
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const L = 36, T = 10, W = w - L - 10, H = h - T - 24;
    if (!solved.has(qk)) {
      ctx.fillStyle = C.rule; ctx.fillRect(L, T, W, H);
      label(ctx, "판정을 마치면 부분합 그래프가 나타납니다", L + W / 2, T + H / 2, C.ink2, "center", `12px ${F.sans}`);
      return;
    }
    const pts = partial(qk), ymax = Math.max(1, pts[pts.length - 1][1]) * 1.1;
    const X = (i) => L + Math.log10(i) / 5 * W, Y = (v) => T + H - v / ymax * H;
    const st = ymax > 6 ? 2 : ymax > 2.5 ? 1 : 0.5, yt = []; for (let v = 0; v <= ymax; v += st) yt.push([v, n(v, 1)]);
    NM.axes(ctx, { x0: L, y0: T, w: W, h: H, X, Y, xt: [1, 10, 100, 1000, 10000, 100000].map((v) => [v, v >= 1000 ? `10${["", "", "", "³", "⁴", "⁵"][Math.log10(v)]}` : String(v)]), yt });
    ctx.strokeStyle = Q[qk].conv ? C.forest : C.warn; ctx.lineWidth = 2.2; ctx.beginPath();
    pts.forEach(([i, s], j) => (j ? ctx.lineTo(X(i), Y(s)) : ctx.moveTo(X(i), Y(s)))); ctx.stroke();
    label(ctx, `부분합 S(n) — ${Q[qk].conv ? "수렴" : "발산"}`, L + 6, T + 10, Q[qk].conv ? C.forest : C.warn, "left", `600 11px ${F.sans}`);
  }
  function nums() {
    $(".n-s").textContent = `${solved.size} / 6`;
    if (solved.has(qk)) { const p = partial(qk); $(".n-1").textContent = n(p.find(([i]) => i >= 100)[1], 4); $(".n-2").textContent = n(p[p.length - 1][1], 4); }
    else { $(".n-1").textContent = "?"; $(".n-2").textContent = "?"; }
    draw();
  }
  root.querySelectorAll(".tests .chip").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll(".tests .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    test = b.dataset.t;
    const ok = Q[qk].ok.includes(test);
    verdict.textContent = ok ? "통하는 판정법입니다. 이제 결론을 고르세요." : NOTE[test];
    verdict.className = "verdict" + (ok ? "" : " bad");
  }));
  root.querySelectorAll(".vd .chip").forEach((b) => b.addEventListener("click", () => {
    const q = Q[qk];
    if (!test || !q.ok.includes(test)) { verdict.textContent = "먼저 통하는 판정법을 고르세요."; verdict.className = "verdict bad"; return; }
    const ok = +b.dataset.v === q.conv;
    verdict.textContent = ok ? `맞습니다. ${q.why}` : `결론이 반대입니다. ${q.why}`;
    verdict.className = "verdict " + (ok ? "good" : "bad");
    if (ok) { solved.add(qk); root.querySelector(`.qs .chip[data-q="${qk}"]`).dataset.ok = "1"; }
    nums();
  }));
  root.querySelectorAll(".qs .chip").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll(".qs .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    qk = +b.dataset.q; test = null; root.querySelectorAll(".tests .chip").forEach((x) => x.setAttribute("aria-pressed", "false"));
    verdict.textContent = ""; verdict.className = "verdict"; nums();
  }));
  nums();
})();
