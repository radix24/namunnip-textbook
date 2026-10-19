/* 카드: 같은 수를 2진법, 16진법으로 쓰면 왜 모양이 달라질까? — 자리값 블록과 나눗셈 과정 */
(() => {
  const root = document.getElementById("card-dmath-base-convert");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), bIn = $(".b"), DIG = "0123456789ABCDEF";
  const { ctx, size } = fit($("canvas"), () => draw());
  const digits = (n, b) => { if (n === 0) return [0]; const d = []; while (n > 0) { d.unshift(n % b); n = Math.floor(n / b); } return d; };
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const n = +nIn.value, b = +bIn.value, d = digits(n, b), k = d.length, cw = (w - 10) / k;
    d.forEach((a, i) => {
      const p = k - 1 - i, x0 = 5 + i * cw, val = b ** p;
      ctx.fillStyle = C.ink2; ctx.font = `600 11px ${F.mono}`; ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(`${b}^${p} = ${val}`, x0 + cw / 2, 2);
      ctx.fillStyle = C.ink; ctx.font = `700 16px ${F.mono}`; ctx.fillText(`${DIG[a]} 묶음`, x0 + cw / 2, h - 22);
      // 묶음 a개를 막대로(각 묶음의 크기는 val, 높이는 로그로 줄임)
      const area = { x: x0 + 4, y: 20, w: cw - 8, h: h - 48 }, cols = Math.max(1, Math.min(a, 8)), bw = area.w / Math.max(cols, 3), hh = Math.max(4, area.h * Math.min(1, Math.log(val + 1) / Math.log(256)));
      for (let j = 0; j < a; j++) { const c = j % 8, r = Math.floor(j / 8); ctx.fillStyle = ["#3f6fa3", "#3b7c2a", "#e0a02a", "#b5532f"][p % 4]; ctx.fillRect(area.x + c * bw + 1, area.y + area.h - hh - r * 6, bw - 2, hh - 1); }
      ctx.strokeStyle = C.rule; ctx.strokeRect(x0 + 1, 18, cw - 2, h - 44);
    });
  }
  function update() {
    const n = +nIn.value, b = +bIn.value, d = digits(n, b);
    $(".n-out").textContent = n; $(".b-out").textContent = b;
    root.querySelectorAll("[data-b]").forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.b === b)));
    $(".digits").textContent = `${n} = ${d.map((a) => DIG[a]).join("")}₍${b}₎ = ` + d.map((a, i) => `${DIG[a]}×${b}^${d.length - 1 - i}`).join(" + ");
    let q = n; const lines = [];
    if (n === 0) lines.push("0은 어느 진법에서나 0");
    while (q > 0) { lines.push(`${q} ÷ ${b} = ${Math.floor(q / b)} … 나머지 ${DIG[q % b]}`); q = Math.floor(q / b); }
    const bin = n.toString(2).padStart(Math.ceil(n.toString(2).length / 4) * 4, "0").replace(/(.{4})(?=.)/g, "$1 ");
    $(".div").innerHTML = lines.join("<br>") + `<br>나머지를 아래에서 위로 읽으면 ${d.map((a) => DIG[a]).join("")} · 2진법 네 자리씩: ${bin} → 16진법 ${n.toString(16).toUpperCase()}`;
    draw();
  }
  root.querySelectorAll("[data-b]").forEach((x) => x.addEventListener("click", () => { bIn.value = x.dataset.b; update(); }));
  [nIn, bIn].forEach((el) => el.addEventListener("input", update));
  update();
})();
