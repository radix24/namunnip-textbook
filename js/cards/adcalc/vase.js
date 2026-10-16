/* 카드: 정확히 1 L가 들어가는 꽃병을 디자인할 수 있을까? — 윤곽 점 끌기, 원판 근사, 부피·옆넓이 적분 */
(() => {
  const root = document.getElementById("card-adcalc-vase");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, drag, label, dot, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn"), cv = $("canvas");
  const H = 30, HS = [0, 7.5, 15, 22.5, 30], RMAX = 12;
  const PRE = { cyl: [3, 3, 3, 3, 3], vase: [2.8, 5.6, 4.5, 1.8, 2.5], cone: [6, 4.5, 3, 1.5, 0.5] };
  let R = PRE.vase.slice(), geo = null;
  const { ctx, size } = fit(cv, () => draw());

  /* 캣멀–롬 보간: 높이 h → 반지름 */
  function r(h) {
    h = NM.clamp(h, 0, H);
    const i = Math.min(3, Math.floor(h / 7.5)), t = (h - HS[i]) / 7.5;
    const p0 = R[Math.max(0, i - 1)], p1 = R[i], p2 = R[i + 1], p3 = R[Math.min(4, i + 2)];
    const v = 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
    return Math.max(0.2, v);
  }
  const dr = (h) => (r(Math.min(H, h + 1e-4)) - r(Math.max(0, h - 1e-4))) / (Math.min(H, h + 1e-4) - Math.max(0, h - 1e-4));
  const vol = () => A.simpson((h) => Math.PI * r(h) ** 2, 0, H, 600);
  const side = () => A.simpson((h) => 2 * Math.PI * r(h) * Math.sqrt(1 + dr(h) ** 2), 0, H, 600);
  const disks = (k) => { let s = 0; for (let i = 0; i < k; i++) s += Math.PI * r((i + 0.5) * H / k) ** 2 * H / k; return s; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const S = Math.min((h - 30) / H, (w - 20) / (2 * RMAX + 2)), cx = w / 2, by = h - 16;
    const X = (rad) => cx + rad * S, Y = (hh) => by - hh * S;
    geo = { X, Y, S };
    // 원판
    const k = +sn.value;
    for (let i = 0; i < k; i++) {
      const rr = r((i + 0.5) * H / k), y1 = Y((i + 1) * H / k), y0 = Y(i * H / k);
      ctx.fillStyle = i % 2 ? "rgba(59,124,42,.16)" : "rgba(59,124,42,.26)";
      ctx.fillRect(X(-rr), y1, 2 * rr * S, y0 - y1);
    }
    // 윤곽
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4;
    [1, -1].forEach((sg) => { ctx.beginPath(); for (let i = 0; i <= 200; i++) { const hh = H * i / 200; i ? ctx.lineTo(X(sg * r(hh)), Y(hh)) : ctx.moveTo(X(sg * r(hh)), Y(hh)); } ctx.stroke(); });
    // 위아래 타원(입구와 바닥)
    [[0, r(0)], [H, r(H)]].forEach(([hh, rr]) => { ctx.save(); ctx.strokeStyle = BLUE; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(cx, Y(hh), rr * S, rr * S * 0.18, 0, 0, 7); ctx.stroke(); ctx.restore(); });
    // 축
    ctx.save(); ctx.strokeStyle = C.ink3; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(cx, Y(H) - 10); ctx.lineTo(cx, by + 8); ctx.stroke(); ctx.restore();
    R.forEach((rr, i) => dot(ctx, X(rr), Y(HS[i]), C.warn, 6));
    label(ctx, "회전축", cx + 4, Y(H) - 6, C.ink3, "left", `11px ${F.sans}`);
    label(ctx, "점을 좌우로 끄세요", w - 6, h - 8, C.ink3, "right", `11px ${F.sans}`);
    for (let hh = 0; hh <= 30; hh += 10) label(ctx, `${hh} cm`, 6, Y(hh), C.ink3, "left", `10px ${F.mono}`);
  }
  function nums() {
    const k = +sn.value, V = vol(), d = (V - 1000) / 1000;
    $(".n-out").textContent = k;
    $(".n-d").textContent = `${n(disks(k), 0)} cm³`;
    $(".n-v").textContent = `${n(V, 0)} cm³`;
    $(".n-s").textContent = `${n(side(), 0)} cm²`;
    const t = $(".n-t"); t.textContent = `${d >= 0 ? "+" : "−"}${n(Math.abs(d) * 100, 1)}%`; t.classList.toggle("good", Math.abs(d) <= 0.02);
    draw();
  }
  drag(cv, (x, y) => {
    if (!geo) return null;
    let best = null, bd = 20;
    R.forEach((rr, i) => { const d = Math.hypot(x - geo.X(rr), y - geo.Y(HS[i])); if (d < bd) { bd = d; best = i; } });
    return best;
  }, (i, x) => { R[i] = Math.round(NM.clamp((x - geo.X(0)) / geo.S, 0.5, RMAX) * 10) / 10; nums(); }, null, "pan-y");
  root.querySelectorAll(".presets .chip").forEach((b) => b.addEventListener("click", () => { R = PRE[b.dataset.p].slice(); nums(); }));
  sn.addEventListener("input", nums);
  nums();
})();
