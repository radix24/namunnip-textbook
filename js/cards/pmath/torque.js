/* 카드: 녹슨 볼트를 풀려면 렌치의 어디를 어느 방향으로 밀어야 할까? — 토크 τ = r × F */
(() => {
  const root = document.getElementById("card-pmath-torque");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, rad, label, seg, arrow, arc, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sr = $(".sr"), sf = $(".sf"), sp = $(".sp");
  const NEED = 40;
  let turn = 0, raf = 0, best = null;
  const { ctx, size } = fit($("canvas"), () => draw());
  const tau = () => +sr.value * +sf.value * Math.sin(rad(+sp.value));

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const cx = w * 0.22, cy = h * 0.55, s = Math.min((w * 0.72) / 0.42, h / 0.5), r = +sr.value, phi = rad(+sp.value);
    const ang = -turn;   // 풀리는 방향(시계 반대)으로 돈 만큼 렌치가 돈다
    const dir = [Math.cos(ang), -Math.sin(ang)];
    // 볼트(육각형)
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-ang); ctx.fillStyle = "#8f9196"; ctx.beginPath();
    for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k; k ? ctx.lineTo(18 * Math.cos(a), 18 * Math.sin(a)) : ctx.moveTo(18, 0); }
    ctx.closePath(); ctx.fill(); ctx.restore();
    // 렌치 몸통
    ctx.strokeStyle = "#5a5d63"; ctx.lineWidth = 12; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + dir[0] * 0.42 * s, cy + dir[1] * 0.42 * s); ctx.stroke(); ctx.lineCap = "butt";
    const P = [cx + dir[0] * r * s, cy + dir[1] * r * s];
    // 힘: 렌치 방향에서 φ만큼(시계 반대 쪽) 돌린 방향
    const fa = Math.atan2(-dir[1], dir[0]) + phi, fd = [Math.cos(fa), -Math.sin(fa)], fl = +sf.value * 0.35;
    // 작용선과 팔 길이
    seg(ctx, P[0] - fd[0] * 200, P[1] - fd[1] * 200, P[0] + fd[0] * 200, P[1] + fd[1] * 200, C.rule, 1, [4, 4]);
    const tpar = (cx - P[0]) * fd[0] + (cy - P[1]) * fd[1], foot = [P[0] + fd[0] * tpar, P[1] + fd[1] * tpar];
    seg(ctx, cx, cy, ...foot, BLUE, 2.4);
    label(ctx, `팔 길이 ${n(r * Math.sin(phi), 3)} m`, (cx + foot[0]) / 2 - 6, (cy + foot[1]) / 2 - 10, BLUE, "right", `600 11px ${F.sans}`);
    arrow(ctx, ...P, P[0] + fd[0] * fl, P[1] + fd[1] * fl, C.warn, 3.2);
    label(ctx, "F", P[0] + fd[0] * (fl + 12), P[1] + fd[1] * (fl + 12), C.warn, "center", `italic 700 14px ${F.serif}`);
    arc(ctx, ...P, 22, Math.atan2(-dir[1], dir[0]), fa, C.ink2);
    // 회전 방향 표시
    const t = tau(), ok = t >= NEED;
    arc(ctx, cx, cy, 34, Math.PI * 0.6, Math.PI * 1.3, ok ? C.forest : C.ink3, 2);
    label(ctx, ok ? "풀린다!" : "꿈쩍 않음", cx, cy + 52, ok ? C.forest : C.ink3, "center", `700 12px ${F.sans}`);
  }
  function update() {
    const t = tau();
    $(".r-out").textContent = n(+sr.value, 2); $(".f-out").textContent = sf.value; $(".p-out").textContent = `${sp.value}°`;
    $(".n-t").textContent = `${n(t, 1)} N·m`; $(".n-l").textContent = `${n(+sr.value * Math.sin(rad(+sp.value)), 3)} m`;
    const ok = t >= NEED;
    if (ok && (best == null || +sf.value < best)) best = +sf.value;
    $(".n-b").textContent = ok ? `풀림 (가장 작은 힘 기록 ${best} N)` : `잠김 (${n(NEED - t, 1)} N·m 부족)`;
    $(".n-b").className = `n-b ${ok ? "good" : "bad"}`;
    cancelAnimationFrame(raf);
    if (ok && !NM.reduce) { const step = () => { turn += 0.03; draw(); if (turn < 1.4) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); }
    else { turn = 0; draw(); }
  }
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) cancelAnimationFrame(raf); }).observe(root);
  [sr, sf, sp].forEach((el) => el.addEventListener("input", update));
  update();
})();
