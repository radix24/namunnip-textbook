/* 카드: 지금 100만 원과 5년 뒤 130만 원, 어느 쪽이 더 이득일까? — 현재 가치와 할인율 (가상 상황) */
(() => {
  const root = document.getElementById("card-econ-present-value");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const rIn = $(".r");
  /* 각 방법: [이름, [[받는 해, 금액], ...]] */
  const OPT = [["A 지금", [[0, 100]]], ["B 2년 뒤", [[2, 110]]], ["C 5년 뒤", [[5, 130]]], ["D 나눠 받기", [1, 2, 3, 4, 5].map((t) => [t, 24])]];
  const COL = [E.BLUE, E.ORANGE, C.forest, E.PURPLE];
  const pv = (cf, r) => cf.reduce((s, [t, a]) => s + a / (1 + r) ** t, 0);
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const r = +rIn.value / 100, v = OPT.map(([, cf]) => pv(cf, r)), best = v.indexOf(Math.max(...v));
    const P = E.frame(ctx, size, { x0: 0, x1: 4, y0: 0, y1: 140, xt: [], yt: [0, 50, 100], ylab: "현재 가치(만 원)", B: 34 });
    const bw = (P.X(1) - P.X(0)) * 0.56;
    OPT.forEach(([nm, cf], i) => {
      const cx = P.X(i + 0.5), nom = cf.reduce((s, [, a]) => s + a, 0);
      ctx.fillStyle = "rgba(141,141,146,.18)"; ctx.fillRect(cx - bw / 2, P.Y(nom), bw, P.Y(0) - P.Y(nom));
      ctx.fillStyle = COL[i]; ctx.fillRect(cx - bw / 2, P.Y(v[i]), bw, P.Y(0) - P.Y(v[i]));
      if (i === best) { ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.strokeRect(cx - bw / 2, P.Y(v[i]), bw, P.Y(0) - P.Y(v[i])); }
      E.text(ctx, cx, P.Y(v[i]) - 5, E.n(v[i], 1), C.ink, "center", `600 11px ${F.mono}`);
      E.text(ctx, cx, P.Y(0) + 16, nm, C.ink2, "center");
    });
    E.text(ctx, P.L + P.w, P.T + 2, "회색: 받는 금액의 합", C.ink3, "right");
  }
  function update() {
    const r = +rIn.value / 100, v = OPT.map(([, cf]) => pv(cf, r)), best = v.indexOf(Math.max(...v));
    $(".r-out").textContent = E.n(+rIn.value, 1);
    $(".say").textContent = `할인율 ${E.n(r * 100, 1)}%에서 현재 가치: ${OPT.map(([nm], i) => `${nm[0]} ${E.n(v[i], 1)}`).join(", ")}만 원 → 가장 유리한 방법은 ${OPT[best][0][0]}`;
    draw();
  }
  rIn.addEventListener("input", update);
  update();
})();
