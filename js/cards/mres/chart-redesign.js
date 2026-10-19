/* 카드: 발표용 그래프 고치기 — 정렬, 0부터, 직접 값, 꾸밈 제거, 결론 제목, 단위·조사 정보(가상 설문 200명) */
(() => {
  const root = document.getElementById("card-mres-chart-redesign");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const D = [["자전거", 18], ["버스", 62], ["도보", 71], ["지하철", 24], ["자가용", 15], ["기타", 10]];
  const LOUD = ["#e0a02a", "#d4493a", "#74ab66", "#8f6bb3", "#3f9fbf", "#c76fa8"];
  const on = (k) => root.querySelector(`[data-o="${k}"]`).checked;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const data = on("sort") ? [...D].sort((a, b) => b[1] - a[1]) : D, y0 = on("zero") ? 0 : 8, top = 80;
    const L = 40, R = 10, T = 40, B = on("unit") ? 46 : 30, bw = (w - L - R) / data.length, Y = (v) => T + (h - T - B) * (1 - (v - y0) / (top - y0));
    ctx.fillStyle = C.ink; ctx.font = `bold 13px ${F.sans}`; ctx.textAlign = "left";
    ctx.fillText(on("title") ? "도보와 버스가 등교 수단의 3분의 2(133명)" : "교통수단 조사 결과", L, 18);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "right";
    for (let v = y0; v <= top; v += on("zero") ? 20 : 18) { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(w - R, Y(v)); ctx.stroke(); ctx.fillText(String(v), L - 4, Y(v) + 4); }
    data.forEach(([n, v], i) => {
      const x = L + i * bw + bw * 0.18, bwid = bw * 0.64;
      if (!on("plain")) { ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(x + 5, Y(v) - 5, bwid, Y(y0) - Y(v)); }
      ctx.fillStyle = on("plain") ? (n === "도보" || n === "버스" ? "#3f6fa3" : "rgba(63,111,163,.45)") : LOUD[D.findIndex((d) => d[0] === n)];
      ctx.fillRect(x, Y(v), bwid, Y(y0) - Y(v));
      if (on("label")) { ctx.fillStyle = C.ink; ctx.font = `bold 11px ${F.mono}`; ctx.textAlign = "center"; ctx.fillText(`${v}명`, x + bwid / 2, Y(v) - 4); }
      ctx.fillStyle = C.ink2; ctx.font = `11px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText(n, x + bwid / 2, h - B + 14);
    });
    if (on("unit")) { ctx.fillStyle = C.ink3; ctx.font = `10px ${F.sans}`; ctx.textAlign = "left"; ctx.fillText("세로축: 학생 수(명) · 우리 학교 학생 200명 설문(가상), 2학기", L, h - 6); }
  }
  function update() {
    const k = [...root.querySelectorAll("[data-o]")].filter((x) => x.checked).length;
    $(".say").textContent = `고친 점 ${k}/6` + (on("zero") ? "" : " · 세로축이 8부터라 작은 막대가 실제보다 훨씬 작아 보입니다") + (k === 6 ? " · 모두 고쳤습니다." : "");
    draw();
  }
  root.querySelectorAll("[data-o]").forEach((x) => x.addEventListener("change", update));
  update();
})();
