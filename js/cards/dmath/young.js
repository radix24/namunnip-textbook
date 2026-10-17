/* 카드: 점 그림을 뒤집으면 어떤 분할이 나올까? — 자연수 분할 목록, 점 그림과 켤레 분할 */
(() => {
  const root = document.getElementById("card-dmath-young");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), kIn = $(".k");
  let parts = [], idx = 0;
  const { ctx, size } = fit($("canvas"), () => draw());
  function all(n, max = n) { if (n === 0) return [[]]; const out = []; for (let a = Math.min(n, max); a >= 1; a--) all(n - a, a).forEach((r) => out.push([a, ...r])); return out; }
  const conj = (p) => [...Array(p[0] || 0)].map((_, j) => p.filter((x) => x > j).length);
  function dots(p, ox, oy, cell, col) {
    p.forEach((len, i) => { for (let j = 0; j < len; j++) { ctx.beginPath(); ctx.arc(ox + j * cell + cell / 2, oy + i * cell + cell / 2, cell * 0.32, 0, 7); ctx.fillStyle = col; ctx.fill(); } });
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const p = parts[idx], q = conj(p), n = +nIn.value, cell = Math.min((w / 2 - 30) / n, (h - 40) / n, 26);
    dots(p, 16, 26, cell, "#3f6fa3"); dots(q, w / 2 + 16, 26, cell, C.warn);
    ctx.fillStyle = C.ink2; ctx.font = `600 12px ${F.sans}`; ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillText(p.join("+"), 16, 6); ctx.fillText(`켤레 ${q.join("+")}`, w / 2 + 16, 6, w / 2 - 20);
    ctx.strokeStyle = C.rule; ctx.beginPath(); ctx.moveTo(w / 2, 8); ctx.lineTo(w / 2, h - 8); ctx.stroke();
  }
  function update() {
    const n = +nIn.value, k = Math.min(+kIn.value, n); kIn.max = n; kIn.value = k;
    $(".n-out").textContent = n; $(".k-out").textContent = k;
    const p = parts[idx], q = conj(p), self = p.join() === q.join();
    $(".cur").textContent = `p(${n}) = ${parts.length} · ${idx + 1}번째 분할 ${p.join(" + ")} (부분 ${p.length}개, 가장 큰 부분 ${p[0]})` + (self ? " · 자기 켤레" : "");
    const a = parts.filter((x) => x.length <= k).length, b = parts.filter((x) => x[0] <= k).length, ex = parts.filter((x) => x.length === k).length;
    $(".cmp").textContent = `${k}개 이하로 나눈 분할 ${a}개 = 가장 큰 부분이 ${k} 이하인 분할 ${b}개 · 정확히 ${k}개: p(${n}, ${k}) = ${ex}`;
    draw();
  }
  nIn.addEventListener("input", () => { parts = all(+nIn.value); idx = 0; update(); });
  kIn.addEventListener("input", update);
  $(".go-prev").addEventListener("click", () => { idx = (idx - 1 + parts.length) % parts.length; update(); });
  $(".go-next").addEventListener("click", () => { idx = (idx + 1) % parts.length; update(); });
  parts = all(8); update();
})();
