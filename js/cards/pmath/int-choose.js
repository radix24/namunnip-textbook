/* 카드: 이 적분은 어떤 방법으로 풀어야 할까? — 여덟 문제의 적분 방법 고르기 */
(() => {
  const root = document.getElementById("card-pmath-int-choose");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const NAME = { sub: "치환적분", parts: "부분적분", pf: "부분분수", trig: "삼각치환", basic: "공식 그대로" };
  /* q: 문제(TeX), best: 정답, also: 함께 통하는 방법, step: 핵심 한 줄(TeX 포함) */
  const Q = [
    { q: "\\int x e^{x^2}\\,dx", best: "sub", step: "신호: \\(x^2\\)과 그 도함수 \\(2x\\). \\(u = x^2\\)이면 \\(\\int x e^{x^2}dx = \\frac{1}{2}\\int e^u du = \\frac{1}{2}e^{x^2} + C\\)." },
    { q: "\\int x e^{x}\\,dx", best: "parts", step: "신호: 다항식과 지수함수의 곱. \\(x\\)를 미분, \\(e^x\\)를 적분하면 \\(xe^x - \\int e^x dx = (x - 1)e^x + C\\)." },
    { q: "\\int \\frac{1}{x^2 - 1}\\,dx", best: "pf", step: "신호: 분모 \\((x - 1)(x + 1)\\). \\(\\frac{1}{x^2 - 1} = \\frac{1}{2}\\left(\\frac{1}{x - 1} - \\frac{1}{x + 1}\\right)\\)이므로 \\(\\frac{1}{2}\\ln\\left|\\frac{x - 1}{x + 1}\\right| + C\\)." },
    { q: "\\int_0^2 \\sqrt{4 - x^2}\\,dx", best: "trig", step: "신호: \\(\\sqrt{a^2 - x^2}\\). \\(x = 2\\sin\\theta\\)로 바꾸면 \\(\\int_0^{\\pi/2} 4\\cos^2\\theta\\,d\\theta = \\pi\\). 반지름 2인 사분원의 넓이와 같습니다." },
    { q: "\\int \\ln x\\,dx", best: "parts", step: "신호: 곱이 안 보여도 \\(1 \\cdot \\ln x\\)로 봅니다. \\(\\ln x\\)를 미분, 1을 적분하면 \\(x\\ln x - \\int 1\\,dx = x\\ln x - x + C\\)." },
    { q: "\\int \\sin^3 x\\cos x\\,dx", best: "sub", step: "신호: \\(\\sin x\\)와 그 도함수 \\(\\cos x\\). \\(u = \\sin x\\)이면 \\(\\int u^3 du = \\frac{\\sin^4 x}{4} + C\\)." },
    { q: "\\int \\frac{2x + 3}{x^2 + 3x + 2}\\,dx", best: "sub", also: ["pf"], step: "숨은 신호: 분자 \\(2x + 3\\)이 분모의 도함수입니다. \\(u = x^2 + 3x + 2\\)이면 \\(\\ln|x^2 + 3x + 2| + C\\). 부분분수 \\(\\frac{1}{x + 1} + \\frac{1}{x + 2}\\)로도 같은 답이 나오지만 길이 깁니다." },
    { q: "\\int \\frac{1}{1 + x^2}\\,dx", best: "basic", also: ["trig"], step: "신호: \\((\\arctan x)' = \\frac{1}{1 + x^2}\\)를 거꾸로 읽으면 바로 \\(\\arctan x + C\\). \\(x = \\tan\\theta\\)로 치환해도 같은 답이 나옵니다." },
  ];
  let i = 0, score = 0, answered = false;
  const qEl = $(".ic-q"), step = $(".ic-step"), verdict = $(".verdict"), next = $(".go-next");
  const opts = [...root.querySelectorAll(".ic-opts .chip")];
  const math = (el) => { if (window.NMMath) NMMath.render(el); };

  function show() {
    answered = false;
    $(".ic-no").textContent = `${i + 1} / ${Q.length}`; $(".ic-score").textContent = `점수 ${score}`;
    qEl.textContent = `\\(${Q[i].q}\\)`; math(qEl);
    step.textContent = ""; verdict.textContent = ""; verdict.className = "verdict";
    opts.forEach((b) => { b.classList.remove("ok", "no"); b.disabled = false; });
    next.disabled = true; next.textContent = i === Q.length - 1 ? "결과 보기" : "다음 문제";
  }
  opts.forEach((b) => b.addEventListener("click", () => {
    if (answered) return;
    answered = true;
    const q = Q[i], m = b.dataset.m, ok = m === q.best, alt = (q.also || []).includes(m);
    if (ok) score++;
    opts.forEach((x) => { if (x.dataset.m === q.best) x.classList.add("ok"); x.disabled = true; });
    if (!ok) b.classList.add("no");
    verdict.textContent = ok ? "맞습니다." : alt ? `${NAME[m]}도 통하지만, 더 짧은 길은 ${NAME[q.best]}입니다.` : `정답은 ${NAME[q.best]}입니다.`;
    verdict.className = "verdict " + (ok ? "good" : "bad");
    step.textContent = q.step; math(step);
    $(".ic-score").textContent = `점수 ${score}`;
    next.disabled = false;
  }));
  next.addEventListener("click", () => {
    if (i < Q.length - 1) { i++; show(); return; }
    qEl.textContent = `${Q.length}문제 중 ${score}문제를 맞혔습니다.`;
    verdict.textContent = score === Q.length ? "모든 신호를 찾았습니다." : "틀린 문제는 처음부터 다시 풀어 보세요.";
    verdict.className = "verdict " + (score === Q.length ? "good" : "");
    step.textContent = ""; opts.forEach((x) => { x.disabled = true; }); next.disabled = true;
  });
  $(".go-again").addEventListener("click", () => { i = 0; score = 0; show(); });
  show();
})();
