/* 카드: 매달 얼마씩 갚아야 24개월 만에 대출이 끝날까? — bₙ₊₁ = (1 + r)bₙ − M (모의 수치) */
(() => {
  const root = document.getElementById("card-dmath-loan");
  if (!root) return;
  const { C, F, fit } = NM;
  const D = NMDm;
  const $ = (s) => root.querySelector(s);
  const bIn = $(".b"), rIn = $(".r"), mIn = $(".m"), N = 24, SHOW = 36;
  const { ctx, size } = fit($("canvas"), () => draw());
  const path = () => { const r = +rIn.value / 100, M = +mIn.value, out = [+bIn.value]; for (let k = 0; k < SHOW; k++) out.push((1 + r) * out[k] - M); return out; };
  const exactM = () => { const B = +bIn.value, r = +rIn.value / 100; return r === 0 ? B / N : (B * r * (1 + r) ** N) / ((1 + r) ** N - 1); };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = path(), B = +bIn.value, top = B * 1.4, bot = -B * 0.4, L = 48, R = 10, T = 10, Bt = 22;
    const X = (k) => L + (k / SHOW) * (w - L - R), Y = (v) => T + ((top - v) / (top - bot)) * (h - T - Bt), cl = (v) => Math.max(bot, Math.min(top, v));
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.fillStyle = C.ink2; ctx.font = `10px ${F.mono}`; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    [0, 0.5, 1].forEach((f) => { const v = B * f; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(w - R, Y(v)); ctx.stroke(); ctx.fillText(D.n(v, 0), L - 4, Y(v)); });
    ctx.textAlign = "center"; ctx.textBaseline = "top"; [0, 12, 24, 36].forEach((k) => ctx.fillText(`${k}개월`, X(k), h - Bt + 6));
    ctx.strokeStyle = C.forest; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X(N), T); ctx.lineTo(X(N), h - Bt); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(w - R, Y(0)); ctx.stroke();
    ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 2.4; ctx.beginPath(); s.forEach((v, k) => (k ? ctx.lineTo(X(k), Y(cl(v))) : ctx.moveTo(X(k), Y(cl(v))))); ctx.stroke();
    ctx.fillStyle = Math.abs(s[N]) < B * 0.01 ? C.forest : C.warn; ctx.beginPath(); ctx.arc(X(N), Y(cl(s[N])), 5, 0, 7); ctx.fill();
  }
  function update(extra) {
    const s = path(), M = +mIn.value, r = +rIn.value / 100, B = +bIn.value;
    $(".b-out").textContent = B; $(".r-out").textContent = D.n(+rIn.value, 1); $(".m-out").textContent = D.n(M, 1);
    const end = s[N], ok = Math.abs(end) < B * 0.01;
    $(".say").textContent = `24개월 뒤 남은 빚 ${D.n(end, 1)}만 원` + (ok ? " · 성공!" : end > 0 ? " · 더 많이 갚아야 합니다" : " · 너무 많이 갚았습니다") + (M <= r * B ? ` · 첫 달 이자 ${D.n(r * B, 1)}만 원보다 적어 빚이 줄지 않습니다` : "") + (extra || "");
    draw();
  }
  $(".go-show").addEventListener("click", () => { const M = exactM(); update(` · 공식: M = Br(1+r)^24/((1+r)^24 − 1) = ${D.n(M, 2)}만 원, 총 이자 ${D.n(M * N - +bIn.value, 1)}만 원`); });
  [bIn, rIn, mIn].forEach((el) => el.addEventListener("input", () => update()));
  update();
})();
