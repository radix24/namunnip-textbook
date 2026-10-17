/* 카드: 내 장바구니로 물가지수를 만들면 얼마가 나올까? — 라스파이레스 지수 (모의 가격) */
(() => {
  const root = document.getElementById("card-econ-cpi-basket");
  if (!root) return;
  const { C, F, fit } = NM;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  /* [품목, 단위, 기준 연도 가격, 올해 가격] (원, 모의 값) */
  const IT = [["쌀(10 kg)", 32000, 36800], ["라면(1개)", 900, 1050], ["버스 요금(1회)", 1400, 1500], ["휴대폰 요금(1달)", 50000, 50500], ["영화표(1장)", 13000, 15000], ["월세(1달)", 450000, 486000]];
  const PRE = [[1, 10, 20, 1, 2, 1], [0, 15, 44, 1, 3, 0], [2, 40, 30, 1, 1, 1]];
  const rows = $(".rows");
  IT.forEach(([nm, p0, p1], i) => {
    rows.insertAdjacentHTML("beforeend", `<tr><td>${nm}</td><td class="mono">${E.n(p0)}</td><td class="mono">${E.n(p1)}</td><td class="mono">${E.pct(p1 / p0 - 1)}</td><td><input type="number" min="0" max="99" step="1" value="1" data-i="${i}" aria-label="${nm} 수량"></td></tr>`);
  });
  const ins = [...root.querySelectorAll("input[data-i]")];
  const { ctx, size } = fit($("canvas"), () => draw());
  const q = () => ins.map((el) => Math.max(0, +el.value || 0));
  const calc = () => { const Q = q(), s0 = IT.reduce((s, it, i) => s + it[1] * Q[i], 0), s1 = IT.reduce((s, it, i) => s + it[2] * Q[i], 0); return { Q, s0, s1, I: s0 ? (s1 / s0) * 100 : NaN, contrib: IT.map((it, i) => (s0 ? ((it[2] - it[1]) * Q[i]) / s0 * 100 : 0)), share: IT.map((it, i) => (s0 ? (it[1] * Q[i]) / s0 : 0)) }; };
  const COL = ["#3f6fa3", "#e0a02a", "#3b7c2a", "#7b5ea7", "#b5532f", "#8d8d92"];
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const r = calc(), L = 10, R = 10, top = 26, bh = 26, max = Math.max(12, Math.ceil((r.I - 100 || 0) + 2));
    const X = (v) => L + (v / max) * (w - L - R);
    ctx.font = `11px ${F.mono}`; ctx.fillStyle = C.ink3; ctx.textAlign = "center";
    for (let v = 0; v <= max; v += max > 20 ? 5 : 2) { ctx.strokeStyle = C.rule; ctx.beginPath(); ctx.moveTo(X(v), top - 4); ctx.lineTo(X(v), top + bh + 4); ctx.stroke(); ctx.fillText(`+${v}`, X(v), top + bh + 18); }
    let x = 0;
    r.contrib.forEach((c, i) => { if (c <= 0) return; ctx.fillStyle = COL[i]; ctx.fillRect(X(x), top, X(x + c) - X(x), bh); x += c; });
    ctx.fillStyle = C.ink; ctx.textAlign = "left"; ctx.font = `600 11px ${F.sans}`; ctx.fillText("지수 상승분(100 위로 몇 포인트)을 품목별로 나눈 막대", L, 14);
    let lx = L, ly = top + bh + 34; ctx.font = `11px ${F.sans}`;
    IT.forEach(([nm], i) => { const t = `${nm.replace(/\(.*\)/, "")} ${E.n(r.contrib[i], 2)}`; const tw = ctx.measureText(t).width + 22; if (lx + tw > w) { lx = L; ly += 16; } ctx.fillStyle = COL[i]; ctx.fillRect(lx, ly - 9, 10, 10); ctx.fillStyle = C.ink2; ctx.fillText(t, lx + 14, ly); lx += tw; });
  }
  function update() {
    const r = calc();
    $(".say").textContent = r.s0 ? `기준 연도 장바구니 ${E.n(r.s0)}원 → 올해 ${E.n(r.s1)}원 · 물가지수 ${E.n(r.I, 1)} (상승률 ${E.n(r.I - 100, 1)}%) · 변화율 단순 평균은 ${E.n((IT.reduce((s, it) => s + it[2] / it[1] - 1, 0) / IT.length) * 100, 1)}%` : "수량을 하나 이상 넣으세요.";
    draw();
  }
  ins.forEach((el) => el.addEventListener("input", update));
  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => { PRE[+b.dataset.p].forEach((v, i) => (ins[i].value = v)); root.querySelectorAll("[data-p]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  root.querySelector("[data-p='0']").click();
})();
