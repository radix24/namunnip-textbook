/* 전문 수학 카드 공용 도구 window.NMPm — 캔버스 끌기, 화살표, 바탕을 깐 글자, 각·수 표기.
   좌표판·곡선은 미적분Ⅰ의 NMCalc(js/cards/calc1/plot.js)를 함께 쓴다. */
window.NMPm = (() => {
  "use strict";
  const { C, F } = NM;
  const M = "−";

  /* 수 표기: 소수 d자리에서 끝의 0을 지우고, 음수는 − */
  const n = (v, d = 3) => {
    if (v === Infinity) return "∞";
    if (v === -Infinity) return M + "∞";
    if (!Number.isFinite(v)) return "—";
    const s = String(+v.toFixed(d));
    return s === "-0" ? "0" : s.replace("-", M);
  };
  const deg = (r) => r * 180 / Math.PI, rad = (d) => d * Math.PI / 180;
  /* 각도(도) 표기 */
  const dg = (r, d = 0) => `${n(deg(r), d)}°`;
  /* π의 배수 눈금 글자: 0, π/2, π, 3π/2, −π … (k = 반 π 단위의 개수) */
  function piLab(v) {
    const k = Math.round(v / (Math.PI / 2));
    if (Math.abs(v - k * Math.PI / 2) > 1e-6) return n(v, 2);
    if (k === 0) return "0";
    const s = k < 0 ? M : "", a = Math.abs(k);
    if (a % 2 === 0) return s + (a / 2 === 1 ? "" : a / 2) + "π";
    return s + (a === 1 ? "" : a) + "π/2";
  }

  /* 캔버스 끌기. pick(px, py) → 잡은 대상(없으면 null), move(대상, px, py), end(대상)
     touch: 손가락으로 끌 때 브라우저에 맡길 동작. 가로로만 끄는 그림은 "pan-y"(세로 스크롤 허용),
     위아래로도 끄는 그림은 "none" */
  function drag(canvas, pick, move, end, touch = "pan-y") {
    let on = null;
    const pos = (e) => { const b = canvas.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    canvas.style.touchAction = touch;
    canvas.addEventListener("pointerdown", (e) => {
      const p = pos(e); on = pick(p[0], p[1]);
      if (on == null) return;
      canvas.setPointerCapture(e.pointerId); canvas.style.cursor = "grabbing"; e.preventDefault();
      move(on, p[0], p[1]);
    });
    canvas.addEventListener("pointermove", (e) => {
      const p = pos(e);
      if (on != null) { e.preventDefault(); move(on, p[0], p[1]); }
      else canvas.style.cursor = pick(p[0], p[1]) != null ? "grab" : "";
    });
    const up = () => { if (on != null && end) end(on); on = null; canvas.style.cursor = ""; };
    canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
  }

  function arrow(ctx, x1, y1, x2, y2, col, lw = 2, head = 8) {
    const t = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1);
    ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw;
    if (L > 1) {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(t) * head * 0.6, y2 - Math.sin(t) * head * 0.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - head * Math.cos(t - 0.4), y2 - head * Math.sin(t - 0.4));
      ctx.lineTo(x2 - head * Math.cos(t + 0.4), y2 - head * Math.sin(t + 0.4)); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  /* 글자 둘레를 카드 색으로 둘러 선 위에서도 읽히게 */
  function label(ctx, text, x, y, col = C.ink, align = "left", font) {
    ctx.save(); ctx.font = font || `600 12px ${F.sans}`; ctx.textAlign = align; ctx.textBaseline = "middle";
    ctx.lineWidth = 3.5; ctx.strokeStyle = C.card; ctx.lineJoin = "round";
    ctx.strokeText(text, x, y); ctx.fillStyle = col; ctx.fillText(text, x, y); ctx.restore();
  }

  const dot = (ctx, x, y, col, r = 4.5, open) => {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7);
    if (open) { ctx.fillStyle = C.card; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = col; ctx.stroke(); }
    else { ctx.fillStyle = col; ctx.fill(); }
    ctx.restore();
  };
  const seg = (ctx, x1, y1, x2, y2, col, lw = 1.5, dash) => {
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
  };
  /* 각의 호: 중심 (cx, cy), 반지름 r, 수학 각 a0 → a1 (화면은 y가 아래로) */
  const arc = (ctx, cx, cy, r, a0, a1, col, lw = 1.5) => {
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
    ctx.arc(cx, cy, r, -a0, -a1, a1 > a0); ctx.stroke(); ctx.restore();
  };

  /* 오류 찾기: <ol class="spot"><li>…<span class="why">…</span></li><li data-bad>…</li></ol>
     처음 틀린 줄(data-bad)을 누르면 맞힘. 어느 줄을 누르든 그 줄의 .why를 보여 준다 */
  function spot(ol, onDone) {
    const lis = [...ol.querySelectorAll(":scope > li")];
    lis.forEach((li) => { li.tabIndex = 0; li.setAttribute("role", "button"); });
    const pick = (li) => {
      if (ol.dataset.done) return;
      lis.forEach((x) => x.classList.remove("sp-show"));
      li.classList.add("sp-show", li.hasAttribute("data-bad") ? "sp-hit" : "sp-miss");
      if (li.hasAttribute("data-bad")) { ol.dataset.done = "1"; onDone && onDone(); }
    };
    ol.addEventListener("click", (e) => { const li = e.target.closest("li"); if (li && li.parentElement === ol) pick(li); });
    ol.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.parentElement === ol) { e.preventDefault(); pick(e.target); } });
  }

  const BLUE = "#3f6fa3", PURPLE = "#7b5ea7";
  return { n, M, deg, rad, dg, piLab, drag, arrow, label, dot, seg, arc, spot, BLUE, PURPLE };
})();
