/* 카드: 카페 계산대에서 쿠폰 두 장 중 어느 것을 써야 손님에게 유리할까? — 합계, 비율 할인과 정액 할인, 거스름돈 (가상 메뉴) */
(() => {
  const root = document.getElementById("card-jmath-cafe-bill");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const M = [["아메리카노", 4500], ["카페라테", 5000], ["딸기 케이크", 6500], ["쿠키", 2500]];
  const q = [1, 2, 0, 0];
  let coupon = 0;
  const won = (x) => x.toLocaleString("ko-KR") + "원";
  $(".menu").innerHTML = M.map(([n, p], i) => `<span>${n} <span class="mono small">${won(p)}</span></span><button class="chip" type="button" data-i="${i}" data-d="-1" aria-label="${n} 빼기">−</button><span class="q" data-q="${i}"></span><button class="chip" type="button" data-i="${i}" data-d="1" aria-label="${n} 더하기">+</button>`).join("");
  /* 거스름돈을 적은 개수로: 5만, 1만, 5천, 1천, 500, 100 */
  const change = (x) => { const U = [50000, 10000, 5000, 1000, 500, 100], out = []; U.forEach((u) => { const k = Math.floor(x / u); if (k) { out.push(u >= 1000 ? `${won(u)} 지폐 ${k}장` : `${u}원 동전 ${k}개`); x -= k * u; } }); return out.join(", ") || "없음"; };
  function update() {
    M.forEach((_, i) => ($(`[data-q="${i}"]`).textContent = q[i]));
    const lines = M.map(([n, p], i) => [n, p, q[i]]).filter((l) => l[2]), sum = lines.reduce((s, [, p, k]) => s + p * k, 0);
    const d10 = Math.round(sum * 0.1), d2 = sum >= 10000 ? 2000 : 0, disc = coupon === 1 ? d10 : coupon === 2 ? d2 : 0, pay = sum - disc, paid = +$(".paid").value;
    const expr = lines.map(([, p, k]) => `${p} × ${k}`).join(" + ") || "0";
    $(".bill").innerHTML = `${lines.map(([n, p, k]) => `${n} ${won(p)} × ${k} = ${won(p * k)}`).join("<br>") || "(주문 없음)"}<br>합계 = ${expr} = <b>${won(sum)}</b>` +
      `<br>10% 쿠폰이면 −${won(d10)} · 2000원 쿠폰이면 ${d2 ? "−2,000원" : "사용 불가(1만 원 미만)"} → ${sum ? (d10 > d2 ? "10% 쿠폰이 유리" : d10 < d2 ? "2000원 쿠폰이 유리" : "같음") : ""}` +
      `<br>적용: ${["쿠폰 없음", "10% 할인", "2000원 할인"][coupon]} → 낼 돈 <b>${won(pay)}</b>` +
      `<br>${paid >= pay ? `받은 돈 ${won(paid)} − ${won(pay)} = 거스름돈 ${won(paid - pay)} (${change(paid - pay)})` : `받은 돈 ${won(paid)}이 모자랍니다`}`;
  }
  root.querySelectorAll("[data-d]").forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.i; q[i] = Math.max(0, Math.min(20, q[i] + +b.dataset.d)); update(); }));
  root.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => { coupon = +b.dataset.c; root.querySelectorAll("[data-c]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); update(); }));
  $(".paid").addEventListener("change", update);
  update();
})();
