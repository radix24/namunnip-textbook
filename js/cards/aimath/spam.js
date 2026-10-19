/* 카드: "무료", "당첨"이 들어간 메일은 스팸일 확률이 얼마일까? — 나이브 베이즈 (가상 확률) */
(() => {
  const root = document.getElementById("card-aimath-spam");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const prIn = $(".pr");
  /* [낱말, 스팸 중 비율, 정상 중 비율] — 가상 값 */
  const W = [["무료", 0.3, 0.02], ["당첨", 0.2, 0.01], ["링크", 0.25, 0.05], ["할인", 0.25, 0.04], ["회의", 0.02, 0.15], ["내일", 0.05, 0.2], ["자료", 0.03, 0.18]];
  const PRE = [[0, 1, 2], [4, 5, 6], [3, 4]];
  const on = new Set(PRE[0]);
  function update() {
    const t = $("table");
    t.innerHTML = `<tr><th>낱말</th><th>스팸 중 비율</th><th>정상 중 비율</th><th>비</th></tr>` + W.map(([w, s, h], i) => `<tr class="${on.has(i) ? "on" : ""}"><td><button class="chip" type="button" data-w="${i}" aria-pressed="${on.has(i)}">${w}</button></td><td>${s}</td><td>${h}</td><td>${(s / h).toFixed(2)}</td></tr>`).join("");
    t.querySelectorAll("[data-w]").forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.w; on.has(i) ? on.delete(i) : on.add(i); update(); }));
    const p = +prIn.value / 100, sel = [...on].sort((a, b) => a - b);
    let odds = p / (1 - p); const parts = [`${(p / (1 - p)).toFixed(3)}`];
    sel.forEach((i) => { odds *= W[i][1] / W[i][2]; parts.push((W[i][1] / W[i][2]).toFixed(2)); });
    const post = odds / (1 + odds);
    $(".pr-out").textContent = prIn.value;
    $(".meter span").style.width = `${post * 100}%`;
    $(".say").textContent = `메일의 낱말: ${sel.map((i) => W[i][0]).join(", ") || "(없음)"} · 스팸 : 정상 = ${parts.join(" × ")} = ${odds.toFixed(3)} → 스팸일 확률 ${(post * 100).toFixed(1)}% · ${post >= 0.5 ? "스팸함으로" : "받은편지함으로"}`;
  }
  root.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => { on.clear(); PRE[+b.dataset.m].forEach((i) => on.add(i)); root.querySelectorAll("[data-m]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  prIn.addEventListener("input", update);
  update();
})();
