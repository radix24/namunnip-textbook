/* 카드: 피보나치 수열의 일반항에 왜 √5가 나올까? — (aₙ₊₁, aₙ)이 큰 고윳값 방향으로 모이는 모습과 일반항 비교 */
(() => {
  const root = document.getElementById("card-adalg-fibonacci");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { label, dot, seg, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const phi = (1 + Math.sqrt(5)) / 2, psi = (1 - Math.sqrt(5)) / 2;
  const aIn = $(".a"), bIn = $(".b");
  const { ctx, size } = fit($("canvas"), () => draw());
  /* 수열 aₙ (n = 1..N) */
  const seq = (N) => { const s = [+aIn.value, +bIn.value]; while (s.length < N) s.push(s[s.length - 1] + s[s.length - 2]); return s; };
  /* 처음 벡터 (a₂, a₁) = c₁(φ, 1) + c₂(ψ, 1) */
  const coef = () => { const a1 = +aIn.value, a2 = +bIn.value, c1 = (a2 - psi * a1) / (phi - psi), c2 = a1 - c1; return [c1, c2]; };

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = seq(9), R = Math.max(6, ...s.map(Math.abs)) * 1.08, pl = L.plane(ctx, { x: 0, y: 0, w, h }, R, { bare: true });
    ctx.strokeStyle = C.ink3; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(...pl.P(-R, 0)); ctx.lineTo(...pl.P(R, 0)); ctx.moveTo(...pl.P(0, -R)); ctx.lineTo(...pl.P(0, R)); ctx.stroke();
    label(ctx, "aₙ₊₁", w - 8, pl.P(0, 0)[1] + 12, C.ink2, "right", `600 11px ${F.sans}`);
    label(ctx, "aₙ", pl.P(0, 0)[0] + 6, 10, C.ink2, "left", `600 11px ${F.sans}`);
    seg(ctx, ...pl.P(-R * 1.2, -R * 1.2 / phi), ...pl.P(R * 1.2, R * 1.2 / phi), C.forest, 1.6, [7, 4]);
    seg(ctx, ...pl.P(-R * 0.75, -R * 0.75 / psi), ...pl.P(R * 0.75, R * 0.75 / psi), C.warn, 1.6, [7, 4]);
    label(ctx, "φ 방향(λ = 1.618)", pl.P(R * 0.62, R * 0.62 / phi)[0], pl.P(R * 0.62, R * 0.62 / phi)[1] - 12, C.forest, "right", `600 11px ${F.sans}`);
    label(ctx, "ψ 방향(λ = −0.618)", pl.P(-R * 0.4, -R * 0.4 / psi)[0] + 6, pl.P(-R * 0.4, -R * 0.4 / psi)[1], C.warn, "left", `600 11px ${F.sans}`);
    for (let k = 0; k + 1 < s.length; k++) {
      const p = pl.P(s[k + 1], s[k]);
      if (k) { const q = pl.P(s[k], s[k - 1]); ctx.strokeStyle = "rgba(63,111,163,.4)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(...q); ctx.lineTo(...p); ctx.stroke(); }
      dot(ctx, ...p, BLUE, 4.5); label(ctx, String(k + 1), p[0] + 7, p[1] + 9, BLUE, "left", `600 10px ${F.mono}`);
    }
  }
  function update() {
    $(".a-out").textContent = aIn.value; $(".b-out").textContent = bIn.value;
    const s = seq(20), [c1, c2] = coef();
    const rows = [`<tr><th>n</th><th>aₙ</th><th>c₁φⁿ⁻¹ 부분</th><th>c₂ψⁿ⁻¹ 부분</th><th>aₙ₊₁/aₙ</th></tr>`];
    [1, 2, 3, 4, 5, 8, 12, 16, 19].forEach((n) => {
      const A = c1 * phi ** (n - 1), B = c2 * psi ** (n - 1);
      rows.push(`<tr><td>${n}</td><td>${s[n - 1]}</td><td>${L.n(A, 4)}</td><td>${L.n(B, 4)}</td><td>${s[n - 1] ? L.n(s[n] / s[n - 1], 5) : "—"}</td></tr>`);
    });
    $(".st").innerHTML = rows.join("");
    $(".note").textContent = `aₙ = c₁φⁿ⁻¹ + c₂ψⁿ⁻¹, c₁ = ${L.n(c1, 4)}, c₂ = ${L.n(c2, 4)} · φ = ${L.n(phi, 6)}, √5 = φ − ψ = ${L.n(phi - psi, 6)}` + (Math.abs(c1) < 1e-9 ? " · c₁ = 0이라 ψ 방향에만 있습니다." : "");
    draw();
  }
  [aIn, bIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
