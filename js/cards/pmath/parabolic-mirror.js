/* 카드: 위성 안테나는 왜 접시 모양일까? — 포물선 x² = 4py (p = 1) 거울의 반사 */
(() => {
  const root = document.getElementById("card-pmath-parabolic-mirror");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, dot, seg, arrow, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa"), sk = $(".sk"), p = 1, X = 3.2;
  let mode = "in";
  const { ctx, size } = fit($("canvas"), () => draw());
  const yOf = (x) => x * x / (4 * p);
  /* 반사: d를 단위 법선 m에 대하여 뒤집는다 */
  const reflect = (d, m) => { const k = 2 * (d[0] * m[0] + d[1] * m[1]); return [d[0] - k * m[0], d[1] - k * m[1]]; };
  const normalAt = (x) => { const m = [-x / (2 * p), 1], L = Math.hypot(...m); return [m[0] / L, m[1] / L]; };
  /* 위에서 내려오는 방향 d(단위)의 빛이 x = x0를 겨냥해 들어올 때 포물선과 만나는 점: 직선 (x0 + t dx, H + t dy) */
  function hitFrom(x0, d) {
    const Hh = 3.4, ox = x0 + d[0] / d[1] * (Hh - yOf(x0)), oy = Hh;   // 직선이 (x0, x0²/4p)를 지나도록 출발점을 정함
    // (ox + t dx)² = 4p(oy + t dy) → t² dx² + t(2 ox dx − 4p dy) + ox² − 4p oy = 0
    const A = d[0] * d[0], B = 2 * ox * d[0] - 4 * p * d[1], Cc = ox * ox - 4 * p * oy;
    let t;
    if (Math.abs(A) < 1e-12) t = -Cc / B;
    else { const D = B * B - 4 * A * Cc; if (D < 0) return null; const r1 = (-B - Math.sqrt(D)) / (2 * A), r2 = (-B + Math.sqrt(D)) / (2 * A); t = Math.min(...[r1, r2].filter((v) => v > 0)); }
    return { o: [ox, oy], q: [ox + t * d[0], oy + t * d[1]] };
  }

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = Math.min(w / (2 * X + 0.6), h / 4.2), ox = w / 2, oy = h - 14;
    const P = (x, y) => [ox + x * s, oy - y * s];
    seg(ctx, ...P(0, -0.1), ...P(0, 3.9), C.rule, 1, [3, 3]);
    // 거울
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath();
    for (let i = 0; i <= 100; i++) { const x = -X + 2 * X * i / 100; i ? ctx.lineTo(...P(x, yOf(x))) : ctx.moveTo(...P(x, yOf(x))); }
    ctx.stroke();
    dot(ctx, ...P(0, p), C.warn, 5.5); label(ctx, "F", P(0, p)[0] + 9, P(0, p)[1], C.warn, "left", `italic 700 13px ${F.serif}`);
    const xs = [-2.8, -2.1, -1.4, -0.7, 0.35, 1, 1.7, 2.4, 3.0], hot = +sk.value;
    if (mode === "in") {
      const a = +sa.value * Math.PI / 180, d = [Math.sin(a), -Math.cos(a)];
      xs.forEach((x0, i) => {
        const hit = hitFrom(x0, d); if (!hit) return;
        const { o, q } = hit, m = normalAt(q[0]), r = reflect(d, m), L = 4.2;
        const thick = i === hot ? 2.4 : 1.2, col = i === hot ? C.amber : "#d9a94a";
        seg(ctx, ...P(...o), ...P(...q), col, thick);
        arrow(ctx, ...P(...q), ...P(q[0] + r[0] * L * 0.55, q[1] + r[1] * L * 0.55), col, thick, 7);
        seg(ctx, ...P(...q), ...P(q[0] + r[0] * L, q[1] + r[1] * L), col, thick * 0.6);
        if (i === hot) {
          const tx = [1, q[0] / (2 * p)], tl = Math.hypot(...tx);
          seg(ctx, ...P(q[0] - tx[0] / tl * 1.4, q[1] - tx[1] / tl * 1.4), ...P(q[0] + tx[0] / tl * 1.4, q[1] + tx[1] / tl * 1.4), BLUE, 1.6);
          $(".eq").textContent = `굵은 빛이 닿은 점 (${n(q[0], 2)}, ${n(q[1], 2)})의 접선: ${n(q[0], 2)}x = 2(y + ${n(q[1], 2)})`;
        }
      });
    } else {
      xs.forEach((x0, i) => {
        const q = [x0, yOf(x0)], d0 = [q[0], q[1] - p], L0 = Math.hypot(...d0), d = [d0[0] / L0, d0[1] / L0];
        const r = reflect(d, normalAt(q[0])), thick = i === hot ? 2.4 : 1.2, col = i === hot ? C.amber : "#d9a94a";
        seg(ctx, ...P(0, p), ...P(...q), col, thick);
        arrow(ctx, ...P(...q), ...P(q[0] + r[0] * 2.4, q[1] + r[1] * 2.4), col, thick, 7);
      });
      $(".eq").textContent = "초점에서 나간 빛은 반사된 뒤 모두 축(y축)과 나란하게 나갑니다.";
    }
  }
  function update() { $(".a-out").textContent = `${sa.value}°`; $(".k-out").textContent = +sk.value + 1; draw(); }
  root.querySelectorAll(".presets .chip").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m; root.querySelectorAll(".presets .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    sa.disabled = mode === "out"; update();
  }));
  [sa, sk].forEach((el) => el.addEventListener("input", update));
  update();
})();
