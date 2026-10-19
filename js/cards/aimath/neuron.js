/* 카드: 인공 뉴런 하나는 입력을 어떻게 확률로 바꿀까? — z = w·x + b, σ(z) (가상 뉴런) */
(() => {
  const root = document.getElementById("card-aimath-neuron");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const K = ["x1", "x2", "w1", "w2", "b"], el = Object.fromEntries(K.map((k) => [k, $(`.${k}`)]));
  const v = () => Object.fromEntries(K.map((k) => [k, +el[k].value]));
  const sig = (z) => 1 / (1 + Math.exp(-z));
  const net = fit($(".net"), () => drawNet()), sg = fit($(".sig"), () => drawSig());
  function node(ctx, x, y, r, fill, txt, sub) { ctx.save(); ctx.fillStyle = fill; ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); E.text(ctx, x, y + 4, txt, C.ink, "center", `600 12px ${F.mono}`); if (sub) E.text(ctx, x, y + r + 14, sub, C.ink2, "center"); }
  function drawNet() {
    const { ctx, size: { w, h } } = net; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = v(), z = p.w1 * p.x1 + p.w2 * p.x2 + p.b, o = sig(z), xi = w * 0.12, xs = w * 0.5, xo = w * 0.86, y1 = h * 0.28, y2 = h * 0.68, ym = h * 0.48;
    [[y1, p.w1, "w₁"], [y2, p.w2, "w₂"]].forEach(([y, ww, lab]) => { ctx.save(); ctx.strokeStyle = ww >= 0 ? E.BLUE : C.warn; ctx.lineWidth = 1 + Math.abs(ww) * 0.9; ctx.beginPath(); ctx.moveTo(xi, y); ctx.lineTo(xs, ym); ctx.stroke(); ctx.restore(); E.text(ctx, (xi + xs) / 2, (y + ym) / 2 - 8, `${lab} = ${ww}`, ww >= 0 ? E.BLUE : C.warn, "center", `11px ${F.mono}`); });
    ctx.save(); ctx.strokeStyle = C.ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xs, ym); ctx.lineTo(xo, ym); ctx.stroke(); ctx.restore();
    node(ctx, xi, y1, 18, "#fff", p.x1.toFixed(2), "습도"); node(ctx, xi, y2, 18, "#fff", p.x2.toFixed(2), "햇빛");
    node(ctx, xs, ym, 24, "rgba(141,141,146,.15)", z.toFixed(2), `z (b = ${p.b})`);
    node(ctx, xo, ym, 22, `rgba(59,124,42,${0.15 + 0.7 * o})`, o.toFixed(2), "σ(z)");
  }
  function drawSig() {
    const { ctx, size } = sg; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const p = v(), z = p.w1 * p.x1 + p.w2 * p.x2 + p.b;
    const P = E.frame(ctx, size, { x0: -8, x1: 8, y0: 0, y1: 1, xt: [[-8, "−8"], [-4, "−4"], [0, "0"], [4, "4"], [8, "8"]], yt: [[0, "0"], [0.5, "0.5"], [1, "1"]], xlab: "z", L: 32 });
    E.fn(ctx, P, sig, -8, 8, C.ink, 2.2);
    const zc = Math.max(-8, Math.min(8, z)); E.dot(ctx, P, zc, sig(zc), C.forest, 5.5, `σ(${z.toFixed(2)}) = ${sig(z).toFixed(3)}`, 8, 12);
  }
  function update() {
    const p = v(), z = p.w1 * p.x1 + p.w2 * p.x2 + p.b;
    K.forEach((k) => ($(`.${k}-out`).textContent = (+el[k].value).toFixed(k[0] === "x" ? 2 : 1)));
    $(".say").textContent = `z = ${p.w1}×${p.x1.toFixed(2)} + ${p.w2}×${p.x2.toFixed(2)} + (${p.b}) = ${z.toFixed(2)} → σ(z) = 1/(1 + e^(−z)) = ${sig(z).toFixed(3)}`;
    drawNet(); drawSig();
  }
  K.forEach((k) => el[k].addEventListener("input", update));
  update();
})();
