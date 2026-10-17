/* 카드: 사진 편집 앱의 버튼은 행렬에 어떤 계산을 할까? — 밝기, 대비, 반전, 전치, 좌우 뒤집기 (가상 이미지) */
(() => {
  const root = document.getElementById("card-aimath-image-ops");
  if (!root) return;
  const { fit } = NM;
  const I = NMImg;
  const $ = (s) => root.querySelector(s);
  const kIn = $(".k"), A = I.sample(24);
  let op = "bright";
  const src = fit($(".src"), () => draw()), dst = fit($(".dst"), () => draw());
  const OPS = {
    bright: { k: true, f: (k) => I.map(A, (v) => I.clamp(v + k)), lab: (k) => `A + ${k}J`, txt: (k) => `모든 성분에 ${k}을 더함` },
    contrast: { k: true, f: (k) => { const c = 1 + k / 100; return I.map(A, (v) => I.clamp(c * (v - 128) + 128)); }, lab: (k) => `${(1 + k / 100).toFixed(2)}(A − 128J) + 128J`, txt: (k) => `128과의 차이를 ${(1 + k / 100).toFixed(2)}배` },
    invert: { k: false, f: () => I.map(A, (v) => 255 - v), lab: () => "255J − A", txt: () => "255에서 뺌: 밝은 곳과 어두운 곳이 바뀜" },
    transpose: { k: false, f: () => I.T(A), lab: () => "Aᵀ", txt: () => "(i, j) 성분과 (j, i) 성분을 바꿈: 왼쪽 위–오른쪽 아래 대각선으로 뒤집힘" },
    flip: { k: false, f: () => A.map((r) => [...r].reverse()), lab: () => "AR", txt: () => "R은 반대각선이 1인 행렬: j열이 (25 − j)열로" },
  };
  function draw() {
    if (!src.size.w || !dst.size.w) return;
    const k = +kIn.value, B = OPS[op].f(k), c1 = src.size.w / 24, c2 = dst.size.w / 24;
    I.draw(src.ctx, A, 0, 0, c1); I.draw(dst.ctx, B, 0, 0, c2);
  }
  function update() {
    const k = +kIn.value, o = OPS[op], B = o.f(k);
    $(".k-out").textContent = o.k ? k : "(쓰지 않음)"; kIn.disabled = !o.k;
    $(".dl").textContent = o.lab(k);
    $(".say").textContent = `${o.txt(k)} · 예: A의 (3, 15) 성분 ${A[2][14]} → ${B[2][14]}, (18, 5) 성분 ${A[17][4]} → ${B[17][4]}`;
    draw();
  }
  root.querySelectorAll("[data-o]").forEach((b) => b.addEventListener("click", () => { op = b.dataset.o; root.querySelectorAll("[data-o]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  kIn.addEventListener("input", update);
  update();
})();
