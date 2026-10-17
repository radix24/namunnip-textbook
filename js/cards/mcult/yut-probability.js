/* 카드: 윷을 던지면 무엇이 가장 잘 나올까? — 배의 개수 ~ B(4, p), 모의 던지기 */
(() => {
  const root = document.getElementById("card-mcult-yut-probability");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p"), NAME = ["도", "개", "걸", "윷", "모"], R = [1, 2, 3, 4, 0], CB = [1, 4, 6, 4, 1];
  const prob = (p) => R.map((r) => CB[r] * p ** r * (1 - p) ** (4 - r));
  let cnt = [0, 0, 0, 0, 0], ctx, size;
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const P = prob(+pIn.value), tot = cnt.reduce((a, b) => a + b, 0), L = 36, Rr = 10, T = 14, B = 26, ymax = 0.6;
    const bw = (w - L - Rr) / 5, Y = (v) => T + (h - T - B) * (1 - v / ymax);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2;
    [0, 0.2, 0.4, 0.6].forEach((v) => { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(w - Rr, Y(v)); ctx.stroke(); ctx.textAlign = "right"; ctx.fillText(v.toFixed(1), L - 4, Y(v) + 4); });
    P.forEach((v, i) => {
      const x = L + i * bw;
      ctx.fillStyle = "rgba(63,111,163,.55)"; ctx.fillRect(x + bw * 0.15, Y(v), bw * 0.35, Y(0) - Y(v));
      if (tot) { const f = cnt[i] / tot; ctx.fillStyle = "rgba(116,171,102,.75)"; ctx.fillRect(x + bw * 0.5, Y(f), bw * 0.35, Y(0) - Y(f)); }
      ctx.fillStyle = C.ink; ctx.font = `12px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText(NAME[i], x + bw / 2, h - 8);
    });
    ctx.font = `11px ${F.sans}`; ctx.textAlign = "left"; ctx.fillStyle = "#3f6fa3"; ctx.fillText("이론 확률", L + 6, T - 2);
    if (tot) { ctx.fillStyle = C.forest; ctx.fillText(`모의 ${tot}번 상대도수`, L + 70, T - 2); }
  }
  function update() {
    const p = +pIn.value, P = prob(p), m = P.indexOf(Math.max(...P)), tot = cnt.reduce((a, b) => a + b, 0);
    $(".p-out").textContent = p.toFixed(2);
    $(".say").textContent = `이론: ${NAME.map((n, i) => `${n} ${P[i].toFixed(3)}`).join(", ")} · 가장 잘 나옴: ${NAME[m]}` + (tot ? ` · 모의: ${NAME.map((n, i) => `${n} ${cnt[i]}`).join(", ")}` : "");
    if (size) draw();
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".verdict").textContent = `${b.dataset.g === "2" ? "맞습니다." : "예측과 다릅니다."} p = 1/2이면 개(6/16)가 가장 잘 나오고, 도와 걸(각 4/16), 윷과 모(각 1/16) 순입니다.`;
    const first = $(".after").hidden; $(".after").hidden = false;
    if (first) ({ ctx, size } = fit($("canvas"), () => draw()));   // 보일 때 만들어야 크기가 잡힘
    update();
  }));
  $(".throw").addEventListener("click", () => {
    const p = +pIn.value;
    for (let k = 0; k < 100; k++) { let r = 0; for (let j = 0; j < 4; j++) if (Math.random() < p) r++; cnt[R.indexOf(r)]++; }
    update();
  });
  $(".reset").addEventListener("click", () => { cnt = [0, 0, 0, 0, 0]; update(); });
  pIn.addEventListener("input", () => { cnt = [0, 0, 0, 0, 0]; update(); });
})();
