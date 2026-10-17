/* 카드: 이 재매개화 풀이는 어디서 틀렸을까? — 풀이 넷에서 처음 틀린 줄 찾기, 바른 결과의 속력 확인 */
(() => {
  const root = document.getElementById("card-adgeo-reparam-spot");
  if (!root) return;
  const chk = root.querySelector(".chk");
  const sp = (f, s) => { const h = 1e-5, a = f(s + h), b = f(s - h); return Math.hypot(...a.map((x, i) => (x - b[i]) / (2 * h))).toFixed(4); };
  const RIGHT = [
    ["r(s) = (3cos(s/5), 3sin(s/5), 4s/5)", (s) => [3 * Math.cos(s / 5), 3 * Math.sin(s / 5), (4 * s) / 5]],
    ["r(s) = (1 + s/√2)(cos t, sin t), t = ln(1 + s/√2)", (s) => { const t = Math.log(1 + s / Math.SQRT2); return [Math.exp(t) * Math.cos(t), Math.exp(t) * Math.sin(t)]; }],
    ["r(s) = (2cos(s/2), 2sin(s/2))", (s) => [2 * Math.cos(s / 2), 2 * Math.sin(s / 2)]],
    ["r(s) = (1 + 2s/3, 3 − s/3, 2s/3)", (s) => [1 + (2 * s) / 3, 3 - s / 3, (2 * s) / 3]],
  ];
  const msg = (i) => `바른 결과: ${RIGHT[i][0]} · 확인: s = 1, 2, 3에서 |dr/ds| = ${[1, 2, 3].map((s) => sp(RIGHT[i][1], s)).join(", ")}`;
  const tabs = [...root.querySelectorAll("button[data-s]")], sols = [...root.querySelectorAll(".sol")], found = new Set();
  sols.forEach((s, i) => NMPm.spot(s.querySelector(".spot"), () => { found.add(i); chk.textContent = msg(i); }));
  tabs.forEach((b) => b.addEventListener("click", () => {
    const i = +b.dataset.s;
    tabs.forEach((t) => t.setAttribute("aria-pressed", String(t === b)));
    sols.forEach((s) => (s.hidden = +s.dataset.s !== i));
    chk.textContent = found.has(i) ? msg(i) : "";
  }));
})();
