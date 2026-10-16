/* 카드: 정확도 99 %인 검사에서 양성이 나오면, 병에 걸렸을 확률도 99 %일까? — 넓이 그림으로 보는 베이즈 정리 */
(() => {
  const root = document.getElementById("card-pmath-bayes-area");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sp = $(".sp"), sse = $(".sse"), ssp = $(".ssp");
  const { ctx, size } = fit($("canvas"), () => draw());
  /* 막대 0~100 → 유병률 0.1 % ~ 50 % (로그 간격) */
  const prev = () => 0.001 * Math.pow(500, +sp.value / 100);
  const vals = () => { const p = prev(), se = +sse.value / 100, sc = +ssp.value / 100; const tp = p * se, fp = (1 - p) * (1 - sc); return { p, se, sc, tp, fp, ppv: tp / (tp + fp) }; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const { p, se, sc, tp, fp } = vals();
    const sq = Math.min(h - 30, w * 0.55), x0 = 10, y0 = 20;
    // 왼쪽 띠(병)는 보기 좋게 최소 폭을 둔다
    const pw = Math.max(sq * p, Math.min(36, sq * 0.2));
    const hw = sq - pw;
    // 병 있음: 위 = 양성(se), 아래 = 음성
    ctx.fillStyle = "#d4493a"; ctx.fillRect(x0, y0, pw, sq * se);
    ctx.fillStyle = "#f3c9c2"; ctx.fillRect(x0, y0 + sq * se, pw, sq * (1 - se));
    // 건강: 위 = 양성(1 − sc), 아래 = 음성
    ctx.fillStyle = "#e0a02a"; ctx.fillRect(x0 + pw, y0, hw, sq * (1 - sc));
    ctx.fillStyle = "#e8f0e2"; ctx.fillRect(x0 + pw, y0 + sq * (1 - sc), hw, sq * sc);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, sq, sq); ctx.beginPath(); ctx.moveTo(x0 + pw, y0); ctx.lineTo(x0 + pw, y0 + sq); ctx.stroke();
    label(ctx, "병", x0 + pw / 2, y0 - 9, "#d4493a", "center", `700 12px ${F.sans}`);
    label(ctx, "건강", x0 + pw + hw / 2, y0 - 9, C.forest, "center", `700 12px ${F.sans}`);
    // 오른쪽: 양성인 사람들만 모은 막대
    const bx = x0 + sq + 30, bw = w - bx - 20, tot = tp + fp;
    label(ctx, "양성인 사람들만 모으면", bx, y0 - 9, C.ink2, "left", `600 12px ${F.sans}`);
    ctx.fillStyle = "#d4493a"; ctx.fillRect(bx, y0 + 10, bw * tp / tot, 40);
    ctx.fillStyle = "#e0a02a"; ctx.fillRect(bx + bw * tp / tot, y0 + 10, bw * fp / tot, 40);
    label(ctx, `참양성 ${n(tp / tot * 100, 1)}%`, bx, y0 + 66, "#d4493a", "left", `600 12px ${F.sans}`);
    label(ctx, `거짓양성 ${n(fp / tot * 100, 1)}%`, bx + bw, y0 + 84, "#b07a1e", "right", `600 12px ${F.sans}`);
    label(ctx, "빨강: 병이면서 양성 · 주황: 건강한데 양성", bx, y0 + sq - 6, C.ink3, "left", `11px ${F.sans}`);
  }
  function update() {
    const { p, tp, fp, ppv } = vals();
    $(".p-out").textContent = n(p * 100, p < 0.01 ? 2 : 1); $(".se-out").textContent = sse.value; $(".sp2-out").textContent = ssp.value;
    $(".n-pos").textContent = `${n((tp + fp) * 1e4, 0)}명`; $(".n-tp").textContent = `${n(tp * 1e4, 0)}명`;
    $(".n-ppv").textContent = `${n(ppv * 100, 1)} %`;
    draw();
  }
  [sp, sse, ssp].forEach((el) => el.addEventListener("input", update));
  update();
})();
