/* 카드: 계속 커지는데 어떤 수도 넘지 못하는 수열은 어디로 갈까? — 단조증가수열과 끄는 천장 M */
(() => {
  const root = document.getElementById("card-adcalc-monotone");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, drag, label, seg, dot, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const cv = $("canvas"), NMAX = 10000;
  function seq(k) {
    const a = new Float64Array(NMAX + 1);
    if (k === "nest") { a[1] = Math.SQRT2; for (let i = 2; i <= NMAX; i++) a[i] = Math.sqrt(2 + a[i - 1]); }
    if (k === "e") for (let i = 1; i <= NMAX; i++) a[i] = (1 + 1 / i) ** i;
    if (k === "sq") { let s = 0; for (let i = 1; i <= NMAX; i++) { s += 1 / (i * i); a[i] = s; } }
    if (k === "h") { let s = 0; for (let i = 1; i <= NMAX; i++) { s += 1 / i; a[i] = s; } }
    return a;
  }
  const YR = { nest: [1.3, 2.2], e: [1.9, 2.9], sq: [0.9, 1.8], h: [0.5, 10.5] };
  let pk = "nest", a = seq(pk), M = 2.15, g = null;
  const { ctx, size } = fit(cv, () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const [y0, y1] = YR[pk], L = 36, T = 10, W = w - L - 10, H = h - T - 26;
    const X = (i) => L + Math.log10(i) / 4 * W, Y = (v) => T + (y1 - v) / (y1 - y0) * H;
    g = { Y, iy: (py) => y1 - (py - T) / H * (y1 - y0), T, H };
    const st = (y1 - y0) > 4 ? 2 : (y1 - y0) > 0.8 ? 0.2 : 0.1, yt = [];
    for (let v = Math.ceil(y0 / st) * st; v <= y1 + 1e-9; v += st) yt.push([+v.toFixed(3), n(v, 2)]);
    NM.axes(ctx, { x0: L, y0: T, w: W, h: H, X, Y, xt: [1, 10, 100, 1000, 10000].map((v) => [v, v >= 1000 ? `10${v === 1000 ? "³" : "⁴"}` : String(v)]), yt });
    // 점 (로그 간격으로 솎음)
    let last = -1;
    for (let i = 1; i <= NMAX; i++) {
      const px = X(i); if (px - last < 2.2 && i !== NMAX) continue; last = px;
      const over = a[i] > M + 1e-12;
      dot(ctx, px, Y(a[i]), over ? C.warn : BLUE, over ? 3.2 : 2.6);
    }
    seg(ctx, L, Y(M), L + W, Y(M), C.forest, 2);
    ctx.fillStyle = C.forest; ctx.fillRect(L + W - 46, Y(M) - 9, 44, 18);
    label(ctx, `M = ${n(M, 3)}`, L + W - 50, Y(M) - 14, C.forest, "right", `600 11px ${F.mono}`);
    ctx.fillStyle = C.card; ctx.font = `600 10px ${F.sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("끌기", L + W - 24, Y(M));
  }
  function nums() {
    let over = 0; for (let i = 1; i <= NMAX; i++) if (a[i] > M + 1e-12) over++;
    $(".n-m").textContent = n(M, 3);
    $(".n-a").textContent = n(a[NMAX], 5);
    const o = $(".n-o"); o.textContent = over ? `${over}개` : "없음"; o.classList.toggle("bad", over > 0);
    draw();
  }
  drag(cv, (x, y) => (g && Math.abs(y - g.Y(M)) < 16 ? 1 : null), (_, x, y) => { const [y0, y1] = YR[pk]; M = Math.round(NM.clamp(g.iy(y), y0, y1) * 1000) / 1000; nums(); }, null, "none");
  root.querySelectorAll(".presets .chip").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll(".presets .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    pk = b.dataset.p; a = seq(pk); M = YR[pk][1] - (YR[pk][1] - YR[pk][0]) * 0.06; nums();
  }));
  nums();
})();
