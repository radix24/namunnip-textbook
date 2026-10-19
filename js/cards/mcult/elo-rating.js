/* 카드: 약한 팀을 이기면 점수가 조금 오르는 까닭 — 엘로 E = 1/(1+10^((Rb−Ra)/400)), R' = R + K(S − E) */
(() => {
  const root = document.getElementById("card-mcult-elo-rating");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".ra"), bIn = $(".rb"), kIn = $(".k");
  const E = (ra, rb) => 1 / (1 + 10 ** ((rb - ra) / 400));
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const L = 40, R = 12, T = 12, B = 30, X = (d) => L + ((w - L - R) * (d + 800)) / 1600, Y = (p) => T + (h - T - B) * (1 - p);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2;
    [0, 0.5, 1].forEach((p) => { ctx.beginPath(); ctx.moveTo(L, Y(p)); ctx.lineTo(w - R, Y(p)); ctx.stroke(); ctx.textAlign = "right"; ctx.fillText(p.toFixed(1), L - 4, Y(p) + 4); });
    [-800, -400, 0, 400, 800].forEach((d) => { ctx.textAlign = "center"; ctx.fillText(String(d), X(d), h - B + 14); });
    ctx.font = `11px ${F.sans}`; ctx.fillText("점수 차 R_A − R_B", (L + w - R) / 2, h - 3);
    ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 2; ctx.beginPath();
    for (let d = -800; d <= 800; d += 10) { const p = E(d, 0); d > -800 ? ctx.lineTo(X(d), Y(p)) : ctx.moveTo(X(d), Y(p)); }
    ctx.stroke();
    const d = Math.max(-800, Math.min(800, +aIn.value - +bIn.value)), p = E(+aIn.value, +bIn.value);
    ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(X(d), Y(p), 5, 0, 7); ctx.fill();
  }
  function update() {
    const ra = +aIn.value, rb = +bIn.value, k = +kIn.value, e = E(ra, rb);
    $(".a-out").textContent = ra; $(".b-out").textContent = rb; $(".k-out").textContent = k;
    $(".say").textContent = `A의 기대 점수 E_A = ${e.toFixed(3)} · A가 이기면 +${(k * (1 - e)).toFixed(1)}, 비기면 ${(k * (0.5 - e) >= 0 ? "+" : "")}${(k * (0.5 - e)).toFixed(1)}, 지면 ${(-k * e).toFixed(1)}`;
    draw();
  }
  root.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => {
    const ra = +aIn.value, rb = +bIn.value, k = +kIn.value, s = +b.dataset.s, e = E(ra, rb), dA = k * (s - e);
    const na = Math.round(ra + dA), nb = ra + rb - na;   // 반올림해도 합은 그대로
    const li = document.createElement("li");
    li.textContent = `${b.textContent}: E_A ${e.toFixed(2)} → A ${ra}→${na} (${dA >= 0 ? "+" : ""}${dA.toFixed(1)}), B ${rb}→${nb} · 합 ${na + nb}`;
    $(".log").prepend(li);
    aIn.value = na; bIn.value = nb; update();
  }));
  [aIn, bIn, kIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
