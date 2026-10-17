/* 카드: 세트 메뉴 가격만 보고 버거 하나의 값을 맞힐 수 있을까? — 무작위 연립방정식, 역행렬 풀이 (가상 가격) */
(() => {
  const root = document.getElementById("card-econ-bundle-price");
  if (!root) return;
  const E = NMEcon;
  const $ = (s) => root.querySelector(s);
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  let pb, streak = 0, k = 0, done = false;
  function make() {
    let a, b, c, d;
    do { a = ri(1, 3); b = ri(1, 3); c = ri(1, 3); d = ri(1, 3); } while (a * d - b * c === 0);
    const x = ri(8, 18) * 500, y = ri(3, 8) * 500;
    return { a, b, c, d, x, y, e: a * x + b * y, f: c * x + d * y };
  }
  function load() {
    pb = make(); k++; done = false;
    $(".no-out").textContent = `문제 ${k} · 연속 정답 ${streak}`;
    $(".menu").innerHTML = `<p>세트 1: 버거 ${pb.a}개 + 음료 ${pb.b}잔 = <b>${E.n(pb.e)}원</b></p><p>세트 2: 버거 ${pb.c}개 + 음료 ${pb.d}잔 = <b>${E.n(pb.f)}원</b></p>`;
    $(".gx").value = ""; $(".gy").value = ""; $(".verdict").textContent = ""; $(".sol").hidden = true;
  }
  $(".go-check").addEventListener("click", () => {
    if (done) return;
    const gx = +$(".gx").value, gy = +$(".gy").value;
    if (!$(".gx").value || !$(".gy").value) { $(".verdict").textContent = "두 값을 모두 넣으세요."; return; }
    const ok = gx === pb.x && gy === pb.y, fits = pb.a * gx + pb.b * gy === pb.e;
    done = true; streak = ok ? streak + 1 : 0;
    $(".verdict").textContent = ok ? `정답입니다. 연속 ${streak}문제${streak >= 3 ? " — 도전 성공!" : ""}` : `아닙니다. ${fits ? "세트 1의 가격은 맞지만 세트 2의 가격이 맞지 않습니다." : "세트 1 가격부터 맞지 않습니다."} 정답은 버거 ${E.n(pb.x)}원, 음료 ${E.n(pb.y)}원입니다.`;
    const { a, b, c, d, e, f } = pb, det = a * d - b * c, s = $(".sol");
    s.innerHTML = `\\(A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix},\\ ad - bc = ${det}\\)<br>\\(\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\dfrac{1}{${det}}\\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix}\\begin{pmatrix} ${e} \\\\ ${f} \\end{pmatrix} = \\dfrac{1}{${det}}\\begin{pmatrix} ${d * e - b * f} \\\\ ${a * f - c * e} \\end{pmatrix} = \\begin{pmatrix} ${pb.x} \\\\ ${pb.y} \\end{pmatrix}\\)`;
    s.hidden = false; if (window.NMMath) NMMath.render(s);
    $(".no-out").textContent = `문제 ${k} · 연속 정답 ${streak}`;
  });
  $(".go-next").addEventListener("click", load);
  load();
})();
