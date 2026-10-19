/* 카드: 등고선 지도만 보고 함수를 알아맞힐 수 있을까? — 함수 넷과 등고선 지도 넷 짝짓기 */
(() => {
  const root = document.getElementById("card-adgeo-level-match");
  if (!root) return;
  const { C, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const D = 2;
  const FN = [
    { eq: "x² + y²", f: (x, y) => x * x + y * y, hint: "원, 바깥으로 갈수록 간격이 좁아짐" },
    { eq: "√(x² + y²)", f: (x, y) => Math.hypot(x, y), hint: "원, 간격이 일정함(원뿔)" },
    { eq: "xy", f: (x, y) => x * y, hint: "좌표축이 점근선인 쌍곡선" },
    { eq: "y − x²", f: (x, y) => y - x * x, hint: "아래로 볼록한 포물선을 위로 옮긴 모양" },
  ];
  const order = [2, 0, 3, 1];
  let pick = null; const matched = new Set();
  function segs(f, c, N = 60) {
    const out = [], h = (2 * D) / N, val = (i, j) => f(-D + i * h, -D + j * h) - c;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const v = [val(i, j), val(i + 1, j), val(i + 1, j + 1), val(i, j + 1)], P = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], pts = [];
      for (let k = 0; k < 4; k++) { const a = v[k], b = v[(k + 1) % 4]; if ((a < 0) !== (b < 0)) { const t = a / (a - b), p = P[k], q = P[(k + 1) % 4]; pts.push([-D + (p[0] + t * (q[0] - p[0])) * h, -D + (p[1] + t * (q[1] - p[1])) * h]); } }
      if (pts.length >= 2) out.push([pts[0], pts[1]]); if (pts.length === 4) out.push([pts[2], pts[3]]);
    }
    return out;
  }
  const eqs = $(".eqs"), grid = $(".grid");
  FN.forEach((F, i) => { const b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.textContent = `f = ${F.eq}`; b.dataset.i = i; b.addEventListener("click", () => { if (matched.has(i)) return; pick = i; eqs.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.i === i))); }); eqs.append(b); });
  order.forEach((fi, slot) => {
    const fig = document.createElement("figure"), cv = document.createElement("canvas"), cap = document.createElement("figcaption");
    cv.setAttribute("aria-label", `등고선 지도 ${slot + 1}`); fig.append(cv, cap); grid.append(fig);
    const F = FN[fi], f = fit(cv, () => {
      const { ctx, size: { w, h } } = f; if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const s = Math.min(w, h) / (2 * D), X = (x) => w / 2 + x * s, Y = (y) => h / 2 - y * s;
      for (let k = -8; k <= 8; k++) { const c = k * 0.5; const L = segs(F.f, c + (fi < 2 && k === 0 ? 0.02 : 0)); ctx.strokeStyle = k === 0 ? C.warn : k > 0 ? "#3f6fa3" : "#7b5ea7"; ctx.lineWidth = k === 0 ? 2 : 1.2; L.forEach(([p, q]) => { ctx.beginPath(); ctx.moveTo(X(p[0]), Y(p[1])); ctx.lineTo(X(q[0]), Y(q[1])); ctx.stroke(); }); }
      ctx.strokeStyle = C.rule; ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    });
    fig.addEventListener("click", () => {
      if (pick == null || matched.has(pick)) return; const v = $(".verdict");
      if (pick === fi) { matched.add(fi); fig.classList.add("hit"); cap.textContent = `f = ${F.eq}`; eqs.querySelector(`[data-i="${fi}"]`).classList.add("done"); v.textContent = `맞습니다. ${F.hint}` + (matched.size === 4 ? " · 모두 짝지었습니다!" : ""); v.className = "verdict good"; }
      else { v.textContent = `아닙니다. f = ${FN[pick].eq}의 단서: ${FN[pick].hint}`; v.className = "verdict bad"; }
      pick = null; eqs.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
    });
  });
})();
