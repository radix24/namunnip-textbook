/* 카드: 8자리 이진수로 음수를 나타내면 100 + 50은 얼마가 될까? — 2의 보수, 수의 원, 넘침 예측 */
(() => {
  const root = document.getElementById("card-dmath-twos-comp");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  let u = 5; // 0~255로 저장된 값
  const signed = (x) => (x >= 128 ? x - 256 : x), bits = (x) => x.toString(2).padStart(8, "0");
  const { ctx, size } = fit($("canvas"), () => draw());
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.38, ang = (x) => -Math.PI / 2 + (2 * Math.PI * x) / 256;
    ctx.lineWidth = 14;
    ctx.strokeStyle = "rgba(63,111,163,.35)"; ctx.beginPath(); ctx.arc(cx, cy, R, ang(0), ang(128)); ctx.stroke();
    ctx.strokeStyle = "rgba(181,83,47,.35)"; ctx.beginPath(); ctx.arc(cx, cy, R, ang(128), ang(256)); ctx.stroke();
    ctx.fillStyle = C.ink2; ctx.font = `600 11px ${F.mono}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    [[0, "0"], [64, "64"], [127, "127"], [128, "−128"], [192, "−64"], [255, "−1"]].forEach(([x, t]) => { const a = ang(x + 0.5); ctx.fillText(t, cx + (R + 24) * Math.cos(a), cy + (R + 24) * Math.sin(a)); });
    const a = ang(u + 0.5);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a)); ctx.stroke();
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(cx + R * Math.cos(a), cy + R * Math.sin(a), 7, 0, 7); ctx.fill();
    ctx.font = `700 18px ${F.mono}`; ctx.fillText(String(signed(u)).replace("-", "−"), cx, cy - 10);
    ctx.font = `600 11px ${F.sans}`; ctx.fillStyle = C.ink2; ctx.fillText("부호 있는 값", cx, cy + 12);
  }
  function render() {
    const box = $(".bits"); box.innerHTML = "";
    bits(u).split("").forEach((b, i) => {
      const e = document.createElement("button"); e.type = "button"; e.textContent = b; if (b === "1") e.className = "one";
      e.setAttribute("aria-label", `${i === 0 ? "부호 자리" : `${8 - i}번째 자리`}: ${b}`);
      e.addEventListener("click", () => { u ^= 1 << (7 - i); render(); });
      box.append(e);
    });
    $(".cur").textContent = `${bits(u)} · 부호 없이 읽으면 ${u}, 2의 보수로 읽으면 ${String(signed(u)).replace("-", "−")}`;
    draw();
  }
  $(".go-neg").addEventListener("click", () => { const before = bits(u), inv = (~u) & 255; u = (inv + 1) & 255; render(); $(".cur").textContent += ` · ${before} → 뒤집기 ${bits(inv)} → +1 → ${bits(u)}`; });
  $(".go-inc").addEventListener("click", () => { u = (u + 1) & 255; render(); });
  $(".go-dec").addEventListener("click", () => { u = (u + 255) & 255; render(); });
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    u = (100 + 50) & 255; render();
    const ok = b.dataset.g === "-106";
    $(".verdict").textContent = `${ok ? "맞습니다." : "아닙니다."} 01100100(100) + 00110010(50) = 10010110. 맨 앞자리가 1이라 2의 보수로 읽으면 150 − 256 = −106입니다. 127을 넘어 원을 돌아간 넘침이고, 컴퓨터는 대개 멈추지 않고 이 값을 그대로 씁니다.`;
    $(".verdict").className = "verdict " + (ok ? "good" : "bad");
  }));
  render();
})();
