/* 카드: 직원 5명으로 오전·오후·야간 근무자를 정하는 방법은 몇 가지일까? — 곱의 법칙, 순열, 중복, 조합 */
(() => {
  const root = document.getElementById("card-jmath-shift-schedule");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), kIn = $(".k"), NAMES = "가나다라마바사아".split(""), SLOT = ["오전", "오후", "야간", "주말"];
  let mode = 0;
  const fact = (m) => (m <= 1 ? 1 : m * fact(m - 1));
  function list(n, k, max = 40) {
    const out = [], P = NAMES.slice(0, n);
    const rec = (cur, start) => {
      if (out.length >= max) return;
      if (cur.length === k) { out.push(cur.slice()); return; }
      for (let i = mode === 2 ? start : 0; i < n; i++) { if (mode === 0 && cur.includes(P[i])) continue; cur.push(P[i]); rec(cur, i + 1); cur.pop(); }
    };
    rec([], 0); return out;
  }
  function update() {
    const n = +nIn.value; if (+kIn.value > n && mode !== 1) kIn.value = n;
    const k = +kIn.value;
    $(".n-out").textContent = n; $(".k-out").textContent = k;
    const terms = [...Array(k)].map((_, i) => (mode === 1 ? n : n - i)), total = terms.reduce((a, b) => a * b, 1) / (mode === 2 ? fact(k) : 1);
    $(".say").textContent = mode === 2 ? `(${terms.join(" × ")}) ÷ ${k}! = ${terms.reduce((a, b) => a * b, 1)} ÷ ${fact(k)} = ${total}가지 (순서 없음, 조합)` : `${terms.join(" × ")} = ${total}가지 (${mode === 1 ? "같은 사람 여러 번 가능" : "순서 있음, 순열"})`;
    const L = list(n, k);
    $(".tree").innerHTML = L.map((c, i) => `${i + 1}. ${mode === 2 ? c.join(", ") : c.map((p, j) => `${SLOT[j]} ${p}`).join(" · ")}`).join("<br>") + (total > L.length ? `<br>… (모두 ${total}가지)` : "");
  }
  [nIn, kIn].forEach((x) => x.addEventListener("input", update));
  root.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { mode = +b.dataset.m; root.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  update();
})();
