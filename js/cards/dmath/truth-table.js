/* 카드: "셋 중 둘 이상이 찬성하면 통과"를 식으로 쓸 수 있을까? — 참값표 채우기, 최소항의 합과 간단한 식 */
(() => {
  const root = document.getElementById("card-dmath-truth-table");
  if (!root) return;
  const Bo = NMBool;
  const $ = (s) => root.querySelector(s);
  const bit = (x, i) => (x >> (2 - i)) & 1; // i = 0: A
  const TASK = [
    { name: "다수결", say: "A, B, C 중 둘 이상이 1이면 1", f: (a, b, c) => a + b + c >= 2 },
    { name: "홀수 개", say: "1인 입력이 홀수 개이면 1 (계단 조명 스위치 세 개)", f: (a, b, c) => (a + b + c) % 2 === 1 },
    { name: "금고", say: "열쇠 A가 있고, 비밀번호 B 또는 지문 C가 맞으면 1", f: (a, b, c) => a && (b || c) },
    { name: "경보", say: "문 A가 열렸는데 경비 모드 C가 켜져 있으면 1, 단 관리자 카드 B가 있으면 0", f: (a, b, c) => a && c && !b },
  ];
  const pick = $(".pick"); TASK.forEach((t, i) => { const o = document.createElement("option"); o.value = i; o.textContent = t.name; pick.append(o); });
  let q = 0, out = Array(8).fill(0), checked = false;
  function render() {
    const t = TASK[q], ans = [...Array(8).keys()].map((x) => (t.f(bit(x, 0), bit(x, 1), bit(x, 2)) ? 1 : 0));
    $(".task").textContent = `규칙: ${t.say}`;
    $(".tt").innerHTML = "<tr><th>A</th><th>B</th><th>C</th><th>출력</th></tr>" + [...Array(8).keys()].map((x) => `<tr class="${checked && out[x] !== ans[x] ? "bad" : ""}"><td>${bit(x, 0)}</td><td>${bit(x, 1)}</td><td>${bit(x, 2)}</td><td><button type="button" data-x="${x}" class="${out[x] ? "one" : ""}" aria-label="입력 ${bit(x, 0)}${bit(x, 1)}${bit(x, 2)}의 출력">${out[x]}</button></td></tr>`).join("");
    $(".tt").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => { out[+b.dataset.x] ^= 1; checked = false; $(".verdict").textContent = ""; $(".expr").textContent = ""; render(); }));
  }
  $(".go-check").addEventListener("click", () => {
    const t = TASK[q], ans = [...Array(8).keys()].map((x) => (t.f(bit(x, 0), bit(x, 1), bit(x, 2)) ? 1 : 0)), wrong = ans.filter((a, x) => a !== out[x]).length;
    checked = true; render();
    const v = $(".verdict");
    if (!wrong) {
      v.textContent = "맞습니다!"; v.className = "verdict good";
      const can = Bo.canonical(out, 3), mn = Bo.minimize(out, 3).text;
      $(".expr").textContent = `최소항의 합: ${can} (글자 ${Bo.literals(can)}개) → 간단히: ${mn} (글자 ${Bo.literals(mn)}개)`;
    } else { v.textContent = `${wrong}줄이 다릅니다(붉은 줄).`; v.className = "verdict bad"; }
  });
  pick.addEventListener("change", () => { q = +pick.value; out = Array(8).fill(0); checked = false; $(".verdict").textContent = ""; $(".expr").textContent = ""; render(); });
  render();
})();
