/* 카드: 방 하나를 칠하려면 페인트를 몇 통 사야 할까? — 벽 넓이, 어림, 올림 (가상 제품) */
(() => {
  const root = document.getElementById("card-jmath-paint-estimate");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const aIn = $(".a"), bIn = $(".b"), hIn = $(".h"), HOLE = 3.5, COAT = 2, PER = 10;
  let cv = null;
  const calc = () => { const a = +aIn.value, b = +bIn.value, h = +hIn.value, per = 2 * (a + b), wall = per * h, net = wall - HOLE, tot = net * COAT; return { a, b, h, per, wall, net, tot, cans: Math.ceil(tot / PER - 1e-9) }; };
  function draw() {
    if (!cv || !cv.size.w) return;
    const { ctx } = cv, w = cv.size.w, hh = cv.size.h, r = calc();
    ctx.clearRect(0, 0, w, hh);
    const L = 10, scale = (w - 2 * L) / Math.max(r.per, 12), y0 = 30, H = r.h * scale;
    const walls = [r.a, r.b, r.a, r.b]; let x = L;
    walls.forEach((len, i) => { ctx.fillStyle = i % 2 ? "rgba(63,111,163,.18)" : "rgba(63,111,163,.28)"; ctx.fillRect(x, y0, len * scale, H); ctx.fillStyle = C.ink2; ctx.font = `11px ${F.mono}`; ctx.textAlign = "center"; ctx.fillText(`${len.toFixed(1)} m`, x + (len * scale) / 2, y0 - 8); x += len * scale; });
    /* 문(0.9×2.1)과 창문(약 1.6 m² 정도) — 그림은 대략 */
    ctx.fillStyle = "#fbfbf8"; ctx.strokeStyle = C.ink3; ctx.fillRect(L + 0.5 * scale, y0 + H - 2.1 * scale, 0.9 * scale, 2.1 * scale); ctx.strokeRect(L + 0.5 * scale, y0 + H - 2.1 * scale, 0.9 * scale, 2.1 * scale);
    ctx.fillRect(L + (r.a + 0.8) * scale, y0 + 0.6 * scale, 1.4 * scale, 1.0 * scale); ctx.strokeRect(L + (r.a + 0.8) * scale, y0 + 0.6 * scale, 1.4 * scale, 1.0 * scale);
    ctx.fillStyle = C.ink2; ctx.textAlign = "left"; ctx.fillText(`높이 ${r.h.toFixed(1)} m · 펼친 길이 ${r.per.toFixed(1)} m`, L, y0 + H + 18);
  }
  function update() {
    const r = calc();
    ["a", "b", "h"].forEach((k) => ($(`.${k}-out`).textContent = (+$(`.${k}`).value).toFixed(1)));
    $(".say").textContent = `벽 = ${r.per.toFixed(1)} × ${r.h.toFixed(1)} = ${r.wall.toFixed(2)} m² · 문·창 빼면 ${r.net.toFixed(2)} m² · 2번 칠 ${r.tot.toFixed(2)} m² · ÷ 10 = ${(r.tot / PER).toFixed(2)}통 → 올림 ${r.cans}통 · 어림: ${Math.round(r.per)} × ${(Math.round(r.h * 2) / 2).toFixed(1)} × 2 ÷ 10 ≈ ${((Math.round(r.per) * Math.round(r.h * 2) / 2 * 2) / 10).toFixed(1)}통`;
    draw();
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".verdict").textContent = `${b.dataset.g === "7" ? "맞습니다." : "다시 생각해 보세요."} 칠할 넓이는 약 67.9 m²라 6.79통이 필요하고, 모자라면 안 되므로 올림해 7통을 삽니다.`;
    $(".after").hidden = false; if (!cv) cv = fit($("canvas"), () => draw()); update();
  }));
  [aIn, bIn, hIn].forEach((el) => el.addEventListener("input", update));
})();
