/* 카드: 레이더는 왜 (x, y) 대신 거리와 방향으로 위치를 알려 줄까? — 극좌표로 주어진 목표 찾기 */
(() => {
  const root = document.getElementById("card-adcalc-radar");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, dot, seg } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const PI = Math.PI;
  /* 목표: r, θ(π의 배수), 표기 */
  const T = [
    { r: 3, k: 1 / 6, s: "(3, π/6)" },
    { r: 4, k: 2 / 3, s: "(4, 2π/3)" },
    { r: 2, k: 5 / 4, s: "(2, 5π/4)" },
    { r: 5, k: -1 / 3, s: "(5, −π/3)" },
    { r: -3, k: 1 / 4, s: "(−3, π/4)" },
    { r: 2, k: 13 / 6, s: "(2, 13π/6)" },
  ];
  let i = 0, click = null, pf = null, score = 0;
  const done = [];
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    pf = A.pframe(ctx, w, h, { rmax: 5, rings: 5, rays: 12, R: Math.min(w, h) / 2 - 30 });
    // 각 눈금
    ["0", "π/6", "π/3", "π/2", "2π/3", "5π/6", "π", "7π/6", "4π/3", "3π/2", "5π/3", "11π/6"].forEach((t, j) => {
      const [x, y] = pf.P(5.45, j * PI / 6); label(ctx, t, x, y, C.ink3, "center", `10px ${F.mono}`);
    });
    done.forEach(({ t, ok }) => { const [x, y] = pf.P(t.r, t.k * PI); dot(ctx, x, y, ok ? C.forest : C.warn, 4); });
    const t = T[i];
    if (click) {
      const [tx, ty] = pf.P(t.r, t.k * PI);
      seg(ctx, pf.cx, pf.cy, tx, ty, C.forest, 1.4, [4, 3]);
      dot(ctx, click[0], click[1], C.ink, 5, true);
      dot(ctx, tx, ty, C.forest, 6);
      if (t.r < 0) { const [ax, ay] = pf.P(3, t.k * PI); seg(ctx, pf.cx, pf.cy, ax, ay, C.warn, 1.4, [2, 3]); label(ctx, "θ 방향", ax, ay - 10, C.warn, "center", `600 11px ${F.sans}`); }
    }
  }
  function nums() {
    const t = T[i];
    $(".tgt").textContent = i < T.length ? `목표 ${i + 1}: 극좌표 ${t.s}인 점을 누르세요.` : "";
    $(".n-k").textContent = `${i + 1} / ${T.length} · 맞힘 ${score}`;
    if (click) {
      const x = t.r * Math.cos(t.k * PI), y = t.r * Math.sin(t.k * PI);
      $(".n-xy").textContent = `(${n(x, 2)}, ${n(y, 2)})`;
    } else { $(".n-xy").textContent = "?"; $(".n-e").textContent = "—"; }
    draw();
  }
  cv.addEventListener("click", (e) => {
    if (!pf || click) return;
    const b = cv.getBoundingClientRect(); click = [e.clientX - b.left, e.clientY - b.top];
    const t = T[i], [tx, ty] = pf.P(t.r, t.k * PI), d = Math.hypot(click[0] - tx, click[1] - ty) / pf.S;
    const ok = d < 0.3; if (ok) score++;
    done.push({ t, ok });
    $(".n-e").textContent = n(d, 2);
    const v = $(".tgt"); v.textContent = ok ? `맞습니다. ${t.s}` : `${t.s}은 초록 점입니다.${t.r < 0 ? " r < 0이면 θ 방향의 반대쪽입니다." : t.k > 2 ? " 13π/6 = 2π + π/6입니다." : ""}`;
    v.className = "verdict tgt " + (ok ? "good" : "bad");
    $(".n-k").textContent = `${i + 1} / ${T.length} · 맞힘 ${score}`;
    const x = t.r * Math.cos(t.k * PI), y = t.r * Math.sin(t.k * PI);
    $(".n-xy").textContent = `(${n(x, 2)}, ${n(y, 2)})`;
    draw();
  });
  $(".go-next").addEventListener("click", () => { if (i < T.length - 1 && click) { i++; click = null; $(".tgt").className = "verdict tgt"; nums(); } });
  $(".go-reset").addEventListener("click", () => { i = 0; click = null; score = 0; done.length = 0; $(".tgt").className = "verdict tgt"; nums(); });
  nums();
})();
