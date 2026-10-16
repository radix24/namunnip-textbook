/* 카드: 음이 조금 다른 두 소리를 함께 내면 왜 울릴까? — 합을 곱으로(맥놀이), WebAudio로 직접 듣기 */
(() => {
  const root = document.getElementById("card-pmath-beats");
  if (!root) return;
  const { C, fit } = NM;
  const G = NMCalc;
  const { n, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const s1 = $(".s1"), s2 = $(".s2"), play = $(".play"), verdict = $(".verdict");
  let target = null;      // 조율 도전의 숨은 기준음
  let audio = null;       // { ac, o1, o2, g }
  const { ctx, size } = fit($("canvas"), () => draw());

  const f1 = () => (target ?? +s1.value), f2 = () => +s2.value;

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const T = 0.5, a = f1(), b = f2(), d = a - b;
    // 위: 두 파동(확대한 20 ms 창), 아래: 합(0.5초)
    const hTop = h * 0.32;
    const g1 = G.frame(ctx, w, hTop, { xr: [0, 0.02], yr: [-1.2, 1.2], xs: 0.005, ys: 1, B: 16, xf: (v) => `${n(v * 1000, 0)}ms`, yf: (v) => n(v, 0) });
    G.curve(ctx, g1, (t) => Math.sin(2 * Math.PI * a * t), C.forest, { width: 1.6, N: 600 });
    G.curve(ctx, g1, (t) => Math.sin(2 * Math.PI * b * t), BLUE, { width: 1.6, N: 600, dash: [3, 2] });
    G.tag(ctx, g1, target == null ? "두 소리 (20 ms 확대)" : "기준음(숨김)과 내 소리 (20 ms)", g1.x0 + g1.w - 4, g1.y0 + 10, C.ink3, "right");
    ctx.save(); ctx.translate(0, hTop + 4);
    const g2 = G.frame(ctx, w, h - hTop - 4, { xr: [0, T], yr: [-2.3, 2.3], xs: 0.1, ys: 1, xf: (v) => `${n(v, 1)}s`, yf: (v) => n(v, 0) });
    // 합: 화소 하나마다 최대·최소를 칠해 빠른 떨림을 띠로 보인다
    ctx.fillStyle = C.sprout;
    const px = Math.max(1, Math.floor(g2.w));
    for (let i = 0; i < px; i++) {
      const t0 = T * i / px, t1 = T * (i + 1) / px;
      let lo = 9, hi = -9;
      for (let k = 0; k <= 8; k++) { const t = t0 + (t1 - t0) * k / 8, y = Math.sin(2 * Math.PI * a * t) + Math.sin(2 * Math.PI * b * t); lo = Math.min(lo, y); hi = Math.max(hi, y); }
      ctx.fillRect(g2.X(t0), g2.Y(hi), Math.max(1, g2.X(t1) - g2.X(t0)), g2.Y(lo) - g2.Y(hi));
    }
    if (target == null) {
      G.curve(ctx, g2, (t) => 2 * Math.cos(Math.PI * d * t), C.warn, { width: 1.8, dash: [6, 4] });
      G.curve(ctx, g2, (t) => -2 * Math.cos(Math.PI * d * t), C.warn, { width: 1.8, dash: [6, 4] });
    }
    G.tag(ctx, g2, "합 sin(2πf₁t) + sin(2πf₂t)", g2.x0 + 4, g2.y0 + 10, C.forest);
    ctx.restore();
  }

  function nums() {
    $(".f1-out").textContent = target == null ? n(+s1.value, 1) : "?";
    $(".f2-out").textContent = n(+s2.value, 1);
    const d = Math.abs(f1() - f2());
    $(".n-avg").textContent = target == null ? `${n((f1() + f2()) / 2, 2)} Hz` : "?";
    $(".n-beat").textContent = target == null ? `${n(d, 2)} Hz` : "귀로 들어 보세요";
    $(".n-per").textContent = target == null ? (d < 1e-9 ? "울림 없음" : `${n(1 / d, 3)} s`) : "?";
    if (audio) { audio.o1.frequency.setTargetAtTime(f1(), audio.ac.currentTime, 0.02); audio.o2.frequency.setTargetAtTime(f2(), audio.ac.currentTime, 0.02); }
    draw();
  }

  function start() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { play.textContent = "이 브라우저는 소리를 낼 수 없습니다"; return; }
    const ac = new AC(), g = ac.createGain();
    g.gain.setValueAtTime(0, ac.currentTime); g.gain.linearRampToValueAtTime(0.12, ac.currentTime + 0.3);
    const o1 = ac.createOscillator(), o2 = ac.createOscillator();
    o1.frequency.value = f1(); o2.frequency.value = f2();
    o1.connect(g); o2.connect(g); g.connect(ac.destination); o1.start(); o2.start();
    audio = { ac, o1, o2, g };
    play.setAttribute("aria-pressed", "true"); play.textContent = "소리 끄기";
  }
  function stop() {
    if (!audio) return;
    const a = audio; audio = null;
    a.g.gain.setTargetAtTime(0, a.ac.currentTime, 0.05);
    setTimeout(() => a.ac.close(), 300);
    play.setAttribute("aria-pressed", "false"); play.textContent = "두 소리 함께 듣기";
  }
  play.addEventListener("click", () => (audio ? stop() : start()));
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) stop(); }).observe(root);

  $(".go-tune").addEventListener("click", () => {
    target = 432 + Math.round(Math.random() * 32) / 2;   // 432 ~ 448 Hz, 0.5 Hz 간격
    s2.value = target + (Math.random() < 0.5 ? -1 : 1) * (3 + Math.round(Math.random() * 6));
    s1.disabled = true;
    verdict.textContent = "소리를 켜고 울림이 없어질 때까지  f₂를 맞춘 뒤 확인을 누르세요."; verdict.className = "verdict";
    nums();
  });
  $(".go-check").addEventListener("click", () => {
    if (target == null) { verdict.textContent = "먼저 새 도전을 누르세요."; verdict.className = "verdict"; return; }
    const d = Math.abs(target - f2());
    verdict.textContent = d < 0.25 ? `성공! 기준음은 ${n(target, 1)} Hz였습니다.` : `아직 ${n(d, 1)} Hz 차이 — 1초에 ${n(d, 1)}번 울립니다. 기준음은 ${n(target, 1)} Hz였습니다.`;
    verdict.className = "verdict " + (d < 0.25 ? "good" : "bad");
    s1.value = target; target = null; s1.disabled = false;
    nums();
  });
  [s1, s2].forEach((s) => s.addEventListener("input", nums));
  nums();
})();
