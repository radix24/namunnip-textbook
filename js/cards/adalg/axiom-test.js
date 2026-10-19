/* 카드: 이 집합에서 마음대로 더하고 실수배해도 집합 안에 머물까? — 벡터공간 판정과 반례 */
(() => {
  const root = document.getElementById("card-adalg-axiom-test");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { drag, arrow, label, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sk = $(".sk"), verdict = $(".verdict");
  const R = 5;
  /* 집합마다: 안에 있는지, 가장 가까운 점으로 끌어오기, 그리기, 벡터공간인지 */
  const S = [
    { inside: (p) => Math.abs(p[1] - 2 * p[0]) < 1e-6, proj: (p) => { const t = (p[0] + 2 * p[1]) / 5; return [t, 2 * t]; }, vs: true, u: [0.5, 1], v: [1, 2] },
    { inside: (p) => p[0] >= -1e-9 && p[1] >= -1e-9, proj: (p) => [Math.max(0, p[0]), Math.max(0, p[1])], vs: false, u: [1, 0.5], v: [0.5, 1.5] },
    { inside: (p) => Math.abs(p[1] - 2 * p[0] - 1) < 1e-6, proj: (p) => { const t = (p[0] + 2 * (p[1] - 1)) / 5; return [t, 2 * t + 1]; }, vs: false, u: [0, 1], v: [1, 3] },
    { inside: (p) => Math.abs(p[0]) < 1e-6 || Math.abs(p[1]) < 1e-6, proj: (p) => (Math.abs(p[0]) < Math.abs(p[1]) ? [0, p[1]] : [p[0], 0]), vs: false, u: [1.5, 0], v: [-1, 0] },
    { inside: (p) => Math.hypot(...p) < 1e-6, proj: () => [0, 0], vs: true, u: [0, 0], v: [0, 0] },
  ];
  let sk_ = 0, u = S[0].u.slice(), v = S[0].v.slice(), pl = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  const snap = (p) => S[sk_].proj(p.map((x) => Math.round(x * 2) / 2));

  function drawSet(P) {
    ctx.save(); ctx.strokeStyle = C.forest; ctx.fillStyle = "rgba(116,171,102,.25)"; ctx.lineWidth = 4;
    const ln = (a, b) => { ctx.beginPath(); ctx.moveTo(...P(...a)); ctx.lineTo(...P(...b)); ctx.stroke(); };
    if (sk_ === 0) ln([-3, -6], [3, 6]);
    if (sk_ === 1) { const a = P(0, 0), b = P(R + 1, R + 1); ctx.fillRect(a[0], b[1], b[0] - a[0], a[1] - b[1]); }
    if (sk_ === 2) ln([-3, -5], [3, 7]);
    if (sk_ === 3) { ln([-R - 1, 0], [R + 1, 0]); ln([0, -R - 1], [0, R + 1]); }
    if (sk_ === 4) { ctx.beginPath(); ctx.arc(...P(0, 0), 6, 0, 7); ctx.fillStyle = C.forest; ctx.fill(); }
    ctx.restore();
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const box = { x: 0, y: 0, w, h };
    pl = L.plane(ctx, box, R);
    const P = pl.P;
    drawSet(P);
    const k = +sk.value, sum = L.add(u, v), ku = L.scl(u, k), set = S[sk_];
    const col = (p) => (set.inside(p) ? C.forest : C.warn);
    arrow(ctx, ...P(0, 0), ...P(...u), BLUE, 2.4); arrow(ctx, ...P(0, 0), ...P(...v), BLUE, 2.4);
    arrow(ctx, ...P(0, 0), ...P(...sum), col(sum), 2.4); arrow(ctx, ...P(0, 0), ...P(...ku), col(ku), 2, 7);
    label(ctx, "u", P(...u)[0] + 8, P(...u)[1] - 8, BLUE, "left", `italic 700 13px ${F.serif}`);
    label(ctx, "v", P(...v)[0] + 8, P(...v)[1] - 8, BLUE, "left", `italic 700 13px ${F.serif}`);
    label(ctx, "u + v", P(...sum)[0] + 8, P(...sum)[1] + 10, col(sum), "left", `600 12px ${F.sans}`);
    label(ctx, "k·u", P(...ku)[0] + 8, P(...ku)[1] + 10, col(ku), "left", `600 12px ${F.sans}`);
    [u, v].forEach((p) => { ctx.beginPath(); ctx.arc(...P(...p), 6, 0, 7); ctx.fillStyle = C.card; ctx.fill(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.stroke(); });
  }
  function update() {
    const k = +sk.value, sum = L.add(u, v), ku = L.scl(u, k), set = S[sk_];
    $(".k-out").textContent = L.n(k, 1);
    const f = (p) => `(${p.map((x) => L.n(x, 2)).join(", ")})`;
    $(".st").textContent = `u + v = ${f(sum)} ${set.inside(sum) ? "안 ✓" : "밖 ✗"} · k·u = ${f(ku)} ${set.inside(ku) ? "안 ✓" : "밖 ✗"}${set.inside([0, 0]) ? "" : " · 영벡터가 집합에 없음"}`;
    draw();
  }
  drag(cv, (x, y) => {
    if (!pl) return null;
    const d = (p) => Math.hypot(x - pl.P(...p)[0], y - pl.P(...p)[1]);
    return d(u) < 18 ? "u" : d(v) < 18 ? "v" : null;
  }, (who, x, y) => { const p = snap(pl.inv(x, y)); if (who === "u") u = p; else v = p; update(); }, null, "none");
  root.querySelectorAll(".which .chip").forEach((b) => b.addEventListener("click", () => {
    sk_ = +b.dataset.s; root.querySelectorAll(".which .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    u = S[sk_].u.slice(); v = S[sk_].v.slice(); verdict.textContent = ""; verdict.className = "verdict";
    root.querySelectorAll(".judge .chip").forEach((x) => x.setAttribute("aria-pressed", "false")); update();
  }));
  root.querySelectorAll(".judge .chip").forEach((b) => b.addEventListener("click", () => {
    const say = b.dataset.j === "1", ok = say === S[sk_].vs;
    root.querySelectorAll(".judge .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    verdict.textContent = ok ? (S[sk_].vs ? "맞습니다. 어떻게 끌어도 결과가 집합 안에 남습니다." : "맞습니다. 반례를 직접 찾아보세요.") : (S[sk_].vs ? "다시 보세요. 결과가 집합 밖으로 나가는 경우가 없습니다." : "다시 보세요. 끌어 보면 밖으로 나가는 경우가 있습니다.");
    verdict.className = "verdict " + (ok ? "good" : "bad");
  }));
  sk.addEventListener("input", update);
  update();
})();
