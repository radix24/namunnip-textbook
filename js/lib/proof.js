/* 공용 증명 조립 도구 window.NMProof — 섞어 놓은 증명 단계를 눌러 순서대로 쌓는다.
   블록 머리 scripts에서 카드 스크립트보다 먼저 적는다: ["js/lib/proof.js", "js/cards/…"]
   마크업: <div class="pf"><ol class="pf-pool"><li data-k="a">단계 글<span class="pf-why">이 단계가 먼저 올 수 없는 까닭</span></li>…</ol></div>
   쓰기:   NMProof.mount(div, { order: ["a", "b", …], onStep(i, k) {…}, onDone() {…} })
   - order에 없는 단계는 함정(쓰이지 않는 단계)이다. 누르면 .pf-why를 보여 주고 쌓지 않는다.
   - onStep(i, k): i번째(0부터) 단계가 맞게 놓일 때마다. 카드는 그림을 그 단계까지 보여 준다. 처음과 다시 하기 때는 i = −1. */
window.NMProof = (() => {
  "use strict";
  /* 정해진 순서와 다르게 보이도록 섞는다 (씨앗이 같으면 늘 같은 배열 — 스크린샷·설명이 흔들리지 않게) */
  function shuffle(arr, seed = 7) {
    const a = arr.slice();
    let s = seed;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function mount(host, o) {
    const pool = host.querySelector(".pf-pool");
    const items = [...pool.querySelectorAll(":scope > li")];
    const byKey = new Map(items.map((li) => [li.dataset.k, li]));
    let order = shuffle(items.map((li) => li.dataset.k), o.seed);
    if (order.join() === o.order.join()) order = order.reverse();
    const built = document.createElement("ol");
    built.className = "pf-built";
    built.setAttribute("aria-label", "쌓은 증명");
    const bar = document.createElement("div");
    bar.className = "pf-bar";
    bar.innerHTML = `<span class="mono pf-count"></span><span class="pf-msg" role="status" aria-live="polite"></span><button type="button" class="chip pf-reset">다시 하기</button>`;
    host.prepend(built);
    host.append(bar);
    const msg = bar.querySelector(".pf-msg"), count = bar.querySelector(".pf-count");
    let at = 0;

    function render() {
      pool.innerHTML = "";
      order.forEach((k) => { const li = byKey.get(k); if (!li.classList.contains("pf-in")) pool.append(li); });
      count.textContent = `${at} / ${o.order.length}단계`;
      host.classList.toggle("pf-done", at === o.order.length);
    }
    function reset() {
      at = 0; built.innerHTML = ""; msg.textContent = ""; msg.className = "pf-msg";
      items.forEach((li) => { li.classList.remove("pf-in", "pf-no", "pf-show"); li.tabIndex = 0; li.setAttribute("role", "button"); });
      render();
      o.onStep && o.onStep(-1, null);
    }
    function pick(li) {
      if (li.classList.contains("pf-in") || at >= o.order.length) return;
      items.forEach((x) => x.classList.remove("pf-show", "pf-no"));
      if (li.dataset.k === o.order[at]) {
        li.classList.add("pf-in"); li.removeAttribute("role"); li.tabIndex = -1;
        built.append(li);
        o.onStep && o.onStep(at, li.dataset.k);
        at++;
        msg.textContent = at === o.order.length ? "증명 완성" : "";
        msg.className = "pf-msg" + (at === o.order.length ? " good" : "");
        render();
        if (at === o.order.length && o.onDone) o.onDone();
      } else {
        li.classList.add("pf-no");
        const trap = !o.order.includes(li.dataset.k);
        if (li.querySelector(".pf-why")) li.classList.add("pf-show");
        msg.textContent = trap ? "이 증명에는 쓰이지 않는 단계입니다." : "아직 이 단계를 놓을 수 없습니다.";
        msg.className = "pf-msg bad";
      }
    }
    pool.addEventListener("click", (e) => { const li = e.target.closest("li"); if (li) pick(li); });
    pool.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.matches("li")) { e.preventDefault(); pick(e.target); } });
    bar.querySelector(".pf-reset").addEventListener("click", reset);
    reset();
    return { reset, get step() { return at; } };
  }

  return { mount, shuffle };
})();
