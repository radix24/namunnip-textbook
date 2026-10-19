/* 카드: 게이트만으로 덧셈하는 기계를 만들 수 있을까? — 전가산기 4개를 이은 리플 가산기, 받아올림 전파 */
(() => {
  const root = document.getElementById("card-dmath-adder");
  if (!root) return;
  const { F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  let A = [1, 0, 1, 1], B = [0, 1, 1, 0], stage = 4, timer = 0; // A[0]이 가장 높은 자리, stage: 계산을 마친 전가산기 수
  const { ctx, size } = fit($("canvas"), () => draw());
  function calc() { const S = [0, 0, 0, 0], Cc = [0, 0, 0, 0, 0]; for (let k = 0; k < 4; k++) { const a = A[3 - k], b = B[3 - k], c = Cc[k]; S[3 - k] = a ^ b ^ c; Cc[k + 1] = (a & b) | (c & (a ^ b)); } return { S, Cc }; }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.fillStyle = "#fbfbf8"; ctx.fillRect(0, 0, w, h);
    const { S, Cc } = calc(), sp = (w - 50) / 4, bw = sp * 0.62, bh = h * 0.32, y = h * 0.38;
    for (let k = 0; k < 4; k++) {
      const x = w - 8 - (k + 1) * sp + (sp - bw) * 0.2, live = k < stage, on = (v) => (live ? (v ? "#e0a02a" : "#bbbbbf") : "#e3e3de");
      // 입력 선
      [[A[3 - k], -0.25, `A${k}`], [B[3 - k], 0.25, `B${k}`]].forEach(([v, dx, t]) => { ctx.strokeStyle = v ? "#e0a02a" : "#bbbbbf"; ctx.lineWidth = v ? 3 : 2; ctx.beginPath(); ctx.moveTo(x + bw / 2 + dx * bw, 14); ctx.lineTo(x + bw / 2 + dx * bw, y); ctx.stroke(); ctx.fillStyle = "#5d5d61"; ctx.font = `600 11px ${F.mono}`; ctx.textAlign = "center"; ctx.fillText(t, x + bw / 2 + dx * bw, 8); });
      ctx.fillStyle = live ? "#fff" : "#f1f1ec"; ctx.strokeStyle = "#232326"; ctx.lineWidth = 2; ctx.fillRect(x, y, bw, bh); ctx.strokeRect(x, y, bw, bh);
      ctx.fillStyle = "#232326"; ctx.font = `700 13px ${F.sans}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(`FA${k}`, x + bw / 2, y + bh / 2);
      // 받아올림 들어오는 선(오른쪽)과 합 출력
      ctx.strokeStyle = on(Cc[k]); ctx.lineWidth = Cc[k] && live ? 3 : 2; const gap = sp - bw; ctx.beginPath(); ctx.moveTo(x + bw + gap, y + bh * 0.5); ctx.lineTo(x + bw, y + bh * 0.5); ctx.stroke();
      ctx.fillStyle = "#b5532f"; ctx.font = `600 10px ${F.mono}`; ctx.fillText(`C${k}=${live || k === 0 ? Cc[k] : "?"}`, x + bw + gap / 2, y + bh * 0.5 + 12);
      ctx.strokeStyle = on(S[3 - k]); ctx.lineWidth = S[3 - k] && live ? 3 : 2; ctx.beginPath(); ctx.moveTo(x + bw / 2, y + bh); ctx.lineTo(x + bw / 2, h - 28); ctx.stroke();
      ctx.fillStyle = "#3b7c2a"; ctx.font = `700 14px ${F.mono}`; ctx.fillText(live ? `S${k}=${S[3 - k]}` : `S${k}=?`, x + bw / 2, h - 14);
    }
    const xl = w - 8 - 4 * sp + (sp - bw) * 0.2; ctx.strokeStyle = stage >= 4 ? (Cc[4] ? "#e0a02a" : "#bbbbbf") : "#e3e3de"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xl, y + bh * 0.5); ctx.lineTo(Math.max(4, xl - 20), y + bh * 0.5); ctx.stroke();
    ctx.fillStyle = "#b5532f"; ctx.font = `700 12px ${F.mono}`; ctx.textAlign = "left"; ctx.fillText(`C4=${stage >= 4 ? Cc[4] : "?"}`, 2, y + bh * 0.5 + 18);
  }
  function bitRow(sel, arr) {
    const el = $(sel); el.innerHTML = "";
    arr.forEach((b, i) => { const e = document.createElement("button"); e.type = "button"; e.textContent = b; if (b) e.className = "one"; e.setAttribute("aria-label", `${sel === ".ra" ? "A" : "B"}${3 - i} = ${b}`); e.addEventListener("click", () => { arr[i] ^= 1; clearInterval(timer); stage = 4; render(); }); el.append(e); });
  }
  const v = (a) => a.reduce((s, b) => s * 2 + b, 0);
  function render() {
    bitRow(".ra", A); bitRow(".rb", B);
    $(".da").textContent = `= ${v(A)}`; $(".db").textContent = `= ${v(B)}`;
    const { S, Cc } = calc();
    $(".say").textContent = stage >= 4 ? `합 ${Cc[4]}${S.join("")}(2) = ${16 * Cc[4] + v(S)} · ${v(A)} + ${v(B)} = ${v(A) + v(B)}` + (Cc[4] ? " · C4 = 1: 4비트를 넘쳤습니다" : "") : `전가산기 ${stage}개까지 계산함 (받아올림을 기다리는 중)`;
    draw();
  }
  $(".go-ripple").addEventListener("click", () => { clearInterval(timer); stage = 0; render(); timer = setInterval(() => { stage++; render(); if (stage >= 4) clearInterval(timer); }, 650); });
  render();
})();
