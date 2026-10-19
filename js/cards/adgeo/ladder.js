/* 카드: 벽에서 미끄러지는 사다리의 가운데 점은 어떤 길을 그릴까? — 사다리 위 점의 자취(타원·원) */
(() => {
  const root = document.getElementById("card-adgeo-ladder");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const kIn = $(".k"), L = 1;
  let th = Math.PI / 2 - 0.05, guess = null, trail = [], timer = 0;
  const { ctx, size } = fit($("canvas"), () => draw());
  const pt = (k, t) => [(1 - k) * L * Math.cos(t), k * L * Math.sin(t)];
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = Math.min(w, h) * 0.82, ox = w * 0.1, oy = h * 0.9, X = (x) => ox + x * s, Y = (y) => oy - y * s;
    ctx.fillStyle = "rgba(141,141,146,.25)"; ctx.fillRect(0, oy, w, h - oy); ctx.fillRect(0, 0, ox, oy);
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, oy); ctx.lineTo(w, oy); ctx.stroke();
    const k = +kIn.value, a = [L * Math.cos(th), 0], b = [0, L * Math.sin(th)];
    if (guess) { ctx.strokeStyle = "rgba(63,111,163,.3)"; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath(); for (let j = 0; j <= 90; j++) { const p = pt(k, (j / 90) * (Math.PI / 2)); j ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])); } ctx.stroke(); ctx.setLineDash([]); }
    ctx.strokeStyle = "#3f6fa3"; ctx.lineWidth = 3; ctx.beginPath(); trail.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])))); ctx.stroke();
    ctx.strokeStyle = "#8b5a2b"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(X(a[0]), Y(a[1])); ctx.lineTo(X(b[0]), Y(b[1])); ctx.stroke(); ctx.lineCap = "butt";
    const p = pt(k, th); ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 7, 0, 7); ctx.fill();
    ctx.fillStyle = C.ink2; ctx.font = `600 12px ${F.sans}`; ctx.textAlign = "left"; ctx.fillText("벽", ox + 6, 16); ctx.fillText("바닥", w - 40, oy + 18);
  }
  function slide() {
    clearInterval(timer); th = Math.PI / 2 - 0.02; trail = [pt(+kIn.value, th)];
    timer = setInterval(() => { th = Math.max(0.02, th - 0.025); trail.push(pt(+kIn.value, th)); draw(); if (th <= 0.02) { clearInterval(timer); reveal(); } }, 25);
  }
  function kind(k) { return k === 0 || k === 1 ? "line" : Math.abs(k - 0.5) < 1e-9 ? "circle" : "ellipse"; }
  function reveal() {
    const k = +kIn.value, a = (1 - k) * L, b = k * L, K = kind(k), NAME = { circle: "원의 일부", ellipse: "타원의 일부", line: "선분", parabola: "포물선의 일부" };
    const eq = K === "line" ? (k === 0 ? "바닥 위의 선분 (y = 0)" : "벽 위의 선분 (x = 0)") : `x²/${NMTri.n(a * a, 3)} + y²/${NMTri.n(b * b, 3)} = 1 (L = 1)`;
    const v = $(".verdict"); v.textContent = (guess ? (guess === K ? "맞습니다. " : `예측과 다릅니다. `) : "") + `${NAME[K]}: ${eq}`; v.className = "verdict " + (guess ? (guess === K ? "good" : "bad") : "");
    draw();
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => { guess = b.dataset.g; root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); slide(); }));
  $(".go-slide").addEventListener("click", slide);
  kIn.addEventListener("input", () => { $(".k-out").textContent = kIn.value; clearInterval(timer); trail = []; guess = null; root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", "false")); $(".verdict").textContent = ""; draw(); });
  draw();
})();
