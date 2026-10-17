/* 카드: 가장 많이 나온 낱말이 그 글의 핵심어일까? — TF × (N/DF), 대수를 배웠다면 TF × log(N/DF) (가상 기사) */
(() => {
  const root = document.getElementById("card-aimath-tfidf");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const D = [
    "학교 축구 대회 학교 학생 응원 축구 결승 학교 학생",
    "학교 도서관 독서 학생 책 대출 독서 행사",
    "학교 급식 메뉴 학생 설문 급식 만족",
    "학교 과학 실험 학생 동아리 발표 실험",
  ].map((s) => s.split(" "));
  const N = D.length, V = [...new Set(D.flat())];
  const useLog = $(".uselog");
  const df = (w) => D.filter((d) => d.includes(w)).length, tf = (w, d) => d.filter((x) => x === w).length;
  const idf = (w) => (useLog.checked ? Math.log10(N / df(w)) : N / df(w));
  const fmt = (x) => (useLog.checked ? x.toFixed(3) : String(+x.toFixed(3)));
  let sel = 0, guessed = false;
  $(".docs").innerHTML = D.map((d, i) => `<div data-i="${i}"><b>기사 ${i + 1}</b><br>${d.join(" · ")}</div>`).join("");
  function table() {
    const d = D[sel], ws = [...new Set(d)].map((w) => [w, tf(w, d), df(w), idf(w), tf(w, d) * idf(w)]).sort((a, b) => b[4] - a[4] || b[1] - a[1]);
    const best = ws[0][4];
    const t = $("table"); t.hidden = !guessed;
    t.innerHTML = `<tr><th>낱말</th><th>TF</th><th>DF</th><th>${useLog.checked ? "IDF = log(4/DF)" : "IDF = 4/DF"}</th><th>TF-IDF</th></tr>` + ws.map(([w, a, b, c, e]) => `<tr class="${e === best ? "best" : ""}"><td>${w}</td><td>${a}</td><td>${b}</td><td>${fmt(c)}</td><td>${fmt(e)}</td></tr>`).join("");
    root.querySelectorAll(".docs [data-i]").forEach((el) => el.classList.toggle("on", +el.dataset.i === sel));
  }
  function verdict(g) {
    const d = D[0], v = (w) => tf(w, d) * idf(w);
    const ties = V.filter((w) => d.includes(w) && Math.abs(v(w) - v("축구")) < 1e-9 && w !== "축구").join(", ") || "없음";
    const head = g === "축구" ? "맞습니다." : "예측과 다릅니다.";
    $(".verdict").textContent = useLog.checked
      ? `${head} "학교"는 3번으로 가장 많지만 네 기사 모두에 나와 IDF = log(4/4) = 0입니다. "학생"도 0입니다. "축구"는 기사 1에만 나와 TF-IDF = 2 × log 4 ≈ ${fmt(v("축구"))}로 가장 큽니다(동점인 낱말: ${ties}).`
      : `${head} "학교"는 3번으로 가장 많지만 네 기사 모두에 나와 IDF = 4/4 = 1, TF-IDF = 3입니다. "축구"는 2번이지만 기사 1에만 나와 IDF = 4/1 = 4, TF-IDF = 2 × 4 = 8로 가장 큽니다(동점인 낱말: ${ties}).`;
  }
  let lastGuess = null;
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    guessed = true; lastGuess = b.dataset.g; root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    verdict(lastGuess);
    sel = 0; root.querySelectorAll("[data-d]").forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.d === 0))); table();
  }));
  root.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { sel = +b.dataset.d; root.querySelectorAll("[data-d]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); if (!guessed) { $(".verdict").textContent = "먼저 기사 1의 핵심어를 예측하세요."; } table(); }));
  useLog.addEventListener("change", () => { if (lastGuess) verdict(lastGuess); table(); });
  table();
})();
