/* 카드: 이 알고리즘은 어떤 입력에서 틀릴까? — 의사코드 넷에서 처음 틀린 줄 찾기, 찾으면 반례 실행 */
(() => {
  const root = document.getElementById("card-dmath-algo-bug");
  if (!root) return;
  const chk = root.querySelector(".chk");
  const maxBug = (x) => { let m = 0; x.forEach((v) => { if (v > m) m = v; }); return m; };
  const sumBug = (n) => { let s = 0, i = 1; while (i < n) { s += i; i++; } return s; };
  const binBug = (x, t) => { let lo = 1, hi = x.length, k = 0; while (lo <= hi && k < 20) { k++; const mid = Math.floor((lo + hi) / 2); if (x[mid - 1] === t) return `위치 ${mid}`; if (x[mid - 1] < t) lo = mid; else hi = mid; } return k >= 20 ? "20번 반복해도 끝나지 않음" : "없음"; };
  const prime = (n) => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return "소수 아님"; return "소수"; };
  const RUN = [
    () => `반례 실행: [−5, −2, −9] → 틀린 알고리즘 ${maxBug([-5, -2, -9])}, 바른 답 −2`,
    () => `반례 실행: n = 3 → 틀린 알고리즘 ${sumBug(3)}, 바른 답 6 · n = 1 → ${sumBug(1)}, 바른 답 1`,
    () => `반례 실행: [3, 7]에서 9 찾기 → ${binBug([3, 7], 9)}`,
    () => `실행: ${[2, 3, 4, 9, 25, 29, 91, 97].map((n) => `${n} ${prime(n)}`).join(", ")}`,
  ];
  const tabs = [...root.querySelectorAll("button[data-s]")], sols = [...root.querySelectorAll(".sol")], found = new Set();
  sols.forEach((s, i) => NMPm.spot(s.querySelector(".spot"), () => { found.add(i); chk.textContent = RUN[i](); }));
  tabs.forEach((b) => b.addEventListener("click", () => {
    const i = +b.dataset.s;
    tabs.forEach((t) => t.setAttribute("aria-pressed", String(t === b)));
    sols.forEach((s) => (s.hidden = +s.dataset.s !== i));
    chk.textContent = found.has(i) ? RUN[i]() : "";
  }));
})();
