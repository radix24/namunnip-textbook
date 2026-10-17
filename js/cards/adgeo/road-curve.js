/* 카드: 고속도로의 굽은 길은 왜 원을 바로 잇지 않을까? — 곡률 κ(s)를 적분해 길 만들기, 옆 가속도 v²κ */
(() => {
  const root = document.getElementById("card-adgeo-road-curve");
  if (!root) return;
  const { C, F, fit } = NM;
  const K = NMCurve;
  const $ = (s) => root.querySelector(s);
  const R = 300, LS = 120, L0 = 200, LARC = 300, vIn = $(".v"), sIn = $(".s");
  let design = "arc";
  const kappa = (s) => { if (s < L0) return 0; if (design === "arc") return s < L0 + LARC ? 1 / R : 0; const u = s - L0; if (u < LS) return u / (LS * R); if (u < LS + LARC) return 1 / R; return u < 2 * LS + LARC ? (2 * LS + LARC - u) / (LS * R) : 0; };
  const total = () => L0 + LARC + (design === "clo" ? 2 * LS : 0) + 100;
  /* 길 좌표: θ′ = κ, x′ = cos θ, y′ = sin θ (1 m 간격 적분) */
  function road() { const out = [[0, 0, 0]]; let x = 0, y = 0, th = 0; for (let s = 1; s <= total(); s++) { th += kappa(s - 0.5); x += Math.cos(th); y += Math.sin(th); out.push([x, y, th]); } return out; }
  const cv = fit($(".c"), () => drawC()), gv = fit($(".g"), () => drawG());
  function drawC() {
    const { ctx, size: { w, h } } = cv; if (!w) return;
    ctx.fillStyle = C.paper || "#f3f4ef"; ctx.clearRect(0, 0, w, h);
    const pts = road(), xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min((w - 30) / (x1 - x0), (h - 30) / (y1 - y0 || 1)), X = (x) => 15 + (x - x0) * s, Y = (y) => h - 15 - (y - y0) * s;
    ctx.lineCap = "round"; ctx.strokeStyle = "#8d8d92"; ctx.lineWidth = 10; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])))); ctx.stroke();
    // 구간 색
    const seg = (a, b, col) => { ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); for (let i = a; i <= Math.min(b, pts.length - 1); i++) (i === a ? ctx.moveTo : ctx.lineTo).call(ctx, X(pts[i][0]), Y(pts[i][1])); ctx.stroke(); };
    seg(0, L0, "#fff"); if (design === "clo") { seg(L0, L0 + LS, "#e0a02a"); seg(L0 + LS, L0 + LS + LARC, C.warn); seg(L0 + LS + LARC, L0 + 2 * LS + LARC, "#e0a02a"); } else seg(L0, L0 + LARC, C.warn);
    ctx.lineCap = "butt";
    const i = Math.round(+sIn.value * (pts.length - 1)), p = pts[i];
    ctx.save(); ctx.translate(X(p[0]), Y(p[1])); ctx.rotate(-p[2]); ctx.fillStyle = "#3f6fa3"; ctx.fillRect(-9, -5, 18, 10); ctx.restore();
    ctx.fillStyle = C.ink2; ctx.font = `600 11px ${F.sans}`; ctx.textAlign = "left"; ctx.fillText(design === "clo" ? "흰: 직선, 주황: 완화곡선, 빨강: 원" : "흰: 직선, 빨강: 원", 10, 14);
  }
  function drawG() {
    const { ctx, size: { w, h } } = gv; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const v = +vIn.value, T = total(), dk = [], da = [];
    for (let s = 0; s <= T; s += 2) { dk.push([s, kappa(s) * 1000]); da.push([s, v * v * kappa(s)]); }
    K.graph(ctx, { x: 0, y: 0, w, h }, [{ data: da, col: C.warn, name: "옆 가속도(m/s²)" }, { data: dk, col: "#7b5ea7", name: "곡률 ×1000" }], { v0: 0, v1: Math.max(4.5, (v * v) / R * 1.15), mark: +sIn.value * T });
  }
  function update() {
    const v = +vIn.value, T = total(), s = +sIn.value * T, k = kappa(s);
    $(".v-out").textContent = v; $(".s-out").textContent = Math.round(s);
    root.querySelectorAll("[data-d]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.d === design)));
    const jump = design === "arc" ? `이음매에서 옆 가속도가 0 → ${K.n((v * v) / R, 2)} m/s²로 한순간에 바뀜` : `완화곡선 ${LS} m 동안 0 → ${K.n((v * v) / R, 2)} m/s²로 서서히 바뀜(약 ${K.n(LS / v, 1)}초)`;
    $(".say").textContent = `지금 곡률 ${K.n(k, 5)}/m (반지름 ${k > 0 ? K.n(1 / k, 0) + " m" : "∞"}) · 옆 가속도 ${K.n(v * v * k, 2)} m/s² · ${jump}`;
    drawC(); drawG();
  }
  root.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { design = b.dataset.d; update(); }));
  [vIn, sIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
