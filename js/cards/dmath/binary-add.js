/* 카드: 이진수의 덧셈과 곱셈은 왜 이렇게 단순할까? — 비트를 눌러 세로셈, 받아올림을 한 자리씩 */
(() => {
  const root = document.getElementById("card-dmath-binary-add");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const W = 8, val = (bits) => bits.reduce((s, b) => s * 2 + b, 0);
  let op = "add", A = [0, 0, 1, 0, 1, 1, 0, 1], B = [0, 0, 0, 1, 0, 1, 1, 1], k = 0; // k: 오른쪽부터 계산한 자리(곱셈은 부분곱) 수
  const cell = (txt, cls = "", btn) => (btn ? `<button class="c ${cls}" type="button" data-r="${btn[0]}" data-i="${btn[1]}" aria-label="${btn[0]}의 ${btn[1] + 1}번째 자리">${txt}</button>` : `<span class="c ${cls}">${txt}</span>`);
  function addRows() {
    const sum = Array(W).fill(0), cout = Array(W).fill(0); let c = 0;
    for (let i = W - 1; i >= 0; i--) { const s = A[i] + B[i] + c; sum[i] = s % 2; c = s >> 1; cout[i] = c; }
    return { sum, cout, top: c };
  }
  function render() {
    const g = $(".grid");
    let h = "";
    if (op === "add") {
      g.style.gridTemplateColumns = `repeat(${W + 2}, 1.9rem)`;
      const { sum, cout, top } = addRows(), done = (i) => W - 1 - i < k, now = W - 1 - k;
      // 받아올림 줄: 자리 i에서 생긴 받아올림은 한 칸 왼쪽(격자 열 i + 1) 위에
      h += cell("") + [...Array(W + 1)].map((_, col) => { const i = col; return i < W && done(i) && cout[i] ? cell("1", "carry") : cell(""); }).join("");
      h += cell("") + cell("") + A.map((b, i) => cell(b, `${b ? "one" : ""}${i === now ? " now" : ""}`, ["A", i])).join("");
      h += cell("+") + cell("") + B.map((b, i) => cell(b, `${b ? "one" : ""}${i === now ? " now" : ""}`, ["B", i])).join("");
      h += cell("", "line") + cell(k >= W && top ? 1 : "", "sum line") + sum.map((s, i) => cell(done(i) ? s : "", "sum line")).join("");
      const res = val([top, ...sum]);
      $(".say").textContent = `${val(A)} + ${val(B)} = ${val(A) + val(B)}` + (k >= W ? ` · 결과 ${top ? "1" : ""}${sum.join("")}(2) = ${res}` + (top ? " · 9번째 자리가 생겼습니다(8자리만 저장하면 넘침)" : "") : k > 0 ? ` · 오른쪽 ${k}자리 계산함` : "");
    } else {
      const C = 9; g.style.gridTemplateColumns = `repeat(${C}, 1.9rem)`;
      const a4 = A.slice(4), b4 = B.slice(4), line = (cells) => Array(C - cells.length).fill(cell("")).join("") + cells.join("");
      h += line(a4.map((b, i) => cell(b, b ? "one" : "", ["A", i + 4])));
      h += line([cell("×"), ...b4.map((b, i) => cell(b, b ? "one" : "", ["B", i + 4]))]);
      for (let j = 0; j < Math.min(4, k); j++) {
        const part = b4[3 - j] ? a4 : [0, 0, 0, 0];
        h += line([...part.map((x) => cell(x, j === 0 ? "line" : "")), ...Array(j).fill(cell("0", "carry"))]);
      }
      const prod = val(a4) * val(b4);
      if (k >= 4) h += line(prod.toString(2).split("").map((x) => cell(x, "sum line")));
      $(".say").textContent = `오른쪽 네 자리만 씁니다: ${val(a4)} × ${val(b4)} = ${prod} · 곱하는 수의 자리가 1이면 피승수를 그 자리만큼 밀어 적습니다` + (k >= 4 ? ` · 합 ${prod.toString(2)}(2)` : "");
    }
    g.innerHTML = h;
    g.querySelectorAll("button.c").forEach((b) => b.addEventListener("click", () => { const arr = b.dataset.r === "A" ? A : B, i = +b.dataset.i; arr[i] = 1 - arr[i]; k = 0; render(); }));
  }
  root.querySelectorAll("[data-op]").forEach((b) => b.addEventListener("click", () => { op = b.dataset.op; k = 0; root.querySelectorAll("[data-op]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); render(); }));
  $(".go-step").addEventListener("click", () => { k = Math.min(op === "add" ? W : 4, k + 1); render(); });
  $(".go-all").addEventListener("click", () => { k = op === "add" ? W : 4; render(); });
  $(".go-rand").addEventListener("click", () => { A = A.map(() => (Math.random() < 0.5 ? 1 : 0)); B = B.map(() => (Math.random() < 0.5 ? 1 : 0)); A[0] = B[0] = 0; k = 0; render(); });
  render();
})();
