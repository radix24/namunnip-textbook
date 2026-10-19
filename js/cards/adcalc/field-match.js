/* 카드: 방향장만 보고 미분방정식을 알아맞힐 수 있을까? — 네 방향장과 네 방정식 짝짓기 */
(() => {
  const root = document.getElementById("card-adcalc-field-match");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMCalc;
  const { label, BLUE } = NMPm;
  const A = NMAdc;
  const $ = (s) => root.querySelector(s);
  const verdict = $(".verdict"), bSol = $(".go-sol");
  const EQ = [(x) => x, (x, y) => y, (x, y) => x + y, (x, y) => -y / x];
  const PANEL = { A: 2, B: 3, C: 0, D: 1 };   // 패널 글자 → 방정식 번호
  const pick = {};
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pw = w / 2, ph = h / 2;
    ["A", "B", "C", "D"].forEach((L, i) => {
      const ox = (i % 2) * pw, oy = Math.floor(i / 2) * ph;
      ctx.save(); ctx.translate(ox, oy);
      const g = G.frame(ctx, pw, ph, { xr: [-2, 2], yr: [-2, 2], xs: 1, ys: 1, L: 18, B: 16, T: 16, R: 6, xf: () => "", yf: () => "" });
      const f = EQ[PANEL[L]];
      A.field(ctx, g, f, { nx: 11, ny: 11, color: C.ink2 });
      if (bSol.getAttribute("aria-pressed") === "true") [-1.5, -0.6, 0.6, 1.5].forEach((y0) => {
        const x0 = PANEL[L] === 3 ? 1 : 0.01;
        const pts = A.rk4(f, x0, y0, 2, 0.01, 20).concat([]), back = A.rk4(f, x0, y0, PANEL[L] === 3 ? 0.05 : -2, 0.01, 20);
        A.path(ctx, g, back.reverse().concat(pts.slice(1)), BLUE, { width: 1.6 });
        if (PANEL[L] === 3) { const p2 = A.rk4(f, -x0, -y0, -2, 0.01, 20), b2 = A.rk4(f, -x0, -y0, -0.05, 0.01, 20); A.path(ctx, g, b2.reverse().concat(p2.slice(1)), BLUE, { width: 1.6 }); }
      });
      label(ctx, L, 8, 9, C.forest, "left", `700 13px ${F.sans}`);
      ctx.restore();
    });
  }
  root.querySelectorAll(".row").forEach((row) => row.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => {
    row.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    pick[row.dataset.e] = b.dataset.v;
  })));
  $(".go-check").addEventListener("click", () => {
    let ok = 0; const wrong = [];
    [0, 1, 2, 3].forEach((e) => { if (pick[e] && PANEL[pick[e]] === e) ok++; else wrong.push(["y′ = x", "y′ = y", "y′ = x + y", "y′ = −y/x"][e]); });
    verdict.textContent = ok === 4 ? "네 짝을 모두 맞혔습니다." : `${ok}개 맞음. 다시 볼 것: ${wrong.join(", ")}`;
    verdict.className = "verdict " + (ok === 4 ? "good" : "bad");
  });
  bSol.addEventListener("click", () => { bSol.setAttribute("aria-pressed", String(bSol.getAttribute("aria-pressed") !== "true")); draw(); });
  draw();
})();
