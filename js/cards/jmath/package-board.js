/* 카드: 상자 하나를 만들려면 판지가 얼마나 필요하고, 얼마나 버려질까? — 직육면체 전개도, 겉넓이, 판지 손실 */
(() => {
  const root = document.getElementById("card-jmath-package-board");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const ins = ["l", "w", "h", "g"].map((k) => $(`.${k}`));
  const v = () => ins.map((x) => +x.value);
  const { ctx, size } = fit($("canvas"), () => draw());
  /* 전개도(단위 cm, 왼쪽 위가 원점): 세로로 뚜껑(w) - 뒷면(h) - 바닥(w) - 앞면(h), 바닥 양옆에 옆면(h).
     날개: 앞면·뒷면의 양옆(g × h), 뚜껑의 앞쪽 끝(g × l) */
  function parts() {
    const [l, w, h, g] = v(), x0 = h + g, y0 = 0;
    const R = [
      ["뚜껑", x0, y0, l, w], ["뒷면", x0, y0 + w, l, h], ["바닥", x0, y0 + w + h, l, w], ["앞면", x0, y0 + 2 * w + h, l, h],
      ["옆면", x0 - h, y0 + w + h, h, w], ["옆면", x0 + l, y0 + w + h, h, w],
    ];
    const G = g ? [[x0 - g, y0 + w, g, h], [x0 + l, y0 + w, g, h], [x0 - g, y0 + 2 * w + h, g, h], [x0 + l, y0 + 2 * w + h, g, h], [x0, y0 - g, l, g]] : [];
    return { R, G };
  }
  function draw() {
    const { w: cw, h: ch } = size; if (!cw) return;
    ctx.clearRect(0, 0, cw, ch);
    const p = parts();
    const all = [...p.R.map((r) => r.slice(1)), ...p.G], x1 = Math.min(...all.map((r) => r[0])), y1 = Math.min(...all.map((r) => r[1])), x2 = Math.max(...all.map((r) => r[0] + r[2])), y2 = Math.max(...all.map((r) => r[1] + r[3]));
    const S = Math.min((cw - 20) / (x2 - x1), (ch - 30) / (y2 - y1)), X = (x) => 10 + (x - x1) * S, Y = (y) => 20 + (y - y1) * S;
    ctx.fillStyle = "rgba(181,83,47,.12)"; ctx.fillRect(X(x1), Y(y1), (x2 - x1) * S, (y2 - y1) * S);
    ctx.strokeStyle = C.warn; ctx.setLineDash([5, 4]); ctx.strokeRect(X(x1), Y(y1), (x2 - x1) * S, (y2 - y1) * S); ctx.setLineDash([]);
    p.G.forEach(([x, y, ww, hh]) => { ctx.fillStyle = "rgba(224,160,42,.55)"; ctx.fillRect(X(x), Y(y), ww * S, hh * S); });
    p.R.forEach(([nm, x, y, ww, hh]) => { ctx.fillStyle = "rgba(63,111,163,.28)"; ctx.fillRect(X(x), Y(y), ww * S, hh * S); ctx.strokeStyle = C.ink2; ctx.lineWidth = 1; ctx.strokeRect(X(x), Y(y), ww * S, hh * S); ctx.fillStyle = C.ink; ctx.font = `11px ${F.sans}`; ctx.textAlign = "center"; if (ww * S > 30 && hh * S > 14) ctx.fillText(nm, X(x + ww / 2), Y(y + hh / 2) + 4); });
    ctx.fillStyle = C.ink2; ctx.font = `11px ${F.mono}`; ctx.textAlign = "left"; ctx.fillText(`판지 ${(x2 - x1).toFixed(1)} × ${(y2 - y1).toFixed(1)} cm`, X(x1), 13);
    root._box = { sheet: (x2 - x1) * (y2 - y1) };
  }
  function update() {
    const [l, w, h, g] = v();
    ["l", "w", "h", "g"].forEach((k, i) => ($(`.${k}-out`).textContent = v()[i]));
    draw();
    const surf = 2 * (l * w + l * h + w * h), glue = g ? 4 * g * h + g * l : 0, sheet = root._box ? root._box.sheet : 0, net = surf + glue;
    $(".say").textContent = `겉넓이 2(${l}·${w} + ${l}·${h} + ${w}·${h}) = ${surf} cm² · 날개 ${glue} cm² · 전개도 ${net} cm² · 판지 ${sheet.toFixed(0)} cm² · 버려지는 부분 ${(sheet - net).toFixed(0)} cm² (${(((sheet - net) / sheet) * 100).toFixed(1)}%)`;
  }
  ins.forEach((x) => x.addEventListener("input", update));
  update();
})();
