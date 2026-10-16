/* 카드: 썰매 줄을 비스듬히 당기면 힘의 얼마가 썰매를 끄는 데 쓰일까? — 일 = F·s */
(() => {
  const root = document.getElementById("card-pmath-work-dot");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, rad, label, seg, arrow, arc, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sf = $(".sf"), st = $(".st"), ss = $(".ss");
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const f = +sf.value, t = rad(+st.value), gy = h * 0.72, ox = w * 0.38;
    seg(ctx, 10, gy, w - 10, gy, C.ink3, 1.5);
    // 썰매
    ctx.fillStyle = "#c9a27a"; ctx.fillRect(ox - 60, gy - 26, 60, 22);
    ctx.strokeStyle = C.ink2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox - 66, gy - 2); ctx.lineTo(ox + 4, gy - 2); ctx.quadraticCurveTo(ox + 12, gy - 2, ox + 10, gy - 10); ctx.stroke();
    const L = f * 1.1, o = [ox, gy - 18];
    const tip = [o[0] + L * Math.cos(t), o[1] - L * Math.sin(t)];
    seg(ctx, ...o, ...tip, C.ink3, 1.2);
    arrow(ctx, ...o, ...tip, C.warn, 3);
    label(ctx, "F", tip[0] + 8, tip[1] - 6, C.warn, "left", `italic 700 14px ${F.serif}`);
    // 정사영(s 방향 성분)
    const comp = L * Math.cos(t);
    seg(ctx, ...tip, tip[0], o[1], C.ink3, 1, [4, 3]);
    arrow(ctx, o[0], o[1] + 2, o[0] + comp, o[1] + 2, C.forest, 4);
    label(ctx, "F의 s 방향 성분", o[0] + comp / 2, o[1] + 18, C.forest, "center", `600 11px ${F.sans}`);
    arc(ctx, ...o, 30, 0, t, C.ink2);
    label(ctx, "θ", o[0] + 38 * Math.cos(t / 2), o[1] - 38 * Math.sin(t / 2), C.ink2, "center", `italic 700 12px ${F.serif}`);
    // 이동 벡터 s
    const sl = +ss.value * 14;
    arrow(ctx, ox - 60, gy + 22, ox - 60 + sl, gy + 22, BLUE, 2.4);
    label(ctx, "s (이동)", ox - 60 + sl + 6, gy + 22, BLUE, "left", `600 11px ${F.sans}`);
  }
  function update() {
    const f = +sf.value, t = rad(+st.value), s = +ss.value;
    $(".f-out").textContent = f; $(".t-out").textContent = `${st.value}°`; $(".s-out").textContent = s;
    $(".n-c").textContent = `${n(f * Math.cos(t), 1)} N`;
    $(".n-w").textContent = `${n(f * s * Math.cos(t), 1)} J`;
    $(".n-k").textContent = `${n(f * Math.cos(t), 1)}×${s} + ${n(f * Math.sin(t), 1)}×0 = ${n(f * s * Math.cos(t), 1)}`;
    draw();
  }
  [sf, st, ss].forEach((el) => el.addEventListener("input", update));
  update();
})();
