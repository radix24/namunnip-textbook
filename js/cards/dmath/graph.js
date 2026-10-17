/* 그래프 카드 공용 도구 window.NMGraph — 꼭짓점 끌기·누르기, 변 누르기, 평행한 변(곡선), 교차 수, 면 세기.
   꼭짓점 V = [{x, y, label}] (x, y는 0~1), 변 E = [[a, b], …] (같은 쌍이 여러 번이면 다중 변). */
window.NMGraph = (() => {
  "use strict";
  const { C, F, fit } = NM;
  /* 보드: o = { V, E, drag, vClick(i), eClick(k), vStyle(i) → {fill, stroke, r, text, textColor}, eStyle(k) → {color, width, dash}, under(ctx, P), over(ctx, P), pad, change() } */
  function board(canvas, o) {
    const pad = o.pad ?? 26;
    const f = fit(canvas, () => draw());
    let P = () => [0, 0];
    const curve = (k) => { // 같은 쌍의 몇 번째 변인지에 따라 휘는 정도
      const [a, b] = o.E[k], same = o.E.map((e, j) => [e, j]).filter(([e]) => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a));
      if (same.length < 2) return 0; const idx = same.findIndex(([, j]) => j === k); return (idx - (same.length - 1) / 2) * 34;
    };
    const ctrl = (k) => { const [a, b] = o.E[k], p = P(a), q = P(b), c = curve(k), mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; const s = (o.E[k][0] < o.E[k][1]) ? 1 : -1; return [mx - (s * c * (q[1] - p[1])) / L, my + (s * c * (q[0] - p[0])) / L]; };
    function draw() {
      const { ctx, size: { w, h } } = f; if (!w) return;
      ctx.clearRect(0, 0, w, h);
      P = (i) => [pad + o.V[i].x * (w - 2 * pad), pad + o.V[i].y * (h - 2 * pad)];
      if (o.under) o.under(ctx, P, w, h);
      o.E.forEach((e, k) => {
        const st = (o.eStyle && o.eStyle(k)) || {}, p = P(e[0]), q = P(e[1]), c = ctrl(k);
        ctx.strokeStyle = st.color || C.ink3; ctx.lineWidth = st.width || 2.2; ctx.setLineDash(st.dash || []);
        ctx.beginPath(); ctx.moveTo(...p); ctx.quadraticCurveTo(...c, ...q); ctx.stroke(); ctx.setLineDash([]);
        if (st.label != null) { ctx.fillStyle = st.labelColor || C.ink2; ctx.font = `700 11px ${F.mono}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; const mx = (p[0] + 2 * c[0] + q[0]) / 4, my = (p[1] + 2 * c[1] + q[1]) / 4; ctx.save(); ctx.fillStyle = C.card; ctx.fillRect(mx - 11, my - 8, 22, 16); ctx.restore(); ctx.fillText(st.label, mx, my); }
      });
      o.V.forEach((v, i) => {
        const st = (o.vStyle && o.vStyle(i)) || {}, [x, y] = P(i), r = st.r || 13;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = st.fill || C.card; ctx.fill(); ctx.strokeStyle = st.stroke || C.ink; ctx.lineWidth = st.lw || 2; ctx.stroke();
        const t = st.text ?? v.label ?? "";
        if (t !== "") { ctx.fillStyle = st.textColor || C.ink; ctx.font = `700 ${Math.round(r * 0.9)}px ${F.sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(t, x, y + 0.5); }
        if (st.badge != null) { ctx.fillStyle = st.badgeColor || C.warn; ctx.font = `700 11px ${F.mono}`; ctx.textAlign = "left"; ctx.textBaseline = "bottom"; ctx.fillText(st.badge, x + r * 0.7, y - r * 0.6); }
      });
      if (o.over) o.over(ctx, P, w, h);
    }
    // 입력
    const pos = (e) => { const b = canvas.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    const hitV = (x, y) => { let best = -1, d = 22; o.V.forEach((_, i) => { const p = P(i), dd = Math.hypot(p[0] - x, p[1] - y); if (dd < d) { d = dd; best = i; } }); return best; };
    const hitE = (x, y) => { let best = -1, d = 9; o.E.forEach((e, k) => { const p = P(e[0]), q = P(e[1]), c = ctrl(k); for (let t = 0; t <= 1; t += 0.05) { const bx = (1 - t) ** 2 * p[0] + 2 * (1 - t) * t * c[0] + t * t * q[0], by = (1 - t) ** 2 * p[1] + 2 * (1 - t) * t * c[1] + t * t * q[1], dd = Math.hypot(bx - x, by - y); if (dd < d) { d = dd; best = k; } } }); return best; };
    let down = null;
    canvas.style.touchAction = o.drag ? "none" : "manipulation";
    canvas.addEventListener("pointerdown", (e) => { const [x, y] = pos(e), i = hitV(x, y); down = { x, y, i, moved: false }; if (i >= 0 && o.drag) { canvas.setPointerCapture(e.pointerId); e.preventDefault(); } });
    canvas.addEventListener("pointermove", (e) => {
      if (!down || down.i < 0 || !o.drag) return; const [x, y] = pos(e);
      if (Math.hypot(x - down.x, y - down.y) > 4) down.moved = true;
      if (down.moved) { const { w, h } = f.size; o.V[down.i].x = Math.max(0, Math.min(1, (x - pad) / (w - 2 * pad))); o.V[down.i].y = Math.max(0, Math.min(1, (y - pad) / (h - 2 * pad))); draw(); }
    });
    canvas.addEventListener("pointerup", (e) => {
      if (!down) return; const d = down; down = null;
      if (d.moved) { o.change && o.change(); return; }
      const [x, y] = pos(e);
      if (d.i >= 0) { o.vClick && o.vClick(d.i); return; }
      const k = hitE(x, y); if (k >= 0 && o.eClick) o.eClick(k);
    });
    return { draw, P: (i) => P(i), o };
  }
  /* 두 선분이 끝점이 아닌 곳에서 만나는지 */
  function crossings(V, E) {
    const cr = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    let n = 0; const pairs = [];
    for (let i = 0; i < E.length; i++) for (let j = i + 1; j < E.length; j++) {
      const [a, b] = E[i], [c, d] = E[j]; if (a === c || a === d || b === c || b === d) continue;
      const A = V[a], B = V[b], Cc = V[c], D = V[d];
      if (cr(A, B, Cc) * cr(A, B, D) < 0 && cr(Cc, D, A) * cr(Cc, D, B) < 0) { n++; pairs.push([i, j]); }
    }
    return { n, pairs };
  }
  /* 교차 없는 직선 그림의 면 수(바깥 면 포함) — 연결 그래프 가정, 각도 순서로 면을 따라 돎 */
  function faces(V, E) {
    const adj = V.map(() => []);
    E.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
    adj.forEach((l, u) => l.sort((p, q) => Math.atan2(V[p].y - V[u].y, V[p].x - V[u].x) - Math.atan2(V[q].y - V[u].y, V[q].x - V[u].x)));
    const seen = new Set(); let count = 0;
    for (const [a, b] of E) for (const [u0, v0] of [[a, b], [b, a]]) {
      if (seen.has(`${u0},${v0}`)) continue; count++;
      let u = u0, v = v0, guard = 0;
      while (!seen.has(`${u},${v}`) && guard++ < 1000) { seen.add(`${u},${v}`); const l = adj[v], i = l.indexOf(u), nx = l[(i - 1 + l.length) % l.length]; u = v; v = nx; }
    }
    return count;
  }
  const degrees = (n, E) => { const d = Array(n).fill(0); E.forEach(([a, b]) => { d[a]++; d[b]++; }); return d; };
  function components(n, E) { const p = [...Array(n).keys()], find = (x) => (p[x] === x ? x : (p[x] = find(p[x]))); E.forEach(([a, b]) => (p[find(a)] = find(b))); return new Set([...Array(n).keys()].map(find)).size; }
  return { board, crossings, faces, degrees, components };
})();
