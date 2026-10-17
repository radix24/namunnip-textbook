/* 카드: 정사각형 6개를 어떻게 이어 붙여야 접어서 상자가 될까? — 주사위 굴리기로 전개도 판정 */
(() => {
  const root = document.getElementById("card-jmath-box-net");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const N = 5, on = new Set(), found = new Map();
  const grid = $(".grid");
  grid.innerHTML = [...Array(N * N)].map((_, k) => `<button type="button" data-k="${k}" aria-pressed="false" aria-label="${Math.floor(k / N) + 1}행 ${(k % N) + 1}열"></button>`).join("");
  /* 상자 방향: 아래(D)·위(U)·북(N, 뒤)·남(S, 앞)·동(E, 오)·서(W, 왼)에 어떤 면이 있는지 */
  const roll = (o, dir) => {
    const { D, U, N: n, S, E, W } = o;
    if (dir === "N") return { D: n, N: U, U: S, S: D, E, W };
    if (dir === "S") return { D: S, S: U, U: n, N: D, E, W };
    if (dir === "E") return { D: E, E: U, U: W, W: D, N: n, S };
    return { D: W, W: U, U: E, E: D, N: n, S };
  };
  const NAME = { D: "아래", U: "위", N: "뒤", S: "앞", E: "오", W: "왼" };
  function judge() {
    const cells = [...on];
    if (cells.length !== 6) return { ok: false, msg: `칸 ${cells.length}개를 골랐습니다. 6개를 고르세요.` };
    const face = new Map([[cells[0], { D: "D", U: "U", N: "N", S: "S", E: "E", W: "W" }]]), q = [cells[0]];
    while (q.length) {
      const k = q.shift(), r = Math.floor(k / N), c = k % N, o = face.get(k);
      [[r - 1, c, "N"], [r + 1, c, "S"], [r, c + 1, "E"], [r, c - 1, "W"]].forEach(([rr, cc, d]) => { const kk = rr * N + cc; if (rr >= 0 && rr < N && cc >= 0 && cc < N && on.has(kk) && !face.has(kk)) { face.set(kk, roll(o, d)); q.push(kk); } });
    }
    if (face.size < 6) return { ok: false, msg: "6칸이 변으로 모두 이어져 있지 않습니다." };
    const bottoms = cells.map((k) => face.get(k).D), uniq = new Set(bottoms);
    return { ok: uniq.size === 6, face, msg: uniq.size === 6 ? "접으면 정육면체가 됩니다." : "접으면 두 칸 이상이 같은 면에 겹칩니다. 정육면체가 되지 않습니다." };
  }
  /* 모양을 돌리기·뒤집기와 상관없이 같은 것으로: 8가지 변환 중 가장 작은 문자열 */
  const canon = () => { const pts = [...on].map((k) => [Math.floor(k / N), k % N]); let best = null; for (let t = 0; t < 8; t++) { const p = pts.map(([r, c]) => { let [a, b] = t & 4 ? [c, r] : [r, c]; if (t & 1) a = -a; if (t & 2) b = -b; return [a, b]; }); const mr = Math.min(...p.map((x) => x[0])), mc = Math.min(...p.map((x) => x[1])); const s = p.map(([a, b]) => `${a - mr},${b - mc}`).sort().join(" "); if (!best || s < best) best = s; } return best; };
  function update() {
    const r = judge();
    grid.querySelectorAll("button").forEach((b) => { const k = +b.dataset.k; b.classList.toggle("on", on.has(k)); b.setAttribute("aria-pressed", String(on.has(k))); b.textContent = r.ok && r.face.has(k) ? NAME[r.face.get(k).D] : ""; });
    if (r.ok) found.set(canon(), true);
    $(".verdict").textContent = r.msg;
    $(".found").textContent = `지금까지 찾은 서로 다른 정육면체 전개도: ${found.size} / 11`;
  }
  grid.addEventListener("click", (e) => { const b = e.target.closest("button[data-k]"); if (!b) return; const k = +b.dataset.k; on.has(k) ? on.delete(k) : on.add(k); update(); });
  $(".go-clear").addEventListener("click", () => { on.clear(); update(); });
  $(".go-cross").addEventListener("click", () => { on.clear(); [2, 6, 7, 8, 12, 17].forEach((k) => on.add(k)); update(); });
  update();
})();
