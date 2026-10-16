/* 카드: 메뉴 세 가지로 목표 영양 식단을 정확히 맞출 수 있을까? — 5차원 벡터의 일차결합 */
(() => {
  const root = document.getElementById("card-adalg-nutrition");
  if (!root) return;
  const { C, fit } = NM;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  const sa = $(".sa"), sb = $(".sb"), sc = $(".sc"), verdict = $(".verdict");
  const NAMES = ["열량", "탄수화물", "단백질", "지방", "나트륨"];
  /* 가상의 모식 값 (단위 생략) */
  const A = [300, 60, 6, 2, 10], B = [150, 0, 30, 3, 70], Cc = [80, 10, 2, 4, 200];
  let goal;
  const { ctx, size } = fit($("canvas"), () => draw());
  const mix = () => L.add(L.add(L.scl(A, +sa.value), L.scl(B, +sb.value)), L.scl(Cc, +sc.value));
  function newGoal() {
    // 절반은 세 메뉴로 정확히 만들 수 있는 목표, 절반은 만들 수 없는 목표
    const r = () => Math.round(Math.random() * 6) / 2 + 0.5;
    goal = L.add(L.add(L.scl(A, r()), L.scl(B, r())), L.scl(Cc, r()));
    if (Math.random() < 0.5) goal[2 + Math.floor(Math.random() * 2)] *= 1.6;   // 단백질이나 지방만 크게 → 맞출 수 없음
    goal = goal.map((v) => Math.round(v));
    verdict.textContent = ""; verdict.className = "verdict";
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const m = mix(), pct = m.map((v, i) => (v / goal[i]) * 100);
    NMSim.bars(ctx, { x0: 40, y0: 10, w: w - 48, h: h - 32 }, pct, { labels: NAMES, expect: NAMES.map(() => 100), top: Math.max(160, ...pct) * 1.05, hi: new Set(pct.map((p, i) => (Math.abs(p - 100) <= 3 ? -1 : i)).filter((i) => i >= 0)), hiColor: "#e8b0a5", yfmt: (v) => String(Math.round(v)) });
  }
  function update() {
    $(".a-out").textContent = sa.value; $(".b-out").textContent = sb.value; $(".c-out").textContent = sc.value;
    const m = mix(), ok = m.every((v, i) => Math.abs(v / goal[i] - 1) <= 0.03);
    $(".menu").innerHTML = `A = (${A.join(", ")})<br>B = (${B.join(", ")})<br>C = (${Cc.join(", ")})<br>목표 g = (${goal.join(", ")})`;
    $(".eq").textContent = `${sa.value}A + ${sb.value}B + ${sc.value}C = (${m.map((v) => Math.round(v)).join(", ")})`;
    if (ok) { verdict.textContent = "다섯 성분을 모두 맞췄습니다!"; verdict.className = "verdict good"; }
    else if (verdict.className.includes("good")) { verdict.textContent = ""; verdict.className = "verdict"; }
    draw();
  }
  $(".go-new").addEventListener("click", () => { newGoal(); update(); });
  [sa, sb, sc].forEach((el) => el.addEventListener("input", update));
  newGoal(); update();
})();
