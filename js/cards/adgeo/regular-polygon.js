/* 카드: 원 안에 정육각형, 정사각형, 정팔각형을 작도할 수 있을까? — 원 위에 꼭짓점 만들기 */
(() => {
  const root = document.getElementById("card-adgeo-regular-polygon");
  if (!root) return;
  const E = NMEuclid;
  const { C } = NM;
  const $ = (s) => root.querySelector(s);
  const PAR = { 6: 4, 4: 4, 8: 10, 3: 3 };
  let n = 6, solved = false, verts = [];
  const GIVEN = [{ x: 0, y: 0, label: "O" }, { x: 2.6, y: 0, label: "A" }];
  /* 원 위에 있고 A에서 360/n의 배수만큼 돈 점들 */
  function found() {
    const [O, A] = b.st.P, R = E.dist(O, A), a0 = Math.atan2(A.y - O.y, A.x - O.x), got = new Map();
    b.st.P.forEach((p) => { if (!p.ok || Math.abs(E.dist(O, p) - R) > 1e-6) return; let t = ((Math.atan2(p.y - O.y, p.x - O.x) - a0) / (2 * Math.PI)) * n; t = ((t % n) + n) % n; const k = Math.round(t); if (Math.abs(t - k) < 1e-6) got.set(k % n, p); });
    return got;
  }
  const b = E.board($("canvas"), {
    given: GIVEN, interactive: true, lockGiven: true, world: { w: 8, h: 6.4 },
    extra: (ctx, toScr) => { if (!verts.length) return; ctx.strokeStyle = C.forest; ctx.lineWidth = 3; ctx.fillStyle = "rgba(116,171,102,.18)"; ctx.beginPath(); verts.forEach((p, i) => (i ? ctx.lineTo(...toScr(p)) : ctx.moveTo(...toScr(p)))); ctx.closePath(); ctx.fill(); ctx.stroke(); },
    onChange: () => check(),
  });
  function check() {
    const got = found(), have = got.size;
    if (!solved && have === n) { solved = true; verts = [...Array(n).keys()].map((k) => got.get(k)); b.draw(); }
    const v = $(".verdict"), used = b.st.moves;
    if (solved) { v.textContent = `성공! 정${n}각형의 꼭짓점 ${n}개를 ${used}수로 작도했습니다` + (used <= PAR[n] ? " (기준 이내)." : ` (기준 ${PAR[n]}수).`); v.className = "verdict good"; }
    else { v.textContent = `원 위에 찾은 꼭짓점 ${have} / ${n} · 쓴 수 ${used}`; v.className = "verdict"; }
  }
  function load() { n = +$(".pick").value; solved = false; verts = []; b.setGiven(GIVEN.map((p) => ({ ...p }))); b.add("circle", 0, 1); b.st.moves = 0; check(); }
  root.querySelectorAll("[data-t]").forEach((x) => x.addEventListener("click", () => { b.setTool(x.dataset.t); root.querySelectorAll("[data-t]").forEach((y) => y.setAttribute("aria-pressed", String(y === x))); }));
  $(".go-undo").addEventListener("click", () => { if (b.st.O.length > 1) { b.undo(); solved = false; verts = []; check(); b.draw(); } });
  $(".go-reset").addEventListener("click", load);
  $(".pick").addEventListener("change", load);
  load();
})();
