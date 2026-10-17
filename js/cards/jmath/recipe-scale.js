/* 카드: 4인분 레시피로 단체 손님 30명의 음식을 만들려면? — 배율, 올림, 포장 단위 (가상 레시피) */
(() => {
  const root = document.getElementById("card-jmath-recipe-scale");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), BASE = 4;
  /* [재료, 4인분 양, 단위, 나눌 수 없음, 포장 단위] */
  const R = [["밀가루", 300, "g", false, 1000], ["우유", 250, "mL", false, 900], ["달걀", 2, "개", true, 10], ["버터", 45, "g", false, 200], ["설탕", 30, "g", false, 500]];
  function update() {
    const n = +nIn.value, k = n / BASE;
    $(".n-out").textContent = n;
    let waste = 0;
    $("table").innerHTML = `<tr><th>재료</th><th>4인분</th><th>× ${+k.toFixed(3)}</th><th>준비할 양</th><th>포장</th><th>살 개수</th></tr>` + R.map(([nm, a, u, whole, pk]) => {
      const need = a * k, use = whole ? Math.ceil(need) : need, buy = Math.ceil(use / pk); waste += (buy * pk - use) / pk;
      return `<tr><td>${nm}</td><td>${a} ${u}</td><td>${+need.toFixed(2)} ${u}</td><td>${+use.toFixed(1)} ${u}${whole && use !== need ? " (올림)" : ""}</td><td>${pk} ${u}</td><td>${buy}${u === "개" ? "판" : "봉지"}</td></tr>`;
    }).join("");
    $(".say").textContent = `배율 = ${n} ÷ ${BASE} = ${+k.toFixed(3)} · 남는 재료(포장 단위로 환산) 합 약 ${waste.toFixed(2)}봉지 분량`;
  }
  nIn.addEventListener("input", update);
  update();
})();
