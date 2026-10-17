/* 카드: 이윤 그래프를 직접 그리지 않고 모양을 알 수 있을까? — 증감표 채우기 (가상 이윤 함수) */
(() => {
  const root = document.getElementById("card-econ-revenue-shape");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const pi = (x) => -(x ** 3) / 3 + 6 * x ** 2 - 20 * x - 10;
  /* 칸마다 고를 수 있는 값과 정답 */
  const OPT = { s: ["+", "−"], d: ["↗", "↘"], e: ["극대", "극소"] };
  const ANS = { s0: "−", s1: "+", s2: "−", d0: "↘", d1: "↗", d2: "↘", e0: "극소", e1: "극대" };
  const cur = {};
  root.querySelectorAll("td[data-c]").forEach((td) => {
    const k = td.dataset.c, kind = k[0];
    td.innerHTML = `<button class="chip" type="button" aria-label="${k} 칸 바꾸기">?</button>`;
    const b = td.querySelector("button");
    b.addEventListener("click", () => { const o = OPT[kind], i = cur[k] == null ? 0 : (o.indexOf(cur[k]) + 1) % o.length; cur[k] = o[i]; b.textContent = cur[k]; b.removeAttribute("data-ok"); td.style.background = ""; });
  });
  let cv = null;
  function draw() {
    if (!cv || !cv.size.w) return;
    const { ctx, size } = cv;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: 0, x1: 14, y0: -40, y1: 70, xt: [0, 2, 4, 6, 8, 10, 12, 14], yt: [-40, -20, 0, 20, 40, 60], xlab: "생산량 x(백 개)", ylab: "이윤(백만 원)", L: 40 });
    E.fn(ctx, P, () => 0, 0, 14, C.ink3, 1);
    E.fn(ctx, P, pi, 0, 14, E.BLUE, 2.6);
    E.dot(ctx, P, 2, pi(2), C.warn, 5, `극소 (2, ${E.n(pi(2), 1)})`, 6, 16);
    E.dot(ctx, P, 10, pi(10), C.forest, 5, `극대 (10, ${E.n(pi(10), 1)})`, 6, -8);
    E.dot(ctx, P, 0, pi(0), C.ink3, 4); E.dot(ctx, P, 14, pi(14), C.ink3, 4, `(14, ${E.n(pi(14), 1)})`, -6, -8);
  }
  $(".go-check").addEventListener("click", () => {
    let right = 0, filled = 0;
    root.querySelectorAll("td[data-c]").forEach((td) => { const k = td.dataset.c; if (cur[k] != null) filled++; const ok = cur[k] === ANS[k]; if (ok) right++; td.style.background = cur[k] == null ? "" : ok ? "rgba(116,171,102,.25)" : "rgba(181,83,47,.2)"; });
    const n = Object.keys(ANS).length;
    $(".verdict").textContent = right === n ? "증감표를 모두 맞게 채웠습니다. 그래프를 그려 확인해 보세요." : `${n}칸 중 ${right}칸이 맞습니다${filled < n ? ` (빈 칸 ${n - filled})` : ""}. 각 구간에서 π'(x) = −(x − 2)(x − 10)에 값을 하나 넣어 부호를 확인해 보세요(예: x = 1, 5, 12).`;
  });
  $(".go-show").addEventListener("click", () => { const c = $("canvas"); c.hidden = false; if (!cv) cv = fit(c, () => draw()); draw(); });
})();
