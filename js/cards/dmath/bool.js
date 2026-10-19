/* 부울 함수 공용 도구 window.NMBool — 변수 n개(4 이하)의 참값표, 최소항 식, 최소 곱의 합(정해진 크기에서 모두 찾아보기). */
window.NMBool = (() => {
  "use strict";
  const VARS = "ABCD";
  /* 큐브: { v: 값 비트, m: 상관없는 자리 비트 } (비트 n−1이 A) */
  const lit = (c, n) => [...Array(n)].map((_, i) => { const b = 1 << (n - 1 - i); return c.m & b ? "" : c.v & b ? VARS[i] : VARS[i] + "′"; }).join("") || "1";
  const covers = (c, x) => (x & ~c.m) === (c.v & ~c.m);
  const size = (c, n) => [...Array(n)].filter((_, i) => !(c.m & (1 << i))).length;
  function minterms(f, n) { return [...Array(1 << n).keys()].filter((x) => f[x]); }
  function canonical(f, n) { const ms = minterms(f, n); return ms.length ? ms.map((x) => lit({ v: x, m: 0 }, n)).join(" + ") : "0"; }
  /* 최소 곱의 합: 소항 찾기 → 가장 적은 항, 그다음 가장 적은 글자 수 */
  function minimize(f, n) {
    const ms = minterms(f, n); if (!ms.length) return { terms: [], text: "0" }; if (ms.length === 1 << n) return { terms: [{ v: 0, m: (1 << n) - 1 }], text: "1" };
    const imp = [];
    for (let m = 0; m < 1 << n; m++) for (let v = 0; v < 1 << n; v++) {
      if (v & m) continue;
      let ok = true; for (let x = 0; x < 1 << n && ok; x++) if (covers({ v, m }, x) && !f[x]) ok = false;
      if (ok) imp.push({ v, m });
    }
    const prime = imp.filter((c) => !imp.some((d) => d !== c && (d.m & c.m) === c.m && d.m !== c.m && covers(d, c.v)));
    // 필수 소항(그것만 덮는 최소항이 있는 소항)을 먼저 고르고, 남은 최소항은 작은 조합부터 찾아봄
    const ess = prime.filter((c) => ms.some((x) => covers(c, x) && prime.filter((d) => covers(d, x)).length === 1));
    const left = ms.filter((x) => !ess.some((c) => covers(c, x))), rest = prime.filter((c) => !ess.includes(c));
    let best = left.length ? null : [];
    for (let k = 1; !best && k <= rest.length; k++) {
      let bestCost = Infinity;
      const comb = (start, cur) => {
        if (cur.length === k) {
          if (left.every((x) => cur.some((c) => covers(c, x)))) { const cost = cur.reduce((s, c) => s + size(c, n), 0); if (cost < bestCost) { bestCost = cost; best = cur.slice(); } }
          return;
        }
        for (let i = start; i < rest.length; i++) { cur.push(rest[i]); comb(i + 1, cur); cur.pop(); }
      };
      comb(0, []);
    }
    const terms = [...ess, ...best];
    return { terms, text: terms.map((c) => lit(c, n)).join(" + ") };
  }
  const literals = (text) => (text.match(/[A-D]/g) || []).length;
  return { VARS, lit, covers, minterms, canonical, minimize, literals };
})();
