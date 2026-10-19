/* 카드: 그리지 않고 이차곡선의 모양을 알 수 있을까? — 여섯 식을 고윳값의 부호로 분류 */
(() => {
  const root = document.getElementById("card-adalg-conic-classify");
  if (!root) return;
  const { fit } = NM;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  /* [a, b(=xy 계수의 절반), c, k] */
  const Q = [[1, 2, 1, 3], [5, -2, 8, 36], [0, 1, 0, 1], [1, -1, 1, 4], [3, 1, 3, -1], [13, -5, 13, 72]];
  const NAME = { ell: "타원", hyp: "쌍곡선", lines: "평행한 두 직선", none: "그래프 없음" };
  let i = 0, done = false;
  const next = $(".go-next"), verdict = $(".verdict");
  const { ctx, size } = fit($("canvas"), () => draw());
  const term = (k, s, first) => (Math.abs(k) < 1e-9 ? "" : `${first ? (k < 0 ? "−" : "") : k < 0 ? " − " : " + "}${Math.abs(k) === 1 ? "" : Math.abs(k)}${s}`);
  const eqStr = ([a, b, c, k]) => { let s = term(a, "x²", true); s += term(2 * b, "xy", !s); s += term(c, "y²", !s); return `${s} = ${k}`.replace("-", "−"); };
  function kind([a, b, c, k]) {
    let [l1, l2] = L.eig2([[a, b], [b, c]]).vals; if (k < 0) { [l1, l2] = [-l2, -l1]; }
    const E = 1e-9;
    return l1 > E && l2 > E ? "ell" : l1 * l2 < -E ? "hyp" : l1 > E ? "lines" : "none";
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    if (!done) return;
    const [a, b, c, k] = Q[i], R = 6, pl = L.plane(ctx, { x: 0, y: 0, w, h }, R), N = 220;
    // 부호가 바뀌는 칸에 점 찍기(음함수 그래프)
    const g = (x, y) => a * x * x + 2 * b * x * y + c * y * y - k, step = (2 * R) / N;
    ctx.fillStyle = "#3f6fa3";
    for (let p = 0; p < N; p++) for (let q = 0; q < N; q++) {
      const x = -R + p * step, y = -R + q * step, v = [g(x, y), g(x + step, y), g(x, y + step), g(x + step, y + step)];
      if (Math.min(...v) <= 0 && Math.max(...v) >= 0) { const P = pl.P(x + step / 2, y + step / 2); ctx.fillRect(P[0] - 1, P[1] - 1, 2.2, 2.2); }
    }
  }
  function show() {
    done = false; $(".no-out").textContent = `${i + 1} / ${Q.length}`;
    $(".q-eq").textContent = eqStr(Q[i]); verdict.textContent = ""; verdict.className = "verdict"; next.disabled = true;
    root.querySelectorAll("[data-g]").forEach((b) => b.setAttribute("aria-pressed", "false"));
    draw();
  }
  root.querySelectorAll("[data-g]").forEach((btn) => btn.addEventListener("click", () => {
    if (done) return; done = true;
    const q = Q[i], [a, b, c] = q, e = L.eig2([[a, b], [b, c]]), ans = kind(q), ok = btn.dataset.g === ans;
    btn.setAttribute("aria-pressed", "true");
    const f = L.frac, co = (x) => (Math.abs(x - 1) < 1e-9 ? "" : f(x));
    verdict.textContent = `${ok ? "맞습니다." : "아닙니다."} ${NAME[ans]}. A = [${f(a)}, ${f(b)} ; ${f(b)}, ${f(c)}], 고윳값 ${e.vals.map(f).join(", ")}, det A = ${f(e.det)}, tr A = ${f(e.tr)}, 우변 ${f(q[3])}` +
      (ans !== "none" && ans !== "lines" ? ` → ${co(e.vals[0])}X² ${e.vals[1] < 0 ? "−" : "+"} ${co(Math.abs(e.vals[1]))}Y² = ${f(q[3])}` : "");
    verdict.className = "verdict " + (ok ? "good" : "bad");
    next.disabled = i === Q.length - 1; draw();
  }));
  next.addEventListener("click", () => { if (i < Q.length - 1) { i++; show(); } });
  show();
})();
