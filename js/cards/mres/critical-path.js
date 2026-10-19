/* 카드: 탐구 일정 — 가장 이른 시작·끝(선행 활동의 최대 끝 + 기간), 임계 경로와 여유 */
(() => {
  const root = document.getElementById("card-mres-critical-path");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  /* [이름, 기간, 선행 활동 번호] */
  const T = [["주제 정하기", 3, []], ["문헌 조사", 5, [0]], ["실험 설계", 4, [0]], ["자료 수집", 6, [2]], ["분석", 4, [1, 3]], ["보고서 쓰기", 5, [4]], ["발표 준비", 3, [4]]];
  const AB = "ABCDEFG";
  $(".tasks").innerHTML = T.map(([n, d, pre], i) => `<label>${AB[i]} ${n}${pre.length ? `(${pre.map((p) => AB[p]).join(",")})` : ""} <input type="number" min="1" max="20" value="${d}" data-i="${i}" aria-label="${n} 기간"></label>`).join("");
  const ins = [...root.querySelectorAll("[data-i]")];
  function plan() {
    const d = ins.map((x) => Math.max(1, Math.min(20, +x.value || 1))), es = [], ef = [];
    T.forEach(([, , pre], i) => { es[i] = pre.length ? Math.max(...pre.map((p) => ef[p])) : 0; ef[i] = es[i] + d[i]; });
    const total = Math.max(...ef), lf = new Array(T.length).fill(total);
    for (let i = T.length - 1; i >= 0; i--) T.forEach(([, , pre], j) => { if (pre.includes(i)) lf[i] = Math.min(lf[i], lf[j] - d[j]); });
    return { d, es, ef, total, slack: ef.map((f, i) => lf[i] - f) };
  }
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = plan(), L = 96, R = 14, rowH = (h - 26) / T.length, X = (v) => L + ((w - L - R) * v) / Math.max(p.total, 1);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `10px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "center";
    const step = p.total > 40 ? 10 : 5;
    for (let v = 0; v <= p.total; v += step) { ctx.beginPath(); ctx.moveTo(X(v), 2); ctx.lineTo(X(v), h - 22); ctx.stroke(); ctx.fillText(`${v}일`, X(v), h - 8); }
    T.forEach(([n], i) => {
      const y = 2 + i * rowH, crit = p.slack[i] === 0;
      ctx.fillStyle = crit ? "rgba(181,83,47,.75)" : "rgba(63,111,163,.6)"; ctx.fillRect(X(p.es[i]), y + rowH * 0.18, X(p.ef[i]) - X(p.es[i]), rowH * 0.64);
      if (p.slack[i] > 0) { ctx.strokeStyle = "rgba(63,111,163,.6)"; ctx.setLineDash([3, 3]); ctx.strokeRect(X(p.ef[i]), y + rowH * 0.3, X(p.ef[i] + p.slack[i]) - X(p.ef[i]), rowH * 0.4); ctx.setLineDash([]); }
      ctx.fillStyle = C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "right"; ctx.fillText(`${AB[i]} ${n}`, L - 6, y + rowH * 0.62);
    });
  }
  function update() {
    const p = plan(), crit = T.map((_, i) => i).filter((i) => p.slack[i] === 0).map((i) => AB[i]).join(" → ");
    $(".say").textContent = `최소 기간 ${p.total}일 · 임계 경로(빨강) ${crit} · 여유(점선): ${T.map((_, i) => i).filter((i) => p.slack[i] > 0).map((i) => `${AB[i]} ${p.slack[i]}일`).join(", ") || "없음"} · 단순히 모두 더하면 ${p.d.reduce((a, b) => a + b, 0)}일`;
    draw();
  }
  ins.forEach((x) => x.addEventListener("input", update));
  update();
})();
