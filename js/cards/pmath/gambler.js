/* 카드: 동전이 다섯 번 연속 앞면이 나왔다면, 다음은 뒷면이 나올 차례일까? — 연속 앞면 직후 결과 모으기 */
(() => {
  const root = document.getElementById("card-pmath-gambler");
  if (!root) return;
  const { fit } = NM;
  const $ = (s) => root.querySelector(s);
  const sk = $(".sk"), verdict = $(".verdict");
  let run = 0, after = { H: 0, T: 0 }, recent = [], total = 0, guess = null;
  const { ctx, size } = fit($("canvas"), () => draw());

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = after.H + after.T, r = s ? [after.H / s, after.T / s] : [0, 0];
    NMSim.bars(ctx, { x0: 40, y0: 10, w: w - 50, h: h - 30 }, r, { labels: [`앞면 ${NMSim.pct(r[0])}`, `뒷면 ${NMSim.pct(r[1])}`], expect: [0.5, 0.5], top: 1, yfmt: (v) => `${Math.round(v * 100)}%`, ylabel: `연속 앞면 ${sk.value}번 직후 ${s}번` });
  }
  function nums() {
    const k = +sk.value;
    $(".k-out").textContent = k;
    // 최근 결과: k번 이상 이어진 앞면 직후 칸을 굵게
    let streak = 0;
    $(".seq").innerHTML = recent.map((c) => { const hot = streak >= k; streak = c === "H" ? streak + 1 : 0; return hot ? `<b>${c === "H" ? "앞" : "뒤"}</b>` : (c === "H" ? "앞" : "뒤"); }).join("");
    const s = after.H + after.T;
    if (guess && s >= 50) {
      const pH = after.H / s, right = guess === "E";
      verdict.textContent = `${total}번 던짐 · 연속 앞면 ${k}번 직후 앞면 비율 ${NMSim.pct(pH)} — ${right ? "예측대로 거의 1/2입니다." : "예측과 달리 거의 1/2입니다."}`;
      verdict.className = "verdict " + (right ? "good" : "bad");
    }
  }
  NMSim.runner(root, {
    trial(k) {
      const K = +sk.value;
      for (let i = 0; i < k; i++) {
        const c = Math.random() < 0.5 ? "H" : "T";
        if (run >= K) after[c]++;
        run = c === "H" ? run + 1 : 0; total++;
        recent.push(c); if (recent.length > 60) recent.shift();
      }
    },
    draw() { nums(); draw(); },
    reset() { run = 0; after = { H: 0, T: 0 }; recent = []; total = 0; verdict.textContent = ""; },
    rate: 3000,
  });
  root.querySelectorAll(".guess .chip").forEach((b) => b.addEventListener("click", () => {
    guess = b.dataset.g; root.querySelectorAll(".guess .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); nums();
  }));
  sk.addEventListener("input", () => { run = 0; after = { H: 0, T: 0 }; recent = []; total = 0; verdict.textContent = ""; nums(); draw(); });
  nums();
})();
