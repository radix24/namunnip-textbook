/* 카드: n² + n + 41의 소수 여부를 0부터 m까지 확인 — 처음 실패하는 n = 40(41²) */
(() => {
  const root = document.getElementById("card-mres-euler-polynomial");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const mIn = $(".m");
  const f = (n) => n * n + n + 41;
  const small = (v) => { for (let d = 2; d * d <= v; d++) if (v % d === 0) return d; return 0; };
  function update() {
    const m = +mIn.value; $(".m-out").textContent = m;
    const rows = Array.from({ length: m + 1 }, (_, n) => { const v = f(n), d = small(v); return { n, v, d }; });
    $(".cells").innerHTML = rows.map(({ n, v, d }) => `<span class="${d ? "no" : ""}" title="${d ? `${v} = ${d} × ${v / d}` : `${v}은 소수`}">${n}: ${v}</span>`).join("");
    const bad = rows.filter((r) => r.d);
    $(".say").textContent = bad.length ? `0~${m} 중 소수가 아닌 경우 ${bad.length}개 · 처음: n = ${bad[0].n}, ${bad[0].v} = ${bad[0].d} × ${bad[0].v / bad[0].d}` : `0~${m}에서 모두 소수(${m + 1}개). 그러면 언제나 소수일까요?`;
  }
  mIn.addEventListener("input", update);
  update();
})();
