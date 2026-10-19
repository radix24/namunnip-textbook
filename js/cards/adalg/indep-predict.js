/* 카드: 계산하기 전에 일차독립인지 알아볼 수 있을까? — 여섯 묶음 예측 후 행 사다리꼴로 확인 */
(() => {
  const root = document.getElementById("card-adalg-indep-predict");
  if (!root) return;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  const verdict = $(".verdict"), whyBox = $(".why-box"), next = $(".go-next");
  /* vs: 성분 벡터, show: 화면 글, hint: 단서 */
  const Q = [
    { vs: [[1, 2], [2, 4]], show: "(1, 2), (2, 4)", hint: "둘째 벡터가 첫째의 2배입니다." },
    { vs: [[1, 0, 1], [0, 1, 1], [1, 1, 0]], show: "(1, 0, 1), (0, 1, 1), (1, 1, 0)", hint: "단서가 없어 계산해야 합니다." },
    { vs: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], show: "(1, 2, 3), (4, 5, 6), (7, 8, 9)", hint: "세 벡터가 등차수열처럼 같은 간격으로 늘어납니다: v₃ − v₂ = v₂ − v₁." },
    { vs: [[1, 0], [0, 1], [1, 1]], show: "(1, 0), (0, 1), (1, 1)", hint: "ℝ²의 벡터가 3개입니다." },
    { vs: [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1]], show: "(1, 1, 0, 0), (0, 1, 1, 0), (0, 0, 1, 1)", hint: "ℝ⁴에서 3개라 개수로는 알 수 없습니다. 첫 성분과 끝 성분을 보세요." },
    { vs: [[1, 1], [1, -1], [0, 1]], show: "1 + x,  1 − x,  x   (일차 이하 다항식)", hint: "계수 벡터 (상수항, x의 계수)로 보면 ℝ²의 벡터 3개입니다." },
  ];
  let i = 0, done = false;
  const show = () => {
    done = false; $(".no-out").textContent = `${i + 1} / ${Q.length}`;
    $(".q-set").textContent = Q[i].show; verdict.textContent = ""; verdict.className = "verdict"; whyBox.textContent = ""; next.disabled = true;
    root.querySelectorAll("[data-g]").forEach((b) => b.setAttribute("aria-pressed", "false"));
  };
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    if (done) return; done = true;
    const q = Q[i], rel = L.relation(q.vs), indep = rel == null, ok = (b.dataset.g === "1") === indep;
    b.setAttribute("aria-pressed", "true");
    verdict.textContent = `${ok ? "맞습니다." : "아닙니다."} ${indep ? "일차독립" : "일차종속"} — ${q.hint}`;
    verdict.className = "verdict " + (ok ? "good" : "bad");
    const { piv } = L.rref(q.vs[0].map((_, r) => q.vs.map((v) => v[r])));
    whyBox.textContent = `벡터를 열로 놓고 행 사다리꼴로 바꾸면 피벗 ${piv.length}개 (벡터 ${q.vs.length}개).` +
      (indep ? " 피벗이 벡터 수와 같아 일차독립입니다." : ` 관계식: ${rel.map((c, k) => `${L.frac(c)}·v${k + 1}`).join(" + ").replace(/\+ −/g, "− ")} = 0`);
    next.disabled = i === Q.length - 1;
  }));
  next.addEventListener("click", () => { if (i < Q.length - 1) { i++; show(); } });
  show();
})();
