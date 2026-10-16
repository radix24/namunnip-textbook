/* 카드: 둥근 탁자에 둘러앉는 방법은 줄을 서는 방법보다 왜 적을까? — 원순열 (n − 1)! */
(() => {
  const root = document.getElementById("card-pmath-round-table");
  if (!root) return;
  const { C, F, fit } = NM;
  const { label } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sn = $(".sn");
  const COL = ["#d4493a", "#e0a02a", "#3b7c2a", "#3f6fa3", "#7b5ea7", "#c0587e", "#3d9a8a"];
  let seat = [], off = 0, anim = 0, raf = 0;   // seat[k] = k번 자리에 앉은 사람(0 = A)
  const { ctx, size } = fit($("canvas"), () => draw());
  const fact = (k) => (k <= 1 ? 1 : k * fact(k - 1));
  const L = (i) => String.fromCharCode(65 + i);

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const N = seat.length, cx = w * 0.3, cy = h / 2, R = Math.min(w * 0.22, h * 0.36);
    ctx.fillStyle = "#e9dcc6"; ctx.beginPath(); ctx.arc(cx, cy, R * 0.72, 0, 7); ctx.fill();
    for (let k = 0; k < N; k++) {
      const a = -Math.PI / 2 + 2 * Math.PI * (k + off + anim) / N, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      ctx.fillStyle = COL[seat[k]]; ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.fill();
      label(ctx, L(seat[k]), x, y, "#ffffff", "center", `700 13px ${F.sans}`);
    }
    // 오른쪽: 같은 원탁 배열을 끊는 자리마다 펴 본 줄
    const rows = lines(), x0 = w * 0.58, rh = Math.min(22, (h - 20) / N);
    rows.forEach((r, i) => {
      [...r].forEach((ch, j) => { ctx.fillStyle = COL[ch.charCodeAt(0) - 65]; ctx.fillRect(x0 + j * (rh + 2), 10 + i * (rh + 2), rh, rh); label(ctx, ch, x0 + j * (rh + 2) + rh / 2, 10 + i * (rh + 2) + rh / 2, "#fff", "center", `700 ${Math.round(rh * 0.55)}px ${F.sans}`); });
    });
    label(ctx, `→ 모두 같은 원탁 배열 (${N}개)`, x0, h - 8, C.ink2, "left", `600 11px ${F.sans}`);
  }
  /* 자리 k부터 시계 방향으로 읽은 줄 n개 */
  const lines = () => seat.map((_, k) => seat.slice(k).concat(seat.slice(0, k)).map(L).join(""));
  function update() {
    const N = seat.length;
    $(".n-out").textContent = N;
    const a = seat.indexOf(0), fromA = seat.slice(a).concat(seat.slice(0, a)).map(L).join(" ");
    $(".rows").textContent = fromA;
    $(".n-f").textContent = fact(N); $(".n-g").textContent = N; $(".n-c").textContent = `${fact(N)} ÷ ${N} = ${fact(N - 1)}`;
    draw();
  }
  function reset() { const N = +sn.value; seat = Array.from({ length: N }, (_, i) => i); off = 0; update(); }
  $(".go-rot").addEventListener("click", () => {
    cancelAnimationFrame(raf);
    const done = () => { anim = 0; off = 0; seat = seat.slice(-1).concat(seat.slice(0, -1)); update(); };
    if (NM.reduce) { done(); return; }
    const t0 = performance.now();
    const step = (t) => { anim = NM.ease(Math.min(1, (t - t0) / 500)); draw(); if (anim < 1) raf = requestAnimationFrame(step); else done(); };
    raf = requestAnimationFrame(step);
  });
  $(".go-mix").addEventListener("click", () => { for (let i = seat.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [seat[i], seat[j]] = [seat[j], seat[i]]; } update(); });
  sn.addEventListener("input", reset);
  reset();
})();
