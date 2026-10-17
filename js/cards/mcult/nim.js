/* 카드: 돌 줍기 게임에서 컴퓨터를 이길 수 있을까? — 님, 님 합(XOR)을 0으로 넘기는 전략 */
(() => {
  const root = document.getElementById("card-mcult-nim");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  let H = [3, 4, 5], busy = false, over = false;
  const xor = (a) => a.reduce((s, v) => s ^ v, 0);
  const bits = (v) => v.toString(2).padStart(3, "0");
  function render() {
    $(".heaps").innerHTML = H.map((n, i) => `<div class="heap"><b>더미 ${i + 1}</b>${Array.from({ length: n }, (_, j) => `<button class="stone" type="button" data-i="${i}" data-j="${j}" aria-label="더미 ${i + 1}에서 ${n - j}개 가져가기"${busy || over ? " disabled" : ""}></button>`).join("")}${n ? "" : '<span class="small">(비었음)</span>'}</div>`).join("");
    const x = xor(H);
    $(".bin").textContent = H.map((n, i) => `더미 ${i + 1}: ${String(n).padStart(2)} = ${bits(n)}`).join("\n") + `\n님 합     = ${bits(x)}  ${x ? "(0이 아님: 지금 두는 쪽이 이길 수 있음)" : "(0: 지금 두는 쪽이 불리함)"}`;
    root.querySelectorAll(".stone").forEach((b) => b.addEventListener("click", () => move(+b.dataset.i, +b.dataset.j)));
  }
  function cpu() {
    const x = xor(H);
    let i = x ? H.findIndex((n) => (n ^ x) < n) : H.indexOf(Math.max(...H));
    const to = x ? H[i] ^ x : H[i] - 1, took = H[i] - to;
    H[i] = to;
    return `컴퓨터: 더미 ${i + 1}에서 ${took}개`;
  }
  function move(i, j) {
    if (busy || over) return;
    const took = H[i] - j; H[i] = j;
    if (!xor(H) && H.every((n) => !n)) { over = true; render(); $(".verdict").textContent = `당신이 마지막 돌을 가져갔습니다. 이겼습니다!`; return; }
    busy = true; render(); $(".verdict").textContent = `당신: 더미 ${i + 1}에서 ${took}개 · 컴퓨터가 생각하는 중…`;
    setTimeout(() => {
      const msg = cpu(); busy = false;
      if (H.every((n) => !n)) { over = true; render(); $(".verdict").textContent = `${msg} · 컴퓨터가 마지막 돌을 가져갔습니다. 님 합을 0으로 만들어 넘겨 보세요.`; return; }
      render(); $(".verdict").textContent = `${msg} · 당신 차례입니다.`;
    }, 650);
  }
  function start(h) { H = h; busy = false; over = false; render(); $(".verdict").textContent = `더미 ${H.join(", ")}개 · 당신이 먼저 둡니다.`; }
  $(".reset").addEventListener("click", () => start([3, 4, 5]));
  $(".reset2").addEventListener("click", () => start(Array.from({ length: 3 }, () => 1 + Math.floor(Math.random() * 7))));
  $(".hint").addEventListener("change", (e) => { $(".bin").hidden = !e.target.checked; });
  start([3, 4, 5]);
})();
