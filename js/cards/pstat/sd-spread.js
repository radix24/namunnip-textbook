/* 카드: 평균 60, 표준편차 10 만들기 — 편차, 분산(÷n), 표준편차 */
(() => {
  const root = document.getElementById("card-pstat-sd-spread");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const INIT = [55, 58, 60, 62, 65];
  $(".sl").innerHTML = INIT.map((v, i) => `<label>점수 ${i + 1} = <output>${v}</output><input type="range" min="0" max="100" step="1" value="${v}" data-i="${i}" aria-label="점수 ${i + 1}"></label>`).join("");
  const ins = [...root.querySelectorAll("[data-i]")];
  const { ctx, size } = fit($("canvas"), () => draw());
  const vals = () => ins.map((x) => +x.value);
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const V = vals(), m = V.reduce((a, b) => a + b, 0) / V.length, L = 14, R = 14, X = (v) => L + ((w - L - R) * v) / 100, rowH = (h - 26) / V.length;
    ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "center";
    for (let v = 0; v <= 100; v += 10) { ctx.strokeStyle = C.rule; ctx.beginPath(); ctx.moveTo(X(v), 4); ctx.lineTo(X(v), h - 22); ctx.stroke(); ctx.fillText(String(v), X(v), h - 8); }
    V.forEach((v, i) => {
      const y = 4 + (i + 0.5) * rowH;
      ctx.fillStyle = v >= m ? "rgba(63,111,163,.35)" : "rgba(181,83,47,.35)"; ctx.fillRect(Math.min(X(v), X(m)), y - rowH * 0.25, Math.abs(X(v) - X(m)), rowH * 0.5);
      ctx.fillStyle = "#232326"; ctx.beginPath(); ctx.arc(X(v), y, 5, 0, 7); ctx.fill();
    });
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(m), 2); ctx.lineTo(X(m), h - 22); ctx.stroke();
  }
  function update() {
    const V = vals(), n = V.length, m = V.reduce((a, b) => a + b, 0) / n, dev = V.map((v) => v - m), vr = dev.reduce((a, d) => a + d * d, 0) / n, sd = Math.sqrt(vr);
    ins.forEach((x) => { x.previousElementSibling.textContent = x.value; });
    const ok = Math.abs(m - 60) <= 0.5 && Math.abs(sd - 10) <= 0.5;
    $(".say").textContent = `평균 ${m.toFixed(1)} · 편차 ${dev.map((d) => d.toFixed(1)).join(", ")}(합 ${dev.reduce((a, b) => a + b, 0).toFixed(1)}) · 분산 ${vr.toFixed(1)} · 표준편차 ${sd.toFixed(2)}` + (ok ? " · 도전 성공!" : "");
    draw();
  }
  ins.forEach((x) => x.addEventListener("input", update));
  update();
})();
