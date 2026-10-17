/* 세금 카드 공용: 가상의 누진 세율표와 계산 window.NMTax */
window.NMTax = (() => {
  "use strict";
  /* [구간 하한(만 원), 세율] — 수업용 가상 세율표 */
  const BR = [[0, 0.05], [1000, 0.15], [4000, 0.25], [8000, 0.35]];
  /* 초과 누진: 각 구간에 속한 몫에만 그 구간 세율 */
  const parts = (x) => BR.map(([lo, r], i) => { const hi = i + 1 < BR.length ? BR[i + 1][0] : Infinity, amt = Math.max(0, Math.min(x, hi) - lo); return { lo, hi, r, amt, tax: amt * r }; });
  const tax = (x) => parts(x).reduce((s, p) => s + p.tax, 0);
  const marginal = (x) => { let r = BR[0][1]; BR.forEach(([lo, rr]) => { if (x > lo) r = rr; }); return r; };
  /* 비교용: 소득 전체에 그 소득이 속한 구간 세율을 매기는 '단순 구간' 방식 */
  const flatBand = (x) => x * marginal(x);
  return { BR, parts, tax, marginal, flatBand };
})();
