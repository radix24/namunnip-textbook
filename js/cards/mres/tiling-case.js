/* 카드: 한 가지 정다각형으로 바닥 채우기 — 꼭짓점 둘레 내각 합 360°, 2n/(n − 2)가 자연수인 n = 3, 4, 6 */
(() => {
  const root = document.getElementById("card-mres-tiling-case");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n");
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const n = +nIn.value, ang = (Math.PI * (n - 2)) / n, k = Math.ceil((2 * Math.PI) / ang - 1e-9), cx = w / 2, cy = h / 2, s = Math.min(w, h) * 0.46 * Math.sin(Math.PI / n);   // 외접원 지름(s/sin(π/n))이 화면 안에 들도록
    for (let j = 0; j < k; j++) {
      /* 꼭짓점 (cx, cy)에서 시작하는 정n각형: 한 변 방향 θ, 다음 변은 외각만큼 회전 */
      const th0 = j * ang, over = (j + 1) * ang > 2 * Math.PI + 1e-9;
      let x = cx, y = cy, th = th0;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let i = 0; i < n; i++) { x += s * Math.cos(th); y -= s * Math.sin(th); ctx.lineTo(x, y); th += Math.PI - ang; }
      ctx.closePath(); ctx.fillStyle = over ? "rgba(181,83,47,.35)" : ["rgba(63,111,163,.35)", "rgba(116,171,102,.35)"][j % 2]; ctx.fill();
      ctx.strokeStyle = over ? C.warn : C.ink2; ctx.lineWidth = 1.5; ctx.stroke();
    }
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, 7); ctx.fill();
  }
  function update() {
    const n = +nIn.value, a = (180 * (n - 2)) / n, q = 360 / a, k = Math.floor(q + 1e-9), ok = Math.abs(q - Math.round(q)) < 1e-9;
    $(".n-out").textContent = n;
    $(".say").textContent = `정${n}각형의 한 내각 ${a.toFixed(1)}° · 360 ÷ ${a.toFixed(1)} = ${q.toFixed(3)} → ${ok ? `정확히 ${Math.round(q)}개로 빈틈없이 채움` : `${k}개면 ${(360 - k * a).toFixed(1)}° 틈, ${k + 1}개면 ${((k + 1) * a - 360).toFixed(1)}° 겹침(빨강)`}`;
    draw();
  }
  nIn.addEventListener("input", update);
  update();
})();
