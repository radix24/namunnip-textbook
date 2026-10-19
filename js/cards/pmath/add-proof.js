/* 카드: cos(α − β)의 공식은 어디에서 나올까? — 단위원 위 두 점의 거리로 덧셈정리를 증명(증명 조립) */
(() => {
  const root = document.getElementById("card-pmath-add-proof");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, rad, label, dot, seg, arc, BLUE, PURPLE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa"), sb = $(".sb");
  let stage = -1;     // 쌓은 증명 단계 (−1: 아직 없음)
  let turn = 0;       // 돌리기 애니메이션 0 → 1
  let raf = 0;
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.38;
    const P = (t) => [cx + R * Math.cos(t), cy - R * Math.sin(t)];
    const a = rad(+sa.value), b = rad(+sb.value);
    // 축과 원
    seg(ctx, cx - R * 1.2, cy, cx + R * 1.2, cy, C.ink3, 1); seg(ctx, cx, cy - R * 1.2, cx, cy + R * 1.2, C.ink3, 1);
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    label(ctx, "O", cx - 10, cy + 12, C.ink2, "center", `italic 600 12px ${F.serif}`);
    if (stage < 0) {
      arc(ctx, cx, cy, R * 0.22, 0, a, C.forest); arc(ctx, cx, cy, R * 0.3, 0, b, BLUE);
      label(ctx, "단계를 쌓으면 그림이 나타납니다", cx, cy + R + 22, C.ink3, "center", `12px ${F.sans}`);
      return;
    }
    // 1단계: P, Q
    const [px, py] = P(a), [qx, qy] = P(b);
    seg(ctx, cx, cy, px, py, C.forest, 1.4); seg(ctx, cx, cy, qx, qy, BLUE, 1.4);
    arc(ctx, cx, cy, R * 0.22, 0, a, C.forest); arc(ctx, cx, cy, R * 0.3, 0, b, BLUE);
    dot(ctx, px, py, C.forest); dot(ctx, qx, qy, BLUE);
    label(ctx, "P", px + (px > cx ? 10 : -10), py - 8, C.forest, "center", `italic 700 13px ${F.serif}`);
    label(ctx, "Q", qx + (qx > cx ? 10 : -10), qy - 8, BLUE, "center", `italic 700 13px ${F.serif}`);
    if (stage >= 1) seg(ctx, px, py, qx, qy, C.warn, 3);
    if (stage >= 2) {
      // 돌린 그림: 각을 −β·turn만큼
      const k = turn, a2 = a - b * k, b2 = b - b * k;
      const [p2x, p2y] = P(a2), [q2x, q2y] = P(b2);
      ctx.save(); ctx.globalAlpha = 0.9;
      seg(ctx, cx, cy, p2x, p2y, PURPLE, 1.2, [4, 3]); seg(ctx, cx, cy, q2x, q2y, PURPLE, 1.2, [4, 3]);
      ctx.restore();
      if (stage >= 3) seg(ctx, p2x, p2y, q2x, q2y, PURPLE, 3);
      dot(ctx, p2x, p2y, PURPLE, 4.5, true); dot(ctx, q2x, q2y, PURPLE, 4.5, true);
      if (k > 0.98) {
        label(ctx, "P′", p2x + (p2x > cx ? 12 : -12), p2y + 10, PURPLE, "center", `italic 700 13px ${F.serif}`);
        label(ctx, "A(1, 0)", q2x + 8, q2y + 14, PURPLE, "left", `italic 600 12px ${F.serif}`);
      }
    }
    if (stage >= 4) label(ctx, "같은 길이 → 같은 식", cx, cy + R + 22, C.forest, "center", `600 12.5px ${F.sans}`);
  }

  function nums() {
    const a = rad(+sa.value), b = rad(+sb.value);
    $(".a-out").textContent = `${sa.value}°`; $(".b-out").textContent = `${sb.value}°`;
    const pq = (Math.cos(a) - Math.cos(b)) ** 2 + (Math.sin(a) - Math.sin(b)) ** 2;
    const pa = (Math.cos(a - b) - 1) ** 2 + Math.sin(a - b) ** 2;
    $(".n-pq").textContent = stage >= 1 ? n(pq, 4) : "—";
    $(".n-pa").textContent = stage >= 3 ? n(pa, 4) : "—";
    $(".n-c").textContent = stage >= 4 ? `${n(Math.cos(a - b), 4)} = ${n(Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b), 4)}` : "—";
    draw();
  }

  function animateTurn() {
    cancelAnimationFrame(raf);
    if (NM.reduce) { turn = 1; nums(); return; }
    const t0 = performance.now();
    const step = (t) => { turn = Math.min(1, (t - t0) / 1100); turn = NM.ease(turn); draw(); if (turn < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  }

  NMProof.mount($(".pf"), {
    order: ["a", "b", "c", "d", "e"],
    onStep(i) { stage = i; if (i === 2) animateTurn(); else if (i < 2) turn = 0; nums(); },
  });
  [sa, sb].forEach((s) => s.addEventListener("input", nums));
  nums();
})();
