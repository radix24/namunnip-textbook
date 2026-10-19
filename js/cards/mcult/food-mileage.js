/* 카드: 멀리서 온 먹거리는 언제나 배출량이 더 많을까? — 푸드 마일리지 t·km × 배출 계수(모식 값) */
(() => {
  const root = document.getElementById("card-mcult-food-mileage");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const EF = { truck: 100, ship: 15, plane: 1000 }, NAME = { truck: "트럭", ship: "배", plane: "비행기" };   // 모식 값 g/t·km
  /* 경로: [이름, [[수단, km], [수단, km]]] — 가상 */
  const R = [["가까운 지역(트럭)", [["truck", 250], ["truck", 0]]], ["먼 나라(배 + 트럭)", [["ship", 9000], ["truck", 300]]], ["먼 나라(비행기 + 트럭)", [["plane", 9000], ["truck", 300]]]];
  const opt = (m) => Object.keys(EF).map((k) => `<option value="${k}"${k === m ? " selected" : ""}>${NAME[k]}</option>`).join("");
  $("table").innerHTML = `<tr><th>경로(식품 1 kg)</th><th>구간 1</th><th>구간 2</th><th>t·km</th><th>배출(g)</th></tr>`
    + R.map(([n, legs], i) => `<tr data-i="${i}"><td>${n}</td>${legs.map(([m, d], j) => `<td><select data-j="${j}" data-f="m" aria-label="${n} 구간 ${j + 1} 수단">${opt(m)}</select> <input type="number" min="0" step="50" value="${d}" data-j="${j}" data-f="d" aria-label="${n} 구간 ${j + 1} 거리 km"> km</td>`).join("")}<td class="tk"></td><td class="em"></td></tr>`).join("");
  const rows = [...root.querySelectorAll("tr[data-i]")];
  let res = [];
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w || !res.length) return;
    ctx.clearRect(0, 0, w, h);
    const L = 140, Rr = 60, bh = (h - 10) / 3, mx = Math.max(...res.map((r) => r.e), 1);
    res.forEach((r, i) => {
      const y = 5 + i * bh, bw = ((w - L - Rr) * r.e) / mx;
      ctx.fillStyle = C.ink2; ctx.font = `12px ${F.sans}`; ctx.textAlign = "right"; ctx.fillText(R[i][0], L - 6, y + bh * 0.6);
      ctx.fillStyle = ["#3f6fa3", C.forest, C.warn][i]; ctx.fillRect(L, y + bh * 0.2, Math.max(bw, 1), bh * 0.6);
      ctx.fillStyle = C.ink; ctx.font = `11px ${F.mono}`; ctx.textAlign = "left"; ctx.fillText(`${r.e.toFixed(1)} g`, L + bw + 4, y + bh * 0.6);
    });
  }
  function update() {
    res = rows.map((r) => {
      let tk = 0, e = 0;
      [0, 1].forEach((j) => { const m = r.querySelector(`[data-j="${j}"][data-f="m"]`).value, d = Math.max(0, +r.querySelector(`[data-j="${j}"][data-f="d"]`).value || 0), t = 0.001 * d; tk += t; e += t * EF[m]; });
      r.querySelector(".tk").textContent = tk.toFixed(2); r.querySelector(".em").textContent = e.toFixed(1);
      return { tk, e };
    });
    const iMax = res.reduce((b, r, i) => (r.tk > res[b].tk ? i : b), 0), eMin = res.reduce((b, r, i) => (r.e < res[b].e ? i : b), 0);
    $(".say").textContent = `배출 계수(모식): 트럭 ${EF.truck}, 배 ${EF.ship}, 비행기 ${EF.plane} g/t·km · 푸드 마일리지 최대: ${R[iMax][0]} · 운송 배출 최소: ${R[eMin][0]}`;
    draw();
  }
  root.querySelectorAll("select, input").forEach((x) => x.addEventListener("input", update));
  update();
})();
