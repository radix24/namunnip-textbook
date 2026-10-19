/* 카드: 비밀번호를 한 자리 늘리는 것과 특수문자를 넣는 것 중 무엇이 더 안전할까? — kⁿ과 모두 시도하는 시간 (가상 컴퓨터) */
(() => {
  const root = document.getElementById("card-jmath-password");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const RATE = 1e10, SIZES = [10, 26, 26, 10], cs = [0, 1, 2, 3].map((i) => $(`.c${i}`)), lenIn = $(".len");
  const big = (x) => { if (x < 1e4) return x.toLocaleString("ko-KR"); const u = [[1e16, "경"], [1e12, "조"], [1e8, "억"], [1e4, "만"]]; for (const [v, s] of u) if (x >= v) return `${(x / v).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}${s}`; return String(x); };
  const dur = (sec) => { if (sec < 1) return `${(sec * 1000).toPrecision(2)}밀리초`; const U = [[3.156e7, "년"], [86400, "일"], [3600, "시간"], [60, "분"], [1, "초"]]; for (const [v, s] of U) if (sec >= v) return `약 ${big(Math.round(sec / v))}${s}`; return ""; };
  function update() {
    const k = cs.reduce((s, c, i) => s + (c.checked ? SIZES[i] : 0), 0), n = +lenIn.value, N = k ** n;
    $(".len-out").textContent = n;
    $(".say").textContent = k ? `글자 ${k}종류 × ${n}자리 → ${k}^${n} = ${big(N)}가지 · 모두 시도하는 데 ${dur(N / RATE)} (1초에 100억 번) · 한 자리 더하면 ${k}배, 숫자 10종류 더하면 ${((k + 10) / k) ** n < 1e6 ? (((k + 10) / k) ** n).toFixed(1) : big(((k + 10) / k) ** n)}배` : "글자 종류를 하나 이상 고르세요.";
  }
  root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => {
    root.querySelectorAll("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $(".verdict").textContent = `${b.dataset.g === "b" ? "맞습니다." : "예측과 다릅니다."} 숫자 8자리는 10⁸ = 1억 가지, 숫자+소문자 6자리는 36⁶ ≈ 21.8억 가지로 (나)가 약 22배 많습니다. 다만 둘 다 1초에 100억 번 시도하는 컴퓨터에는 1초도 버티지 못합니다.`;
    $(".after").hidden = false; update();
  }));
  [...cs, lenIn].forEach((x) => x.addEventListener("input", update));
})();
