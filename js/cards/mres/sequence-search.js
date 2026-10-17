/* 카드: 수열 찾기 — 연습용 작은 목록에서 입력한 항이 연속으로 나타나는 수열 찾기(OEIS 번호 함께) */
(() => {
  const root = document.getElementById("card-mres-sequence-search");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const DB = [
    ["A000079", "2의 거듭제곱 2ⁿ", "aₙ = 2ⁿ", [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]],
    ["A000127", "원 위 n점을 이은 최대 조각 수", "1 + nC2 + nC4", [1, 2, 4, 8, 16, 31, 57, 99, 163, 256]],
    ["A000124", "케이크를 직선 n번 잘라 얻는 최대 조각 수", "n(n+1)/2 + 1", [1, 2, 4, 7, 11, 16, 22, 29, 37, 46]],
    ["A000045", "피보나치 수열", "Fₙ = Fₙ₋₁ + Fₙ₋₂", [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]],
    ["A000108", "카탈랑 수", "(2n)! / ((n+1)! n!)", [1, 1, 2, 5, 14, 42, 132, 429, 1430]],
    ["A000110", "벨 수(집합을 나누는 방법의 수)", "Bₙ₊₁ = Σ nCk Bₖ", [1, 1, 2, 5, 15, 52, 203, 877, 4140]],
    ["A000041", "자연수의 분할 수", "생성함수 Π 1/(1 − xᵏ)", [1, 1, 2, 3, 5, 7, 11, 15, 22, 30, 42]],
    ["A000217", "삼각수", "n(n+1)/2", [0, 1, 3, 6, 10, 15, 21, 28, 36, 45]],
    ["A000290", "제곱수", "n²", [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]],
    ["A000040", "소수", "1과 자기 자신만을 약수로 갖는 수", [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]],
    ["A000142", "계승", "n!", [1, 1, 2, 6, 24, 120, 720, 5040, 40320]],
  ];
  const find = (seq, q) => { for (let i = 0; i + q.length <= seq.length; i++) if (q.every((v, k) => seq[i + k] === v)) return i; return -1; };
  function update() {
    const q = ($(".q").value.match(/-?\d+/g) || []).map(Number);
    if (q.length < 3) { $(".res").innerHTML = `<div>항을 3개 이상 입력하세요.</div>`; return; }
    const hits = DB.map((d) => [d, find(d[3], q)]).filter(([, i]) => i >= 0);
    $(".res").innerHTML = hits.length ? hits.map(([[id, name, f, s], i]) => `<div><b>${id}</b> ${name} · ${f}<br><span class="mono">${s.map((v, k) => (k >= i && k < i + q.length ? `<mark>${v}</mark>` : v)).join(", ")}, …</span></div>`).join("") + (hits.length > 1 ? `<div>후보가 ${hits.length}개입니다. 항을 더 넣거나 문제의 정의와 비교해 좁히세요.</div>` : "") : `<div>연습용 목록에는 없습니다. 실제 탐구에서는 OEIS에서 찾아보세요.</div>`;
  }
  root.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => { $(".q").value = b.dataset.q; update(); }));
  $(".q").addEventListener("input", update);
  update();
})();
