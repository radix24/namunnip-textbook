/* 카드: 포물선, 타원, 쌍곡선을 하나의 규칙으로 그릴 수 있을까? — PF = e·PH의 자취 (초점 원점, 준선 x = −2) */
(() => {
  const root = document.getElementById("card-pmath-eccentricity");
  if (!root) return;
  const { C, F, fit } = NM;
  const { n, label, dot, seg, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const se = $(".se"), st = $(".st"), D = 2;
  const { ctx, size } = fit($("canvas"), () => draw());
  const rOf = (e, t) => e * D / (1 - e * Math.cos(t));

  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const e = +se.value, t = +st.value * Math.PI / 180;
    const s = Math.min(w / 16, h / 10), ox = w * 0.4, oy = h / 2;
    const P = (x, y) => [ox + x * s, oy - y * s];
    seg(ctx, 0, oy, w, oy, C.rule, 1); seg(ctx, ox, 0, ox, h, C.rule, 1);
    seg(ctx, ...P(-D, -20), ...P(-D, 20), C.ink2, 2);
    label(ctx, "준선 l", P(-D, 0)[0] - 6, 14, C.ink2, "right", `600 11.5px ${F.sans}`);
    // 곡선: 각을 잘게 나눠 r이 튀는 곳(분모 0 근처)에서 끊는다
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
    ctx.strokeStyle = C.forest; ctx.lineWidth = 2.6; ctx.beginPath();
    let pen = false, prev = 0;
    for (let i = 0; i <= 1440; i++) {
      const th = 2 * Math.PI * i / 1440, r = rOf(e, th);
      if (!Number.isFinite(r) || Math.abs(r) > 60 || (pen && Math.sign(r) !== Math.sign(prev))) { pen = false; prev = r; continue; }
      const [x, y] = P(r * Math.cos(th), r * Math.sin(th));
      pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = true; prev = r;
    }
    ctx.stroke(); ctx.restore();
    dot(ctx, ox, oy, C.warn, 5); label(ctx, "F", ox + 8, oy + 12, C.warn, "left", `italic 700 13px ${F.serif}`);
    const r = rOf(e, t);
    if (Number.isFinite(r) && Math.abs(r) < 60) {
      const px = r * Math.cos(t), py = r * Math.sin(t), [X, Y] = P(px, py);
      seg(ctx, ox, oy, X, Y, C.warn, 2); seg(ctx, X, Y, ...P(-D, py), BLUE, 2, [5, 4]);
      dot(ctx, X, Y, C.ink, 5.5); dot(ctx, ...P(-D, py), BLUE, 4);
      label(ctx, "P", X + 9, Y - 9, C.ink, "left", `italic 700 13px ${F.serif}`);
      label(ctx, "H", P(-D, py)[0] - 9, P(-D, py)[1] - 9, BLUE, "right", `italic 700 12px ${F.serif}`);
    }
  }
  function update() {
    const e = +se.value, t = +st.value * Math.PI / 180, r = rOf(e, t);
    $(".e-out").textContent = n(e, 2); $(".t-out").textContent = `${st.value}°`;
    const ok = Number.isFinite(r) && Math.abs(r) < 1e4;
    const px = ok ? r * Math.cos(t) : NaN, py = ok ? r * Math.sin(t) : NaN;
    const pf = Math.hypot(px, py), ph = Math.abs(px + D);
    $(".n-pf").textContent = ok ? n(pf, 3) : "무한히 멂"; $(".n-ph").textContent = ok ? n(ph, 3) : "—"; $(".n-r").textContent = ok ? n(pf / ph, 3) : "—";
    $(".type").textContent = Math.abs(e - 1) < 1e-9 ? "포물선 (e = 1)" : e < 1 ? "타원 (e < 1)" : "쌍곡선 (e > 1)";
    draw();
  }
  [se, st].forEach((el) => el.addEventListener("input", update));
  update();
})();
