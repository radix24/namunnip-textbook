/* 카드: 부유한 한 집이 이사 오면 — 극단값에 끌려가는 평균과 버티는 중앙값(가상 소득) */
(() => {
  const root = document.getElementById("card-pstat-mean-median");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const xIn = $(".x"), BASE = [220, 250, 280, 300, 320, 350, 380, 420, 480];
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const med = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  let ctx, size;
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const D = [...BASE, +xIn.value], top = Math.max(1000, +xIn.value * 1.05), L = 14, R = 14, X = (v) => L + ((w - L - R) * v) / top, y0 = h * 0.55;
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(0), y0); ctx.lineTo(X(top), y0); ctx.stroke();
    ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "center";
    const step = top > 10000 ? 5000 : top > 4000 ? 2000 : top > 2000 ? 500 : 200;
    for (let v = 0; v <= top; v += step) ctx.fillText(String(v), X(v), y0 + 16);
    D.forEach((v, i) => { ctx.fillStyle = i === 9 ? C.warn : "#3f6fa3"; ctx.beginPath(); ctx.arc(X(v), y0 - 7 - (i < 9 ? (i % 3) * 7 : 0), 4.5, 0, 7); ctx.fill(); });
    const mk = (v, col, lab, up) => { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(v), up ? 6 : y0 + 22); ctx.lineTo(X(v), up ? y0 - 30 : h - 4); ctx.stroke(); ctx.fillStyle = col; ctx.font = `11px ${F.sans}`; ctx.textAlign = X(v) > w - 90 ? "right" : "left"; ctx.fillText(lab, X(v) + (X(v) > w - 90 ? -4 : 4), up ? 16 : h - 6); };
    mk(med(D), C.forest, `중앙값 ${med(D).toFixed(0)}`, true); mk(mean(D), C.warn, `평균 ${mean(D).toFixed(0)}`, false);
  }
  function update() {
    const D = [...BASE, +xIn.value], m0 = mean(BASE), d0 = med(BASE);
    $(".x-out").textContent = xIn.value;
    $(".say").textContent = `원래 9가구: 평균 ${m0.toFixed(0)}, 중앙값 ${d0} → 10가구: 평균 ${mean(D).toFixed(0)}(${mean(D) - m0 >= 0 ? "+" : ""}${(mean(D) - m0).toFixed(0)}), 중앙값 ${med(D).toFixed(0)}(${med(D) - d0 >= 0 ? "+" : ""}${(med(D) - d0).toFixed(0)}) · 평균보다 소득이 적은 가구 ${D.filter((v) => v < mean(D)).length}곳`;
    if (size) draw();
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".verdict").textContent = `${b.dataset.g === "mean" ? "맞습니다." : "예측과 다릅니다."} 소득 5000만 원 가구가 더해지면 평균은 333에서 800으로 크게 오르지만, 중앙값은 320에서 335로 조금만 움직입니다.`;
    const first = $(".after").hidden; $(".after").hidden = false;
    if (first) ({ ctx, size } = fit($("canvas"), () => draw()));
    update();
  }));
  xIn.addEventListener("input", update);
})();
