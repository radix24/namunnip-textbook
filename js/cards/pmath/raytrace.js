/* 카드: 빛줄기와 구의 교점만 계산해서 3D 그림을 그릴 수 있을까? — 화소마다 직선-구 교점(레이 트레이싱) */
(() => {
  const root = document.getElementById("card-pmath-raytrace");
  if (!root) return;
  const { fit } = NM;
  const { n } = NMPm;
  const $ = (s) => root.querySelector(s);
  const sr = $(".sr"), sl = $(".sl"), ss = $(".ss"), calc = $(".calc");
  const cv = $(".img");
  const { ctx, size } = fit(cv, () => draw());
  const O = [0, 1, -4];                        // 눈
  const CEN = () => [0, +ss.value, 0];         // 구는 바닥(y = 0) 위에 놓임
  let pick = null;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const nrm = (a) => { const L = Math.hypot(...a); return [a[0] / L, a[1] / L, a[2] / L]; };
  const light = () => { const a = +sl.value * Math.PI / 180; return nrm([Math.sin(a), 1.1, -Math.cos(a)]); };

  /* 빛줄기 o + t d와 구의 교점: { D, t } (D < 0이면 비켜 감) */
  function hitSphere(o, d, c, r) {
    const w = sub(o, c), A = dot(d, d), B = 2 * dot(d, w), Cc = dot(w, w) - r * r, D = B * B - 4 * A * Cc;
    if (D < 0) return { D, t: null, A, B, C: Cc };
    const t1 = (-B - Math.sqrt(D)) / (2 * A), t2 = (-B + Math.sqrt(D)) / (2 * A);
    return { D, t: t1 > 1e-6 ? t1 : t2 > 1e-6 ? t2 : null, A, B, C: Cc };
  }
  /* 화소 (i, j)의 빛줄기를 따라가 색과 계산 기록을 돌려준다 */
  function trace(i, j, W, H) {
    const u = (i + 0.5) / W * 2 - 1, v = 1 - (j + 0.5) / H * 2;
    const d = nrm([u * 1.2, v * 0.9, 1.6]);
    const c = CEN(), r = +ss.value, L = light(), sp = hitSphere(O, d, c, r);
    if (sp.t != null) {
      const p = [O[0] + sp.t * d[0], O[1] + sp.t * d[1], O[2] + sp.t * d[2]], nn = nrm(sub(p, c)), b = Math.max(0, dot(nn, L));
      const g = 30 + 200 * b;
      return { col: [g * 0.55, g * 0.8, g], info: { kind: "구", d, sp, p, nn, b } };
    }
    if (d[1] < 0) {   // 바닥 y = 0
      const t = -O[1] / d[1], p = [O[0] + t * d[0], 0, O[2] + t * d[2]];
      const sh = hitSphere(p, L, c, r), shadow = sh.t != null;
      const chk = (Math.floor(p[0]) + Math.floor(p[2])) & 1, base = chk ? 205 : 175, g = shadow ? base * 0.45 : base * (0.55 + 0.45 * L[1]);
      return { col: [g, g * 0.97, g * 0.9], info: { kind: "바닥", d, sp, p, t, shadow } };
    }
    return { col: [214, 228, 240], info: { kind: "하늘", d, sp } };
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    const W = +sr.value, H = Math.round(W * 0.75), img = ctx.createImageData(W, H);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const { col } = trace(i, j, W, H), k = 4 * (j * W + i);
      img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255;
    }
    // 작은 이미지를 화면 크기로 늘려 그린다(화소가 보이도록)
    const off = document.createElement("canvas"); off.width = W; off.height = H; off.getContext("2d").putImageData(img, 0, 0);
    ctx.clearRect(0, 0, w, h); ctx.imageSmoothingEnabled = false; ctx.drawImage(off, 0, 0, w, h);
    if (pick) { const cw = w / W, ch = h / H; ctx.strokeStyle = "#d4493a"; ctx.lineWidth = 2; ctx.strokeRect(pick[0] * cw, pick[1] * ch, cw, ch); }
  }
  const f = (a) => `(${a.map((x) => n(x, 2)).join(", ")})`;
  function explain() {
    if (!pick) return;
    const W = +sr.value, H = Math.round(W * 0.75), { info } = trace(pick[0], pick[1], W, H), sp = info.sp;
    let s = `방향 d = ${f(info.d)} · 구와의 이차방정식 판별식 D = ${n(sp.D, 3)}`;
    if (info.kind === "구") s += ` ≥ 0 → 작은 근 t = ${n(sp.t, 3)}, 닿은 점 ${f(info.p)}, 법선 ${f(info.nn)}, 빛과의 내적 → 밝기 ${n(info.b, 3)}`;
    else if (info.kind === "바닥") s += ` < 0 → 구를 비켜 감. 바닥에 닿은 점 ${f(info.p)}. 해 쪽으로 다시 쏜 빛줄기가 ${info.shadow ? "구에 막힘 → 그림자" : "막히지 않음 → 밝게"}`;
    else s += " < 0 → 구도 바닥도 만나지 않음(하늘)";
    calc.textContent = s;
  }
  cv.addEventListener("click", (e) => {
    const b = cv.getBoundingClientRect(), W = +sr.value, H = Math.round(W * 0.75);
    pick = [Math.min(W - 1, Math.floor((e.clientX - b.left) / b.width * W)), Math.min(H - 1, Math.floor((e.clientY - b.top) / b.height * H))];
    draw(); explain();
  });
  function update() { $(".r-out").textContent = sr.value; $(".l-out").textContent = `${sl.value}°`; $(".s-out").textContent = n(+ss.value, 2); pick = null; calc.textContent = "그림의 한 칸을 누르면 그 칸의 빛줄기 계산을 보여 줍니다."; draw(); }
  [sr, sl, ss].forEach((el) => el.addEventListener("input", update));
  update();
})();
