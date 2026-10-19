/* 카드: 몇 명이 모이면 생일이 같은 두 사람이 꼭 있을까? — 366일 달력에 생일 찍기, 겹침 확률 */
(() => {
  const root = document.getElementById("card-dmath-birthday");
  if (!root) return;
  const { C, F, fit } = NM;
  const D = NMDm;
  const $ = (s) => root.querySelector(s);
  const nIn = $(".n"), DAYS = 366;
  let cnt = [], runs = 0, hit = 0;
  const { ctx, size } = fit($("canvas"), () => draw());
  const pSame = (n) => { if (n > DAYS) return 1; let q = 1; for (let i = 0; i < n; i++) q *= (DAYS - i) / DAYS; return 1 - q; };
  function make() { const n = +nIn.value; cnt = Array(DAYS).fill(0); for (let i = 0; i < n; i++) cnt[Math.floor(Math.random() * DAYS)]++; return cnt.some((c) => c > 1); }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const cols = 31, rows = 12, cw = (w - 40) / cols, ch = (h - 10) / rows, ML = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let d = 0;
    ctx.font = `10px ${F.mono}`; ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (let m = 0; m < rows; m++) {
      ctx.fillStyle = C.ink2; ctx.fillText(`${m + 1}월`, 34, 5 + m * ch + ch / 2);
      for (let j = 0; j < ML[m]; j++, d++) {
        const c = cnt[d] || 0, x = 40 + j * cw, y = 5 + m * ch;
        ctx.fillStyle = c === 0 ? "rgba(141,141,146,.15)" : c === 1 ? "#3f6fa3" : "#d4493a";
        ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2);
        if (c > 1) { ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(c, x + cw / 2, y + ch / 2); ctx.textAlign = "right"; }
      }
    }
  }
  function say(extra) {
    const n = +nIn.value, same = cnt.filter((c) => c > 1).length;
    $(".n-out").textContent = n;
    $(".say").textContent = `이 반: 겹친 날 ${same}일 · 계산한 확률 P(겹침) = ${D.n(pSame(n), 4)}` + (n > DAYS ? " (367명 이상: 비둘기집의 원리로 반드시)" : "") + (runs ? ` · ${runs}반 중 겹친 반 ${hit} (${D.n(hit / runs, 3)})` : "") + (extra || "");
    draw();
  }
  $(".go-1").addEventListener("click", () => { make(); say(); });
  $(".go-500").addEventListener("click", () => { for (let k = 0; k < 500; k++) { runs++; if (make()) hit++; } say(); });
  nIn.addEventListener("input", () => { runs = hit = 0; make(); say(); });
  make(); say();
})();
