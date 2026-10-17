/* 카드: 정렬 방법에 따라 비교 횟수는 얼마나 달라질까? — 버블 정렬과 병합 정렬을 비교 한 번씩 진행 */
(() => {
  const root = document.getElementById("card-dmath-sort-race");
  if (!root) return;
  const { F, fit } = NM;
  const D = NMDm;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n");
  let data, timer = 0;
  let bub = { a: [], hi: [], cmp: 0, done: false }, mer = { a: [], hi: [], cmp: 0, done: false };
  const A = fit($(".cb"), () => paint(A, bub)), B = fit($(".cm"), () => paint(B, mer)), G = fit($(".cmp"), () => chart());
  /* 생성기: 비교할 때마다 멈춤 */
  function* bubble(st) { const a = st.a, n = a.length; for (let i = 0; i < n - 1; i++) for (let j = 0; j < n - 1 - i; j++) { st.hi = [j, j + 1]; st.cmp++; yield; if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]]; } st.hi = []; st.done = true; }
  function* merge(st) {
    const a = st.a;
    function* ms(lo, hi) { if (hi - lo < 2) return; const mid = (lo + hi) >> 1; yield* ms(lo, mid); yield* ms(mid, hi); const L = a.slice(lo, mid), R = a.slice(mid, hi); let i = 0, j = 0, k = lo; while (i < L.length && j < R.length) { st.hi = [lo + i, mid + j]; st.cmp++; yield; a[k++] = L[i] <= R[j] ? L[i++] : R[j++]; } while (i < L.length) a[k++] = L[i++]; while (j < R.length) a[k++] = R[j++]; }
    yield* ms(0, a.length); st.hi = []; st.done = true;
  }
  const countMerge = (arr) => { const st = { a: arr.slice(), hi: [], cmp: 0 }; const g = merge(st); while (!g.next().done); return st.cmp; };
  function paint(f, st) {
    const { ctx, size: { w, h } } = f; if (!w) return;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
    const n = st.a.length, bw = w / n;
    st.a.forEach((v, i) => { ctx.fillStyle = st.hi.includes(i) ? "#d4493a" : st.done ? "#3b7c2a" : "#3f6fa3"; const bh = (v / n) * (h - 6); ctx.fillRect(i * bw + 0.5, h - bh, Math.max(1, bw - 1), bh); });
  }
  function chart() {
    const { ctx, size: { w, h } } = G; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const L = 50, R = 10, T = 10, Bt = 22, ns = [8, 16, 24, 32, 40, 48, 56, 64], max = (64 * 63) / 2;
    const X = (n) => L + ((n - 8) / 56) * (w - L - R), Y = (v) => T + (1 - v / max) * (h - T - Bt);
    ctx.strokeStyle = "#d9dad2"; ctx.fillStyle = "#5d5d61"; ctx.font = `10px ${F.mono}`; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    [0, 1000, 2000].forEach((v) => { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(w - R, Y(v)); ctx.stroke(); ctx.fillText(v, L - 4, Y(v)); });
    ctx.textAlign = "center"; ctx.textBaseline = "top"; ns.forEach((n) => ctx.fillText(n, X(n), h - Bt + 5));
    const line = (f, col, lab) => { ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath(); ns.forEach((n, i) => (i ? ctx.lineTo(X(n), Y(f(n))) : ctx.moveTo(X(n), Y(f(n))))); ctx.stroke(); ctx.fillStyle = col; ctx.textAlign = "left"; ctx.fillText(lab, X(40) + 6, Y(f(40)) - 12); };
    line((n) => (n * (n - 1)) / 2, "#b5532f", "버블 n(n−1)/2");
    line((n) => countMerge(D.shuffle([...Array(n).keys()].map((x) => x + 1), D.rng(n))), "#3b7c2a", "병합(실측)");
  }
  function say() { $(".sb").textContent = `버블 정렬 비교 ${bub.cmp}번${bub.done ? " · 끝" : ""}`; $(".sm").textContent = `병합 정렬 비교 ${mer.cmp}번${mer.done ? " · 끝" : ""}`; paint(A, bub); paint(B, mer); }
  function reset() {
    clearInterval(timer); const n = +nIn.value; $(".n-out").textContent = n;
    data = D.shuffle([...Array(n).keys()].map((x) => x + 1));
    bub = { a: data.slice(), hi: [], cmp: 0, done: false }; mer = { a: data.slice(), hi: [], cmp: 0, done: false }; say();
  }
  $(".go").addEventListener("click", () => {
    clearInterval(timer); bub = { a: data.slice(), hi: [], cmp: 0, done: false }; mer = { a: data.slice(), hi: [], cmp: 0, done: false };
    const gb = bubble(bub), gm = merge(mer), per = Math.max(1, Math.round(data.length / 8));
    timer = setInterval(() => { for (let k = 0; k < per; k++) { if (!bub.done) gb.next(); if (!mer.done) gm.next(); } say(); if (bub.done && mer.done) clearInterval(timer); }, 30);
  });
  $(".go-new").addEventListener("click", reset);
  nIn.addEventListener("input", reset);
  reset(); chart();
})();
