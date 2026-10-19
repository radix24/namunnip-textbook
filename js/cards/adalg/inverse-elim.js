/* 카드: 역행렬이 있는지 계산하기 전에 알 수 있을까? — [A | I]의 가우스-조르당 소거를 한 단계씩 */
(() => {
  const root = document.getElementById("card-adalg-inverse-elim");
  if (!root) return;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  const AS = [
    { A: [[1, 2, 0], [0, 1, 1], [1, 0, 2]], hint: "열 사이에 단순한 관계가 보이지 않습니다." },
    { A: [[2, 1, 1], [1, 1, 0], [1, 0, 1]], hint: "첫 열 = 둘째 열 + 셋째 열입니다." },
    { A: [[1, 1, 1], [0, 1, 1], [0, 0, 1]], hint: "대각선 아래가 모두 0이고 대각성분이 0이 아닙니다." },
    { A: [[0, 1, 2], [1, 0, 3], [4, -3, 8]], hint: "첫 피벗 자리가 0이지만 행을 바꾸면 됩니다." },
  ];
  /* 가우스-조르당 단계 목록: [{M, say, hi}] */
  function plan(A) {
    const n = A.length, M = A.map((r, i) => [...r, ...L.eye(n)[i]]), out = [{ M: M.map((r) => r.slice()), say: "[A | I]에서 시작합니다.", hi: -1 }];
    const push = (say, hi) => out.push({ M: M.map((r) => r.map((x) => (Math.abs(x) < 1e-9 ? 0 : x))), say, hi });
    for (let c = 0; c < n; c++) {
      let p = -1; for (let r = c; r < n; r++) if (Math.abs(M[r][c]) > 1e-9) { p = r; break; }
      if (p < 0) { out.push({ M: M.map((r) => r.slice()), say: `${c + 1}열에서 피벗을 찾을 수 없습니다. 왼쪽을 I로 만들 수 없으므로 역행렬이 없습니다.`, hi: -1, fail: true }); return out; }
      if (p !== c) { [M[c], M[p]] = [M[p], M[c]]; push(`R${c + 1} ↔ R${p + 1} (피벗 자리가 0이라 행을 바꿈)`, c); }
      const k = M[c][c];
      if (Math.abs(k - 1) > 1e-9) { M[c] = M[c].map((x) => x / k); push(`R${c + 1} ← (1/${L.frac(k)})·R${c + 1} (피벗을 1로)`, c); }
      for (let r = 0; r < n; r++) {
        if (r === c || Math.abs(M[r][c]) < 1e-9) continue;
        const f = M[r][c]; M[r] = M[r].map((x, j) => x - f * M[c][j]);
        push(`R${r + 1} ← R${r + 1} − (${L.frac(f)})·R${c + 1} (${c + 1}열의 다른 성분을 0으로)`, r);
      }
    }
    out.push({ M: M.map((r) => r.slice()), say: "왼쪽이 I가 되었습니다. 오른쪽이 A⁻¹입니다.", hi: -1, ok: true });
    return out;
  }
  let q, S, i, guess;
  const step = $(".go-step"), all = $(".go-all");
  function show() {
    const s = S[i];
    $(".work").innerHTML = L.table(s.M, { bar: 3, hiRow: s.hi });
    $(".say").textContent = `${i} / ${S.length - 1} · ${s.say}`;
    const end = i === S.length - 1; step.disabled = all.disabled = end;
    const v = $(".verdict");
    if (end) {
      const has = !s.fail, ok = (guess === "1") === has;
      let msg = `${ok ? "예측이 맞았습니다." : "예측과 다릅니다."} ${q.hint}`;
      if (has) { const Ai = s.M.map((r) => r.slice(3)), chk = L.mul(q.A, Ai); msg += ` 확인: A·A⁻¹ = ${L.matStr(chk)}`; }
      else msg += ` 행렬식 det A = ${L.frac(L.det(q.A))}`;
      v.textContent = msg; v.className = "verdict " + (ok ? "good" : "bad");
    } else { v.textContent = ""; v.className = "verdict"; }
  }
  function load() {
    q = AS[+$(".pick").value]; S = plan(q.A); i = 0; guess = null;
    $(".a0").innerHTML = "A = " + L.table(q.A);
    $(".work").innerHTML = ""; $(".verdict").textContent = ""; $(".say").textContent = "먼저 예측을 고르세요.";
    step.disabled = all.disabled = true;
    root.querySelectorAll("[data-g]").forEach((b) => { b.setAttribute("aria-pressed", "false"); b.disabled = false; });
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    guess = b.dataset.g; b.setAttribute("aria-pressed", "true");
    root.querySelectorAll("[data-g]").forEach((x) => (x.disabled = true));
    show();
  }));
  step.addEventListener("click", () => { if (i < S.length - 1) { i++; show(); } });
  all.addEventListener("click", () => { i = S.length - 1; show(); });
  $(".pick").addEventListener("change", load);
  load();
})();
