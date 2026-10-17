/* 카드: 주문표의 개수와 금액으로 단가를 거꾸로 구할 수 있을까? — 2×2 역행렬, ad − bc = 0의 뜻 (모의 값) */
(() => {
  const root = document.getElementById("card-econ-inverse-steps");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const ids = ["a", "b", "c", "d", "e", "f"], el = Object.fromEntries(ids.map((k) => [k, $(`.${k}`)]));
  const INIT = { a: 2, b: 1, c: 1, d: 3, e: 11000, f: 13000 };
  const v = () => Object.fromEntries(ids.map((k) => [k, +el[k].value || 0]));
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const { a, b, c, d, e, f } = v(), XM = 8000, YM = 8000;
    const P = E.frame(ctx, size, { x0: 0, x1: XM, y0: 0, y1: YM, xt: [[0, "0"], [4000, "4천"], [8000, "8천"]], yt: [[0, "0"], [4000, "4천"], [8000, "8천"]], xlab: "김밥 x", ylab: "라면 y", L: 34, B: 30 });
    P.clip();
    const ln = (p, q, r, col, dash) => { if (Math.abs(q) > 1e-9) E.fn(ctx, P, (x) => (r - p * x) / q, 0, XM, col, 2.2, dash); else if (Math.abs(p) > 1e-9) E.line(ctx, P, [[r / p, 0], [r / p, YM]], col, 2.2, dash); };
    ln(a, b, e, E.BLUE); ln(c, d, f, C.warn, [6, 4]);
    ctx.restore();
    const det = a * d - b * c;
    if (Math.abs(det) > 1e-9) { const x = (d * e - b * f) / det, y = (a * f - c * e) / det; if (x >= 0 && y >= 0 && x <= XM && y <= YM) E.dot(ctx, P, x, y, C.ink, 5); }
  }
  function update() {
    const { a, b, c, d, e, f } = v(), det = a * d - b * c, out = $(".out");
    if (Math.abs(det) > 1e-9) {
      const x = (d * e - b * f) / det, y = (a * f - c * e) / det;
      out.innerHTML = `\\(ad - bc = ${a}\\cdot${d} - ${b}\\cdot${c} = ${det}\\)<br>\\(A^{-1} = \\dfrac{1}{${det}}\\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix}\\)<br>\\(\\begin{pmatrix} x \\\\ y \\end{pmatrix} = A^{-1}\\begin{pmatrix} ${e} \\\\ ${f} \\end{pmatrix} = \\begin{pmatrix} ${E.n(x, 1).replace(/,/g, "")} \\\\ ${E.n(y, 1).replace(/,/g, "")} \\end{pmatrix}\\)<br><span class="mono">김밥 ${E.n(x, 1)}원, 라면 ${E.n(y, 1)}원${x < 0 || y < 0 ? " · 음수 단가가 나왔습니다. 기록이 맞는지 확인하세요" : ""}</span>`;
    } else {
      const prop = Math.abs(a * f - c * e) < 1e-9 && Math.abs(b * f - d * e) < 1e-9;
      out.innerHTML = `\\(ad - bc = ${a}\\cdot${d} - ${b}\\cdot${c} = 0\\) → 역행렬이 없습니다.<br><span class="mono">${prop ? "두 주문이 비례하고 금액도 비례합니다. 두 직선이 겹쳐 해가 무수히 많아 단가를 하나로 정할 수 없습니다." : "개수는 비례하는데 금액은 비례하지 않습니다. 두 직선이 평행해 해가 없습니다(기록이 모순)."}</span>`;
    }
    if (window.NMMath) NMMath.render(out);
    draw();
  }
  ids.forEach((k) => el[k].addEventListener("input", update));
  $(".go-same").addEventListener("click", () => { const { a, b, e } = v(); el.c.value = 2 * a; el.d.value = 2 * b; el.f.value = 2 * e; update(); });
  $(".go-reset").addEventListener("click", () => { ids.forEach((k) => (el[k].value = INIT[k])); update(); });
  update();
})();
