/* 카드: 네 직사각형 중 황금 직사각형은? — 황금비의 정의와 피보나치, 황금비 '신화' 따져 보기 */
(() => {
  const root = document.getElementById("card-mcult-golden-myth");
  if (!root) return;
  const { C, F } = NM;
  const $ = (s) => root.querySelector(s);
  const PHI = (1 + Math.sqrt(5)) / 2;
  const R = [[1.414, "√2(종이 A4)"], [1.5, "3 : 2(사진)"], [PHI, "황금비"], [1.778, "16 : 9(화면)"]];
  const order = [1, 3, 0, 2];   // 화면 순서 섞기
  $(".rects").innerHTML = order.map((k) => `<button type="button" data-k="${k}" aria-label="직사각형"><span style="width:${Math.round(56 * R[k][0])}px;height:56px"></span></button>`).join("");
  let ctx, size;
  function spiral() {
    const cv = $("canvas");
    if (!ctx) { cv.hidden = false; ({ ctx, size } = NM.fit(cv, () => spiral())); }   // 보일 때 만들어야 크기가 잡힘
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    let x = 0, y = 0, W = w, H = h; ctx.strokeStyle = C.ink2; ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, w, h);
    const arcs = [];
    for (let i = 0; i < 9; i++) {
      const s = Math.min(W, H), dir = i % 4;
      let sx, sy;
      if (dir === 0) { sx = x; sy = y; x += s; W -= s; arcs.push([sx + s, sy + s, s, Math.PI, 1.5 * Math.PI]); }
      else if (dir === 1) { sx = x; sy = y; y += s; H -= s; arcs.push([sx, sy + s, s, 1.5 * Math.PI, 2 * Math.PI]); }
      else if (dir === 2) { sx = x + W - s; sy = y; W -= s; arcs.push([sx, sy, s, 0, 0.5 * Math.PI]); }
      else { sx = x; sy = y + H - s; H -= s; arcs.push([sx + s, sy, s, 0.5 * Math.PI, Math.PI]); }
      ctx.strokeRect(sx, sy, s, s);
    }
    ctx.strokeStyle = C.warn; ctx.lineWidth = 2; arcs.forEach(([cx, cy, r, a, b]) => { ctx.beginPath(); ctx.arc(cx, cy, r, a, b); ctx.stroke(); });
  }
  root.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-k]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const k = +b.dataset.k, ok = k === 2;
    $(".verdict").textContent = `${ok ? "맞습니다." : `이것은 ${R[k][1]}(약 ${R[k][0].toFixed(3)} : 1)입니다.`} 네 직사각형은 √2 ≈ 1.414, 1.5, 황금비 ≈ 1.618, 16:9 ≈ 1.778이었습니다. 1.5와 1.618은 눈으로 구별하기 쉽지 않습니다.`;
    root.querySelectorAll("[data-k]").forEach((x) => x.setAttribute("aria-label", R[+x.dataset.k][1]));
    spiral();
    const fib = [1, 1]; while (fib.length < 12) fib.push(fib.at(-1) + fib.at(-2));
    $(".say").textContent = `황금비 (1 + √5)/2 = ${PHI.toFixed(6)} · 피보나치 비: ${fib.slice(1, 11).map((v, i) => (fib[i + 2] / v).toFixed(4)).join(", ")} → 황금비에 다가감`;
  }));
})();
