/* 카드: 두 주사위 눈의 합은 왜 7이 가장 잘 나올까? — 36가지 결과를 눌러 확률분포를 쌓는다 */
(() => {
  const root = document.getElementById("card-pmath-dice-dist");
  if (!root) return;
  const { fit } = NM;
  const $ = (s) => root.querySelector(s);
  const grid = $(".grid");
  const RV = {
    sum: { f: (a, b) => a + b, vals: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], name: "X = 눈의 합" },
    diff: { f: (a, b) => Math.abs(a - b), vals: [0, 1, 2, 3, 4, 5], name: "X = |a − b|" },
    max: { f: (a, b) => Math.max(a, b), vals: [1, 2, 3, 4, 5, 6], name: "X = 큰 눈" },
  };
  let rk = "sum", used = new Set();
  const { ctx, size } = fit($("canvas"), () => draw());

  function build() {
    grid.innerHTML = "";
    for (let b = 1; b <= 6; b++) for (let a = 1; a <= 6; a++) {
      const el = document.createElement("button"); el.type = "button"; el.dataset.k = `${a},${b}`;
      el.textContent = used.has(`${a},${b}`) ? RV[rk].f(a, b) : `${a},${b}`;
      el.className = used.has(`${a},${b}`) ? "used" : ""; el.setAttribute("aria-label", `(${a}, ${b})`);
      grid.append(el);
    }
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const R = RV[rk], cnt = R.vals.map(() => 0), truth = R.vals.map(() => 0);
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) { const i = R.vals.indexOf(R.f(a, b)); truth[i]++; if (used.has(`${a},${b}`)) cnt[i]++; }
    NMSim.bars(ctx, { x0: 34, y0: 10, w: w - 42, h: h - 34 }, cnt.map((c) => c / 36), {
      labels: R.vals.map(String), top: Math.max(...truth) / 36 * 1.15, expect: used.size === 36 ? truth.map((t) => t / 36) : null,
      yfmt: (v) => `${Math.round(v * 36)}/36`, ylabel: R.name,
    });
    $(".cnt").textContent = `넣은 결과 ${used.size} / 36 · 확률의 합 ${used.size}/36`;
  }
  grid.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b || used.has(b.dataset.k)) return; used.add(b.dataset.k); build(); draw(); });
  $(".go-all").addEventListener("click", () => { for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) used.add(`${a},${b}`); build(); draw(); });
  $(".go-reset").addEventListener("click", () => { used.clear(); build(); draw(); });
  root.querySelectorAll(".rv .chip").forEach((b) => b.addEventListener("click", () => {
    rk = b.dataset.v; root.querySelectorAll(".rv .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); used.clear(); build(); draw();
  }));
  build();
})();
