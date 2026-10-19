/* 카드: 검색 엔진은 어떤 페이지를 맨 위에 올릴까? — 가상 연결망 다섯 페이지의 페이지랭크(거듭제곱법·무작위 서퍼) */
(() => {
  const root = document.getElementById("card-adalg-pagerank");
  if (!root) return;
  const { C, F, fit } = NM;
  const L = NMLin;
  const { label, BLUE } = NMPm;
  const $ = (s) => root.querySelector(s);
  const NAME = "ABCDE", n = 5, d = 0.85;
  /* 링크: [보내는 쪽, 받는 쪽]. 가상의 연결망 */
  const NETS = [
    [[0, 1], [1, 2], [2, 0], [3, 2], [3, 4], [4, 2], [4, 0], [1, 3]],
    [[0, 1], [1, 2], [2, 0], [3, 2], [3, 4], [4, 2], [4, 0], [1, 3], [2, 4]],
  ];
  const POS = [...Array(n)].map((_, i) => [Math.cos(Math.PI / 2 + (2 * Math.PI * i) / n), Math.sin(Math.PI / 2 + (2 * Math.PI * i) / n)]);
  let links, G, x, iter, guess, rng = 1;
  const { ctx, size } = fit($("canvas"), () => draw());
  function build() {
    const M = [...Array(n)].map(() => Array(n).fill(0)), out = Array(n).fill(0);
    links.forEach(([a]) => out[a]++);
    links.forEach(([a, b]) => (M[b][a] += 1 / out[a]));
    G = M.map((r) => r.map((m) => d * m + (1 - d) / n));
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2 + 4, Rr = Math.min(w, h) * 0.36, P = (i) => [cx + Rr * POS[i][0], cy - Rr * POS[i][1]];
    const rad = (i) => 10 + 70 * Math.sqrt(x[i] / 1.2) * 0.6;
    links.forEach(([a, b]) => {
      const p = P(a), q = P(b), t = Math.atan2(q[1] - p[1], q[0] - p[0]), off = 5;
      const s = [p[0] + Math.cos(t) * rad(a) - Math.sin(t) * off, p[1] + Math.sin(t) * rad(a) + Math.cos(t) * off];
      const e = [q[0] - Math.cos(t) * (rad(b) + 2) - Math.sin(t) * off, q[1] - Math.sin(t) * (rad(b) + 2) + Math.cos(t) * off];
      NMPm.arrow(ctx, ...s, ...e, C.ink3, 1.4, 7);
    });
    for (let i = 0; i < n; i++) {
      const p = P(i);
      ctx.beginPath(); ctx.arc(...p, rad(i), 0, 7); ctx.fillStyle = "rgba(63,111,163,.22)"; ctx.fill(); ctx.strokeStyle = BLUE; ctx.lineWidth = 1.6; ctx.stroke();
      label(ctx, NAME[i], p[0], p[1], C.ink, "center", `700 15px ${F.sans}`);
    }
  }
  function show(msg) {
    $(".vec").textContent = `${msg} · ` + x.map((v, i) => `${NAME[i]} ${L.n(v, 3)}`).join("  ");
    draw();
    if (iter >= 50) {
      const best = x.indexOf(Math.max(...x)), ok = +guess === best;
      $(".verdict").textContent = `${ok ? "예측이 맞았습니다." : "예측과 다릅니다."} 1위는 ${NAME[best]}입니다. ` +
        `받은 링크 수: ${[...Array(n)].map((_, i) => `${NAME[i]} ${links.filter(([, b]) => b === i).length}`).join(", ")}. Gx와 x의 차이 ${L.n(L.norm(L.sub(L.mv(G, x), x)), 6)}`;
      $(".verdict").className = "verdict " + (ok ? "good" : "bad");
    }
  }
  function load() {
    links = NETS[+$(".pick").value]; build(); x = Array(n).fill(1 / n); iter = 0; guess = null;
    root.querySelectorAll("[data-g]").forEach((b) => { b.disabled = false; b.setAttribute("aria-pressed", "false"); });
    root.querySelectorAll(".go-1, .go-50, .go-surf").forEach((b) => (b.disabled = true));
    $(".verdict").textContent = ""; $(".verdict").className = "verdict";
    $(".vec").textContent = "처음에는 모두 1/5에서 시작합니다. 먼저 예측을 고르세요."; draw();
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    guess = b.dataset.g; b.setAttribute("aria-pressed", "true");
    root.querySelectorAll("[data-g]").forEach((y) => (y.disabled = true));
    root.querySelectorAll(".go-1, .go-50, .go-surf").forEach((y) => (y.disabled = false));
  }));
  $(".go-1").addEventListener("click", () => { x = L.mv(G, x); iter++; show(`${iter}번 곱함`); });
  $(".go-50").addEventListener("click", () => { for (let k = 0; k < 50; k++) x = L.mv(G, x); iter += 50; show(`${iter}번 곱함`); });
  $(".go-surf").addEventListener("click", () => {
    const rand = () => { rng = (rng * 16807) % 2147483647; return rng / 2147483647; };
    const cnt = Array(n).fill(0); let at = 0;
    for (let k = 0; k < 2000; k++) {
      const outs = links.filter(([a]) => a === at).map(([, b]) => b);
      at = rand() < d ? outs[Math.floor(rand() * outs.length)] : Math.floor(rand() * n); cnt[at]++;
    }
    const pr = x; x = cnt.map((c) => c / 2000);
    $(".vec").textContent = "서퍼 방문 비율 · " + x.map((v, i) => `${NAME[i]} ${L.n(v, 3)}`).join("  ") + (iter ? " (곱셈 결과: " + pr.map((v) => L.n(v, 3)).join(", ") + ")" : "");
    draw(); x = pr;
  });
  $(".pick").addEventListener("change", load);
  load();
})();
