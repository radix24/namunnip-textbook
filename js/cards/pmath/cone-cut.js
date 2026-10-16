/* 카드: 원뿔을 자르는 칼을 기울이면 단면은 어떻게 바뀔까? — 이중 원뿔과 기울어진 평면의 교선 */
(() => {
  const root = document.getElementById("card-pmath-cone-cut");
  if (!root) return;
  const { C, F, fit } = NM;
  const S = NMSpace3;
  const { n, label } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sb = $(".sb"), sc = $(".sc");
  const AL = Math.PI / 6, H = 2.2, TA = Math.tan(AL);
  const vw = S.view($(".c3"), () => draw(), { center: [0, 0, 0], span: 6.4, yaw: -1.95, pitch: 0.62 });
  const c2 = fit($(".c2"), () => draw2());

  /* 단면: 원뿔 위의 점 (h tanα cosφ, h tanα sinφ, h)이 평면 z = c + y tanβ 위에 있을 조건에서 h를 구한다 */
  function section() {
    const b = +sb.value * Math.PI / 180, c = +sc.value, tb = Math.tan(b);
    const segs = []; let cur = [];
    for (let i = 0; i <= 720; i++) {
      const ph = 2 * Math.PI * i / 720, den = 1 - TA * tb * Math.sin(ph);
      const h = Math.abs(den) < 1e-9 ? Infinity : c / den;
      if (!Number.isFinite(h) || Math.abs(h) > H) { if (cur.length > 1) segs.push(cur); cur = []; continue; }
      const p = [h * TA * Math.cos(ph), h * TA * Math.sin(ph), h];
      if (cur.length && Math.sign(cur[cur.length - 1][2]) !== Math.sign(h)) { if (cur.length > 1) segs.push(cur); cur = []; }
      cur.push(p);
    }
    if (cur.length > 1) segs.push(cur);
    return { segs, b, c, tb };
  }
  const kind = () => {
    const b = +sb.value, lim = 90 - 30;
    if (+sc.value === 0) return ["퇴화한 단면", "평면이 꼭짓점을 지납니다"];
    if (b === 0) return ["원", "β = 0°"];
    if (b < lim) return ["타원", `β = ${b}° < 60°`];
    if (b === lim) return ["포물선", "β = 60° — 모선과 나란함"];
    return ["쌍곡선", `β = ${b}° > 60°`];
  };

  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const { segs, b, c, tb } = section();
    // 원뿔: 테두리 원과 모선
    [H, -H].forEach((z) => vw.path(vw.circle([0, 0, z], [1, 0, 0], [0, 1, 0], H * TA), C.ink3, 1.2));
    for (let k = 0; k < 12; k++) { const ph = 2 * Math.PI * k / 12, d = [TA * Math.cos(ph), TA * Math.sin(ph), 1]; vw.line(S.mul(d, -H), S.mul(d, H), C.rule, 1); }
    // 평면 조각: 중심 (0, 0, c), 방향 u = x, v = (0, cos b, sin b)
    const v = [0, Math.cos(b), Math.sin(b)];
    vw.poly(vw.quad([0, 0, c], [1, 0, 0], v, 2.2, 2.6), "#7aa7d9", "#3f6fa3", 0.18, 1);
    segs.forEach((sg) => vw.path(sg, C.warn, 3, null, false));
    vw.dot([0, 0, 0], C.ink, 3);
  }
  function draw2() {
    const { ctx, size } = c2; const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const { segs, b } = section();
    // 평면 좌표: u = x, t = (y, z)를 v 방향으로 잰 길이
    const v = [0, Math.cos(b), Math.sin(b)];
    const pts = segs.map((sg) => sg.map((p) => [p[0], p[1] * v[1] + p[2] * v[2]]));
    // 가로세로 같은 축척으로 단면 전체가 들어오게 맞춘다
    const all = pts.flat();
    if (!all.length) { label(ctx, kind()[0], 8, 14, C.forest, "left", `700 13px ${F.sans}`); return; }
    const us = all.map((p) => p[0]), ts = all.map((p) => p[1]);
    const u0 = Math.min(...us), u1 = Math.max(...us), t0 = Math.min(...ts), t1 = Math.max(...ts);
    const s = Math.min((w - 20) / Math.max(u1 - u0, 0.2), (h - 30) / Math.max(t1 - t0, 0.2), 120);
    const cx = w / 2 - (u0 + u1) / 2 * s, cy = h / 2 + 8 + (t0 + t1) / 2 * s;
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.moveTo(cx, 22); ctx.lineTo(cx, h); ctx.stroke();
    ctx.strokeStyle = C.warn; ctx.lineWidth = 2.6;
    pts.forEach((sg) => { ctx.beginPath(); sg.forEach(([u, t], i) => { const X = cx + u * s, Y = cy - t * s; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); });
    label(ctx, kind()[0], 8, 14, C.forest, "left", `700 13px ${F.sans}`);
  }
  function update() {
    $(".b-out").textContent = `${sb.value}°`; $(".c-out").textContent = n(+sc.value, 2);
    const [k, why] = kind(); $(".type").textContent = k; $(".why").textContent = why;
    draw(); draw2();
  }
  [sb, sc].forEach((el) => el.addEventListener("input", update));
  update();
})();
