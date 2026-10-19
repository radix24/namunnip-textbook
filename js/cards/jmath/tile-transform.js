/* 카드: 한 가지 무늬 타일만으로 바닥에 여러 무늬를 만들 수 있을까? — 평행이동, 회전이동, 대칭이동 */
(() => {
  const root = document.getElementById("card-jmath-tile-transform");
  if (!root) return;
  const { C, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const N = 4, cv = $("canvas");
  /* 칸마다 상태 0~7: 0~3은 90°×k 회전, 4~7은 뒤집은 뒤 90°×k 회전 */
  let S = Array(N * N).fill(0);
  const RULES = [() => 0, (r, c) => (r + c) % 4, (r, c) => (c % 2 ? 4 : 0) + (r % 2 ? 2 : 0), (r, c) => [0, 1, 3, 2][(r % 2) * 2 + (c % 2)]];
  const { ctx, size } = fit(cv, () => draw());
  /* 기본 무늬(단위 정사각형 안): 한쪽 모서리의 삼각형 + 작은 원 — 회전·뒤집기를 알아보기 쉽게 비대칭 */
  function motif(x, y, s, st) {
    ctx.save(); ctx.translate(x + s / 2, y + s / 2); ctx.rotate(((st % 4) * Math.PI) / 2); if (st >= 4) ctx.scale(-1, 1); ctx.translate(-s / 2, -s / 2);
    ctx.fillStyle = "#f3efe4"; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = "#3f6fa3"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s, 0); ctx.lineTo(0, s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#e0a02a"; ctx.beginPath(); ctx.arc(s * 0.72, s * 0.28, s * 0.13, 0, 7); ctx.fill();
    ctx.restore();
  }
  function draw() {
    const { w } = size; if (!w) return;
    ctx.clearRect(0, 0, w, w);
    const s = w / N;
    S.forEach((st, k) => motif((k % N) * s, Math.floor(k / N) * s, s, st));
    ctx.strokeStyle = "rgba(35,35,38,.35)"; ctx.lineWidth = 1; for (let i = 0; i <= N; i++) { ctx.beginPath(); ctx.moveTo(i * s, 0); ctx.lineTo(i * s, w); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i * s); ctx.lineTo(w, i * s); ctx.stroke(); }
  }
  function update() {
    const flips = S.filter((x) => x >= 4).length, kinds = new Set(S).size;
    $(".say").textContent = `타일 16장 모두 합동 · 쓰인 방향 ${kinds}가지 · 뒤집은 타일 ${flips}장` + (flips ? " → 거울상 타일이 따로 필요" : " → 같은 타일 한 종류로 시공 가능");
    draw();
  }
  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { const f = RULES[+b.dataset.p]; S = S.map((_, k) => f(Math.floor(k / N), k % N)); root.querySelectorAll("[data-p]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  cv.addEventListener("click", (e) => { const r = cv.getBoundingClientRect(), s = r.width / N, k = Math.min(N - 1, Math.floor((e.clientY - r.top) / s)) * N + Math.min(N - 1, Math.floor((e.clientX - r.left) / s)); S[k] = (S[k] + 1) % 8; update(); });
  update();
})();
