/* 카드: 위도와 경도만으로 두 도시 사이 거리를 구할 수 있을까? — 구면 코사인법칙으로 대원 거리 (좌표는 대략값) */
(() => {
  const root = document.getElementById("card-adgeo-city-distance");
  if (!root) return;
  const { C } = NM;
  const S = NMSpace3, G = NMSphere;
  const $ = (s) => root.querySelector(s);
  const R = 6371;
  const CITY = [["서울", 37.57, 126.98], ["부산", 35.18, 129.08], ["도쿄", 35.68, 139.69], ["베이징", 39.9, 116.41], ["싱가포르", 1.35, 103.82], ["시드니", -33.87, 151.21], ["파리", 48.86, 2.35], ["런던", 51.51, -0.13], ["카이로", 30.04, 31.24], ["뉴욕", 40.71, -74.01], ["로스앤젤레스", 34.05, -118.24], ["상파울루", -23.55, -46.63]];
  const p1 = $(".p1"), p2 = $(".p2");
  CITY.forEach(([n], i) => { p1.add(new Option(n, i)); p2.add(new Option(n, i)); });
  p1.value = 0; p2.value = 6;
  let shown = false;
  const v = S.view($("canvas"), () => draw(), { center: [0, 0, 0], span: 2.6, yaw: -2.6, pitch: 0.6 });
  const pos = (i) => G.xyz(CITY[i][1], CITY[i][2]);
  function draw() {
    const { ctx, size } = v; if (!size.w) return;
    ctx.clearRect(0, 0, size.w, size.h);
    G.globe(v, 1, true);
    const X = pos(+p1.value), Y = pos(+p2.value), P = [0, 0, 1];
    if (shown) { G.curve(v, G.slerp(P, X, 60), "rgba(63,111,163,.8)", 1.8); G.curve(v, G.slerp(P, Y, 60), "rgba(63,111,163,.8)", 1.8); }
    G.curve(v, G.slerp(X, Y, 100), "#7b5ea7", 3);
    [[X, CITY[+p1.value][0]], [Y, CITY[+p2.value][0]], [P, "P(북극)"]].forEach(([p, nm]) => { const f = G.front(v, p); v.dot(p, f ? C.ink : "rgba(141,141,146,.6)", 4.5); if (f) v.label(p, nm, C.ink, 6, -7); });
  }
  function update() {
    const a = CITY[+p1.value], b = CITY[+p2.value], calc = $(".calc");
    if (!shown) { calc.textContent = "거리를 짐작해 적은 뒤 \"계산해 보기\"를 누르세요."; draw(); return; }
    if (a === b) { calc.textContent = "서로 다른 두 도시를 고르세요."; draw(); return; }
    const f1 = G.rad(a[1]), f2 = G.rad(b[1]);
    let dl = b[2] - a[2]; if (dl > 180) dl -= 360; if (dl < -180) dl += 360;
    const cd = Math.sin(f1) * Math.sin(f2) + Math.cos(f1) * Math.cos(f2) * Math.cos(G.rad(dl)), d = Math.acos(Math.max(-1, Math.min(1, cd))), km = R * d;
    /* 위도·경도를 그대로 평면 좌표로 본 거리(1° = 111.2 km) */
    const flat = Math.hypot(a[1] - b[1], dl) * (Math.PI * R / 180);
    const g = parseFloat($(".guess").value);
    const gs = Number.isFinite(g) && g > 0 ? ` · 짐작 ${g.toLocaleString()} km는 ${Math.abs(g - km) / km < 0.1 ? "10% 안으로 잘 맞혔습니다" : `${g > km ? "더 길게" : "더 짧게"} 짐작했습니다(차이 ${Math.round(Math.abs(g - km)).toLocaleString()} km)`}` : "";
    calc.innerHTML = `\\(\\varphi_1 = ${a[1]}°,\\ \\varphi_2 = ${b[1]}°,\\ \\Delta\\lambda = ${Math.abs(dl).toFixed(2)}°\\)<br>` +
      `\\(\\cos d = \\sin\\varphi_1\\sin\\varphi_2 + \\cos\\varphi_1\\cos\\varphi_2\\cos\\Delta\\lambda = ${cd.toFixed(5)}\\)<br>` +
      `\\(d = ${G.deg(d).toFixed(2)}° = ${d.toFixed(4)}\\) rad, 거리 \\(= 6371 \\times ${d.toFixed(4)} \\approx\\) ${Math.round(km).toLocaleString()} km<br>` +
      `<span class="mono">위도·경도를 평면 좌표로 본 거리 ${Math.round(flat).toLocaleString()} km (대원 거리보다 ${S.n(((flat - km) / km) * 100, 1)}%)${gs}</span>`;
    if (window.NMMath) NMMath.render(calc);
    draw();
  }
  [p1, p2].forEach((el) => el.addEventListener("change", () => { shown = false; update(); }));
  $(".go-calc").addEventListener("click", () => { shown = true; update(); });
  update();
})();
