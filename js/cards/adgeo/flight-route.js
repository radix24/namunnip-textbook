/* 카드: 서울에서 뉴욕 가는 비행기는 왜 북극 쪽으로 돌아갈까? — 대원 항로와 항정선 (도시 좌표는 대략값) */
(() => {
  const root = document.getElementById("card-adgeo-flight-route");
  if (!root) return;
  const { C, F, fit } = NM;
  const S = NMSpace3, G = NMSphere;
  const $ = (s) => root.querySelector(s);
  const R = 6371;
  const SEOUL = { name: "서울", lat: 37.57, lon: 126.98 };
  const DEST = [{ name: "뉴욕", lat: 40.71, lon: -74.01 }, { name: "런던", lat: 51.51, lon: -0.13 }, { name: "로스앤젤레스", lat: 34.05, lon: -118.24 }, { name: "시드니", lat: -33.87, lon: 151.21 }];
  let di = 0;
  const rad = G.rad, deg = G.deg;
  /* 항정선: 메르카토르 좌표에서 직선(경도 차는 짧은 쪽) */
  function rhumb(a, b, n = 120) {
    let dl = b.lon - a.lon; if (dl > 180) dl -= 360; if (dl < -180) dl += 360;
    const y = (lat) => Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2)), y1 = y(a.lat), y2 = y(b.lat);
    return [...Array(n + 1)].map((_, k) => { const t = k / n, yy = y1 + (y2 - y1) * t; return [deg(2 * Math.atan(Math.exp(yy)) - Math.PI / 2), a.lon + dl * t]; });
  }
  function rhumbLen(a, b) { let dl = rad(b.lon - a.lon); if (dl > Math.PI) dl -= 2 * Math.PI; if (dl < -Math.PI) dl += 2 * Math.PI; const p1 = rad(a.lat), p2 = rad(b.lat), dp = p2 - p1, dq = Math.log(Math.tan(Math.PI / 4 + p2 / 2) / Math.tan(Math.PI / 4 + p1 / 2)), q = Math.abs(dq) > 1e-12 ? dp / dq : Math.cos(p1); return R * Math.sqrt(dp * dp + q * q * dl * dl); }
  const v = S.view($(".g"), () => drawG(), { center: [0, 0, 0], span: 2.6, yaw: -2.6, pitch: 0.75 });
  const m = fit($(".m"), () => drawM());
  const gc = () => G.slerp(G.xyz(SEOUL.lat, SEOUL.lon), G.xyz(DEST[di].lat, DEST[di].lon), 120);
  function drawG() {
    const { ctx, size } = v; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    G.globe(v, 1, true);
    G.curve(v, rhumb(SEOUL, DEST[di]).map(([a, b]) => G.xyz(a, b)), "#e0a02a", 2.6);
    G.curve(v, gc(), "#7b5ea7", 3);
    [SEOUL, DEST[di]].forEach((c) => { const p = G.xyz(c.lat, c.lon); v.dot(p, G.front(v, p) ? C.ink : "rgba(141,141,146,.6)", 5); if (G.front(v, p)) v.label(p, c.name, C.ink, 6, -8); });
    v.dot([0, 0, 1], C.ink3, 3); v.label([0, 0, 1], "북극", C.ink2, 6, -6);
  }
  function drawM() {
    const { ctx, size: { w, h } } = m; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    /* 지도 가운데 경도 = 두 도시 경도의 (짧은 쪽) 중간 */
    let dl = DEST[di].lon - SEOUL.lon; if (dl > 180) dl -= 360; if (dl < -180) dl += 360;
    const lon0 = SEOUL.lon + dl / 2, X = (lon) => (((lon - lon0 + 540) % 360) / 360) * w, Y = (lat) => h / 2 - (lat / 180) * h;
    ctx.fillStyle = "rgba(143,184,222,.16)"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(141,141,146,.4)"; ctx.lineWidth = 1;
    for (let la = -60; la <= 60; la += 30) { ctx.beginPath(); ctx.moveTo(0, Y(la)); ctx.lineTo(w, Y(la)); ctx.stroke(); }
    for (let lo = -180; lo < 180; lo += 30) { ctx.beginPath(); ctx.moveTo(X(lo), 0); ctx.lineTo(X(lo), h); ctx.stroke(); }
    const line = (pts, col, lw) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); pts.forEach(([la, lo], i) => { const x = X(lo), y = Y(la); if (i && Math.abs(x - X(pts[i - 1][1])) > w / 2) ctx.moveTo(x, y); else (i ? ctx.lineTo : ctx.moveTo).call(ctx, x, y); }); ctx.stroke(); };
    line(rhumb(SEOUL, DEST[di]), "#e0a02a", 2.4);
    line(gc().map((p) => G.latlon(p)), "#7b5ea7", 2.8);
    ctx.fillStyle = C.ink; ctx.font = `600 11px ${F.sans}`;
    [SEOUL, DEST[di]].forEach((c) => { ctx.beginPath(); ctx.arc(X(c.lon), Y(c.lat), 4, 0, 7); ctx.fill(); ctx.fillText(c.name, X(c.lon) + 5, Y(c.lat) - 5); });
  }
  function update() {
    const D = DEST[di], ang = G.arc(G.xyz(SEOUL.lat, SEOUL.lon), G.xyz(D.lat, D.lon)), dg = R * ang, dr = rhumbLen(SEOUL, D), top = Math.max(...gc().map((p) => G.latlon(p)[0]));
    $(".say").textContent = `대원 항로(보라) ${Math.round(dg).toLocaleString()} km (중심각 ${deg(ang).toFixed(1)}°) · 항정선(주황) ${Math.round(dr).toLocaleString()} km · 차이 ${Math.round(dr - dg).toLocaleString()} km (${((dr / dg - 1) * 100).toFixed(1)}%) · 대원 항로의 가장 높은 위도 ${top.toFixed(1)}°`;
    drawG(); drawM();
  }
  $(".pick").addEventListener("change", () => { di = +$(".pick").value; update(); });
  update();
})();
