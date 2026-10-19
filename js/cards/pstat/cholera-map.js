/* 카드: 목록으로는 안 보이던 원인을 지도가 보여 줄까? — 사망자 점 지도와 가장 가까운 펌프 영역(모식 자료) */
(() => {
  const root = document.getElementById("card-pstat-cholera-map");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const r = NMStat.rng(1854), g = () => NMStat.gauss(r);
  /* 지도 좌표 0~100 × 0~75. 펌프 다섯 곳, A 주변에 사망자가 몰리게 만든 모식 자료 */
  const PUMP = [["A", 48, 38], ["B", 18, 15], ["C", 82, 20], ["D", 22, 62], ["E", 80, 60]];
  const STREET = ["가", "나", "다", "라", "마", "바", "사", "아"];
  const D = [];
  for (let i = 0; i < 230; i++) {
    const near = r() < 0.78, x = near ? 48 + g() * 9 : 6 + r() * 88, y = near ? 38 + g() * 8 : 5 + r() * 65;
    if (x > 2 && x < 98 && y > 2 && y < 73) D.push([x, y]);
  }
  const nearest = ([x, y]) => PUMP.reduce((b, p, i) => (Math.hypot(p[1] - x, p[2] - y) < Math.hypot(PUMP[b][1] - x, PUMP[b][2] - y) ? i : b), 0);
  let view = "list";
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const s = Math.min(w / 100, h / 75), X = (x) => x * s, Y = (y) => y * s;
    if (view === "near") {   // 가장 가까운 펌프 영역(보로노이) 칠하기
      const cols = ["rgba(181,83,47,.18)", "rgba(63,111,163,.12)", "rgba(116,171,102,.15)", "rgba(224,160,42,.15)", "rgba(141,141,146,.15)"];
      for (let x = 0; x < 100; x += 1) for (let y = 0; y < 75; y += 1) { ctx.fillStyle = cols[nearest([x + 0.5, y + 0.5])]; ctx.fillRect(X(x), Y(y), s + 0.5, s + 0.5); }
    }
    ctx.strokeStyle = "rgba(141,141,146,.5)"; ctx.lineWidth = 1;
    for (let k = 1; k < 8; k++) { ctx.beginPath(); ctx.moveTo(X(k * 12.5), 0); ctx.lineTo(X(k * 12.5), Y(75)); ctx.stroke(); }
    for (let k = 1; k < 6; k++) { ctx.beginPath(); ctx.moveTo(0, Y(k * 12.5)); ctx.lineTo(X(100), Y(k * 12.5)); ctx.stroke(); }
    if (view !== "list") { ctx.fillStyle = "#232326"; D.forEach(([x, y]) => { ctx.fillRect(X(x) - 1.5, Y(y) - 1.5, 3, 3); }); }
    PUMP.forEach(([n, x, y]) => { ctx.fillStyle = "#3f6fa3"; ctx.beginPath(); ctx.arc(X(x), Y(y), 6, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = `bold 9px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText(n, X(x), Y(y) + 3); });
    if (view === "list") { ctx.fillStyle = C.ink3; ctx.font = `12px ${F.sans}`; ctx.textAlign = "center"; ctx.fillText("목록만으로는 위치 관계가 보이지 않습니다", w / 2, h - 10); }
  }
  function show(v) {
    view = v;
    root.querySelectorAll("[data-v]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === v)));
    $(".list").hidden = v !== "list";
    if (v === "list") $(".list").textContent = D.slice(0, 40).map(([x, y], i) => `${String(i + 1).padStart(3)}. ${STREET[Math.floor(x / 12.5)]}길 ${Math.floor(y / 12.5) + 1}번지 ${Math.floor((x % 12.5) * 8) + 1}호`).join("\n") + `\n… 모두 ${D.length}명`;
    const cnt = PUMP.map(() => 0); D.forEach((p) => cnt[nearest(p)]++);
    const top = cnt.indexOf(Math.max(...cnt));
    $(".say").textContent = v === "near" ? `가장 가까운 펌프별 사망자: ${PUMP.map((p, i) => `${p[0]} ${cnt[i]}`).join(", ")} · 펌프 ${PUMP[top][0]}에 ${((100 * cnt[top]) / D.length).toFixed(0)}%` : v === "dots" ? `사망자 ${D.length}명을 지도에 찍었습니다. 어디에 몰려 있나요?` : `주소 목록(모식 자료) ${D.length}명`;
    draw();
  }
  root.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => show(b.dataset.v)));
  show("list");
})();
