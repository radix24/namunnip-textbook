/* 카드: 길이 1만 주어지면 어떤 길이를 작도할 수 있을까? — 사칙연산·제곱근으로 길이 만들기, 마지막 연산의 작도 그림 */
(() => {
  const root = document.getElementById("card-adgeo-constructible-number");
  if (!root) return;
  const { C, F, fit } = NM;
  const $ = (s) => root.querySelector(s);
  const TARGET = [
    { v: Math.SQRT2, name: "√2" }, { v: Math.sqrt(3), name: "√3" }, { v: (1 + Math.sqrt(5)) / 2, name: "(1 + √5)/2" },
    { v: Math.sqrt(1 + Math.SQRT2), name: "√(1 + √2)" }, { v: Math.cbrt(2), name: "∛2", impossible: true },
  ];
  let ti = 0, pool, sel, last, done;
  const { ctx, size } = fit($("canvas"), () => draw());
  const fmt = (x) => (Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : x.toFixed(4));
  function render() {
    const box = $(".pool"); box.innerHTML = "";
    pool.forEach((p, i) => { const b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.textContent = `${p.name} ≈ ${fmt(p.v)}`; b.setAttribute("aria-pressed", String(sel.includes(i))); b.addEventListener("click", () => { sel = sel.length >= 2 ? [i] : [...sel, i]; render(); }); box.append(b); });
    const s = document.createElement("span"); s.className = "mono small"; s.textContent = sel.length ? `고른 순서: ${sel.map((i, k) => `${"ab"[k]} = ${pool[i].name}`).join(", ")}` : "(같은 길이를 두 번 골라도 됩니다)"; box.append(s);
    draw();
  }
  function apply(op) {
    if (done) return; const v = $(".verdict");
    if (op === "sqrt" ? sel.length < 1 : sel.length < 2) { v.textContent = op === "sqrt" ? "길이 하나를 고르세요." : "길이 두 개를 차례로 고르세요(a, b 순서)."; v.className = "verdict"; return; }
    const a = pool[sel[0]], b = pool[sel[1]];
    let val, name;
    if (op === "add") { val = a.v + b.v; name = `(${a.name} + ${b.name})`; }
    if (op === "sub") { val = a.v - b.v; name = `(${a.name} − ${b.name})`; if (val <= 1e-9) { v.textContent = "길이는 양수여야 합니다. 큰 것을 먼저 고르세요."; return; } }
    if (op === "mul") { val = a.v * b.v; name = `${a.name}·${b.name}`; }
    if (op === "div") { val = a.v / b.v; name = `${a.name}/${b.name}`; }
    if (op === "sqrt") { val = Math.sqrt(a.v); name = `√${a.name}`; }
    name = name.replace(/^\((.*)\)$/, "$1");
    const frac = [2, 3, 4, 5, 6, 8].find((q) => Math.abs(val * q - Math.round(val * q)) < 1e-9);
    if (Math.abs(val - Math.round(val)) < 1e-9) name = String(Math.round(val));
    else if (frac) name = `${Math.round(val * frac)}/${frac}`;
    else if (Math.abs(val * val - Math.round(val * val)) < 1e-9) name = `√${Math.round(val * val)}`;
    if (pool.some((p) => Math.abs(p.v - val) < 1e-9)) { v.textContent = "이미 가진 길이입니다."; v.className = "verdict"; }
    else { pool.push({ v: val, name: name.length > 18 ? `≈${fmt(val)}` : name }); }
    last = { op, a: a.v, b: b ? b.v : null, val }; sel = [];
    const T = TARGET[ti];
    if (!T.impossible && Math.abs(val - T.v) < 1e-9) { done = true; v.textContent = `성공! ${T.name} ≈ ${fmt(T.v)}를 작도했습니다(연산 ${pool.length - 1}번).`; v.className = "verdict good"; }
    else if (!done) { v.textContent = `새 길이 ${fmt(val)}. 목표 ${T.name} ≈ ${fmt(T.v)}`; v.className = "verdict"; }
    render();
  }
  function draw() {
    const { w, h } = size; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    ctx.font = `600 12px ${F.sans}`; ctx.fillStyle = C.ink2; ctx.textAlign = "left"; ctx.textBaseline = "top";
    if (!last) { ctx.fillText("연산을 하면 그 작도 그림이 여기에 나타납니다.", 10, 10); return; }
    const L = last, sc = Math.min((w - 40) / Math.max(L.a + (L.b || 1), L.val, 2.2), (h - 40) / 2.2), ox = 20, oy = h - 22;
    const X = (x) => ox + x * sc, Y = (y) => oy - y * sc, seg = (x1, y1, x2, y2, col, lw = 2.4) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(X(x1), Y(y1)); ctx.lineTo(X(x2), Y(y2)); ctx.stroke(); };
    const lab = (t, x, y, col) => { ctx.fillStyle = col; ctx.font = `600 12px ${F.mono}`; ctx.fillText(t, X(x), Y(y)); };
    if (L.op === "add" || L.op === "sub") {
      seg(0, 0.6, L.a, 0.6, "#3f6fa3"); lab(`a = ${fmt(L.a)}`, 0, 0.9, "#3f6fa3");
      if (L.op === "add") { seg(L.a, 0.6, L.a + L.b, 0.6, "#b5532f"); lab(`b`, L.a + L.b / 2, 0.9, "#b5532f"); seg(0, 0.2, L.val, 0.2, C.forest, 4); }
      else { seg(L.a - L.b, 0.45, L.a, 0.45, "#b5532f"); lab("b", L.a - L.b / 2, 0.75, "#b5532f"); seg(0, 0.2, L.val, 0.2, C.forest, 4); }
      lab(`결과 ${fmt(L.val)} (컴퍼스로 길이를 옮겨 이어 붙이거나 덜어 냄)`, 0, 1.6, C.ink2);
    } else if (L.op === "mul" || L.op === "div") {
      // 꼭짓점 O, 한 반직선에 1과 b(또는 b와 1), 다른 반직선에 a; 평행선으로 결과
      const ang = 0.5, u = (t) => [t, 0], v = (t) => [t * Math.cos(ang), t * Math.sin(ang)];
      const one = L.op === "mul" ? 1 : L.b, other = L.op === "mul" ? L.b : 1, s2 = Math.min(1, 1.9 / Math.max(L.a, L.val, one, other) / Math.sin(ang));
      const U = (t) => u(t * s2), V = (t) => v(t * s2);
      seg(0, 0, ...U(Math.max(one, other) * 1.15), C.ink3, 1.5); seg(0, 0, ...V(Math.max(L.a, L.val) * 1.15), C.ink3, 1.5);
      seg(...U(one), ...V(L.a), "#3f6fa3"); seg(...U(other), ...V(L.val), "#b5532f", 2.4);
      lab(L.op === "mul" ? "1" : "b", ...U(one).map((x, i) => x + (i ? -0.12 : 0)), "#3f6fa3"); lab(L.op === "mul" ? "b" : "1", ...U(other).map((x, i) => x + (i ? -0.12 : 0)), "#b5532f");
      lab(`a`, ...V(L.a).map((x, i) => x + (i ? 0.08 : -0.15)), "#3f6fa3"); lab(`결과 ${fmt(L.val)}`, ...V(L.val).map((x, i) => x + (i ? 0.08 : -0.1)), C.forest);
      lab("평행선으로 닮은 삼각형을 만듦", 0.1, 2.1, C.ink2);
    } else {
      // 지름 a + 1인 반원, 경계에서 세운 수선의 길이 √a
      const D = L.a + 1, s3 = Math.min(1, (w - 40) / sc / D), r = (D / 2) * s3;
      ctx.strokeStyle = C.ink3; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(r), Y(0), r * sc, Math.PI, 0); ctx.stroke();
      seg(0, 0, L.a * s3, 0, "#3f6fa3"); seg(L.a * s3, 0, D * s3, 0, "#b5532f");
      seg(L.a * s3, 0, L.a * s3, L.val * s3, C.forest, 4);
      lab("a", (L.a * s3) / 2, -0.15, "#3f6fa3"); lab("1", L.a * s3 + 0.1 * s3, -0.15, "#b5532f"); lab(`√a = ${fmt(L.val)}`, L.a * s3 + 0.06, L.val * s3, C.forest);
      lab("지름 a + 1인 반원에 세운 수선: h² = a × 1", 0, 2.1, C.ink2);
    }
  }
  function load() { ti = +$(".pick").value; pool = [{ v: 1, name: "1" }]; sel = []; last = null; done = false; $(".verdict").textContent = ""; $(".verdict").className = "verdict"; render(); }
  root.querySelectorAll("[data-op]").forEach((b) => b.addEventListener("click", () => apply(b.dataset.op)));
  $(".go-no").addEventListener("click", () => {
    const T = TARGET[ti], v = $(".verdict");
    if (T.impossible) { done = true; v.textContent = "맞습니다. ∛2는 기약인 삼차방정식 x³ = 2의 근이라, 사칙연산과 제곱근으로는 만들 수 없습니다. 정육면체의 부피를 두 배로 하는 작도는 불가능합니다."; v.className = "verdict good"; }
    else { v.textContent = `${T.name}는 작도할 수 있습니다. 제곱근과 덧셈을 조합해 보세요.`; v.className = "verdict bad"; }
  });
  $(".go-reset").addEventListener("click", load);
  $(".pick").addEventListener("change", load);
  load();
})();
