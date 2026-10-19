/* 카드: 타원 모양 당구대에서 초점을 지나게 친 공은 어디로 갈까? — 타원 안의 반사 경로 */
(() => {
  const root = document.getElementById("card-pmath-ellipse-billiard");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, dot, seg, drag, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sd = $(".sd"), sbn = $(".sbn");
  const A = 4, B = 2.5, Cf = Math.sqrt(A * A - B * B);
  let mode = "focus", start = [-Cf, 0], geo = null;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());

  /* 점 o에서 방향 d로 나간 공이 타원과 만나는 점 */
  function hit(o, d) {
    const a = (d[0] / A) ** 2 + (d[1] / B) ** 2, b = 2 * (o[0] * d[0] / (A * A) + o[1] * d[1] / (B * B)), c = (o[0] / A) ** 2 + (o[1] / B) ** 2 - 1;
    const t = (-b + Math.sqrt(Math.max(0, b * b - 4 * a * c))) / (2 * a);
    return [o[0] + t * d[0], o[1] + t * d[1]];
  }
  function path() {
    const t = +sd.value * Math.PI / 180;
    let o = start.slice(), d = [Math.cos(t), Math.sin(t)];
    const pts = [o];
    for (let i = 0; i < +sbn.value; i++) {
      const q = hit(o, d);
      let m = [q[0] / (A * A), q[1] / (B * B)]; const L = Math.hypot(...m); m = [m[0] / L, m[1] / L];
      const k = 2 * (d[0] * m[0] + d[1] * m[1]); d = [d[0] - k * m[0], d[1] - k * m[1]];
      pts.push(q); o = [q[0] + d[0] * 1e-9, q[1] + d[1] * 1e-9];
    }
    pts.push(hit(o, d).map((v, i) => o[i] + (v - o[i]) * 0.5));   // 마지막 반사 뒤 절반만
    return pts;
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = Math.min((w - 20) / (2 * A), (h - 20) / (2 * B)), cx = w / 2, cy = h / 2;
    const P = (x, y) => [cx + x * s, cy - y * s];
    geo = { s, cx, cy };
    ctx.fillStyle = "#e8f0e2"; ctx.strokeStyle = C.forest; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(cx, cy, A * s, B * s, 0, 0, 7); ctx.fill(); ctx.stroke();
    const pts = path();
    ctx.strokeStyle = C.warn; ctx.lineWidth = 1.8; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...P(...p)) : ctx.moveTo(...P(...p)))); ctx.stroke();
    // 첫 반사점에서 접선
    const q = pts[1], tl = [-q[1] / (B * B), q[0] / (A * A)], L = Math.hypot(...tl);
    seg(ctx, ...P(q[0] - tl[0] / L * 1.6, q[1] - tl[1] / L * 1.6), ...P(q[0] + tl[0] / L * 1.6, q[1] + tl[1] / L * 1.6), BLUE, 1.4, [5, 3]);
    [[-Cf, "F₁"], [Cf, "F₂"]].forEach(([x, t]) => { dot(ctx, ...P(x, 0), C.ink, 4.5); label(ctx, t, P(x, 0)[0], P(x, 0)[1] + 14, C.ink, "center", `italic 700 12px ${F.serif}`); });
    dot(ctx, ...P(...start), "#ffffff", 7, true); dot(ctx, ...P(...start), C.ink, 2.5);
  }
  function update() {
    $(".d-out").textContent = `${sd.value}°`; $(".b-out").textContent = sbn.value;
    const pts = path(), q = pts[1];
    $(".n-sum").textContent = n(Math.hypot(q[0] + Cf, q[1]) + Math.hypot(q[0] - Cf, q[1]), 4);
    // 첫 반사 뒤 경로가 F₂를 지나는지: F₂에서 직선 q→pts[2]까지 거리
    const r = pts[2], d = [r[0] - q[0], r[1] - q[1]], L = Math.hypot(...d);
    const dist = Math.abs(d[0] * (q[1] - 0) - d[1] * (q[0] - Cf)) / L;
    const ok = dist < 1e-6 && ((Cf - q[0]) * d[0] + (0 - q[1]) * d[1]) > 0;
    $(".n-f2").textContent = ok ? "예" : `아니요 (${n(dist, 2)}만큼 비껴감)`; $(".n-f2").className = `n-f2 ${ok ? "good" : "bad"}`;
    draw();
  }
  drag(cv, (x, y) => {
    if (mode !== "free" || !geo) return null;
    const px = geo.cx + start[0] * geo.s, py = geo.cy - start[1] * geo.s;
    return Math.hypot(x - px, y - py) < 20 ? 1 : null;
  }, (_, x, y) => {
    let u = (x - geo.cx) / geo.s, v = (geo.cy - y) / geo.s;
    const k = (u / A) ** 2 + (v / B) ** 2; if (k > 0.92) { const f = Math.sqrt(0.92 / k); u *= f; v *= f; }
    start = [u, v]; update();
  }, null, "pan-y");
  root.querySelectorAll(".presets .chip").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.s; root.querySelectorAll(".presets .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    start = mode === "focus" ? [-Cf, 0] : [-1.5, 1.2];
    cv.style.touchAction = mode === "free" ? "none" : "pan-y";   // 끌 것이 있을 때만 손가락 스크롤을 막는다
    update();
  }));
  [sd, sbn].forEach((el) => el.addEventListener("input", update));
  update();
})();
