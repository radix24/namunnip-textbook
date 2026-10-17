/* 카드: 식만 보고 공간곡선의 모양을 알아볼 수 있을까? — 식 넷과 3차원 그림 넷 짝짓기 */
(() => {
  const root = document.getElementById("card-adgeo-curve-match");
  if (!root) return;
  const S = NMSpace3;
  const $ = (s) => root.querySelector(s);
  const CV = [
    { eq: "(cos t, sin t, t/4)", f: (t) => [1.6 * Math.cos(t), 1.6 * Math.sin(t), t / 4], T: [0, 4 * Math.PI], hint: "x² + y² = 1: 원기둥 위, z는 계속 늘어남" },
    { eq: "(t, t², t³)", f: (t) => [t * 1.6, t * t * 1.6, t * t * t * 1.6], T: [-1.2, 1.2], hint: "그림자가 포물선 y = x², 삼차곡선 z = x³" },
    { eq: "(cos t, sin t, cos 2t)", f: (t) => [1.6 * Math.cos(t), 1.6 * Math.sin(t), Math.cos(2 * t)], T: [0, 2 * Math.PI], hint: "원기둥 위의 닫힌 곡선, 위아래로 두 번 출렁임" },
    { eq: "(t cos t, t sin t, t)", f: (t) => [0.3 * t * Math.cos(t), 0.3 * t * Math.sin(t), 0.3 * t], T: [0, 4 * Math.PI], hint: "z = √(x² + y²): 원뿔 위를 감아 오름" },
  ];
  const order = [2, 0, 3, 1]; // 그림의 순서(섞음)
  let pick = null, matched = new Set();
  const eqs = $(".eqs"), grid = $(".grid");
  CV.forEach((c, i) => { const b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.textContent = `r(t) = ${c.eq}`; b.dataset.i = i; b.addEventListener("click", () => { if (matched.has(i)) return; pick = i; eqs.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.i === i))); }); eqs.append(b); });
  order.forEach((ci, slot) => {
    const fig = document.createElement("figure"), cv = document.createElement("canvas"), cap = document.createElement("figcaption");
    cv.setAttribute("aria-label", `곡선 그림 ${slot + 1}`); fig.append(cv, cap); grid.append(fig);
    const c = CV[ci], pts = [...Array(301)].map((_, k) => c.f(c.T[0] + ((c.T[1] - c.T[0]) * k) / 300));
    const v = S.view(cv, () => { const { ctx, size } = v; if (!size.w) return; ctx.clearRect(0, 0, size.w, size.h); v.axes(2.2, 0.4); v.path(pts, "#7b5ea7", 2.6, null, false); }, { center: [0, 0, 0.8], span: 8.5, yaw: -2.2, pitch: 0.4 });
    let moved = false; cv.addEventListener("pointerdown", () => (moved = false)); cv.addEventListener("pointermove", (e) => { if (e.buttons) moved = true; });
    cv.addEventListener("click", () => {
      if (moved || pick == null || matched.has(pick)) return;
      const v2 = $(".verdict");
      if (pick === ci) { matched.add(ci); fig.classList.add("hit"); cap.textContent = c.eq; eqs.querySelector(`[data-i="${ci}"]`).classList.add("done"); v2.textContent = `맞습니다. 단서: ${c.hint}` + (matched.size === 4 ? " · 모두 짝지었습니다!" : ""); v2.className = "verdict good"; }
      else { v2.textContent = `아닙니다. 고른 식의 단서: ${CV[pick].hint}`; v2.className = "verdict bad"; }
      pick = null; eqs.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
    });
  });
})();
