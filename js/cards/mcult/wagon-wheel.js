/* 카드: 영화 속 마차 바퀴는 왜 가끔 거꾸로 돌아 보일까? — 24 fps 표본 추출과 회전 대칭(나머지) */
(() => {
  const root = document.getElementById("card-mcult-wagon-wheel");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const rIn = $(".r"), kIn = $(".k"), FPS = 24, SLOW = 10;
  const { ctx, size } = fit($("canvas"), () => draw());
  let t0 = performance.now(), on = false;
  /* 한 장 사이 회전각을 한 칸(360/k) 기준 (−반 칸, 반 칸]으로 옮긴 값 = 눈에 보이는 움직임 */
  const seen = (r, k) => { const step = 360 / k, th = (360 * r) / FPS; let m = th % step; if (m > step / 2) m -= step; return m; };
  function wheel(cx, cy, R, ang, k, mark) {
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    for (let i = 0; i < k; i++) {
      const a = ((ang + (360 * i) / k) * Math.PI) / 180;
      ctx.strokeStyle = mark && i === 0 ? C.warn : C.ink2; ctx.lineWidth = mark && i === 0 ? 3 : 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a)); ctx.stroke();
    }
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fill();
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const r = +rIn.value, k = +kIn.value, ts = (performance.now() - t0) / 1000 / SLOW, R = Math.min(w / 4, h / 2) - 26;
    const idx = Math.floor(ts * FPS);
    wheel(w / 4, h / 2 + 8, R, 360 * r * ts, k, true);
    wheel((3 * w) / 4, h / 2 + 8, R, (360 * r * idx) / FPS, k, false);
    ctx.fillStyle = C.ink2; ctx.font = `12px ${F.sans}`; ctx.textAlign = "center";
    ctx.fillText("실제 바퀴(살 하나 표시)", w / 4, 14); ctx.fillText(`영화 속 바퀴(${FPS} fps)`, (3 * w) / 4, 14);
  }
  function tick() { draw(); if (on) requestAnimationFrame(tick); }
  new IntersectionObserver(([e]) => { const was = on; on = e.isIntersecting; if (on && !was) requestAnimationFrame(tick); }).observe($("canvas"));
  function update() {
    const r = +rIn.value, k = +kIn.value, th = (360 * r) / FPS, m = seen(r, k), app = (m * FPS) / 360;
    $(".r-out").textContent = r.toFixed(2); $(".k-out").textContent = k;
    const dir = Math.abs(m) < 1e-6 ? "멈춰 보임" : m > 0 ? "앞으로 도는 것처럼 보임" : "거꾸로 도는 것처럼 보임";
    $(".say").textContent = `한 장 사이 실제 회전 ${th.toFixed(1)}° · 한 칸 ${(360 / k).toFixed(1)}° · 눈에 보이는 이동 ${m.toFixed(1)}° → ${dir} (보이는 속도 ${app.toFixed(2)} 바퀴/초)`;
    draw();
  }
  [rIn, kIn].forEach((x) => x.addEventListener("input", update));
  update();
})();
