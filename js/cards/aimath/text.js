/* 텍스트 카드 공용 window.NMText — 아주 단순한 한국어 낱말 나누기(띄어쓰기 + 흔한 조사 떼기), 빈도, 불용어 */
window.NMText = (() => {
  "use strict";
  /* 긴 조사부터 뗀다. 낱말이 두 글자 이상 남을 때만 */
  const JOSA = ["에서는", "으로는", "에게서", "이라는", "까지", "부터", "처럼", "보다", "에서", "에게", "한테", "으로", "에는", "이나", "이다", "입니다", "은", "는", "이", "가", "을", "를", "에", "의", "도", "와", "과", "로", "만"];
  const STOP = new Set(["그리고", "그런데", "하지만", "그래서", "또", "더", "아주", "정말", "매우", "것", "수", "등", "및", "이런", "그런", "저런", "우리", "있다", "없다", "했다", "한다", "하는", "있는", "된다", "되는", "같은", "때", "중", "위해"]);
  function strip(w) { for (const j of JOSA) if (w.length - j.length >= 2 && w.endsWith(j)) return w.slice(0, -j.length); return w; }
  const tokens = (s, stop = false) => s.replace(/[.,!?·"'“”‘’()\[\]{}:;~…]/g, " ").split(/\s+/).filter(Boolean).map((w) => strip(w.toLowerCase())).filter((w) => !stop || !STOP.has(w));
  const counts = (ts) => { const m = new Map(); ts.forEach((t) => m.set(t, (m.get(t) || 0) + 1)); return m; };
  return { tokens, counts, STOP, strip };
})();
