/* 카드: 원판 n개를 옮기는 최소 횟수는 어떻게 구할까? — 하노이의 탑 놀이와 재귀 풀이 재생 */
(() => {
  const root = document.getElementById("card-dmath-hanoi");
  if (!root) return;
  const { F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const COLS = ["#b5532f", "#e0a02a", "#3b7c2a", "#2a9d8f", "#3f6fa3", "#7b5ea7"];
  let n = 3, pegs, held = null, moves = 0, timer = 0;
  const cv = $("canvas");
  const { ctx, size } = fit(cv, () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.fillStyle = "#fbfbf8"; ctx.fillRect(0, 0, w, h);
    const base = h - 18, ph = h * 0.7, dh = Math.min(22, (ph - 10) / n), maxW = w / 3 - 20;
    ctx.fillStyle = "#8d8d92"; ctx.fillRect(10, base, w - 20, 6);
    pegs.forEach((pg, i) => {
      const cx = (w / 3) * (i + 0.5);
      ctx.fillStyle = held && held.from === i ? "#e0a02a" : "#8d8d92"; ctx.fillRect(cx - 3, base - ph, 6, ph);
      pg.forEach((d, k) => {
        const ww = maxW * (0.3 + (0.7 * (d + 1)) / n), y = base - (k + 1) * dh - (held && held.from === i && k === pg.length - 1 ? 30 : 0);
        ctx.fillStyle = COLS[d % 6]; ctx.fillRect(cx - ww / 2, y + 1, ww, dh - 2);
      });
    });
    ctx.fillStyle = "#5d5d61"; ctx.font = `600 12px ${F.sans}`; ctx.textAlign = "center";
    ["왼쪽", "가운데", "오른쪽"].forEach((t, i) => ctx.fillText(t, (w / 3) * (i + 0.5), base + 15 > h ? h - 2 : base + 14));
  }
  function say(msg) {
    const min = 2 ** n - 1, done = pegs[2].length === n;
    $(".say").textContent = msg || `옮긴 횟수 ${moves} · 최소 2^${n} − 1 = ${min}` + (done ? (moves === min ? " · 최소로 성공!" : ` · 성공 (최소보다 ${moves - min}번 많음)`) : "");
    let a = 0; const seq = []; for (let k = 1; k <= 6; k++) { a = 2 * a + 1; seq.push(`a${k} = ${a}`); }
    $(".rec").textContent = `a₁ = 1, aₙ = 2aₙ₋₁ + 1: ${seq.join(", ")}`;
    draw();
  }
  function reset() { clearInterval(timer); n = +$(".pick").value; pegs = [[...Array(n).keys()].reverse(), [], []]; held = null; moves = 0; say(); }
  cv.addEventListener("click", (e) => {
    clearInterval(timer);
    const b = cv.getBoundingClientRect(), i = Math.min(2, Math.floor(((e.clientX - b.left) / b.width) * 3));
    if (!held) { if (pegs[i].length) { held = { from: i }; say(`${["왼쪽", "가운데", "오른쪽"][i]} 기둥의 원판을 집었습니다. 놓을 기둥을 누르세요.`); } return; }
    const from = held.from, d = pegs[from][pegs[from].length - 1], top = pegs[i][pegs[i].length - 1];
    held = null;
    if (i === from) { say(); return; }
    if (top !== undefined && top < d) { say("작은 원판 위에 큰 원판을 놓을 수 없습니다."); return; }
    pegs[i].push(pegs[from].pop()); moves++; say();
  });
  $(".go-reset").addEventListener("click", reset);
  $(".go-auto").addEventListener("click", () => {
    reset(); const plan = []; const rec = (k, a, b, c) => { if (!k) return; rec(k - 1, a, c, b); plan.push([a, c]); rec(k - 1, b, a, c); };
    rec(n, 0, 1, 2); let s = 0;
    timer = setInterval(() => { if (s >= plan.length) { clearInterval(timer); return; } const [a, c] = plan[s++]; pegs[c].push(pegs[a].pop()); moves++; say(); }, Math.max(120, 2400 / plan.length));
  });
  $(".pick").addEventListener("change", reset);
  reset();
})();
