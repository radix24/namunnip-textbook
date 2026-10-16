/* 카드: 멸종 위기종을 살리려면 어느 생존율을 올려야 할까? — 2단계 레슬리 행렬(모식 값), 로그 눈금 그래프 */
(() => {
  const root = document.getElementById("card-adalg-population");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const fIn = $(".f"), s1In = $(".s1"), s2In = $(".s2"), YEARS = 30;
  const { ctx, size } = fit($("canvas"), () => draw());
  const M = () => [[0, +fIn.value], [+s1In.value, +s2In.value]];
  const lam = () => { const f = +fIn.value, s1 = +s1In.value, s2 = +s2In.value; return (s2 + Math.sqrt(s2 * s2 + 4 * f * s1)) / 2; };
  function series() { const A = M(); let x = [50, 50]; const out = [x]; for (let k = 0; k < YEARS; k++) { x = L.mv(A, x); out.push(x); } return out; }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const Lm = 44, R = 10, T = 12, B = 26, lo = -1, hi = 5;
    const X = (k) => Lm + (k / YEARS) * (w - Lm - R), Y = (v) => T + ((hi - Math.log10(Math.max(v, 10 ** lo))) / (hi - lo)) * (h - T - B);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.fillStyle = C.ink2; ctx.font = `11px ${F.mono}`; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (let e = lo; e <= hi; e++) { ctx.beginPath(); ctx.moveTo(Lm, Y(10 ** e)); ctx.lineTo(w - R, Y(10 ** e)); ctx.stroke(); ctx.fillText(e < 0 ? "0.1" : String(10 ** e), Lm - 4, Y(10 ** e)); }
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (let k = 0; k <= YEARS; k += 5) ctx.fillText(`${k}년`, X(k), h - B + 6);
    const s = series();
    [[0, C.amber], [1, BLUE]].forEach(([i, col]) => {
      ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath();
      s.forEach((x, k) => (k ? ctx.lineTo(X(k), Y(x[i])) : ctx.moveTo(X(k), Y(x[i])))); ctx.stroke();
    });
    ctx.fillStyle = C.amber; ctx.textAlign = "left"; ctx.font = `600 11px ${F.sans}`; ctx.fillText("새끼", Lm + 6, T + 2);
    ctx.fillStyle = BLUE; ctx.fillText("어른", Lm + 44, T + 2);
  }
  function update() {
    $(".f-out").textContent = L.n(+fIn.value, 1); $(".s1-out").textContent = L.n(+s1In.value, 2); $(".s2-out").textContent = L.n(+s2In.value, 2);
    const l = lam(), e = L.eig2(M()), v = e.vecs[0], r = v[0] / v[1], s = series(), last = s[YEARS];
    $(".say").textContent = `λ = ${L.n(l, 4)} · 고유벡터의 새끼 : 어른 = ${L.n(Math.abs(r), 3)} : 1 · ${YEARS}년 뒤 새끼 ${L.n(last[0], 1)}, 어른 ${L.n(last[1], 1)} (비율 ${L.n(last[0] / last[1], 3)})`;
    const v2 = $(".verdict");
    if (l >= 1) { v2.textContent = `λ ≥ 1: 개체 수가 유지되거나 늘어납니다. 처음 값(f = 1.2, s₁ = 0.3, s₂ = 0.6)에서 무엇을 얼마나 바꿨나요?`; v2.className = "verdict good"; }
    else { v2.textContent = `λ < 1: 해마다 약 ${L.n((1 - l) * 100, 1)}%씩 줄어듭니다.`; v2.className = "verdict bad"; }
    draw();
  }
  [fIn, s1In, s2In].forEach((el) => el.addEventListener("input", update));
  update();
})();
