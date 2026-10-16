/* 카드: 화학 반응식의 계수는 어떻게 한 번에 정할까? — 원소별 원자 수 보존 = 동차 연립방정식 */
(() => {
  const root = document.getElementById("card-adalg-balance-eq");
  if (!root) return;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  /* 분자: [화면 이름(아래 첨자), {원소: 개수}], left 개수만큼이 반응물 */
  const RX = [
    { name: "프로페인의 연소", left: 2, mols: [["C₃H₈", { C: 3, H: 8 }], ["O₂", { O: 2 }], ["CO₂", { C: 1, O: 2 }], ["H₂O", { H: 2, O: 1 }]] },
    { name: "암모니아 합성", left: 2, mols: [["N₂", { N: 2 }], ["H₂", { H: 2 }], ["NH₃", { N: 1, H: 3 }]] },
    { name: "철의 산화", left: 2, mols: [["Fe", { Fe: 1 }], ["O₂", { O: 2 }], ["Fe₂O₃", { Fe: 2, O: 3 }]] },
    { name: "광합성", left: 2, mols: [["CO₂", { C: 1, O: 2 }], ["H₂O", { H: 2, O: 1 }], ["C₆H₁₂O₆", { C: 6, H: 12, O: 6 }], ["O₂", { O: 2 }]] },
  ];
  const pick = $(".pick");
  RX.forEach((r, i) => { const o = document.createElement("option"); o.value = i; o.textContent = r.name; pick.append(o); });
  let q, k, done;
  const els = () => [...new Set(q.mols.flatMap(([, f]) => Object.keys(f)))];
  function render() {
    const rx = $(".rx"); rx.innerHTML = "";
    q.mols.forEach(([nm], i) => {
      if (i === q.left) { const a = document.createElement("span"); a.textContent = "→"; rx.append(a); }
      else if (i > 0) { const p = document.createElement("span"); p.textContent = "+"; rx.append(p); }
      const m = document.createElement("span"); m.className = "mol";
      m.innerHTML = `<button type="button" aria-label="${nm} 계수 줄이기">−</button><b>${k[i]}</b><span>${nm}</span><button type="button" aria-label="${nm} 계수 늘리기">+</button>`;
      const [dn, up] = m.querySelectorAll("button");
      dn.addEventListener("click", () => { k[i] = Math.max(1, k[i] - 1); render(); });
      up.addEventListener("click", () => { k[i] = Math.min(12, k[i] + 1); render(); });
      rx.append(m);
    });
    const E = els(); let all = true;
    const rows = E.map((e) => {
      const lt = q.mols.slice(0, q.left).reduce((s, [, f], i) => s + (f[e] || 0) * k[i], 0);
      const rt = q.mols.slice(q.left).reduce((s, [, f], i) => s + (f[e] || 0) * k[i + q.left], 0);
      if (lt !== rt) all = false;
      return `<tr><th>${e}</th><td class="${lt === rt ? "ok" : "no"}">${lt}</td><td class="${lt === rt ? "ok" : "no"}">${rt}</td></tr>`;
    });
    $(".cnt").innerHTML = `<tr><th>원소</th><th>반응물</th><th>생성물</th></tr>${rows.join("")}`;
    const v = $(".verdict");
    if (all && !done) { done = true; }
    if (all) {
      const g = k.reduce((a, b) => { while (b) [a, b] = [b, a % b]; return a; });
      v.textContent = g > 1 ? `원자 수가 맞습니다. 다만 모든 계수가 ${g}의 배수라 ${g}로 나눌 수 있습니다.` : "원자 수가 모두 맞습니다. 가장 작은 자연수 비입니다.";
      v.className = "verdict " + (g > 1 ? "" : "good");
    } else { v.textContent = ""; v.className = "verdict"; }
  }
  function load() { q = RX[+pick.value]; k = q.mols.map(() => 1); done = false; $(".mx").innerHTML = ""; render(); }
  $(".go-solve").addEventListener("click", () => {
    const E = els(), A = E.map((e) => q.mols.map(([, f], i) => (i < q.left ? 1 : -1) * (f[e] || 0)));
    const { R } = L.rref(A), cols = q.mols.map((_, j) => A.map((r) => r[j]));
    let c = L.relation(cols); if (c.some((x) => x < 0)) c = c.map((x) => -x);
    $(".mx").innerHTML = `<p>행: ${E.join(", ")} · 열: ${q.mols.map(([n]) => n).join(", ")} (생성물은 −)</p><p>A = ${L.table(A)} → 기약 행 사다리꼴 ${L.table(R)}</p><p>자유변수 1개 → 해 t(${c.map((x) => L.frac(x)).join(", ")}). 가장 작은 자연수: t = 1</p>`;
    k = c.map((x) => Math.round(x)); render();
  });
  pick.addEventListener("change", load);
  load();
})();
