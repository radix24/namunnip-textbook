/* 카드: 1부터 1000까지의 수를 몇 번 만에 맞힐 수 있을까? — 업다운 게임, 이진 탐색 자동 풀이 */
(() => {
  const root = document.getElementById("card-dmath-updown");
  if (!root) return;
  const { fit } = NM;
  const $ = (s) => root.querySelector(s);
  let N, secret, lo, hi, tries, log, pred = null, over;
  const { ctx, size } = fit($("canvas"), () => draw());
  const worst = (n) => Math.ceil(Math.log2(n + 1));
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.fillStyle = "rgba(141,141,146,.25)"; ctx.clearRect(0, 0, w, h); ctx.fillRect(0, h * 0.25, w, h * 0.5);
    const X = (v) => ((v - 1) / Math.max(1, N - 1)) * w;
    ctx.fillStyle = "#3f6fa3"; ctx.fillRect(X(lo), h * 0.2, Math.max(3, X(hi) - X(lo)), h * 0.6);
    if (over) { ctx.fillStyle = "#d4493a"; ctx.fillRect(X(secret) - 2, 0, 4, h); }
  }
  function say() {
    $(".log").textContent = `남은 후보 ${lo} ~ ${hi} (${hi - lo + 1}개) · 시도 ${tries}번` + (log.length ? ` · ${log.slice(-6).join(" ")}` : "");
    draw();
  }
  function finish(by) {
    over = true; const wst = worst(N);
    $(".verdict").textContent = `${by}${tries}번 만에 맞혔습니다. 정답 ${secret}. 최악의 경우 필요한 횟수는 ⌈log₂(${N} + 1)⌉ = ${wst}번` + (pred ? ` · 예측 ${pred}번: ${+pred === 10 && N === 1000 ? "정확합니다" : `범위 1~${N}에서는 ${wst}번`}` : "");
    $(".verdict").className = "verdict good"; say();
  }
  function ask(g) {
    if (over) return; g = Math.floor(g); if (!(g >= 1 && g <= N)) { $(".log").textContent = `1부터 ${N} 사이의 수를 넣으세요.`; return; }
    tries++;
    if (g === secret) { log.push(`${g} 정답`); finish(""); return; }
    if (g < secret) { log.push(`${g} 업`); lo = Math.max(lo, g + 1); } else { log.push(`${g} 다운`); hi = Math.min(hi, g - 1); }
    say();
  }
  function load() { N = +$(".pick").value; secret = 1 + Math.floor(Math.random() * N); lo = 1; hi = N; tries = 0; log = []; over = false; $(".guess").max = N; $(".verdict").textContent = ""; $(".verdict").className = "verdict"; say(); }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => { pred = b.dataset.g; root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); }));
  $(".go-guess").addEventListener("click", () => ask(+$(".guess").value));
  $(".guess").addEventListener("keydown", (e) => { if (e.key === "Enter") ask(+$(".guess").value); });
  $(".go-new").addEventListener("click", load);
  $(".go-auto").addEventListener("click", () => { if (over) load(); let k = 0; while (!over && k++ < 40) ask(Math.floor((lo + hi) / 2)); if (!over) return; $(".verdict").textContent = "이진 탐색이 " + $(".verdict").textContent; });
  $(".pick").addEventListener("change", load);
  load();
})();
