/* 카드: 행렬로 잠근 암호는 어떤 열쇠로 열릴까? — 2×2 힐 암호(26으로 나눈 나머지) */
(() => {
  const root = document.getElementById("card-adalg-hill-cipher");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const ks = [...root.querySelectorAll("[data-k]")], msg = $(".msg");
  const mod = (x) => ((x % 26) + 26) % 26;
  const inv26 = (d) => { d = mod(d); for (let x = 1; x < 26; x++) if ((d * x) % 26 === 1) return x; return null; };
  const ch = (n) => String.fromCharCode(65 + n), num = (c) => c.charCodeAt(0) - 65;
  const apply = (K, v) => [mod(K[0][0] * v[0] + K[0][1] * v[1]), mod(K[1][0] * v[0] + K[1][1] * v[1])];
  function update() {
    const k = ks.map((el) => Math.round(+el.value) || 0), K = [[k[0], k[1]], [k[2], k[3]]];
    let t = msg.value.toUpperCase().replace(/[^A-Z]/g, ""); if (!t) t = "A"; if (t.length % 2) t += "X";
    const P = []; for (let i = 0; i < t.length; i += 2) P.push([num(t[i]), num(t[i + 1])]);
    const Cv = P.map((p) => apply(K, p)), ct = Cv.map((c) => ch(c[0]) + ch(c[1])).join("");
    const d = k[0] * k[3] - k[1] * k[2], di = inv26(d);
    $(".det").textContent = `det K = ${d}${mod(d) !== d ? ` ≡ ${mod(d)} (mod 26)` : ""} · ${di ? `26으로 나눈 나머지에서 역수 ${di} (${mod(d)}×${di} = ${mod(d) * di} ≡ 1)` : "26과 서로소가 아니라 역수가 없습니다"}`;
    $(".flow").innerHTML = P.slice(0, 4).map((p, i) => `${t[2 * i]}${t[2 * i + 1]} → (${p.join(", ")}) → K·p = (${k[0] * p[0] + k[1] * p[1]}, ${k[2] * p[0] + k[3] * p[1]}) ≡ (${Cv[i].join(", ")}) → ${ct.slice(2 * i, 2 * i + 2)}`).join("<br>") + (P.length > 4 ? "<br>…" : "");
    $(".ct").textContent = ct;
    const v = $(".verdict");
    if (di) {
      const Ki = [[mod(di * k[3]), mod(-di * k[1])], [mod(-di * k[2]), mod(di * k[0])]];
      const back = Cv.map((c) => apply(Ki, c)).map((p) => ch(p[0]) + ch(p[1])).join("");
      $(".pt").textContent = back;
      v.textContent = `해독 열쇠 K⁻¹ ≡ [${Ki[0].join(", ")} ; ${Ki[1].join(", ")}] (mod 26). 암호문에 곱하면 평문이 돌아옵니다.`;
      v.className = "verdict good";
    } else {
      $(".pt").textContent = "해독 불가";
      // 같은 암호문이 되는 두 평문 쌍 찾기
      let ex = "";
      outer: for (let a = 0; a < 26; a++) for (let b = 0; b < 26; b++) for (let c = 0; c < 26; c++) for (let e = 0; e < 26; e++) {
        if (a * 26 + b >= c * 26 + e) continue;
        const x = apply(K, [a, b]), y = apply(K, [c, e]);
        if (x[0] === y[0] && x[1] === y[1]) { ex = `${ch(a)}${ch(b)}와 ${ch(c)}${ch(e)}가 둘 다 ${ch(x[0])}${ch(x[1])}로 바뀝니다.`; break outer; }
      }
      v.textContent = `역행렬이 없어 되돌릴 수 없습니다. 예: ${ex}`;
      v.className = "verdict bad";
    }
  }
  const setK = (a) => { ks.forEach((el, i) => (el.value = a[i])); update(); };
  $(".go-bad").addEventListener("click", () => setK([4, 1, 3, 4]));
  $(".go-ok").addEventListener("click", () => setK([3, 3, 2, 5]));
  [...ks, msg].forEach((el) => el.addEventListener("input", update));
  update();
})();
