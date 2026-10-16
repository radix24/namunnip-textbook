/* 카드: 컴퓨터는 어떻게 비슷한 기사를 골라낼까? — 단어 횟수 벡터의 코사인 유사도 (가상 기사) */
(() => {
  const root = document.getElementById("card-adalg-cosine-sim");
  if (!root) return;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  /* 단어 [경기, 골, 감독, 금리, 주가] 횟수 — 수업용으로 만든 가상 제목 */
  const D = [
    { t: "결승골로 경기 뒤집은 감독, 골 넣은 교체 선수 칭찬", v: [1, 2, 1, 0, 0] },
    { t: "감독 경질 뒤 첫 경기, 감독 대행 체제로 골 가뭄 끝", v: [1, 1, 2, 0, 0] },
    { t: "금리 동결에 주가 반등, 주가 흐름 주목", v: [0, 0, 0, 1, 2] },
    { t: "금리 인상 우려에 주가 하락, 주가 약세에 경기 둔화 신호", v: [1, 0, 0, 1, 2] },
    { t: "경기 침체 우려 커져, 경기 부양 위해 금리 인하 기대", v: [2, 0, 0, 1, 0] },
  ];
  const pick = $(".pick"), docs = $(".docs"), verdict = $(".verdict"), dbl = $(".go-dbl");
  let q = 0, guessed = null, twice = false;
  D.forEach((d, i) => { const o = document.createElement("option"); o.value = i; o.textContent = `${"ABCDE"[i]}`; pick.append(o); });
  const cos = (a, b) => L.dot(a, b) / (L.norm(a) * L.norm(b));
  function render() {
    const qv = twice ? L.scl(D[q].v, 2) : D[q].v;
    const others = D.map((d, i) => i).filter((i) => i !== q);
    const best = others.reduce((m, i) => (cos(qv, D[i].v) > cos(qv, D[m].v) ? i : m), others[0]);
    docs.innerHTML = "";
    D.forEach((d, i) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "doc" + (i === q ? " q" : "");
      const v = i === q ? qv : d.v;
      let tail = `<span class="vec">(${v.join(", ")})</span>`;
      if (guessed != null && i !== q) tail = `<span class="vec">내적 ${L.dot(qv, d.v)} · cos ${L.n(cos(qv, d.v), 2)}</span>`;
      b.innerHTML = `<b class="mono">${"ABCDE"[i]}</b><span>${i === q ? "[기준] " : ""}${d.t}${i === q && twice ? " (두 번)" : ""}</span>${tail}` +
        (guessed != null && i !== q ? `<span class="bar"><i style="width:${Math.max(0, cos(qv, d.v)) * 100}%"></i></span>` : "");
      if (i === q) b.disabled = true;
      b.setAttribute("aria-pressed", String(i === guessed));
      b.addEventListener("click", () => { if (guessed == null) { guessed = i; render(); } });
      docs.append(b);
    });
    if (guessed == null) { verdict.textContent = ""; verdict.className = "verdict"; return; }
    const ok = guessed === best;
    const big = others.reduce((m, i) => (L.dot(qv, D[i].v) > L.dot(qv, D[m].v) ? i : m), others[0]);
    verdict.textContent = `${ok ? "맞습니다." : "다릅니다."} 코사인 유사도가 가장 큰 기사는 ${"ABCDE"[best]}입니다.` +
      (big !== best ? ` 내적만 보면 ${"ABCDE"[big]}가 가장 큽니다.` : "") + (twice ? " 길이를 두 배로 해도 cos는 그대로이고 내적만 두 배가 되었습니다." : "");
    verdict.className = "verdict " + (ok ? "good" : "bad");
  }
  pick.addEventListener("change", () => { q = +pick.value; guessed = null; render(); });
  dbl.addEventListener("click", () => { twice = !twice; dbl.setAttribute("aria-pressed", String(twice)); render(); });
  render();
})();
