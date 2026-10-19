/* 카드: 첫 자리 숫자 비율과 벤포드 법칙 log10(1 + 1/d) — 가상 인구(로그 균등), 지어낸 듯한 숫자, 직접 입력 */
(() => {
  const root = document.getElementById("card-mres-benford-check");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  let s = 2024; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const REAL = Array.from({ length: 300 }, () => Math.round(10 ** (2 + 4 * rnd())));   // 100 ~ 1,000,000 사이 로그 균등(가상)
  const FAKE = Array.from({ length: 300 }, () => (1 + Math.floor(rnd() * 9)) * 1000 + Math.floor(rnd() * 1000));   // 첫 자리를 고르게 쓴 숫자
  const BEN = Array.from({ length: 9 }, (_, i) => Math.log10(1 + 1 / (i + 1)));
  let cur = "real";
  const first = (v) => { const t = String(Math.abs(v)).replace(/^[0.]+/, ""); return t ? +t[0] : 0; };
  const nums = () => cur === "real" ? REAL : cur === "fake" ? FAKE : ($(".mine").value.match(/\d[\d.]*/g) || []).map(Number).filter((v) => v > 0);
  const { ctx, size } = fit($("canvas"), () => draw());
  function freq() { const a = nums(), c = new Array(9).fill(0); a.forEach((v) => { const d = first(v); if (d) c[d - 1]++; }); const n = c.reduce((x, y) => x + y, 0); return { n, f: c.map((x) => (n ? x / n : 0)) }; }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const { f } = freq(), L = 36, R = 10, T = 10, B = 24, bw = (w - L - R) / 9, Y = (v) => T + (h - T - B) * (1 - v / 0.4);
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink2; ctx.textAlign = "right";
    [0, 0.1, 0.2, 0.3, 0.4].forEach((v) => { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(w - R, Y(v)); ctx.stroke(); ctx.fillText(`${v * 100}%`, L - 4, Y(v) + 4); });
    f.forEach((v, i) => { ctx.fillStyle = "rgba(63,111,163,.6)"; ctx.fillRect(L + i * bw + bw * 0.18, Y(v), bw * 0.64, Y(0) - Y(v)); ctx.fillStyle = C.ink2; ctx.textAlign = "center"; ctx.fillText(String(i + 1), L + (i + 0.5) * bw, h - 8); });
    ctx.strokeStyle = C.warn; ctx.lineWidth = 2; ctx.beginPath(); BEN.forEach((v, i) => (i ? ctx.lineTo(L + (i + 0.5) * bw, Y(v)) : ctx.moveTo(L + (i + 0.5) * bw, Y(v)))); ctx.stroke();
    ctx.fillStyle = C.warn; BEN.forEach((v, i) => { ctx.beginPath(); ctx.arc(L + (i + 0.5) * bw, Y(v), 3, 0, 7); ctx.fill(); });
    ctx.font = `11px ${F.sans}`; ctx.textAlign = "right"; ctx.fillText("빨간 선: 벤포드 법칙", w - R - 4, T + 12);
  }
  function update() {
    root.querySelectorAll("[data-d]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.d === cur)));
    $(".mine").hidden = cur !== "mine";
    const { n, f } = freq(), dist = f.reduce((a, v, i) => a + Math.abs(v - BEN[i]), 0) / 2;
    $(".say").textContent = n ? `숫자 ${n}개 · 첫 자리 1의 비율 ${(100 * f[0]).toFixed(1)}%(법칙 30.1%), 9의 비율 ${(100 * f[8]).toFixed(1)}%(법칙 4.6%) · 법칙과의 차이 ${(100 * dist).toFixed(1)}%p` + (cur === "mine" && n < 30 ? " · 30개 이상 입력하면 더 잘 보입니다" : "") : "숫자를 입력하세요.";
    draw();
  }
  root.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { cur = b.dataset.d; update(); }));
  $(".mine").addEventListener("input", update);
  update();
})();
