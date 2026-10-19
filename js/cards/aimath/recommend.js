/* 카드: 동영상 앱은 내가 볼 만한 영화를 어떻게 골라 줄까? — 사용자 기반 협업 필터링 (가상 평점) */
(() => {
  const root = document.getElementById("card-aimath-recommend");
  if (!root) return;
  const A = NMAi;
  const $ = (s) => root.querySelector(s);
  const MV = ["우주 탐험", "공룡 섬", "로맨스 파리", "웃음 학교", "유령 저택", "마법 숲"];
  const U = ["민", "서", "준", "하", "윤"];
  /* 0 = 안 봄 */
  const R = [[5, 4, 1, 2, 4, 5], [4, 5, 2, 1, 5, 4], [1, 2, 5, 4, 1, 2], [2, 1, 4, 5, 2, 0], [5, 0, 1, 3, 4, 3]];
  const me = [5, 4, 0, 1, 0, 0];
  const mean = (v) => { const s = v.filter((x) => x); return s.length ? s.reduce((a, b) => a + b, 0) / s.length : 0; };
  /* 함께 본 영화만, 각자 평균을 뺀 평점으로 코사인 */
  const sim = (a, b) => { const ma = mean(a), mb = mean(b), idx = a.map((_, i) => i).filter((i) => a[i] && b[i]); if (idx.length < 2) return 0; return A.cos(idx.map((i) => a[i] - ma), idx.map((i) => b[i] - mb)); };
  function update() {
    const S = R.map((r) => sim(me, r));
    const t = $("table");
    t.innerHTML = `<tr><th></th>${MV.map((m) => `<th class="mv">${m}</th>`).join("")}<th>나와 유사도</th></tr>` +
      R.map((r, u) => `<tr><th>${U[u]}</th>${r.map((v) => `<td>${v || "·"}</td>`).join("")}<td class="sim">${S[u].toFixed(2)}</td></tr>`).join("") +
      `<tr class="me"><th>나</th>${me.map((v, i) => `<td><select data-i="${i}" aria-label="내 ${MV[i]} 평점">${["·", 1, 2, 3, 4, 5].map((o, k) => `<option value="${k}" ${k === v ? "selected" : ""}>${o}</option>`).join("")}</select></td>`).join("")}<td></td></tr>`;
    t.querySelectorAll("select").forEach((s) => s.addEventListener("change", () => { me[+s.dataset.i] = +s.value; update(); }));
    /* 안 본 영화의 예상 평점: 유사도가 양수인 친구들의 가중평균 */
    const pred = MV.map((_, i) => { if (me[i]) return null; let num = 0, den = 0; R.forEach((r, u) => { if (r[i] && S[u] > 0) { num += S[u] * r[i]; den += S[u]; } }); return den ? num / den : null; });
    const cand = pred.map((p, i) => [p, i]).filter(([p]) => p !== null).sort((a, b) => b[0] - a[0]);
    const best = S.indexOf(Math.max(...S));
    $(".rec").innerHTML = cand.length ? `가장 비슷한 친구: <b>${U[best]}</b>(유사도 ${S[best].toFixed(2)})<br>안 본 영화의 예상 평점: ${cand.map(([p, i]) => `${MV[i]} ${p.toFixed(2)}`).join(", ")}<br>추천: <b>${MV[cand[0][1]]}</b>` : "안 본 영화가 없거나, 비슷한 친구가 없어 추천할 수 없습니다.";
  }
  update();
})();
