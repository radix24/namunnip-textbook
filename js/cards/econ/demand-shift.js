/* 카드: 가격이 올라 덜 사는 것과 덜 사고 싶어지는 것은 무엇이 다를까? — 곡선 위 이동 vs 곡선 이동 (모의 함수) */
(() => {
  const root = document.getElementById("card-econ-demand-shift");
  if (!root) return;
  const { C, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const pIn = $(".p"), QM = 500, PM = 7000;
  /* 수요 Q = 400 − 0.06P + 이동, 공급 Q = −60 + 0.08P + 이동 */
  const BASE = { d: (P) => 400 - 0.06 * P, s: (P) => -60 + 0.08 * P };
  const EV = {
    d: [["용돈이 늘었다", 60], ["김밥 값이 올랐다(대체재)", 40], ["떡볶이가 몸에 나쁘다는 기사", -80], ["어묵 값이 올랐다(함께 먹는 보완재)", -40]],
    s: [["떡 값이 올랐다(원재료)", -70], ["새 조리 기계 도입", 60], ["분식점이 새로 생겼다", 80], ["가게 임대료 인상", -40]],
  };
  let k = "d", shift = { d: 0, s: 0 }, last = "";
  const { ctx, size } = fit($("canvas"), () => draw());
  const Q = (kk, P) => BASE[kk](P) + shift[kk];
  function evs() {
    $(".ev").innerHTML = EV[k].map(([t, dv], i) => `<button class="chip" type="button" data-e="${i}">${t}</button>`).join("") + `<button class="chip" type="button" data-e="r">처음으로</button>`;
    $(".ev").querySelectorAll("[data-e]").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.e === "r") { shift[k] = 0; last = ""; } else { const [t, dv] = EV[k][+b.dataset.e]; shift[k] += dv; last = `${t} → ${k === "d" ? "수요" : "공급"}곡선이 ${dv > 0 ? "오른쪽" : "왼쪽"}으로 ${Math.abs(dv)}만큼 이동`; }
      update();
    }));
  }
  function draw() {
    if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    const P = E.frame(ctx, size, { x0: 0, x1: QM, y0: 0, y1: PM, xt: [0, 100, 200, 300, 400, 500], yt: [[0, "0"], [2000, "2000"], [4000, "4000"], [6000, "6000"]], xlab: "하루 수량(그릇)", ylab: "가격(원)", L: 48 });
    const col = k === "d" ? E.BLUE : C.warn;
    P.clip();
    /* Q를 가로, P를 세로로: 점 (Q(P), P) */
    const curve = (f, c, lw, dash) => E.line(ctx, P, [...Array(141)].map((_, i) => { const pp = (i / 140) * PM; return [f(pp), pp]; }), c, lw, dash);
    curve((pp) => BASE[k](pp), C.ink3, 1.6, [5, 4]);
    curve((pp) => Q(k, pp), col, 2.6);
    ctx.restore();
    const pp = +pIn.value, q = Q(k, pp), q0 = BASE[k](pp);
    ctx.save(); ctx.strokeStyle = C.rule; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(P.X(0), P.Y(pp)); ctx.lineTo(P.X(Math.max(q, q0)), P.Y(pp)); ctx.stroke(); ctx.restore();
    if (shift[k]) E.dot(ctx, P, q0, pp, C.ink3, 4);
    E.dot(ctx, P, q, pp, col, 5.5, `${E.n(q)}그릇`, 7, -7);
  }
  function update() {
    const pp = +pIn.value, q = Q(k, pp);
    $(".p-out").textContent = E.n(pp);
    $(".say").textContent = `가격 ${E.n(pp)}원에서 ${k === "d" ? "수요량" : "공급량"} ${E.n(Math.max(0, q))}그릇` + (shift[k] ? ` (원래 곡선이면 ${E.n(Math.max(0, BASE[k](pp)))}그릇)` : "") + (last ? ` · ${last}` : " · 가격을 바꾸면 점이 곡선 위에서 움직입니다");
    draw();
  }
  root.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => { k = b.dataset.k; last = ""; root.querySelectorAll("[data-k]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); evs(); update(); }));
  pIn.addEventListener("input", () => { last = ""; update(); });
  evs(); update();
})();
