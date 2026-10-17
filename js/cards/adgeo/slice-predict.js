/* 카드: 이 곡면을 이 평면으로 자르면 어떤 모양이 나올까? — 단면 예측 여섯 문제 */
(() => {
  const root = document.getElementById("card-adgeo-slice-predict");
  if (!root) return;
  const { C, F, fit } = NM;
  const S = NMSpace3, Q = NMQuad;
  const $ = (s) => root.querySelector(s);
  /* kind: NMQuad 종류, a, b, c, 평면 축(0=x,1=y,2=z), 값, 답, 설명 */
  const PB = [
    { k: 1, a: 1, b: 1, c: 1, ax: 0, val: 1, ans: "lines", why: "x = 1을 넣으면 y² − z² = 0, 곧 두 직선 z = ±y" },
    { k: 5, a: 1, b: 1, c: 1, ax: 2, val: 0, ans: "lines", why: "z = 0을 넣으면 x² − y² = 0, 곧 두 직선 y = ±x" },
    { k: 5, a: 1, b: 1, c: 1, ax: 1, val: 1, ans: "parabola", why: "y = 1을 넣으면 z = x² − 1, 위로 열린 포물선" },
    { k: 3, a: 1, b: 1, c: 1, ax: 1, val: 1, ans: "hyperbola", why: "y = 1을 넣으면 x² + 1 = z², 곧 z² − x² = 1인 쌍곡선" },
    { k: 0, a: 2, b: 1, c: 1, ax: 0, val: 1, ans: "ellipse", why: "x = 1을 넣으면 y² + z² = 3/4, 원" },
    { k: 2, a: 1, b: 1, c: 1, ax: 2, val: 0.5, ans: "none", why: "z = 0.5를 넣으면 x² + y² = 0.25 − 1 < 0, 단면이 없음" },
  ];
  const AX = ["x", "y", "z"], NAME = { ellipse: "타원(원)", hyperbola: "쌍곡선", parabola: "포물선", lines: "두 직선", none: "없음" };
  let pi = 0, done = false;
  const v = S.view($(".v3"), () => draw3(), { center: [0, 0, 0], span: 8.2, yaw: -2.2, pitch: 0.4 });
  const sf = fit($(".sec"), () => drawSec());
  /* 평면 위의 두 좌표 (p, q)를 3차원으로 */
  const lift = (P, p, q) => (P.ax === 0 ? [P.val, p, q] : P.ax === 1 ? [p, P.val, q] : [p, q, P.val]);
  const g2 = (P) => (p, q) => { const [x, y, z] = lift(P, p, q); return Q.KINDS[P.k].F(x, y, z, P.a, P.b, P.c); };
  function draw3() {
    const { ctx, size } = v; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = PB[pi];
    v.axes(2.8, 2.4); Q.mesh(v, P.k, P.a, P.b, P.c);
    const R = 3, corners = [[-R, -R], [R, -R], [R, R], [-R, R]].map(([p, q]) => lift(P, p, q));
    v.poly(corners, "#e0a02a", "#e0a02a", 0.12, 1);
    if (done) Q.segs(g2(P)).forEach(([p, q]) => v.line(lift(P, ...p), lift(P, ...q), C.warn, 3));
  }
  function drawSec() {
    const { ctx, size: { w, h } } = sf; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const P = PB[pi], R = 3, s = Math.min(w, h) / (2 * R), X = (p) => w / 2 + p * s, Y = (q) => h / 2 - q * s, names = [[1, 2], [0, 2], [0, 1]][P.ax];
    ctx.strokeStyle = C.rule; ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(w, Y(0)); ctx.moveTo(X(0), 0); ctx.lineTo(X(0), h); ctx.stroke();
    ctx.fillStyle = C.ink2; ctx.font = `italic 600 12px ${F.serif}`; ctx.fillText(AX[names[0]], w - 14, Y(0) - 6); ctx.fillText(AX[names[1]], X(0) + 6, 12);
    ctx.font = `600 11px ${F.sans}`; ctx.fillText(`평면 ${AX[P.ax]} = ${P.val} 위에서 본 모습`, 6, h - 8);
    if (!done) { ctx.fillStyle = C.ink3; ctx.textAlign = "center"; ctx.fillText("예측한 뒤 나타납니다", w / 2, h / 2 - 10); ctx.textAlign = "left"; return; }
    ctx.strokeStyle = C.warn; ctx.lineWidth = 2.6; Q.segs(g2(PB[pi]), R, 80).forEach(([p, q]) => { ctx.beginPath(); ctx.moveTo(X(p[0]), Y(p[1])); ctx.lineTo(X(q[0]), Y(q[1])); ctx.stroke(); });
  }
  function load() {
    const P = PB[pi], K = Q.KINDS[P.k]; done = false;
    $(".no-out").textContent = `${pi + 1} / ${PB.length}`;
    const eq = K.eq.replace(/a²/g, String(P.a * P.a)).replace(/b²/g, String(P.b * P.b)).replace(/c²/g, String(P.c * P.c)).replace(/\/1(?![0-9])/g, "");
    $(".q-txt").textContent = `${K.name} ${eq}을 평면 ${AX[P.ax]} = ${P.val}로 자르면?`;
    $(".verdict").textContent = ""; $(".verdict").className = "verdict"; $(".go-next").disabled = true;
    root.querySelectorAll("[data-g]").forEach((b) => b.setAttribute("aria-pressed", "false"));
    draw3(); drawSec();
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    if (done) return; done = true; const P = PB[pi], ok = b.dataset.g === P.ans; b.setAttribute("aria-pressed", "true");
    $(".verdict").textContent = `${ok ? "맞습니다." : `아닙니다. 답은 ${NAME[P.ans]}.`} ${P.why}`; $(".verdict").className = "verdict " + (ok ? "good" : "bad");
    $(".go-next").disabled = pi === PB.length - 1; draw3(); drawSec();
  }));
  $(".go-next").addEventListener("click", () => { if (pi < PB.length - 1) { pi++; load(); } });
  load();
})();
