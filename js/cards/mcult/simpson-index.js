/* 카드: 네 종이 사는 두 숲, 어느 쪽이 더 다양할까? — 심프슨 D = 1 − Σp², 가상 자료 */
(() => {
  const root = document.getElementById("card-mcult-simpson-index");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const SP = ["소나무", "참나무", "단풍", "자작"], COL = ["#3b7c2a", "#a0782c", "#b5532f", "#8d8d92"];
  const INIT = [[25, 25, 25, 25], [85, 5, 5, 5]], NAME = ["A 숲", "B 숲"];
  $(".comm").innerHTML = INIT.map((c, j) => `<div data-j="${j}"><h4>${NAME[j]}</h4>${c.map((v, i) => `<div class="sp"><span>${SP[i]}</span><input type="range" min="0" max="100" step="1" value="${v}" data-i="${i}" aria-label="${NAME[j]} ${SP[i]} 그루 수"><output class="mono">${v}</output></div>`).join("")}<div class="stack"></div><div class="d"></div></div>`).join("");
  const boxes = [...root.querySelectorAll("[data-j]")];
  function D(c) { const N = c.reduce((a, b) => a + b, 0); return N ? 1 - c.reduce((a, b) => a + (b / N) ** 2, 0) : 0; }
  function update() {
    const res = boxes.map((b) => {
      const c = [...b.querySelectorAll("input")].map((x) => +x.value), N = c.reduce((a, v) => a + v, 0), d = D(c), k = c.filter((v) => v > 0).length;
      b.querySelectorAll("output").forEach((o, i) => { o.textContent = c[i]; });
      b.querySelector(".stack").innerHTML = c.map((v, i) => `<i style="width:${N ? (100 * v) / N : 0}%;background:${COL[i]}"></i>`).join("");
      b.querySelector(".d").textContent = `종 ${k}개 · 합 ${N}그루 · D = 1 − Σp² = ${d.toFixed(3)}`;
      return { d, k };
    });
    $(".say").textContent = `종의 수: A ${res[0].k}, B ${res[1].k} · 다양도: A ${res[0].d.toFixed(3)}, B ${res[1].d.toFixed(3)} → ${Math.abs(res[0].d - res[1].d) < 0.005 ? "거의 같음" : res[0].d > res[1].d ? "A 숲이 더 다양" : "B 숲이 더 다양"}`;
  }
  root.querySelectorAll("input").forEach((x) => x.addEventListener("input", update));
  update();
})();
