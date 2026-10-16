/* 카드: 두 변환의 순서를 바꾸면 결과도 달라질까? — "먼저 B, 그다음 A" 결과를 네 그림에서 고르기 */
(() => {
  const root = document.getElementById("card-adalg-compose-order");
  if (!root) return;
  const { C, fit } = NM;
  const L = NMLin;
  const $ = (s) => root.querySelector(s);
  const T = {
    R: { m: [[0, -1], [1, 0]], n: "90° 회전" }, S: { m: [[1, 0], [0, -1]], n: "x축 대칭" }, Sy: { m: [[-1, 0], [0, 1]], n: "y축 대칭" },
    H: { m: [[1, 1], [0, 1]], n: "밀기(전단)" }, D: { m: [[1.5, 0], [0, 0.75]], n: "가로 1.5배·세로 0.75배" }, K: { m: [[1.5, 0], [0, 1.5]], n: "1.5배 닮음" },
  };
  const PAIRS = [["R", "S"], ["H", "R"], ["D", "H"], ["S", "Sy"], ["R", "K"]];
  const pick = $(".pick"), opts = $(".opts");
  PAIRS.forEach(([a, b], i) => { const o = document.createElement("option"); o.value = i; o.textContent = `A = ${T[a].n}, B = ${T[b].n}`; pick.append(o); });
  let cand = [], chosen = null;
  const same = (X, Y) => X.every((r, i) => r.every((x, j) => Math.abs(x - Y[i][j]) < 1e-9));
  function mini(cv, M) {
    const { ctx, size } = fit(cv, () => paint());
    function paint() {
      const { w, h } = size; if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const pl = L.plane(ctx, { x: 0, y: 0, w, h }, 2.6);
      L.shape(ctx, pl, L.HOUSE, null, null, "rgba(141,141,146,.6)");
      L.shape(ctx, pl, L.HOUSE, M, "rgba(224,160,42,.35)", C.amber);
    }
    paint();
  }
  function load() {
    const [a, b] = PAIRS[+pick.value], A = T[a].m, B = T[b].m;
    $(".say").textContent = `A = ${T[a].n}, B = ${T[b].n}. 먼저 B를 하고 그다음 A를 한 결과는? (회색: 원래 집)`;
    const pool = [{ M: L.mul(A, B), tag: "AB (먼저 B, 그다음 A)" }, { M: L.mul(B, A), tag: "BA (먼저 A, 그다음 B)" }, { M: A, tag: "A만" }, { M: B, tag: "B만" }];
    // 같은 그림이 겹치면 하나만 남기고 다른 후보로 채움
    const extra = [{ M: L.mul(A, A), tag: "AA" }, { M: L.mul(B, B), tag: "BB" }, { M: L.T(L.mul(A, B)), tag: "(AB)ᵀ" }, { M: L.eye(2), tag: "변환 없음" }];
    cand = [];
    [...pool, ...extra].forEach((c) => { if (cand.length < 4 && !cand.some((d) => same(d.M, c.M))) cand.push(c); });
    if (same(L.mul(A, B), L.mul(B, A))) cand[0].tag = "AB = BA";
    cand.sort(() => Math.random() - 0.5);
    chosen = null; opts.innerHTML = ""; $(".verdict").textContent = ""; $(".verdict").className = "verdict"; $(".prod").textContent = "";
    cand.forEach((c, i) => {
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-pressed", "false");
      b.innerHTML = `<canvas aria-label="후보 ${i + 1}"></canvas><span class="cap"></span>`;
      b.addEventListener("click", () => reveal(i));
      opts.append(b); mini(b.querySelector("canvas"), c.M);
    });
  }
  function reveal(i) {
    if (chosen != null) return; chosen = i;
    const [a, b] = PAIRS[+pick.value], A = T[a].m, B = T[b].m, AB = L.mul(A, B), BA = L.mul(B, A);
    [...opts.children].forEach((btn, k) => { btn.setAttribute("aria-pressed", String(k === i)); btn.querySelector(".cap").textContent = cand[k].tag; });
    const ok = same(cand[i].M, AB);
    $(".verdict").textContent = ok ? "맞습니다. 먼저 하는 B가 오른쪽에 오는 AB입니다." : `아닙니다. 고른 것은 "${cand[i].tag}"입니다. 먼저 하는 B가 오른쪽에 오는 AB를 찾으세요.`;
    $(".verdict").className = "verdict " + (ok ? "good" : "bad");
    $(".prod").textContent = `AB = ${L.matStr(AB)} · BA = ${L.matStr(BA)} → ${same(AB, BA) ? "순서를 바꿔도 같습니다." : "순서를 바꾸면 다릅니다."}`;
  }
  pick.addEventListener("change", load);
  load();
})();
