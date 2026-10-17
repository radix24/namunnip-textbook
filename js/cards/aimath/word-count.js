/* 카드: 낱말을 세기만 해도 글의 요점을 찾을 수 있을까? — 빈도수 벡터, 불용어, 추출 요약 (가상 글) */
(() => {
  const root = document.getElementById("card-aimath-word-count");
  if (!root) return;
  const { C, F, fit } = NM;
  const T = NMText, E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const DOC = [
    "다음 주 금요일에 우리 학교 축제가 열립니다.",
    "이번 축제에는 동아리 공연과 체험 부스가 준비됩니다.",
    "그리고 공연은 강당에서 오후 두 시에 시작합니다.",
    "그리고 동아리 여섯 곳이 공연에 참여합니다.",
    "체험 부스는 운동장에 설치되며 과학 동아리 부스가 가장 인기가 많을 것 같습니다.",
    "그리고 비가 오면 운동장 부스는 체육관으로 옮겨집니다.",
    "우리 학생회는 축제 공연과 부스에 많은 참여를 바란다고 밝혔습니다.",
  ];
  let stop = false, sum = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  const freq = () => T.counts(DOC.flatMap((s) => T.tokens(s, stop)));
  const top = (m, k) => [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, k);
  const score = (s, m) => T.tokens(s, true).reduce((a, w) => a + (m.get(w) || 0), 0);
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const t = top(freq(), 8), mx = t.length ? t[0][1] : 1, L = 10, bw = (w - 2 * L) / 8;
    t.forEach(([word, c], i) => { const bh = (c / mx) * (h - 40); ctx.fillStyle = T.STOP.has(word) ? "rgba(141,141,146,.6)" : E.BLUE; ctx.fillRect(L + i * bw + 4, h - 20 - bh, bw - 8, bh); E.text(ctx, L + i * bw + bw / 2, h - 6, word, C.ink2, "center", `11px ${F.sans}`); E.text(ctx, L + i * bw + bw / 2, h - 24 - bh, String(c), C.ink, "center", `600 11px ${F.mono}`); });
  }
  function update() {
    const m = freq(), keys = new Set(top(new Map([...m].filter(([w]) => !T.STOP.has(w))), 5).map(([w]) => w));
    const sc = DOC.map((s) => score(s, new Map([...m].filter(([w]) => !T.STOP.has(w)))));
    const bi = sc.indexOf(Math.max(...sc));
    $(".doc").innerHTML = DOC.map((s, i) => `<span class="s ${sum && i === bi ? "top" : ""}">${s.split(" ").map((wd) => (keys.has(T.strip(wd.replace(/[.,]/g, "").toLowerCase())) ? `<mark>${wd}</mark>` : wd)).join(" ")}</span>`).join(" ");
    $(".say").textContent = `핵심어(파랑 표시) ${[...keys].join(", ")}` + (sum ? ` · 문장 점수 ${sc.join(", ")} → 요약 문장: "${DOC[bi]}"` : "") + (stop ? " · 불용어를 뺐습니다" : " · 회색 막대는 불용어");
    draw();
  }
  $(".go-stop").addEventListener("click", (e) => { stop = !stop; e.currentTarget.setAttribute("aria-pressed", String(stop)); update(); });
  $(".go-sum").addEventListener("click", () => { sum = true; update(); });
  update();
})();
