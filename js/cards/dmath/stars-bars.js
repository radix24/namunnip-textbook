/* 카드: 같은 사탕을 친구들에게 나누는 방법은 몇 가지일까? — 별과 막대 줄을 직접 만들어 기록 */
(() => {
  const root = document.getElementById("card-dmath-stars-bars");
  if (!root) return;
  const D = NMDm;
  const $ = (s) => root.querySelector(s);
  const rIn = $(".r"), nIn = $(".n");
  let r, n, seq, seen;
  const share = () => { const out = [0]; seq.forEach((t) => (t ? out.push(0) : out[out.length - 1]++)); return out; };
  function render() {
    const row = $(".row"); row.innerHTML = "";
    seq.forEach((isBar, i) => {
      const b = document.createElement("button"); b.type = "button"; b.className = isBar ? "bar" : "star"; b.textContent = isBar ? "|" : "★";
      b.setAttribute("aria-label", `${i + 1}번째 칸: ${isBar ? "칸막이" : "사탕"}`);
      b.addEventListener("click", () => {
        // 같은 개수를 지키도록: 누른 칸과 가장 가까운 반대 종류 칸을 맞바꿈
        let j = -1, d = 1e9; seq.forEach((t, k) => { if (t !== isBar && Math.abs(k - i) < d) { d = Math.abs(k - i); j = k; } });
        if (j >= 0) { [seq[i], seq[j]] = [seq[j], seq[i]]; render(); }
      });
      row.append(b);
    });
    $(".give").textContent = `나눔: (${share().join(", ")})`;
    $(".say").textContent = `기록 ${seen.size}개 / 전체 ₙHᵣ = ₍${r}+${n}−1₎C₍${n}−1₎ = ${D.big(D.C(r + n - 1, n - 1))}` + (seen.size ? ` · ${[...seen].slice(-6).join(" ")}` : "");
  }
  function load() { r = +rIn.value; n = +nIn.value; $(".r-out").textContent = r; $(".n-out").textContent = n; seq = [...Array(r).fill(false), ...Array(n - 1).fill(true)]; seen = new Set(); render(); }
  $(".go-save").addEventListener("click", () => { seen.add(`(${share().join(",")})`); render(); });
  $(".go-all").addEventListener("click", () => {
    const all = []; const rec = (k, left, cur) => { if (k === n - 1) { all.push([...cur, left]); return; } for (let a = left; a >= 0; a--) rec(k + 1, left - a, [...cur, a]); };
    rec(0, r, []);
    $(".say").textContent = `모든 나눔 ${all.length}가지: ` + all.map((a) => `(${a.join(",")})`).join(" ") + (seen.size ? ` · 내가 찾은 것 ${[...seen].filter((s) => all.some((a) => `(${a.join(",")})` === s)).length}개` : "");
  });
  [rIn, nIn].forEach((el) => el.addEventListener("input", load));
  load();
})();
