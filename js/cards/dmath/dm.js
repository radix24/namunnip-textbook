/* 이산 수학 카드 공용 도구 window.NMDm — 큰 정수 세기(BigInt), 시드 난수, 수 표기. */
window.NMDm = (() => {
  "use strict";
  /* n! , nCr , nPr (BigInt) */
  function fact(n) { let r = 1n; for (let k = 2n; k <= BigInt(n); k++) r *= k; return r; }
  function C(n, r) { if (r < 0 || r > n) return 0n; r = Math.min(r, n - r); let a = 1n; for (let k = 0; k < r; k++) a = (a * BigInt(n - k)) / BigInt(k + 1); return a; }
  function P(n, r) { if (r < 0 || r > n) return 0n; let a = 1n; for (let k = 0; k < r; k++) a *= BigInt(n - k); return a; }
  /* 세 자리마다 쉼표 */
  const big = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace("-", "−");
  /* 시드 난수(같은 시드면 같은 결과): 0 이상 1 미만 */
  function rng(seed = 1) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
  /* 배열 섞기(피셔-예이츠) */
  function shuffle(a, rand = Math.random) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const n = (x, d = 3) => (Number.isFinite(x) ? String(+x.toFixed(d)).replace("-", "−") : "—");
  return { fact, C, P, big, rng, shuffle, n };
})();
