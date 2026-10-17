/* 카드: 바코드의 마지막 숫자는 왜 있을까? — EAN-13 검사 숫자, 가중치 1·3과 10의 나머지 */
(() => {
  const root = document.getElementById("card-mcult-barcode-check");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const inp = $(".code"), ORIG = "8801234567893";
  let note = "";
  function check() {
    const s = inp.value.replace(/\D/g, "").slice(0, 13); inp.value = s;
    if (s.length < 13) { $("table").innerHTML = ""; $(".verdict").textContent = `13자리를 모두 입력하세요(지금 ${s.length}자리).`; return; }
    const d = [...s].map(Number), wt = d.map((_, i) => (i % 2 ? 3 : 1)), pr = d.map((v, i) => v * wt[i]), sum = pr.reduce((a, b) => a + b, 0);
    const ok = sum % 10 === 0, need = (10 - (sum - d[12]) % 10) % 10;
    const diff = [...s].map((c, i) => c !== ORIG[i]);
    const row = (h, a) => `<tr><th>${h}</th>${a.map((v, i) => `<td${diff[i] ? ' class="bad"' : ""}>${v}</td>`).join("")}</tr>`;
    $("table").innerHTML = row("숫자", d) + row("가중치", wt) + row("곱", pr);
    $(".verdict").innerHTML = `${note}곱의 합 = ${sum} → ${ok ? `<span class="good">10의 배수, 통과</span>` : `<span class="bad">10의 배수가 아님, 다시 읽기</span>`} (앞 12자리에 맞는 검사 숫자는 ${need})`;
    note = "";
  }
  $(".one").addEventListener("click", () => {
    const d = [...ORIG], i = Math.floor(Math.random() * 13), old = d[i];
    let v; do v = String(Math.floor(Math.random() * 10)); while (v === old);
    d[i] = v; inp.value = d.join(""); note = `${i + 1}번째 자리 ${old} → ${v} · `; check();
  });
  $(".swap").addEventListener("click", () => {
    const d = [...ORIG]; let i; do i = Math.floor(Math.random() * 12); while (d[i] === d[i + 1]);
    [d[i], d[i + 1]] = [d[i + 1], d[i]]; inp.value = d.join(""); note = `${i + 1}·${i + 2}번째 자리 ${d[i + 1]}${d[i]} → ${d[i]}${d[i + 1]} (차 ${Math.abs(d[i] - d[i + 1])}) · `; check();
  });
  $(".back").addEventListener("click", () => { inp.value = ORIG; check(); });
  inp.addEventListener("input", check);
  check();
})();
