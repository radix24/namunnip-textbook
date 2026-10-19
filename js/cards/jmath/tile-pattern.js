/* 카드: 정사각형 바닥 둘레에 까는 테두리 타일은 몇 장일까? — 대응표에서 규칙(4n + 4) 만들기 */
(() => {
  const root = document.getElementById("card-jmath-tile-pattern");
  if (!root) return;
  const { C, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), f = (n) => 4 * n + 4;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w } = size; if (!w) return;
    ctx.clearRect(0, 0, w, w);
    const n = +nIn.value, m = n + 2, u = (w - 8) / 12, x0 = (w - m * u) / 2;
    for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) {
      const border = i === 0 || j === 0 || i === m - 1 || j === m - 1;
      ctx.fillStyle = border ? "#e0a02a" : "rgba(63,111,163,.55)";
      ctx.fillRect(x0 + j * u + 1, x0 + i * u + 1, u - 2, u - 2);
    }
    ctx.strokeStyle = C.ink3; ctx.strokeRect(x0, x0, m * u, m * u);
  }
  function update() {
    const n = +nIn.value;
    $(".n-out").textContent = n;
    $("table").innerHTML = `<tr><th>n</th>${[1, 2, 3, 4, 5, 6].map((k) => `<th${k === n ? ' style="background:rgba(224,160,42,.25)"' : ""}>${k}</th>`).join("")}</tr><tr><th>테두리</th>${[1, 2, 3, 4, 5, 6].map((k) => `<td>${f(k)}</td>`).join("")}</tr>`;
    draw();
  }
  $(".go-check").addEventListener("click", () => {
    const a = +$(".ka").value, b = +$(".kb").value, bad = [1, 2, 3, 4, 5, 6, 10, 25].filter((k) => a * k + b !== f(k));
    $(".verdict").textContent = bad.length ? `n = ${bad[0]}일 때 내 식은 ${a * bad[0] + b}장, 실제는 ${f(bad[0])}장입니다. 대응표에서 n이 1 늘 때 테두리가 몇 장 느는지 보세요.` : `맞습니다. 테두리 타일 수 = ${a}n + ${b}. n = 25이면 ${f(25)}장입니다.`;
  });
  nIn.addEventListener("input", update);
  update();
})();
