/* 카드: 각뿔의 부피는 왜 각기둥의 1/3일까? — 정사각형 판을 쌓은 계단 입체(비스듬한 투영) */
(() => {
  const root = document.getElementById("card-pmath-pyramid");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn");
  let mode = "out";
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const N = +sn.value;
    // 투영: 3D (x, y, z) → 화면. x 오른쪽, y 깊이(오른쪽 위로 비스듬히), z 위
    const S = Math.min(w * 0.5, h * 0.72), ox = w * 0.5 - S * 0.62, oy = h - 16;
    const P = (x, y, z) => [ox + S * (x + 0.45 * y), oy - S * (z + 0.32 * y)];
    const poly = (pts, fill, stroke, lw = 1) => {
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
    };
    // 기둥(정육면체) 테두리
    ctx.save(); ctx.setLineDash([4, 4]);
    const cube = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]];
    poly(cube.map(([x, y]) => P(x, y, 1)), null, C.ink3);
    cube.forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(...P(x, y, 0)); ctx.lineTo(...P(x, y, 1)); ctx.strokeStyle = C.ink3; ctx.stroke(); });
    poly(cube.map(([x, y]) => P(x, y, 0)), null, C.ink3);
    ctx.restore();
    // 판: 아래에서 위로 그린다(가려짐 순서). 꼭짓점은 (0.5, 0.5, 1) 위, 밑면 중심 (0.5, 0.5)
    const d = 1 / N, edge = N > 30 ? 0 : 0.8;
    for (let i = 0; i < N; i++) {
      const z0 = i * d, z1 = z0 + d;
      const k = N - i;                                  // 위에서 k번째
      const side = mode === "out" ? k / N : (k - 1) / N;
      if (side <= 0) continue;
      const a = 0.5 - side / 2, b = 0.5 + side / 2;
      const shade = 0.55 + 0.4 * (i / N);
      const top = `rgba(116,171,102,${shade})`, front = `rgba(59,124,42,${shade})`, right = `rgba(47,99,33,${shade})`;
      poly([P(a, a, z0), P(b, a, z0), P(b, a, z1), P(a, a, z1)], front, edge ? C.card : null, edge);
      poly([P(b, a, z0), P(b, b, z0), P(b, b, z1), P(b, a, z1)], right, edge ? C.card : null, edge);
      poly([P(a, a, z1), P(b, a, z1), P(b, b, z1), P(a, b, z1)], top, edge ? C.card : null, edge);
    }
    // 뿔의 모서리
    ctx.strokeStyle = C.warn; ctx.lineWidth = 1.6;
    [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(...P(x, y, 0)); ctx.lineTo(...P(0.5, 0.5, 1)); ctx.stroke(); });
    poly([[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => P(x, y, 0)), null, C.warn, 1.6);
    label(ctx, "빨간 선: 정사각뿔 · 점선: 정육면체(기둥)", 8, 12, C.ink2, "left", `11.5px ${F.sans}`);
  }

  function update() {
    const N = +sn.value;
    const vo = (N + 1) * (2 * N + 1) / (6 * N * N), vi = (N - 1) * (2 * N - 1) / (6 * N * N);
    $(".n-out").textContent = N;
    $(".n-o").textContent = n(vo, 5); $(".n-i").textContent = n(vi, 5); $(".n-d").textContent = `${n(vo - vi, 5)} = 1/${N}`;
    draw();
  }
  root.querySelectorAll(".presets .chip").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.m; root.querySelectorAll(".presets .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); draw();
  }));
  sn.addEventListener("input", update);
  update();
})();
