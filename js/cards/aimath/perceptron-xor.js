/* 카드: 인공 뉴런 하나로 "둘 중 하나만 참"을 판단할 수 있을까? — 퍼셉트론과 선형 분리 */
(() => {
  const root = document.getElementById("card-aimath-perceptron-xor");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const w1In = $(".w1"), w2In = $(".w2"), bIn = $(".b"), X = [[0, 0], [1, 0], [0, 1], [1, 1]];
  const T = { and: [0, 0, 0, 1], or: [0, 1, 1, 1], xor: [0, 1, 1, 0] };
  let task = "and";
  const out = (x) => (+w1In.value * x[0] + +w2In.value * x[1] + +bIn.value > 0 ? 1 : 0);
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: -0.5, x1: 1.5, y0: -0.5, y1: 1.5, xt: [0, 1], yt: [0, 1], xlab: "x₁", ylab: "x₂", L: 26, B: 26 });
    const cell = 5; for (let px = P.L; px < P.L + P.w; px += cell) for (let py = P.T; py < P.T + P.h; py += cell) { if (out(P.inv(px + cell / 2, py + cell / 2))) { ctx.fillStyle = "rgba(63,111,163,.16)"; ctx.fillRect(px, py, cell, cell); } }
    const a = +w1In.value, b = +w2In.value, c = +bIn.value;
    P.clip();
    if (Math.abs(b) > 1e-9) E.fn(ctx, P, (x) => -(a * x + c) / b, -0.5, 1.5, E.BLUE, 2.2); else if (Math.abs(a) > 1e-9) E.line(ctx, P, [[-c / a, -0.5], [-c / a, 1.5]], E.BLUE, 2.2);
    ctx.restore();
    X.forEach((x, i) => { const want = T[task][i], got = out(x); ctx.save(); ctx.fillStyle = want ? "#3f6fa3" : "#fff"; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(P.X(x[0]), P.Y(x[1]), 9, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); E.text(ctx, P.X(x[0]) + 12, P.Y(x[1]) - 10, got === want ? "맞음" : "틀림", got === want ? C.forest : C.warn, "left", `600 11px ${F.sans}`); });
  }
  function update() {
    $(".w1-out").textContent = E.n(+w1In.value, 1); $(".w2-out").textContent = E.n(+w2In.value, 1); $(".b-out").textContent = E.n(+bIn.value, 1);
    const right = X.filter((x, i) => out(x) === T[task][i]).length;
    $(".verdict").textContent = `${task.toUpperCase()}: 네 점 중 ${right}개 맞음` + (right === 4 ? " · 성공!" : task === "xor" && right === 3 ? " · 셋까지는 되지만 넷은 될까요?" : "") + " (채운 원: 1이어야 함, 빈 원: 0이어야 함, 파란 영역: 퍼셉트론이 1로 판단)";
    draw();
  }
  [w1In, w2In, bIn].forEach((el) => el.addEventListener("input", update));
  root.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => { task = b.dataset.t; root.querySelectorAll("[data-t]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  $(".go-proof").addEventListener("click", () => {
    const p = $(".proof"); p.hidden = false;
    p.innerHTML = "XOR을 맞힌다고 가정하면 네 부등식이 모두 성립해야 합니다.<br>\\((0, 0) \\to 0\\): \\(b \\le 0\\) &nbsp; \\((1, 0) \\to 1\\): \\(w_1 + b > 0\\) &nbsp; \\((0, 1) \\to 1\\): \\(w_2 + b > 0\\) &nbsp; \\((1, 1) \\to 0\\): \\(w_1 + w_2 + b \\le 0\\)<br>가운데 두 식을 더하면 \\(w_1 + w_2 + 2b > 0\\), 곧 \\(w_1 + w_2 + b > -b \\ge 0\\)입니다. 이는 마지막 식과 모순이므로, 어떤 \\(w_1, w_2, b\\)도 XOR을 맞힐 수 없습니다.";
    if (window.NMMath) NMMath.render(p);
  });
  update();
})();
