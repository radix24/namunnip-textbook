/* 카드: 조건이 붙은 방정식의 정수해는 몇 개일까? — x + y + z = 8의 해를 삼각형 격자에 찍기 */
(() => {
  const root = document.getElementById("card-dmath-int-solutions");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const R = 8;
  const Q = [
    { ok: () => true, opts: [45, 36, 21, 15], ans: 45, how: "₃H₈ = ₁₀C₈ = 45" },
    { ok: (x, y, z) => x >= 1 && y >= 1 && z >= 1, opts: [45, 21, 15, 10], ans: 21, how: "하나씩 먼저 주고 ₃H₅ = ₇C₅ = 21" },
    { ok: (x) => x >= 3, opts: [45, 28, 21, 15], ans: 21, how: "x = x′ + 3으로 두면 x′ + y + z = 5, ₃H₅ = 21" },
    { ok: (x, y, z) => x <= 4 && y <= 4 && z <= 4, opts: [45, 30, 27, 15], ans: 15, how: "전체 45 − (어느 하나가 5 이상: 각각 ₃H₃ = 10, 겹침 없음) × 3 = 15" },
  ];
  let q = 0, guess = null;
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pad = 28, side = Math.min(w - 2 * pad, ((h - 2 * pad) * 2) / Math.sqrt(3)), cx = w / 2, top = (h - (side * Math.sqrt(3)) / 2) / 2;
    // 꼭짓점: z=8 위, x=8 왼쪽 아래, y=8 오른쪽 아래
    const A = [cx - side / 2, top + (side * Math.sqrt(3)) / 2], B = [cx + side / 2, top + (side * Math.sqrt(3)) / 2], Ct = [cx, top];
    const P = (x, y, z) => [(x * A[0] + y * B[0] + z * Ct[0]) / R, (x * A[1] + y * B[1] + z * Ct[1]) / R];
    ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...Ct); ctx.closePath(); ctx.stroke();
    ctx.font = `600 12px ${F.sans}`; ctx.fillStyle = C.ink2; ctx.textAlign = "center";
    ctx.fillText("(8, 0, 0)", A[0], A[1] + 16); ctx.fillText("(0, 8, 0)", B[0], B[1] + 16); ctx.fillText("(0, 0, 8)", Ct[0], Ct[1] - 8);
    const show = guess != null;
    for (let x = 0; x <= R; x++) for (let y = 0; x + y <= R; y++) {
      const z = R - x - y, p = P(x, y, z), ok = Q[q].ok(x, y, z);
      ctx.beginPath(); ctx.arc(...p, 5.5, 0, 7);
      ctx.fillStyle = !show ? C.ink3 : ok ? C.forest : "rgba(181,83,47,.25)"; ctx.fill();
    }
  }
  function load() {
    q = +$(".pick").value; guess = null; const gp = $(".gp"); gp.innerHTML = "";
    Q[q].opts.forEach((v) => { const b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.textContent = v; b.addEventListener("click", () => { if (guess != null) return; guess = v; b.setAttribute("aria-pressed", "true"); reveal(); }); gp.append(b); });
    $(".say").textContent = "먼저 예측을 고르세요. 그다음 조건을 만족하는 점이 초록으로 나타납니다."; draw();
  }
  function reveal() {
    let cnt = 0; for (let x = 0; x <= R; x++) for (let y = 0; x + y <= R; y++) if (Q[q].ok(x, y, R - x - y)) cnt++;
    $(".say").textContent = `${guess === cnt ? "맞습니다." : `예측 ${guess}, 실제 ${cnt}.`} 초록 점 ${cnt}개 · ${Q[q].how}`;
    draw();
  }
  $(".pick").addEventListener("change", load);
  load();
})();
