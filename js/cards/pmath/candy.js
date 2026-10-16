/* 카드: 똑같은 사탕 6개를 세 사람에게 나누는 방법은 몇 가지일까? — 중복조합과 별·막대 */
(() => {
  const root = document.getElementById("card-pmath-candy");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const sr = $(".sr"), sn = $(".sn"), kidsEl = $(".kids"), verdict = $(".verdict");
  const NAMES = ["가윤", "나준", "다온", "라희"];
  let give = [], seen = new Set();
  const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };

  function build() {
    const n = +sn.value;
    give = Array(n).fill(0); seen = new Set();
    kidsEl.innerHTML = give.map((_, i) => `<div class="kid"><b>${NAMES[i]}</b><div class="c"></div><button type="button" class="chip" data-i="${i}" data-d="-1" aria-label="${NAMES[i]}에게서 사탕 하나 빼기">−</button> <button type="button" class="chip" data-i="${i}" data-d="1" aria-label="${NAMES[i]}에게 사탕 하나 주기">+</button></div>`).join("");
    update();
  }
  function update() {
    const r = +sr.value, n = +sn.value, used = give.reduce((a, b) => a + b, 0);
    $(".r-out").textContent = r; $(".n-out").textContent = n;
    kidsEl.querySelectorAll(".kid").forEach((el, i) => { el.querySelector(".c").textContent = "●".repeat(give[i]) || "—"; });
    $(".left").textContent = `남은 사탕 ${r - used}개`;
    $(".sb").innerHTML = give.map((g) => "★".repeat(g)).join('<span class="bar">|</span>') || "—";
    const total = C(n + r - 1, r);
    if (used === r) {
      const key = give.join(",");
      if (!seen.has(key)) { seen.add(key); verdict.textContent = `새 방법 (${give.join(", ")})`; verdict.className = "verdict good"; }
      else { verdict.textContent = `이미 기록한 방법 (${give.join(", ")})`; verdict.className = "verdict"; }
    } else { verdict.textContent = ""; verdict.className = "verdict"; }
    $(".cnt").textContent = `기록한 방법 ${seen.size} / ${n}H${r} = ${n + r - 1}C${r} = ${total}가지${seen.size === total ? " — 모두 찾았습니다!" : ""}`;
  }
  kidsEl.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]"); if (!b) return;
    const i = +b.dataset.i, d = +b.dataset.d, used = give.reduce((a, c) => a + c, 0);
    if (d > 0 && used >= +sr.value) return;
    if (d < 0 && give[i] === 0) return;
    give[i] += d; update();
  });
  [sr, sn].forEach((el) => el.addEventListener("input", build));
  build();
})();
