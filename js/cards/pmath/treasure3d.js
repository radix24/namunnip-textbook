/* 카드: 거리만 알려 주는 탐지기로 공간 속 보물을 찾을 수 있을까? — 정수 격자점 보물찾기 */
(() => {
  const root = document.getElementById("card-pmath-treasure3d");
  if (!root) return;
  const { C, F } = NM;
  const S = NMSpace3;
  const { BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sx = $(".sx"), sy = $(".sy"), sz = $(".sz"), log = $(".log"), verdict = $(".verdict");
  const MAX = 5;
  let T, scans, done;
  const vw = S.view($("canvas"), () => draw(), { center: [0, 0, 0], span: 9.5, yaw: -2.2, pitch: 0.45 });
  const rnd = () => Math.floor(Math.random() * 7) - 3;
  const cur = () => [+sx.value, +sy.value, +sz.value];
  const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  const fmt = (p) => `(${p.map((v) => String(v).replace("-", "−")).join(", ")})`;

  function draw() {
    const { ctx, size } = vw; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    // 바닥 격자 z = −3
    for (let k = -3; k <= 3; k++) { vw.line([k, -3, -3], [k, 3, -3], C.rule, 0.8); vw.line([-3, k, -3], [3, k, -3], C.rule, 0.8); }
    vw.axes(3.6, 3.6);
    scans.forEach(({ p, d }) => { vw.dot(p, BLUE, 4); vw.label(p, `√${d}`, BLUE, 6, -8, "left", `600 11px ${F.mono}`); });
    const c = cur();
    vw.line(c, [c[0], c[1], -3], C.ink3, 1, [3, 3]);
    vw.dot(c, C.warn, 6); vw.label(c, fmt(c), C.warn, 8, 10, "left", `600 11px ${F.mono}`);
    if (done) { vw.dot(T, C.forest, 8); vw.label(T, `보물 ${fmt(T)}`, C.forest, 10, -10, "left", `700 12px ${F.sans}`); }
  }
  function update() { $(".x-out").textContent = sx.value; $(".y-out").textContent = sy.value; $(".z-out").textContent = sz.value; draw(); }
  function reset() {
    T = [rnd(), rnd(), rnd()]; scans = []; done = false; log.innerHTML = "";
    verdict.textContent = ""; verdict.className = "verdict"; $(".go-scan").disabled = false; update();
  }
  $(".go-scan").addEventListener("click", () => {
    if (done) return;
    const p = cur(), d = d2(p, T);
    scans.push({ p, d });
    const li = document.createElement("li");
    li.textContent = `${scans.length}. ${fmt(p)}에서 거리 √${d}${Number.isInteger(Math.sqrt(d)) ? ` = ${Math.sqrt(d)}` : ` ≈ ${Math.sqrt(d).toFixed(3)}`}`;
    log.append(li); log.scrollTop = log.scrollHeight;
    if (d === 0) { done = true; verdict.textContent = `찾았습니다! ${scans.length}번 만에 보물을 찾았습니다.`; verdict.className = "verdict good"; }
    else if (scans.length >= MAX) { done = true; verdict.textContent = `측정을 모두 썼습니다. 보물은 ${fmt(T)}에 있었습니다.`; verdict.className = "verdict bad"; }
    if (done) $(".go-scan").disabled = true;
    draw();
  });
  $(".go-new").addEventListener("click", reset);
  [sx, sy, sz].forEach((el) => el.addEventListener("input", update));
  reset();
})();
