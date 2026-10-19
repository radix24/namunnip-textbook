/* 카드: 인공지능을 만든 수학과 사건을 시간 순서로 놓을 수 있을까? — 연표 순서 맞추기 */
(() => {
  const root = document.getElementById("card-aimath-timeline");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const EV = [
    [1763, "베이즈 정리가 담긴 논문이 발표됨(확률로 판단 고치기)"],
    [1805, "르장드르가 최소제곱법을 발표함(자료에 맞는 직선)"],
    [1847, "코시가 기울기를 따라 내려가는 방법(경사하강법의 시작)을 제안함"],
    [1950, "튜링이 \"기계는 생각할 수 있는가\"를 묻는 논문을 발표함"],
    [1956, "다트머스 회의에서 '인공지능'이라는 말이 쓰임"],
    [1958, "로젠블랫이 퍼셉트론(인공 뉴런 모형)을 발표함"],
    [1969, "민스키와 페퍼트가 단층 퍼셉트론의 한계를 보임"],
    [1986, "역전파 알고리즘이 논문으로 널리 알려짐(다층 신경망 학습)"],
    [1997, "체스 컴퓨터 딥 블루가 세계 챔피언에게 이김"],
    [2016, "알파고가 이세돌 9단과의 바둑 대국에서 4승 1패로 이김"],
  ];
  let order = [], pool = [];
  const shuffle = () => { const a = EV.map((_, i) => i); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function render() {
    $(".pool").innerHTML = pool.map((i) => `<li><button class="chip" type="button" data-i="${i}">${EV[i][1]}</button></li>`).join("");
    const full = order.length === EV.length;
    $(".line").innerHTML = order.map((i, k) => { const bad = full && k > 0 && EV[order[k - 1]][0] > EV[i][0]; return `<li class="${bad ? "bad" : ""}">${full ? `<span class="yr">${EV[i][0]}</span>` : ""}${EV[i][1]}</li>`; }).join("");
    $(".pool").querySelectorAll("[data-i]").forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.i; pool = pool.filter((x) => x !== i); order.push(i); render(); }));
    if (full) {
      const right = order.filter((i, k) => i === k).length, inv = order.reduce((s, i, k) => s + order.slice(k + 1).filter((j) => j < i).length, 0);
      $(".verdict").textContent = inv === 0 ? "순서를 모두 맞혔습니다." : `제자리에 놓인 사건 ${right}/${EV.length} · 순서가 뒤바뀐 쌍 ${inv}개. 빨간 줄은 바로 앞 사건보다 이른 사건입니다.`;
    } else $(".verdict").textContent = `${order.length}/${EV.length}개 놓음`;
  }
  const reset = () => { order = []; pool = shuffle(); render(); };
  $(".go-undo").addEventListener("click", () => { if (order.length) { pool.push(order.pop()); render(); } });
  $(".go-reset").addEventListener("click", reset);
  reset();
})();
