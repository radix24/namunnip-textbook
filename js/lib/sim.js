/* 공용 반복 시행 도구 window.NMSim — 실행 버튼 묶음, 막대그래프, 상대도수 추이, 분포 계산.
   블록 머리 scripts에서 카드 스크립트보다 먼저 적는다: ["js/lib/sim.js", "js/cards/…"]
   실행 버튼 마크업: <div class="sim-btns"><button class="chip" data-sim="1">1번</button><button class="chip" data-sim="100">100번</button>
                     <button class="chip go" data-sim="auto">계속 실행</button><button class="chip" data-sim="reset">처음부터</button></div> */
window.NMSim = (() => {
  "use strict";
  const { C, F, axes } = NM;

  /* 실행 버튼을 잇는다. o: { trial(k): k번 시행, draw(), reset(), rate: 계속 실행 때 초당 시행 수(기본 60), max: 자동 정지 횟수 }
     trial은 몇 번 했는지 스스로 세지 않아도 된다. runner가 n을 센다. */
  function runner(root, o) {
    const btns = root.querySelector(".sim-btns");
    const auto = btns.querySelector('[data-sim="auto"]');
    let n = 0, on = false, raf = 0, last = 0, acc = 0;
    const max = o.max || Infinity;
    const run = (k) => { k = Math.min(k, max - n); if (k <= 0) { stop(); return; } o.trial(k); n += k; o.draw(); };
    function frame(t) {
      if (!on) return;
      const dt = Math.min(0.1, (t - last) / 1000); last = t;
      acc += dt * (o.rate || 60);
      const k = Math.floor(acc); acc -= k;
      if (k) run(k);
      if (n >= max) { stop(); return; }
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      on = false; cancelAnimationFrame(raf);
      if (auto) { auto.setAttribute("aria-pressed", "false"); auto.textContent = "계속 실행"; }
    }
    btns.addEventListener("click", (e) => {
      const b = e.target.closest("[data-sim]"); if (!b) return;
      const v = b.dataset.sim;
      if (v === "auto") {
        if (on) { stop(); return; }
        on = true; last = performance.now(); acc = 0; b.setAttribute("aria-pressed", "true"); b.textContent = "멈춤";
        raf = requestAnimationFrame(frame);
      } else if (v === "reset") { stop(); n = 0; o.reset(); o.draw(); }
      else { stop(); run(+v); }
    });
    // 화면 밖으로 나가면 멈춘다 (배터리)
    new IntersectionObserver(([en]) => { if (!en.isIntersecting && on) stop(); }).observe(root);
    return { get n() { return n; }, stop, run };
  }

  /* 막대그래프. box: {x0, y0, w, h}. counts: 막대 높이 배열(횟수 또는 확률).
     o: { labels: 막대 아래 글자, expect: 기대 높이 배열(점선 표시), top: 세로 최대, color, hi: 강조할 막대 번호 집합, ylabel, yfmt } */
  function bars(ctx, box, counts, o = {}) {
    const k = counts.length, top = o.top || Math.max(1e-9, ...counts, ...(o.expect || [0])) * 1.08;
    const bw = box.w / k, Y = (v) => box.y0 + box.h - v / top * box.h;
    const yt = niceTicks(0, top, 3).map((v) => [v, o.yfmt ? o.yfmt(v) : fmtTick(v)]);
    axes(ctx, { x0: box.x0, y0: box.y0, w: box.w, h: box.h, X: (v) => v, Y, xt: [], yt, ylabel: o.ylabel });
    ctx.save();
    counts.forEach((c, i) => {
      const x = box.x0 + i * bw, hot = o.hi && o.hi.has(i);
      ctx.fillStyle = hot ? (o.hiColor || C.warn) : (o.color || C.sprout);
      ctx.fillRect(x + bw * 0.12, Y(c), bw * 0.76, box.y0 + box.h - Y(c));
    });
    if (o.expect) {
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]);
      o.expect.forEach((e, i) => { const x = box.x0 + i * bw; ctx.beginPath(); ctx.moveTo(x + bw * 0.06, Y(e)); ctx.lineTo(x + bw * 0.94, Y(e)); ctx.stroke(); });
      ctx.setLineDash([]);
    }
    if (o.labels) {
      ctx.font = `10.5px ${F.mono}`; ctx.fillStyle = C.ink3; ctx.textAlign = "center";
      const every = Math.ceil(k / Math.max(1, Math.floor(box.w / 26)));
      o.labels.forEach((l, i) => { if (i % every === 0) ctx.fillText(l, box.x0 + (i + 0.5) * bw, box.y0 + box.h + 14); });
    }
    ctx.restore();
    return { Y, bw, top };
  }

  /* 상대도수 추이: series = [[시행 수, 비율], …]. o: { target: 수렴할 값(가로 점선), yr: [lo, hi], color, xlabel, ylabel } */
  function trend(ctx, box, series, o = {}) {
    const nmax = Math.max(10, series.length ? series[series.length - 1][0] : 10);
    const [lo, hi] = o.yr || [0, 1];
    const lx = (v) => Math.log10(Math.max(1, v)), L = lx(nmax) || 1;
    const X = (v) => box.x0 + lx(v) / L * box.w, Y = (v) => box.y0 + (hi - v) / (hi - lo) * box.h;
    const xt = [1, 10, 100, 1000, 10000, 100000].filter((v) => v <= nmax).map((v) => [v, v >= 1000 ? `${v / 1000}천` : String(v)]);
    axes(ctx, { x0: box.x0, y0: box.y0, w: box.w, h: box.h, X, Y, xt, yt: niceTicks(lo, hi, 4).map((v) => [v, fmtTick(v)]), xlabel: o.xlabel || "시행 횟수(로그 눈금)", ylabel: o.ylabel });
    ctx.save(); ctx.beginPath(); ctx.rect(box.x0, box.y0, box.w, box.h); ctx.clip();
    if (o.target != null) {
      ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.2; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(box.x0, Y(o.target)); ctx.lineTo(box.x0 + box.w, Y(o.target)); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.strokeStyle = o.color || C.forest; ctx.lineWidth = 2; ctx.beginPath();
    series.forEach(([t, v], i) => (i ? ctx.lineTo(X(t), Y(v)) : ctx.moveTo(X(t), Y(v))));
    ctx.stroke(); ctx.restore();
    return { X, Y };
  }
  /* 추이 기록: 시행 수가 늘어날 때 로그 간격으로만 점을 남긴다(점이 수만 개로 불어나지 않게) */
  function recorder() {
    const pts = []; let next = 1, tail = null;
    return {
      push(n, v) { tail = [n, v]; if (n >= next) { pts.push(tail); next = Math.ceil(n * 1.04) + 1; } },
      /* 그릴 점들: 남겨 둔 점 + 가장 최근 값 */
      get pts() { return tail && (!pts.length || pts[pts.length - 1] !== tail) ? pts.concat([tail]) : pts; },
      clear() { pts.length = 0; next = 1; tail = null; },
    };
  }

  function niceTicks(lo, hi, n) {
    const raw = (hi - lo) / n || 1, mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
    const out = [];
    for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-9; v += step) out.push(+v.toPrecision(10));
    return out;
  }
  const fmtTick = (v) => (Math.abs(v) >= 1e4 ? `${+(v / 1000).toPrecision(3)}천` : String(+v.toPrecision(4))).replace("-", "−");

  /* 분포 */
  function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  /* 표준 정규 누적분포 Φ(z) — erf 근사(Abramowitz–Stegun 7.1.26, 오차 1.5×10⁻⁷) */
  function phi(z) {
    const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2);
    return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
  }
  const npdf = (x, m = 0, s = 1) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
  /* 이항분포 P(X = k), X ~ B(n, p). 로그로 계산해 n이 커도 넘치지 않는다 */
  function binom(n, k, p) {
    if (k < 0 || k > n) return 0;
    if (p === 0) return k === 0 ? 1 : 0;
    if (p === 1) return k === n ? 1 : 0;
    let lc = 0; for (let i = 1; i <= k; i++) lc += Math.log(n - k + i) - Math.log(i);
    return Math.exp(lc + k * Math.log(p) + (n - k) * Math.log(1 - p));
  }
  const C_ = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };

  /* 수 표기: 소수 d자리, 음수는 − */
  const n = (v, d = 3) => (Number.isFinite(v) ? String(+v.toFixed(d)).replace("-", "−") : "—");
  const pct = (v, d = 1) => (Number.isFinite(v) ? `${(v * 100).toFixed(d)}%` : "—");

  return { runner, bars, trend, recorder, niceTicks, gauss, phi, npdf, binom, C: C_, n, pct };
})();
