/* 카드: 서로 다른 구슬 다섯 개로 목걸이를 몇 가지나 만들 수 있을까? — 염주순열 도감 모으기 */
(() => {
  const root = document.getElementById("card-pmath-necklace");
  if (!root) return;
  const { C, F, fit } = NM;
  const { label } = NMPm;
  const $ = (s) => root.querySelector(s);
  const COL = ["#d4493a", "#e0a02a", "#3b7c2a", "#3f6fa3", "#7b5ea7"], N = 5;
  let beads = [0, 1, 2, 3, 4], sel = null, flip = true, geo = null;
  const book = new Map();   // 대표 문자열 → 배열
  const cv = $(".main");
  const { ctx, size } = fit(cv, () => draw());

  /* 돌리기(와 뒤집기)로 같아지는 배열 가운데 사전순으로 가장 앞선 것을 대표로 */
  function canon(a) {
    const cand = [];
    const vars = flip ? [a, a.slice().reverse()] : [a];
    vars.forEach((v) => { for (let k = 0; k < N; k++) cand.push(v.slice(k).concat(v.slice(0, k)).join("")); });
    return cand.sort()[0];
  }
  function ring(c, cx, cy, R, arr, r, hi) {
    c.strokeStyle = "#9a8f80"; c.lineWidth = Math.max(1, r * 0.25); c.beginPath(); c.arc(cx, cy, R, 0, 7); c.stroke();
    arr.forEach((b, k) => {
      const a = -Math.PI / 2 + 2 * Math.PI * k / N, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      c.fillStyle = COL[b]; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
      if (hi === k) { c.strokeStyle = C.ink; c.lineWidth = 3; c.beginPath(); c.arc(x, y, r + 4, 0, 7); c.stroke(); }
    });
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const R = Math.min(w, h) * 0.33, cx = w / 2, cy = h / 2;
    geo = { R, cx, cy };
    ring(ctx, cx, cy, R, beads, 17, sel);
    if (sel != null) label(ctx, "바꿀 구슬을 하나 더 누르세요", cx, h - 10, C.ink2, "center", `600 11px ${F.sans}`);
  }
  function drawBook() {
    const host = $(".book"); host.innerHTML = "";
    [...book.values()].forEach((arr) => {
      const c = document.createElement("canvas"); host.append(c);
      const { ctx: g, size: s } = fit(c, () => { g.clearRect(0, 0, s.w, s.h); ring(g, s.w / 2, s.h / 2, s.w * 0.32, arr, s.w * 0.09); });
    });
    const total = flip ? 12 : 24;
    $(".cnt").textContent = `도감: ${book.size} / ${total}가지 (${flip ? "(5 − 1)! ÷ 2" : "(5 − 1)!"})`;
  }
  cv.addEventListener("click", (e) => {
    if (!geo) return;
    const b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
    for (let k = 0; k < N; k++) {
      const a = -Math.PI / 2 + 2 * Math.PI * k / N;
      if (Math.hypot(x - (geo.cx + geo.R * Math.cos(a)), y - (geo.cy + geo.R * Math.sin(a))) < 22) {
        if (sel == null) sel = k; else { [beads[sel], beads[k]] = [beads[k], beads[sel]]; sel = null; }
        draw(); return;
      }
    }
  });
  $(".go-add").addEventListener("click", () => {
    const key = canon(beads), v = $(".verdict");
    if (book.has(key)) { v.textContent = "이미 도감에 있는 목걸이입니다(돌리거나 뒤집으면 같아요)."; v.className = "verdict bad"; }
    else { book.set(key, beads.slice()); v.textContent = "새 목걸이!"; v.className = "verdict good"; drawBook(); }
  });
  $(".go-mix").addEventListener("click", () => { for (let i = N - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [beads[i], beads[j]] = [beads[j], beads[i]]; } sel = null; draw(); });
  $(".go-clear").addEventListener("click", () => { book.clear(); drawBook(); $(".verdict").textContent = ""; });
  root.querySelectorAll(".mode .chip").forEach((b) => b.addEventListener("click", () => {
    flip = b.dataset.f === "1"; root.querySelectorAll(".mode .chip").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    book.clear(); drawBook(); $(".verdict").textContent = "";
  }));
  drawBook(); draw();
})();
