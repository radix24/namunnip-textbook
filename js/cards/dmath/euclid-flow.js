/* 카드: 최대공약수를 구하는 절차를 기계에게 어떻게 알려 줄까? — 유클리드 호제법 순서도 한 단계씩 */
(() => {
  const root = document.getElementById("card-dmath-euclid-flow");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  /* 상자: [이름, 글, 모양, x(0~1), y(0~1)] */
  const BOX = [
    ["start", "시작: a, b 입력", "round", 0.5, 0.07],
    ["test", "b = 0 ?", "diamond", 0.5, 0.25],
    ["r", "r ← a mod b", "rect", 0.5, 0.45],
    ["ab", "a ← b,  b ← r", "rect", 0.5, 0.63],
    ["out", "a 출력, 끝", "round", 0.5, 0.88],
  ];
  let a, b, r, at, rows, done;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const bw = w * 0.52, bh = h * 0.085, P = (k) => [BOX[k][3] * w, BOX[k][4] * h];
    const arrow = (x1, y1, x2, y2, label) => {
      ctx.strokeStyle = C.ink2; ctx.fillStyle = C.ink2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      const t = Math.atan2(y2 - y1, x2 - x1); ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 8 * Math.cos(t - 0.4), y2 - 8 * Math.sin(t - 0.4)); ctx.lineTo(x2 - 8 * Math.cos(t + 0.4), y2 - 8 * Math.sin(t + 0.4)); ctx.fill();
      if (label) { ctx.font = `700 12px ${F.sans}`; ctx.fillText(label, (x1 + x2) / 2 + 6, (y1 + y2) / 2 - 4); }
    };
    const [s0, t0, r0, ab0, o0] = [0, 1, 2, 3, 4].map(P);
    arrow(s0[0], s0[1] + bh / 2, t0[0], t0[1] - bh * 0.75);
    arrow(t0[0], t0[1] + bh * 0.75, r0[0], r0[1] - bh / 2, "아니요");
    arrow(r0[0], r0[1] + bh / 2, ab0[0], ab0[1] - bh / 2);
    // 되돌아가기
    ctx.strokeStyle = C.ink2; ctx.beginPath(); ctx.moveTo(ab0[0] - bw / 2, ab0[1]); ctx.lineTo(w * 0.07, ab0[1]); ctx.lineTo(w * 0.07, t0[1]); ctx.stroke();
    arrow(w * 0.07, t0[1], t0[0] - bw * 0.42, t0[1]);
    ctx.beginPath(); ctx.moveTo(t0[0] + bw * 0.42, t0[1]); ctx.lineTo(w * 0.93, t0[1]); ctx.lineTo(w * 0.93, o0[1]); ctx.stroke();
    arrow(w * 0.93, o0[1], o0[0] + bw / 2, o0[1]);
    ctx.fillStyle = C.ink2; ctx.font = `700 12px ${F.sans}`; ctx.fillText("예", w * 0.93 - 18, t0[1] - 6);
    BOX.forEach(([id, txt, shape], k) => {
      const [x, y] = P(k), on = id === at;
      ctx.beginPath();
      if (shape === "diamond") { ctx.moveTo(x, y - bh * 0.75); ctx.lineTo(x + bw * 0.42, y); ctx.lineTo(x, y + bh * 0.75); ctx.lineTo(x - bw * 0.42, y); ctx.closePath(); }
      else if (shape === "round") ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, bh / 2);
      else ctx.rect(x - bw / 2, y - bh / 2, bw, bh);
      ctx.fillStyle = on ? "rgba(224,160,42,.45)" : "rgba(141,141,146,.12)"; ctx.fill(); ctx.strokeStyle = on ? C.amber : C.ink3; ctx.lineWidth = on ? 3 : 1.4; ctx.stroke();
      ctx.fillStyle = C.ink; ctx.font = `600 13px ${F.mono}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(txt, x, y);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    });
  }
  function table() {
    $(".st").innerHTML = "<tr><th>단계</th><th>a</th><th>b</th><th>r</th></tr>" + rows.map((x, i) => `<tr><td>${i}</td><td>${x[0]}</td><td>${x[1]}</td><td>${x[2] ?? ""}</td></tr>`).join("");
  }
  function reset() {
    a = Math.max(1, Math.floor(+$(".a").value) || 1); b = Math.max(0, Math.floor(+$(".b").value) || 0); r = null; at = "start"; done = false; rows = [[a, b, ""]];
    $(".say").textContent = "시작 상자입니다. 한 단계를 누르세요."; table(); draw();
  }
  function step() {
    if (done) return;
    if (at === "start") { at = "test"; $(".say").textContent = `b = ${b}이 0인지 판단합니다.`; }
    else if (at === "test") { if (b === 0) { at = "out"; done = true; $(".say").textContent = `b = 0이므로 a를 출력합니다. 최대공약수는 ${a}입니다. (반복 ${rows.length - 1}번)`; } else { at = "r"; $(".say").textContent = "b ≠ 0이므로 나머지를 구합니다."; } }
    else if (at === "r") { r = a % b; at = "ab"; $(".say").textContent = `r ← ${a} mod ${b} = ${r}`; }
    else if (at === "ab") { a = b; b = r; rows.push([a, b, r]); at = "test"; $(".say").textContent = `a ← ${a}, b ← ${b}. 다시 판단으로 돌아갑니다.`; table(); }
    draw();
  }
  $(".go-step").addEventListener("click", step);
  $(".go-run").addEventListener("click", () => { let k = 0; while (!done && k++ < 400) step(); });
  $(".go-reset").addEventListener("click", reset);
  [$(".a"), $(".b")].forEach((el) => el.addEventListener("change", reset));
  reset();
})();
