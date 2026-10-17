/* 카드: 일곱 다리를 한 번씩만 건너 산책할 수 있을까? — 모식 지도와 다중 그래프에서 산책하기 */
(() => {
  const root = document.getElementById("card-dmath-konigsberg");
  if (!root) return;
  const { C, F, fit } = NM;
  const G = NMGraph;
  const $ = (s) => root.querySelector(s);
  /* 땅: 0 북쪽 기슭, 1 섬, 2 남쪽 기슭, 3 동쪽 땅 */
  const V = [{ x: 0.35, y: 0.08, label: "북" }, { x: 0.3, y: 0.5, label: "섬" }, { x: 0.35, y: 0.92, label: "남" }, { x: 0.92, y: 0.5, label: "동" }];
  const BASE = [[0, 1], [0, 1], [1, 2], [1, 2], [0, 3], [1, 3], [2, 3]], EXTRA = [0, 3];
  let E = BASE.slice(), used = [], at = -1, showDeg = false, extra = false;
  const gb = G.board($(".gr"), {
    V, E,
    vStyle: (i) => ({ fill: i === at ? "#e0a02a" : C.card, r: 16, badge: showDeg ? G.degrees(4, E)[i] : null, badgeColor: G.degrees(4, E)[i] % 2 ? C.warn : C.forest }),
    eStyle: (k) => ({ color: used.includes(k) ? "#e0a02a" : C.ink3, width: used.includes(k) ? 4 : 2.4, label: used.includes(k) ? used.indexOf(k) + 1 : null }),
    vClick: (i) => { if (at < 0) { at = i; update(); } },
    eClick: (k) => {
      if (at < 0) { say("먼저 출발할 땅(점)을 누르세요."); return; }
      if (used.includes(k)) { say("이미 건넌 다리입니다."); return; }
      const [a, b] = E[k]; if (a !== at && b !== at) { say("지금 있는 땅에 닿은 다리만 건널 수 있습니다."); return; }
      used.push(k); at = a === at ? b : a; update();
    },
  });
  const mp = fit($(".map"), () => drawMap());
  function drawMap() {
    const { ctx, size: { w, h } } = mp; if (!w) return;
    ctx.fillStyle = "#cfe0c4"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#8fb8de"; // 강: 서쪽에서 갈라져 섬을 감싸고 동쪽 땅 서쪽에서 합류
    ctx.beginPath(); ctx.moveTo(0, h * 0.22); ctx.bezierCurveTo(w * 0.4, h * 0.2, w * 0.6, h * 0.22, w * 0.72, h * 0.4); ctx.lineTo(w * 0.78, h * 0.5); ctx.lineTo(w * 0.72, h * 0.6); ctx.bezierCurveTo(w * 0.6, h * 0.78, w * 0.4, h * 0.8, 0, h * 0.78); ctx.lineTo(0, h * 0.66); ctx.bezierCurveTo(w * 0.35, h * 0.66, w * 0.55, h * 0.62, w * 0.62, h * 0.5); ctx.bezierCurveTo(w * 0.55, h * 0.38, w * 0.35, h * 0.34, 0, h * 0.34); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(w * 0.72, h * 0.4); ctx.lineTo(w, h * 0.2); ctx.lineTo(w, h * 0.32); ctx.lineTo(w * 0.8, h * 0.47); ctx.lineTo(w * 0.8, h * 0.53); ctx.lineTo(w, h * 0.68); ctx.lineTo(w, h * 0.8); ctx.lineTo(w * 0.72, h * 0.6); ctx.closePath(); ctx.fill();
    const br = [[0.2, 0.22, 0.2, 0.36], [0.42, 0.22, 0.42, 0.36], [0.2, 0.64, 0.2, 0.78], [0.42, 0.64, 0.42, 0.78], [0.66, 0.2, 0.82, 0.33], [0.6, 0.5, 0.8, 0.5], [0.66, 0.8, 0.82, 0.67]];
    if (extra) br.push([0.88, 0.2, 0.94, 0.38]);
    ctx.strokeStyle = "#7a5a3a"; ctx.lineWidth = 7; ctx.lineCap = "round";
    br.forEach(([x1, y1, x2, y2]) => { ctx.beginPath(); ctx.moveTo(x1 * w, y1 * h); ctx.lineTo(x2 * w, y2 * h); ctx.stroke(); });
    ctx.fillStyle = "#232326"; ctx.font = `700 13px ${F.sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("북쪽 기슭", w * 0.3, h * 0.08); ctx.fillText("섬", w * 0.3, h * 0.5); ctx.fillText("남쪽 기슭", w * 0.3, h * 0.92); ctx.fillText("동쪽", w * 0.9, h * 0.5);
    ctx.font = `600 11px ${F.sans}`; ctx.fillText("모식도", w - 28, h - 10);
  }
  const say = (m) => { $(".say").textContent = m; gb.draw(); };
  function update() {
    const d = G.degrees(4, E), odd = d.filter((x) => x % 2).length;
    let m = at < 0 ? "출발할 땅을 누르세요." : `건넌 다리 ${used.length} / ${E.length}`;
    if (used.length === E.length) m += " · 모든 다리를 건넜습니다!";
    else if (at >= 0 && !E.some((e, k) => !used.includes(k) && (e[0] === at || e[1] === at))) m += " · 더 건널 다리가 없습니다";
    if (showDeg) m += ` · 다리 수: ${V.map((v, i) => `${v.label} ${d[i]}`).join(", ")} (홀수인 땅 ${odd}곳)`;
    say(m); drawMap();
  }
  $(".go-reset").addEventListener("click", () => { used = []; at = -1; update(); });
  $(".go-add").addEventListener("click", (e) => { extra = !extra; e.target.setAttribute("aria-pressed", String(extra)); E.length = 0; BASE.forEach((x) => E.push(x)); if (extra) E.push(EXTRA); used = []; at = -1; update(); });
  $(".go-deg").addEventListener("click", (e) => { showDeg = !showDeg; e.target.setAttribute("aria-pressed", String(showDeg)); update(); });
  update();
})();
