/* 카드: 재귀로 피보나치 수를 구하면 왜 이렇게 느릴까? — 호출 나무, 메모이제이션 비교 */
(() => {
  const root = document.getElementById("card-dmath-call-tree");
  if (!root) return;
  const { C, F, fit } = NM;
  const D = NMDm;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), COLS = ["", "#8d8d92", "#8d8d92", "#3f6fa3", "#3b7c2a", "#e0a02a", "#b5532f", "#7b5ea7", "#2a9d8f"];
  let memo = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  /* 나무 만들기: { v, kids, cached } */
  function build(n) {
    const seen = new Set();
    const go = (k) => { if (memo && seen.has(k)) return { v: k, kids: [], cached: true }; seen.add(k); return { v: k, kids: k <= 2 ? [] : [go(k - 1), go(k - 2)] }; };
    return go(n);
  }
  const leaves = (t) => (t.kids.length ? t.kids.reduce((s, c) => s + leaves(c), 0) : 1);
  const count = (t) => 1 + t.kids.reduce((s, c) => s + count(c), 0);
  const depth = (t) => 1 + Math.max(0, ...t.kids.map(depth));
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const t = build(+nIn.value), L = leaves(t), dp = depth(t), dx = (w - 20) / L, dy = (h - 24) / Math.max(1, dp - 1);
    const r = Math.max(4, Math.min(13, dx * 0.42));
    let x0 = 10;
    const place = (node, d) => { if (!node.kids.length) { node.x = x0 + dx / 2; x0 += dx; } else { node.kids.forEach((c) => place(c, d + 1)); node.x = (node.kids[0].x + node.kids[node.kids.length - 1].x) / 2; } node.y = 12 + d * dy; };
    place(t, 0);
    const edges = (node) => node.kids.forEach((c) => { ctx.strokeStyle = C.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(c.x, c.y); ctx.stroke(); edges(c); });
    const nodes = (node) => {
      ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, 7);
      ctx.fillStyle = node.cached ? "#fff" : COLS[node.v] || "#555"; ctx.fill();
      if (node.cached) { ctx.strokeStyle = COLS[node.v] || "#555"; ctx.lineWidth = 2; ctx.stroke(); }
      if (r >= 8) { ctx.fillStyle = node.cached ? C.ink : "#fff"; ctx.font = `700 ${Math.round(r)}px ${F.sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(node.v, node.x, node.y); }
      node.kids.forEach(nodes);
    };
    edges(t); nodes(t);
  }
  function calls(n, m) { if (m) return n <= 2 ? 1 : 2 * n - 3; let a = 1, b = 1; for (let k = 3; k <= n; k++) [a, b] = [b, a + b + 1]; return n <= 2 ? 1 : b; }
  function update() {
    const n = +nIn.value, t = build(n);
    $(".n-out").textContent = n;
    $(".say").textContent = `F(${n}) 구하기: 호출 ${count(t)}번` + (memo ? " (흰 마디는 기억해 둔 값을 바로 꺼낸 것)" : ` · 그중 F(2) 호출 ${(() => { let c = 0; const f = (x) => { if (x.v === 2) c++; x.kids.forEach(f); }; f(t); return c; })()}번`);
    $(".big-n").textContent = [10, 20, 30, 40].map((k) => `n = ${k}: 그대로 ${D.big(calls(k, false))}번, 기억하기 ${calls(k, true)}번`).join(" · ");
    draw();
  }
  $(".go-memo").addEventListener("click", (e) => { memo = !memo; e.target.setAttribute("aria-pressed", String(memo)); update(); });
  nIn.addEventListener("input", update);
  update();
})();
