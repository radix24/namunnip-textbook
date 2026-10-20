/* 공통수학1 본문 카드의 조작 그림 (js/lib/qfig.js의 NMQ를 쓴다). 그림마다 NMQ.def("이름", …). */
(() => {
  "use strict";
  const Q = window.NMQ;
  if (!Q) return;
  const { el, clear, txt, num } = Q;

  // 다항식의 연산: (x+3)(x+2) 넓이 모형
  Q.def("cm1-poly-area", (fig, svg) => {
    const g = el("g", {}, svg), read = fig.querySelector(".q-read");
    Q.bind(fig, ({ x }) => {
      clear(g);
      const u = 30, oy = 20, W = (x + 3) * u, H = (x + 2) * u;
      const s = Math.min(1, 420 / W, 250 / H), a = x * u * s, b3 = 3 * u * s, b2 = 2 * u * s, ox = (520 - a - b3) / 2;
      el("rect", { x: ox, y: oy, width: a, height: a, class: "la" }, g);
      el("rect", { x: ox + a, y: oy, width: b3, height: a, class: "lb" }, g);
      el("rect", { x: ox, y: oy + a, width: a, height: b2, class: "lb" }, g);
      el("rect", { x: ox + a, y: oy + a, width: b3, height: b2, class: "lc" }, g);
      el("rect", { x: ox, y: oy, width: a + b3, height: a + b2, class: "k" }, g);
      Q.line(g, ox + a, oy, ox + a, oy + a + b2, "k");
      Q.line(g, ox, oy + a, ox + a + b3, oy + a, "k");
      txt(g, ox + a / 2, oy + a / 2 + 5, "x²", "", "middle");
      txt(g, ox + a + b3 / 2, oy + a / 2 + 5, "3x", "", "middle");
      txt(g, ox + a / 2, oy + a + b2 / 2 + 5, "2x", "", "middle");
      txt(g, ox + a + b3 / 2, oy + a + b2 / 2 + 5, "6", "", "middle");
      txt(g, ox + a / 2, oy + a + b2 + 18, "x", "s", "middle");
      txt(g, ox + a + b3 / 2, oy + a + b2 + 18, "3", "s", "middle");
      txt(g, ox - 8, oy + a / 2 + 4, "x", "s", "end");
      txt(g, ox - 8, oy + a + b2 / 2 + 4, "2", "s", "end");
      const area = (x + 3) * (x + 2);
      read.textContent = `넓이 (x + 3)(x + 2) = ${num(x + 3)} × ${num(x + 2)} = ${num(area)}, 식 x² + 5x + 6에 넣으면 ${num(x * x)} + ${num(5 * x)} + 6 = ${num(x * x + 5 * x + 6)}`;
    });
  });

  // 나머지정리: P(x) = x³ − 2x² − 5x + 6, x = a에서의 높이
  Q.def("cm1-rem", (fig, svg) => {
    const P = (x) => x ** 3 - 2 * x * x - 5 * x + 6;
    const F = Q.frame(-3.5, 4.5, -12, 12, 20, 500, 10, 290);
    const bg = el("g", {}, svg), g = el("g", {}, svg), read = fig.querySelector(".q-read");
    Q.axes(bg, F, { step: 1, lstep: 2 });
    Q.plot(bg, F, P, "b");
    Q.bind(fig, ({ a }) => {
      clear(g);
      const r = P(a);
      Q.line(g, F.x(a), F.y(0), F.x(a), F.y(Math.max(-12, Math.min(12, r))), r === 0 ? "a" : "d");
      Q.dot(g, F.x(a), F.y(Math.max(-12, Math.min(12, r))), r === 0 ? "fa" : "fd", 5);
      read.textContent = `x − (${num(a)})로 나눈 나머지 = P(${num(a)}) = ${num(r, 3)}` + (r === 0 ? ", 나누어떨어진다" : "");
    });
  });

  // 인수분해: a² − b² L자 도형 → (a+b)(a−b) 직사각형 (a = 5)
  Q.def("cm1-sqdiff", (fig, svg) => {
    const g = el("g", {}, svg), read = fig.querySelector(".q-read");
    Q.bind(fig, ({ b, t }) => {
      clear(g);
      const a = 5, u = 38, ox = 40, oy = 16, ab = a - b;
      // 고정 조각: 왼쪽 a × (a−b) 아래 띠가 아니라, 위 띠 a × (a−b) 를 두고 오른쪽 아래 (a−b) × b 를 옮긴다
      el("rect", { x: ox, y: oy, width: a * u, height: ab * u, class: "la" }, g);
      el("rect", { x: ox, y: oy, width: a * u, height: ab * u, class: "k" }, g);
      // 옮기는 조각: 처음 위치 (x: 0~a−b, y: a−b~a) 크기 (a−b)×b → 회전해 오른쪽 (x: a~a+b, y: 0~a−b)
      const x0 = ox, y0 = oy + ab * u, x1 = ox + a * u, y1 = oy;
      const cx = x0 + (x1 - x0) * t, cy = y0 + (y1 - y0) * t;
      const w = ab * u + (b * u - ab * u) * t, h = b * u + (ab * u - b * u) * t;
      el("rect", { x: cx, y: cy, width: w, height: h, class: "lb" }, g);
      el("rect", { x: cx, y: cy, width: w, height: h, class: "b" }, g);
      if (t === 0) el("rect", { x: ox + ab * u, y: oy + ab * u, width: b * u, height: b * u, class: "gd dsh" }, g);
      txt(g, ox + a * u / 2, oy - 2 + 14, "", "s", "middle");
      txt(g, ox + a * u / 2, oy + ab * u / 2 + 5, `${num(a)} × ${num(ab)}`, "", "middle");
      txt(g, cx + w / 2, cy + h / 2 + 5, `${num(ab)} × ${num(b)}`, "tb", "middle");
      if (t === 1) {
        txt(g, ox + (a + b) * u / 2, oy + ab * u + 20, `가로 a + b = ${num(a + b)}`, "s", "middle");
        txt(g, ox + (a + b) * u + 8, oy + ab * u / 2 + 4, `세로 a − b = ${num(ab)}`, "s");
      }
      read.textContent = `a = 5, b = ${num(b)}일 때 a² − b² = ${num(a * a - b * b)}, (a + b)(a − b) = ${num(a + b)} × ${num(ab)} = ${num((a + b) * ab)}`;
    });
  });

  // 복소수: i의 거듭제곱이 네 자리를 돈다
  Q.def("cm1-ipow", (fig, svg) => {
    const g = el("g", {}, svg), read = fig.querySelector(".q-read");
    const cx = 260, cy = 130, R = 90, pos = [[1, 0], [0, -1], [-1, 0], [0, 1]], name = ["1", "i", "−1", "−i"];
    el("circle", { cx, cy, r: R, class: "gd" }, svg);
    pos.forEach(([px, py], k) => txt(svg, cx + px * (R + 26), cy + py * (R + 18) + 5, name[k], "i", "middle"));
    Q.bind(fig, ({ n }) => {
      clear(g);
      for (let k = 0; k < Math.min(n, 12); k++) {
        const [ax, ay] = pos[k % 4], [bx, by] = pos[(k + 1) % 4];
        const off = 4 + Math.floor(k / 4) * 6;
        el("path", { d: `M${cx + ax * (R - off)} ${cy + ay * (R - off)} Q${cx + (ax + bx) * (R - off) * .75} ${cy + (ay + by) * (R - off) * .75} ${cx + bx * (R - off)} ${cy + by * (R - off)}`, class: "b" }, g);
      }
      const [px, py] = pos[n % 4];
      Q.dot(g, cx + px * R, cy + py * R, "fd", 7);
      read.textContent = `i의 ${n}제곱 = ${name[n % 4]} (${n}을 4로 나눈 나머지가 ${n % 4})`;
    });
  });

  // 이차함수 그래프 하나와 x축 교점 (판별식·이차함수 절에서 함께 쓴다)
  function quadFig(fig, svg, f, info, box) {
    const F = Q.frame(...(box || [-3, 5, -5, 7]), 20, 500, 10, 270);
    const bg = el("g", {}, svg), g = el("g", {}, svg), read = fig.querySelector(".q-read");
    Q.axes(bg, F, { step: 1 });
    Q.bind(fig, (v) => {
      clear(g);
      const { a, b, c } = f(v);
      Q.plot(g, F, (x) => a * x * x + b * x + c, "b");
      const D = b * b - 4 * a * c;
      if (D >= 0) [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].forEach((r) => Q.dot(g, F.x(r), F.y(0), "fd", 5));
      read.textContent = info(v, D);
    });
  }
  Q.def("cm1-vieta", (fig, svg) => quadFig(fig, svg, ({ p, q }) => ({ a: 1, b: -(p + q), c: p * q }),
    ({ p, q }) => `x² − (${num(p + q)})x + (${num(p * q)}) = 0: 두 근의 합 ${num(p + q)}, 곱 ${num(p * q)}`, [-5, 5, -6, 8]));
  Q.def("cm1-qf", (fig, svg) => quadFig(fig, svg, ({ k }) => ({ a: 1, b: -4, c: k }),
    ({ k }, D) => `꼭짓점 (2, ${num(k - 4)}), D/4 = ${num(D / 4)}: ` + (D > 0 ? "x축과 두 점에서 만난다" : D === 0 ? "x축에 접한다" : "x축과 만나지 않는다"), [-2, 6, -4, 8]));
  // 포물선 y = x²과 직선 y = 2x + k
  Q.def("cm1-lp", (fig, svg) => {
    const F = Q.frame(-3, 4, -3, 10, 20, 500, 10, 270);
    const bg = el("g", {}, svg), g = el("g", {}, svg), read = fig.querySelector(".q-read");
    Q.axes(bg, F, { step: 1, lstep: 2 });
    Q.plot(bg, F, (x) => x * x, "b");
    Q.bind(fig, ({ k }) => {
      clear(g);
      Q.plot(g, F, (x) => 2 * x + k, "c");
      const D4 = 1 + k;
      if (D4 >= 0) [1 - Math.sqrt(D4), 1 + Math.sqrt(D4)].forEach((r) => Q.dot(g, F.x(r), F.y(r * r), "fd", 5));
      read.textContent = `x² − 2x − (${num(k)}) = 0의 D/4 = ${num(D4)}: ` + (D4 > 0 ? "두 점에서 만난다" : D4 === 0 ? "점 (1, 1)에서 접한다" : "만나지 않는다");
    });
  });
  // 최대·최소: y = x² − 4x + 1, 범위 [p, p + 2]
  Q.def("cm1-minmax", (fig, svg) => {
    const f = (x) => x * x - 4 * x + 1;
    const F = Q.frame(-2, 7, -4, 12, 20, 500, 10, 270);
    const bg = el("g", {}, svg), g = el("g", {}, svg), read = fig.querySelector(".q-read");
    Q.axes(bg, F, { step: 1, lstep: 2 });
    Q.plot(bg, F, f, "gd");
    Q.bind(fig, ({ p }) => {
      clear(g);
      const q = p + 2;
      el("rect", { x: F.x(p), y: F.Y0, width: F.x(q) - F.x(p), height: F.Y1 - F.Y0, class: "lk", opacity: .6 }, g);
      Q.plot(g, F, f, "b", p, q);
      const cand = [p, q];
      if (p <= 2 && 2 <= q) cand.push(2);
      let lo = cand[0], hi = cand[0];
      cand.forEach((x) => { if (f(x) < f(lo)) lo = x; if (f(x) > f(hi)) hi = x; });
      Q.dot(g, F.x(lo), F.y(f(lo)), "fb", 6);
      Q.dot(g, F.x(hi), F.y(f(hi)), "fd", 6);
      read.textContent = `${num(p)} ≤ x ≤ ${num(q)}: 최솟값 ${num(f(lo))} (x = ${num(lo)}), 최댓값 ${num(f(hi))} (x = ${num(hi)})`;
    });
  });
  // 삼차방정식: 상자의 부피 V = x(10 − 2x)(8 − 2x)
  Q.def("cm1-cubic", (fig, svg) => {
    const V = (x) => x * (10 - 2 * x) * (8 - 2 * x);
    const F = Q.frame(-0.5, 7, -60, 80, 30, 500, 10, 270);
    const bg = el("g", {}, svg), g = el("g", {}, svg), read = fig.querySelector(".q-read");
    Q.axes(bg, F, { step: 1, label: false });
    for (let x = 1; x <= 7; x++) txt(bg, F.x(x), F.y(0) + 14, String(x), "s", "middle");
    for (let y = -40; y <= 80; y += 20) if (y) txt(bg, F.x(0) - 5, F.y(y) + 4, num(y), "s", "end");
    el("rect", { x: F.x(4), y: F.Y0, width: F.X1 - F.x(4), height: F.Y1 - F.Y0, class: "lk", opacity: .7 }, bg);
    txt(bg, F.x(5.5), F.Y0 + 16, "x > 4는 상자가 안 된다", "s", "middle");
    Q.plot(bg, F, V, "b");
    Q.line(bg, F.X0, F.y(48), F.X1, F.y(48), "c dsh");
    txt(bg, F.X1 - 4, F.y(48) - 6, "V = 48", "tc", "end");
    [1, 2, 6].forEach((r) => Q.dot(bg, F.x(r), F.y(48), "fc", 4));
    Q.bind(fig, ({ x }) => {
      clear(g);
      Q.line(g, F.x(x), F.y(0), F.x(x), F.y(V(x)), "d");
      Q.dot(g, F.x(x), F.y(V(x)), "fd", 5);
      read.textContent = `높이 ${num(x)}, 밑면 ${num(10 - 2 * x)} × ${num(8 - 2 * x)}, 부피 ${num(V(x))}` + (Math.abs(V(x) - 48) < 1e-9 ? " = 48" : "");
    });
  });
  Q.def("cm1-disc", (fig, svg) => quadFig(fig, svg, ({ c }) => ({ a: 1, b: -2, c }),
    ({ c }, D) => `D/4 = 1 − c = ${num(D / 4)}: ` + (D > 0 ? "서로 다른 두 실근" : D === 0 ? "중근 x = 1" : "서로 다른 두 허근 (x축과 만나지 않음)")));
})();
