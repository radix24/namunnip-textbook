/* 카드: 원탁에 앉는 방법은 왜 n!보다 적을까? — 원탁 돌리기와 한 줄 배치 n!개를 회전으로 묶기 */
(() => {
  const root = document.getElementById("card-dmath-round-table");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const NAMES = "ABCDE", COLS = ["#b5532f", "#3b7c2a", "#3f6fa3", "#7b5ea7", "#e0a02a"];
  let n = 4, seat = [], grouped = false;
  const { ctx, size } = fit($("canvas"), () => draw());
  function perms(a) { if (a.length <= 1) return [a]; return a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])); }
  const canon = (p) => { const k = p.indexOf(0); return [...p.slice(k), ...p.slice(0, k)].join(""); }; // A부터 읽은 원탁 배치
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.3;
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.72, 0, 7); ctx.fillStyle = "rgba(141,141,146,.18)"; ctx.fill(); ctx.strokeStyle = C.ink3; ctx.stroke();
    seat.forEach((p, i) => {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / n, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      ctx.beginPath(); ctx.arc(x, y, R * 0.24, 0, 7); ctx.fillStyle = COLS[p]; ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = `700 ${Math.round(R * 0.22)}px ${F.sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(NAMES[p], x, y);
    });
  }
  function list() {
    const all = perms([...Array(n).keys()]), cur = canon(seat), box = $(".all");
    let items = all.map((p) => ({ s: p.map((i) => NAMES[i]).join(""), c: canon(p) }));
    if (grouped) items.sort((a, b) => (a.c < b.c ? -1 : a.c > b.c ? 1 : 0));
    box.innerHTML = items.map((it, k) => `${grouped && k && it.c !== items[k - 1].c ? "<br>" : ""}<span class="${it.c === cur ? "on" : ""}">${it.s}</span>`).join("");
    const nf = all.length, groups = new Set(all.map(canon)).size;
    $(".say").textContent = `한 줄 배치 ${n}! = ${nf}가지 · 지금 원탁과 같은 것 ${n}개 · 원탁 배치 ${nf} ÷ ${n} = ${groups}가지 = (${n} − 1)!` + (grouped ? ` · ${groups}묶음` : "");
  }
  function update() { draw(); list(); }
  function load() { n = +$(".pick").value; seat = NMDm.shuffle([...Array(n).keys()]); grouped = false; update(); }
  $(".go-l").addEventListener("click", () => { seat.push(seat.shift()); update(); });
  $(".go-r").addEventListener("click", () => { seat.unshift(seat.pop()); update(); });
  $(".go-new").addEventListener("click", () => { seat = NMDm.shuffle(seat.slice()); update(); });
  $(".go-group").addEventListener("click", () => { grouped = !grouped; list(); });
  $(".pick").addEventListener("change", load);
  load();
})();
