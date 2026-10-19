/* 카드: 카드 여섯 장만 보고 마음속의 수를 어떻게 맞힐까? — 이진법 자리별 숫자 카드 마술 */
(() => {
  const root = document.getElementById("card-dmath-binary-cards");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  let ans = Array(6).fill(null), why = false;
  function render() {
    const deck = $(".deck"); deck.innerHTML = "";
    const guess = ans.every((a) => a !== null) ? ans.reduce((s, a, k) => s + (a ? 2 ** k : 0), 0) : null;
    for (let k = 0; k < 6; k++) {
      const v = 2 ** k, nums = [];
      for (let x = 1; x <= 63; x++) if (x & v) nums.push(x);
      const c = document.createElement("div"); c.className = "mc"; if (ans[k] !== null) c.dataset.a = ans[k] ? "1" : "0";
      c.innerHTML = `<p class="mono small">카드 ${k + 1}${why ? ` · 2^${k} 자리` : ""}</p><div class="nums">${nums.map((x, i) => `<span class="${why && guess === x ? "me" : ""}">${i === 0 ? `<b>${x}</b>` : x}</span>`).join(" ")}</div><div class="yn"><button class="chip" type="button">있다</button><button class="chip" type="button">없다</button></div>`;
      const [y, n] = c.querySelectorAll("button");
      y.setAttribute("aria-pressed", String(ans[k] === true)); n.setAttribute("aria-pressed", String(ans[k] === false));
      y.addEventListener("click", () => { ans[k] = true; render(); }); n.addEventListener("click", () => { ans[k] = false; render(); });
      deck.append(c);
    }
  }
  $(".go-reveal").addEventListener("click", () => {
    const v = $(".verdict");
    if (ans.some((a) => a === null)) { v.textContent = "여섯 장 모두 대답하세요."; v.className = "verdict"; return; }
    const sum = ans.reduce((s, a, k) => s + (a ? 2 ** k : 0), 0), parts = ans.map((a, k) => (a ? 2 ** k : 0)).filter(Boolean);
    v.textContent = sum ? `마음속의 수는 ${sum}입니다! (${parts.join(" + ")}, 이진법 ${sum.toString(2).padStart(6, "0")})` : "모두 없다면 1~63 밖의 수입니다.";
    v.className = "verdict good"; render();
  });
  $(".go-why").addEventListener("click", (e) => { why = !why; e.target.setAttribute("aria-pressed", String(why)); render(); });
  $(".go-reset").addEventListener("click", () => { ans = Array(6).fill(null); $(".verdict").textContent = ""; render(); });
  render();
})();
