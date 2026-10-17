/* 카드: ㄱ자 모양 방에 장판을 깔려면 몇 m²를 주문해야 할까? — 나누기와 빼기, 모서리를 뺀 도형의 둘레 (수업용 가정) */
(() => {
  const root = document.getElementById("card-jmath-floor-area");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const ins = ["A", "B", "a", "b"].map((k) => $(`.${k}`));
  let mode = 0;
  const { ctx, size } = fit($("canvas"), () => draw());
  const val = () => { let [A, B, a, b] = ins.map((x) => +x.value); a = Math.min(a, A - 0.5); b = Math.min(b, B - 0.5); return { A, B, a, b }; };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const { A, B, a, b } = val(), u = Math.min((w - 60) / 10, (h - 50) / 10), x0 = 40, y0 = 20, X = (x) => x0 + x * u, Y = (y) => y0 + y * u;
    /* 빠진 부분: 오른쪽 위 모서리 */
    const poly = [[0, 0], [A - a, 0], [A - a, b], [A, b], [A, B], [0, B]];
    if (mode === 0) { ctx.fillStyle = "rgba(63,111,163,.3)"; ctx.fillRect(X(0), Y(0), (A - a) * u, B * u); ctx.fillStyle = "rgba(224,160,42,.4)"; ctx.fillRect(X(A - a), Y(b), a * u, (B - b) * u); }
    else { ctx.fillStyle = "rgba(63,111,163,.3)"; ctx.fillRect(X(0), Y(0), A * u, B * u); ctx.fillStyle = "rgba(181,83,47,.18)"; ctx.fillRect(X(A - a), Y(0), a * u, b * u); ctx.setLineDash([5, 4]); ctx.strokeStyle = C.warn; ctx.strokeRect(X(A - a), Y(0), a * u, b * u); ctx.setLineDash([]); }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); poly.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = C.ink2; ctx.font = `11px ${F.mono}`; ctx.textAlign = "center";
    ctx.fillText(`${A.toFixed(1)} m`, X(A / 2), Y(B) + 16); ctx.fillText(`${a.toFixed(1)}`, X(A - a / 2), Y(b) + 14);
    ctx.save(); ctx.translate(X(0) - 12, Y(B / 2)); ctx.rotate(-Math.PI / 2); ctx.fillText(`${B.toFixed(1)} m`, 0, 0); ctx.restore();
    ctx.textAlign = "left"; ctx.fillText(`${b.toFixed(1)}`, X(A - a) + 4, Y(b / 2) + 4);
  }
  function update() {
    const { A, B, a, b } = val();
    ["A", "B", "a", "b"].forEach((k, i) => ($(`.${k}-out`).textContent = (+ins[i].value).toFixed(1)));
    const area = A * B - a * b, per = 2 * (A + B), order = area * 1.1;
    const how = mode === 0 ? `${(A - a).toFixed(1)}×${B.toFixed(1)} + ${a.toFixed(1)}×${(B - b).toFixed(1)}` : `${A.toFixed(1)}×${B.toFixed(1)} − ${a.toFixed(1)}×${b.toFixed(1)}`;
    $(".say").textContent = `넓이 = ${how} = ${area.toFixed(2)} m² · 둘레 = 2(${A.toFixed(1)} + ${B.toFixed(1)}) = ${per.toFixed(1)} m · 장판 주문(손실 10%) ${order.toFixed(2)} m² → ${Math.ceil(order)} m², ${(Math.ceil(order) * 2).toLocaleString()}만 원 · 걸레받이 ${per.toFixed(1)} m → ${(per * 0.5).toFixed(1)}만 원`;
    draw();
  }
  ins.forEach((x) => x.addEventListener("input", update));
  root.querySelectorAll("[data-m]").forEach((btn) => btn.addEventListener("click", () => { mode = +btn.dataset.m; root.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", String(x === btn))); update(); }));
  update();
})();
