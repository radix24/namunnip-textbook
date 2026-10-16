/* 카드: 주어진 화살표 두 개만으로 목표점에 갈 수 있을까? — s·a + t·b = T 퍼즐 */
(() => {
  const root = document.getElementById("card-pmath-vec-puzzle");
  if (!root) return;
  const { C, F, fit } = NM;
  const { label, dot, arrow, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const ss = $(".ss"), stt = $(".stt"), verdict = $(".verdict"), next = $(".go-next");
  /* 단계: a, b, 목표 T, 가능 여부 */
  const LV = [
    { a: [2, 1], b: [1, 2], T: [5, 4], ok: true },
    { a: [2, 1], b: [-1, 1], T: [1, 5], ok: true },
    { a: [3, 1], b: [1, 2], T: [-1, 3], ok: true },
    { a: [2, 0], b: [0, 2], T: [3, 2], ok: false },
  ];
  let lv = 0, solved = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const vs = (v) => `(${v.map((x) => String(x).replace("-", "−")).join(", ")})`;

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const R = 7, s = Math.min(w, h) / (2 * R + 1), cx = w / 2, cy = h / 2;
    const P = (x, y) => [cx + x * s, cy - y * s];
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1;
    for (let k = -R; k <= R; k++) { ctx.beginPath(); ctx.moveTo(...P(k, -R)); ctx.lineTo(...P(k, R)); ctx.moveTo(...P(-R, k)); ctx.lineTo(...P(R, k)); ctx.stroke(); }
    ctx.strokeStyle = C.ink3; ctx.beginPath(); ctx.moveTo(...P(-R, 0)); ctx.lineTo(...P(R, 0)); ctx.moveTo(...P(0, -R)); ctx.lineTo(...P(0, R)); ctx.stroke();
    const L = LV[lv], sa = +ss.value, tb = +stt.value;
    // 목표
    ctx.fillStyle = "rgba(224,160,42,.25)"; ctx.beginPath(); ctx.arc(...P(...L.T), 13, 0, 7); ctx.fill();
    dot(ctx, ...P(...L.T), C.amber, 6); label(ctx, "T", P(...L.T)[0] + 10, P(...L.T)[1] - 10, C.amber, "left", `italic 700 13px ${F.serif}`);
    // 경로: a를 |s|번, 그다음 b를 |t|번
    let cur = [0, 0];
    const step = (v, k, col) => { for (let i = 0; i < Math.abs(k); i++) { const nx = [cur[0] + Math.sign(k) * v[0], cur[1] + Math.sign(k) * v[1]]; arrow(ctx, ...P(...cur), ...P(...nx), col, 2.4, 8); cur = nx; } };
    step(L.a, sa, C.forest); step(L.b, tb, BLUE);
    dot(ctx, ...P(0, 0), C.ink, 5); label(ctx, "O", P(0, 0)[0] - 10, P(0, 0)[1] + 12, C.ink, "center", `italic 700 12px ${F.serif}`);
    dot(ctx, ...P(...cur), C.warn, 5);
  }
  function update() {
    const L = LV[lv], sa = +ss.value, tb = +stt.value;
    $(".s-out").textContent = sa; $(".t-out").textContent = tb;
    $(".lv").textContent = `${lv + 1}단계 / ${LV.length}  ·  a = ${vs(L.a)},  b = ${vs(L.b)},  목표 T = ${vs(L.T)}`;
    const p = [sa * L.a[0] + tb * L.b[0], sa * L.a[1] + tb * L.b[1]];
    $(".eq").textContent = `${sa}a + ${tb}b = ${vs(p)}`.replace(/\+ -/g, "− ").replace(/-/g, "−");
    if (!solved && p[0] === L.T[0] && p[1] === L.T[1]) { solved = true; verdict.textContent = `도착! s = ${sa}, t = ${tb}`; verdict.className = "verdict good"; next.disabled = lv === LV.length - 1; }
    draw();
  }
  function load() { solved = false; ss.value = 0; stt.value = 0; verdict.textContent = ""; verdict.className = "verdict"; next.disabled = true; update(); }
  $(".go-imp").addEventListener("click", () => {
    const L = LV[lv];
    if (!L.ok) { solved = true; verdict.textContent = "맞습니다. 2s = 3을 만족하는 정수 s는 없으므로 x좌표 3에 갈 수 없습니다(a, b로 가는 점의 좌표는 모두 짝수입니다)."; verdict.className = "verdict good"; }
    else { verdict.textContent = "갈 수 있습니다. 연립방정식을 풀어 보세요."; verdict.className = "verdict bad"; }
  });
  next.addEventListener("click", () => { if (lv < LV.length - 1) { lv++; load(); } });
  [ss, stt].forEach((el) => el.addEventListener("input", update));
  load();
})();
