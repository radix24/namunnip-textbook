/* 카드: 정칠각형은 작도할 수 있을까, 정십칠각형은? — 가우스-방첼 정리로 정n각형 판정 예측 */
(() => {
  const root = document.getElementById("card-adgeo-gauss-polygon");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const FERMAT = [3, 5, 17, 257, 65537];
  function why(n) { let m = n, k = 0; while (m % 2 === 0) { m /= 2; k++; } const used = []; for (const p of FERMAT) if (m % p === 0) { m /= p; if (m % p === 0) return { ok: false, t: `${p}가 두 번 이상` }; used.push(p); } return m === 1 ? { ok: true, t: `2^${k}` + (used.length ? ` × ${used.join(" × ")}` : "") } : { ok: false, t: `${m}에 페르마 소수가 아닌 인수` }; }
  let mark = "1", ans = {}, checked = false;
  function render() {
    const g = $(".grid"); g.innerHTML = "";
    for (let n = 3; n <= 30; n++) {
      const b = document.createElement("button"); b.type = "button"; const w = why(n), a = ans[n];
      b.className = (a === "1" ? "yes" : a === "0" ? "no" : "") + (checked && a !== undefined && (a === "1") !== w.ok ? " wrong" : "");
      b.innerHTML = `${n}<small>${checked ? (w.ok ? "가능" : "불가능") : a === "1" ? "가능?" : a === "0" ? "불가능?" : ""}</small>`;
      b.title = checked ? w.t : ""; b.setAttribute("aria-label", `정${n}각형${a ? (a === "1" ? ", 가능 예측" : ", 불가능 예측") : ""}`);
      b.addEventListener("click", () => { if (checked) { $(".verdict").textContent = `정${n}각형: ${w.ok ? "작도 가능" : "작도 불가능"} (${n} = ${w.t})`; return; } ans[n] = ans[n] === mark ? undefined : mark; render(); });
      g.append(b);
    }
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => { mark = b.dataset.g; root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); }));
  $(".go-check").addEventListener("click", () => {
    checked = true; let right = 0, total = 0;
    for (let n = 3; n <= 30; n++) { if (ans[n] === undefined) continue; total++; if ((ans[n] === "1") === why(n).ok) right++; }
    const yes = []; for (let n = 3; n <= 30; n++) if (why(n).ok) yes.push(n);
    $(".verdict").textContent = `예측 ${total}칸 중 ${right}칸 맞음. 작도 가능: ${yes.join(", ")}. 칸을 누르면 이유가 나옵니다.`;
    $(".verdict").className = "verdict good"; render();
  });
  $(".go-reset").addEventListener("click", () => { ans = {}; checked = false; $(".verdict").textContent = ""; render(); });
  render();
})();
