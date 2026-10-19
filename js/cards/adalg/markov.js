/* 카드: 공유 자전거는 며칠 뒤 어느 대여소에 모일까? — 2상태 마르코프 연쇄(모의 비율), 행렬 계산과 300대 모의 실험 */
(() => {
  const root = document.getElementById("card-adalg-markov");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p"), qIn = $(".q"), aIn = $(".a0"), DAYS = 20, BIKES = 300;
  let sim = [], seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const { ctx, size } = fit($("canvas"), () => draw());
  function runSim() {
    const p = +pIn.value, q = +qIn.value;
    let at = [...Array(BIKES)].map((_, i) => (i < Math.round((BIKES * +aIn.value) / 100) ? 0 : 1));
    sim = [at.filter((x) => !x).length / BIKES];
    for (let d = 0; d < DAYS; d++) { at = at.map((s) => (s === 0 ? (rand() < p ? 1 : 0) : rand() < q ? 0 : 1)); sim.push(at.filter((x) => !x).length / BIKES); }
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const Lm = 36, R = 10, T = 12, B = 26, X = (d) => Lm + (d / DAYS) * (w - Lm - R), Y = (v) => T + (1 - v) * (h - T - B);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.fillStyle = C.ink2; ctx.font = `11px ${F.mono}`;
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (let v = 0; v <= 1.001; v += 0.25) { ctx.beginPath(); ctx.moveTo(Lm, Y(v)); ctx.lineTo(w - R, Y(v)); ctx.stroke(); ctx.fillText(L.n(v, 2), Lm - 4, Y(v)); }
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (let d = 0; d <= DAYS; d += 5) ctx.fillText(`${d}일`, X(d), h - B + 6);
    const p = +pIn.value, q = +qIn.value, s = q / (p + q);
    ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = C.forest; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(X(0), Y(s)); ctx.lineTo(X(DAYS), Y(s)); ctx.stroke(); ctx.restore();
    ctx.fillStyle = C.forest; ctx.textAlign = "right"; ctx.textBaseline = "bottom"; ctx.font = `600 11px ${F.sans}`; ctx.fillText(`장기 비율 ${L.n(s, 3)}`, w - R - 2, Y(s) - 3);
    const Tm = [[1 - p, q], [p, 1 - q]]; let x = [+aIn.value / 100, 1 - +aIn.value / 100];
    ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.beginPath();
    for (let d = 0; d <= DAYS; d++) { d ? ctx.lineTo(X(d), Y(x[0])) : ctx.moveTo(X(d), Y(x[0])); x = L.mv(Tm, x); }
    ctx.stroke();
    ctx.fillStyle = C.amber; sim.forEach((v, d) => { ctx.beginPath(); ctx.arc(X(d), Y(v), 3.2, 0, 7); ctx.fill(); });
  }
  function update() {
    const p = +pIn.value, q = +qIn.value, l2 = 1 - p - q;
    $(".p-out").textContent = L.n(p, 2); $(".q-out").textContent = L.n(q, 2); $(".a0-out").textContent = aIn.value;
    $(".say").textContent = `T = [${L.n(1 - p, 2)}, ${L.n(q, 2)} ; ${L.n(p, 2)}, ${L.n(1 - q, 2)}] · 고윳값 1, ${L.n(l2, 2)} · 고유벡터(λ = 1) (${L.n(q / (p + q), 3)}, ${L.n(p / (p + q), 3)}) · 차이가 하루에 ${L.n(Math.abs(l2), 2)}배` + (l2 < 0 ? " (부호가 바뀌며 진동)" : "");
    runSim(); draw();
  }
  $(".go-sim").addEventListener("click", () => { runSim(); draw(); });
  [pIn, qIn, aIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
