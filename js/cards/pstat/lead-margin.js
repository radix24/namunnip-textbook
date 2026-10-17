/* 카드: A 47%, B 43%면 A가 앞설까? — 같은 조사 두 비율의 차이 신뢰구간 d ± 1.96√((pA + pB − d²)/n) */
(() => {
  const root = document.getElementById("card-pstat-lead-margin");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".a"), bIn = $(".b"), nIn = $(".n");
  const { ctx, size } = fit($("canvas"), () => draw());
  const calc = () => {
    const a = +aIn.value / 100, b = Math.min(+bIn.value / 100, 1 - a), n = +nIn.value, d = a - b;
    return { a, b, n, d, ea: 1.96 * Math.sqrt((a * (1 - a)) / n), eb: 1.96 * Math.sqrt((b * (1 - b)) / n), ed: 1.96 * Math.sqrt((a + b - d * d) / n) };
  };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const c = calc(), L = 110, R = 16, X0 = (v) => L + ((w - L - R) * v) / 0.8, rowH = (h - 28) / 3;
    ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "center"; ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
    for (let v = 0; v <= 0.8 + 1e-9; v += 0.1) { ctx.beginPath(); ctx.moveTo(X0(v), 4); ctx.lineTo(X0(v), rowH * 2 + 4); ctx.stroke(); ctx.fillText(`${Math.round(v * 100)}%`, X0(v), rowH * 2 + 16); }
    const row = (i, name, v, e, col) => {
      const y = 4 + (i + 0.5) * rowH; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0(v - e), y); ctx.lineTo(X0(v + e), y); ctx.stroke();
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(X0(v), y, 5, 0, 7); ctx.fill();
      ctx.fillStyle = C.ink2; ctx.font = `12px ${F.sans}`; ctx.textAlign = "right"; ctx.fillText(name, L - 8, y + 4);
    };
    row(0, `A ${(c.a * 100).toFixed(0)}%`, c.a, c.ea, C.warn); row(1, `B ${(c.b * 100).toFixed(0)}%`, c.b, c.eb, "#3f6fa3");
    /* 아래 줄: 차이의 신뢰구간(가로 −20%p ~ +20%p) */
    const y = rowH * 2 + 4 + rowH * 0.62, XD = (v) => L + ((w - L - R) * (v + 0.2)) / 0.4;
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(XD(-0.2), y); ctx.lineTo(XD(0.2), y); ctx.stroke();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(XD(0), y - 12); ctx.lineTo(XD(0), y + 12); ctx.stroke(); ctx.setLineDash([]);
    const col = Math.abs(c.d) > c.ed ? C.forest : C.ink3;
    ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(XD(Math.max(-0.2, c.d - c.ed)), y); ctx.lineTo(XD(Math.min(0.2, c.d + c.ed)), y); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(XD(Math.max(-0.2, Math.min(0.2, c.d))), y, 5, 0, 7); ctx.fill();
    ctx.fillStyle = C.ink2; ctx.font = `12px ${F.sans}`; ctx.textAlign = "right"; ctx.fillText("차이 A − B", L - 8, y + 4);
    ctx.font = `10px ${F.mono}`; ctx.textAlign = "center"; [-0.2, -0.1, 0, 0.1, 0.2].forEach((v) => ctx.fillText(`${v > 0 ? "+" : ""}${Math.round(v * 100)}`, XD(v), y + 22));
  }
  function update() {
    const c = calc();
    $(".a-out").textContent = aIn.value; $(".b-out").textContent = Math.round(c.b * 100); $(".n-out").textContent = c.n;
    const lead = Math.abs(c.d) > c.ed, rule = Math.abs(c.d) > 2 * Math.max(c.ea, c.eb);
    $(".say").textContent = `각 오차범위 A ±${(100 * c.ea).toFixed(1)}%p, B ±${(100 * c.eb).toFixed(1)}%p · 차이 ${(100 * c.d).toFixed(0)}%p ± ${(100 * c.ed).toFixed(1)}%p → ${lead ? "구간이 0을 포함하지 않음: 앞섰다고 판단" : "구간이 0을 포함: 접전"} · 언론 기준(오차범위의 2배): ${rule ? "오차범위 밖" : "오차범위 내"}`;
    draw();
  }
  [aIn, bIn, nIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
