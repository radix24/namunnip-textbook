/* 카드: 똑같은 표로 세는 방법만 바꾸면 당선자가 달라질까? — 다수, 결선, 보르다, 콩도르세 */
(() => {
  const root = document.getElementById("card-mcult-voting-methods");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const ORD = ["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"], DEF = [0, 7, 0, 6, 0, 5];   // 가상 자료 18명
  $(".prefs").innerHTML = ORD.map((o, i) => `<label>${[...o].join(" > ")}<input type="number" min="0" max="40" step="1" value="${DEF[i]}" data-i="${i}" aria-label="${[...o].join(" > ")} 인원"></label>`).join("");
  const ins = [...root.querySelectorAll("[data-i]")];
  const win = (sc) => { const m = Math.max(...Object.values(sc)), w = Object.keys(sc).filter((k) => sc[k] === m); return w.length > 1 ? `${w.join("·")} 동점` : w[0]; };
  const fmt = (sc) => Object.entries(sc).map(([k, v]) => `${k} ${v}`).join(", ");
  function update() {
    const n = ins.map((x) => Math.max(0, Math.floor(+x.value || 0))), tot = n.reduce((a, b) => a + b, 0);
    const pref = (x, y) => ORD.reduce((s, o, i) => s + (o.indexOf(x) < o.indexOf(y) ? n[i] : 0), 0);   // x를 y보다 좋아하는 사람 수
    const first = { A: 0, B: 0, C: 0 }, borda = { A: 0, B: 0, C: 0 };
    ORD.forEach((o, i) => { first[o[0]] += n[i]; borda[o[0]] += 2 * n[i]; borda[o[1]] += n[i]; });
    const top2 = Object.keys(first).sort((a, b) => first[b] - first[a]).slice(0, 2), [p, q] = top2, pq = pref(p, q), qp = pref(q, p);
    const run = pq === qp ? `${p}·${q} 동점` : pq > qp ? p : q;
    const cond = ["A", "B", "C"].find((x) => ["A", "B", "C"].every((y) => y === x || pref(x, y) > pref(y, x)));
    const pairs = [["A", "B"], ["A", "C"], ["B", "C"]].map(([x, y]) => `${x}:${y} = ${pref(x, y)}:${pref(y, x)}`).join(", ");
    $("table").innerHTML = `<tr><th>방법</th><th>계산</th><th>당선</th></tr>`
      + `<tr><td>다수 득표제</td><td>1순위 표: ${fmt(first)}</td><td><b>${win(first)}</b></td></tr>`
      + `<tr><td>결선 투표제</td><td>상위 ${p}, ${q} 중 선호: ${p} ${pq}, ${q} ${qp}</td><td><b>${run}</b></td></tr>`
      + `<tr><td>보르다 방식</td><td>점수(2·1·0): ${fmt(borda)}</td><td><b>${win(borda)}</b></td></tr>`
      + `<tr><td>콩도르세 승자</td><td>일대일: ${pairs}</td><td><b>${cond || "없음(순환)"}</b></td></tr>`;
    $(".say").textContent = `투표자 ${tot}명 · 결선 진출자는 1순위 표 상위 두 명(동점이면 앞 글자 순)`;
  }
  ins.forEach((x) => x.addEventListener("input", update));
  update();
})();
