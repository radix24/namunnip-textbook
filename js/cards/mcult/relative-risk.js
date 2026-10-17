/* 카드: "위험 2배!" 기사는 얼마나 걱정해야 할까? — 상대 위험(비)과 절대 위험 차이(차), 1만 명 점 그림 */
(() => {
  const root = document.getElementById("card-mcult-relative-risk");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const bIn = $(".b"), rIn = $(".r"), N = 10000, COLS = 125, ROWS = 80;
  const { ctx, size } = fit($("canvas"), () => draw());
  /* 1만 칸을 고정된 순서로 섞어 환자를 흩어 찍음(적은 수도 보이도록 점은 칸보다 크게) */
  const PERM = Array.from({ length: N }, (_, i) => i);
  for (let i = N - 1, s = 7; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [PERM[i], PERM[j]] = [PERM[j], PERM[i]]; }
  function grid(x0, y0, gw, gh, k, col, title) {
    const s = Math.min(gw / COLS, gh / ROWS);
    ctx.fillStyle = "rgba(141,141,146,.18)"; ctx.fillRect(x0, y0, COLS * s, ROWS * s);
    ctx.fillStyle = col;
    for (let i = 0; i < k; i++) { const c = PERM[i] % COLS, r = Math.floor(PERM[i] / COLS); ctx.beginPath(); ctx.arc(x0 + (c + 0.5) * s, y0 + (r + 0.5) * s, Math.max(s * 0.6, 2.2), 0, 7); ctx.fill(); }
    ctx.fillStyle = C.ink2; ctx.font = `12px ${F.sans}`; ctx.textAlign = "left"; ctx.fillText(title, x0, y0 - 6);
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const b = +bIn.value, a = Math.min(N, Math.round(b * +rIn.value)), gw = (w - 30) / 2, gh = h - 26;
    grid(10, 20, gw, gh, b, "#3f6fa3", `먹지 않음: 1만 명 중 ${b}명`);
    grid(20 + gw, 20, gw, gh, a, C.warn, `먹음: 1만 명 중 ${a}명`);
  }
  function update() {
    const b = +bIn.value, r = +rIn.value, a = Math.round(b * r), d = a - b;
    $(".b-out").textContent = b; $(".r-out").textContent = r.toFixed(1);
    $(".headline-text").textContent = `"OO 먹으면 △△병 위험 ${r.toFixed(1)}배!" (가상 기사)`;
    $(".say").textContent = `상대 위험 ${r.toFixed(1)}배 · 발생률 ${(b / 100).toFixed(2)}% → ${(a / 100).toFixed(2)}% · 절대 위험 차이: 1만 명 중 ${d}명(${(d / 100).toFixed(2)}%p)` + (d > 0 ? ` · 약 ${Math.round(N / d).toLocaleString("ko-KR")}명이 먹으면 1명 더 걸림` : "");
    draw();
  }
  [bIn, rIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
