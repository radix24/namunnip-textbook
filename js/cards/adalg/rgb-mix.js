/* 카드: 색이 섞인 조명 세 개로 원하는 색을 만들 수 있을까? — 3차원 색 벡터의 일차결합 */
(() => {
  const root = document.getElementById("card-adalg-rgb-mix");
  if (!root) return;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  const s1 = $(".s1"), s2 = $(".s2"), s3 = $(".s3"), verdict = $(".verdict");
  const LT = [[0.8, 0.2, 0.1], [0.1, 0.7, 0.2], [0.1, 0.2, 0.7]];   // 조명의 색 (r, g, b)
  let target;
  const css = (c) => `rgb(${c.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255)).join(",")})`;
  const fmt = (c) => `(${c.map((v) => L.n(v, 2)).join(", ")})`;
  const mix = () => L.add(L.add(L.scl(LT[0], +s1.value), L.scl(LT[1], +s2.value)), L.scl(LT[2], +s3.value));
  /* 목표: 대부분은 만들 수 있게(세기 0.05 간격) 고르고, 가끔은 만들 수 없는 색 */
  function newTarget() {
    if (Math.random() < 0.7) { const w = [0, 0, 0].map(() => Math.round(Math.random() * 20) / 20); target = L.add(L.add(L.scl(LT[0], w[0]), L.scl(LT[1], w[1])), L.scl(LT[2], w[2])); }
    else target = [[0, 0.9, 0.9], [0.95, 0.05, 0.9], [0.05, 0.05, 0.05], [1, 1, 0]][Math.floor(Math.random() * 4)];
    verdict.textContent = ""; verdict.className = "verdict"; $(".eq").textContent = "—";
  }
  function update() {
    const m = mix();
    $(".s1-out").textContent = L.n(+s1.value, 2); $(".s2-out").textContent = L.n(+s2.value, 2); $(".s3-out").textContent = L.n(+s3.value, 2);
    $(".lights").innerHTML = `조명 1 = ${fmt(LT[0])} · 조명 2 = ${fmt(LT[1])} · 조명 3 = ${fmt(LT[2])}<br>목표 = ${fmt(target)}`;
    $(".mine").style.background = css(m); $(".mine").textContent = `내 색 ${fmt(m)}`;
    $(".target").style.background = css(target); $(".target").textContent = `목표 ${fmt(target)}`;
    const d = Math.max(...m.map((v, i) => Math.abs(v - target[i])));
    if (d < 0.02) { verdict.textContent = "목표 색을 만들었습니다!"; verdict.className = "verdict good"; }
  }
  $(".go-solve").addEventListener("click", () => {
    // s·l1 + t·l2 + u·l3 = target  →  M [s t u]ᵀ = target, M의 열이 조명 벡터
    const M = L.T(LT), Mi = L.inv(M), w = L.mv(Mi, target), ok = w.every((v) => v >= -1e-9 && v <= 1 + 1e-9);
    $(".eq").textContent = `(s, t, u) = (${w.map((v) => L.n(v, 3)).join(", ")})`;
    verdict.textContent = ok ? "세기가 모두 0~1 안이므로 만들 수 있습니다. 슬라이더를 그 값에 맞춰 보세요." : "세기가 0~1을 벗어나므로 이 조명들로는 만들 수 없는 색입니다.";
    verdict.className = "verdict " + (ok ? "" : "bad");
  });
  $(".go-new").addEventListener("click", () => { newTarget(); update(); });
  [s1, s2, s3].forEach((el) => el.addEventListener("input", update));
  newTarget(); update();
})();
