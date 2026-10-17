/* 카드: 내가 궁금한 것을 인공지능 수학 탐구 주제로 바꿀 수 있을까? — 질문·자료·도구·평가를 골라 계획서 만들기 */
(() => {
  const root = document.getElementById("card-aimath-explore-plan");
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  /* 각 선택지: [이름, 성질 태그] */
  const SETS = [
    ["질문", [["급식 잔반량을 날씨와 메뉴로 예측할 수 있을까?", "num"], ["학교 게시판 글을 주제별로 자동 분류할 수 있을까?", "text"], ["손으로 그린 도형(원, 세모, 네모)을 구별할 수 있을까?", "image"], ["인공지능은 사람보다 똑똑할까?", "vague"]]],
    ["자료", [["급식실 잔반 기록과 날씨 기록 60일", "num"], ["공개 게시판 글 200개(이름 지움)", "text"], ["친구들이 그린 도형 그림 150장", "image"], ["친구들의 휴대폰 메시지(허락 없이)", "private"], ["자료 5개", "tiny"]]],
    ["수학 도구", [["추세선과 손실함수(최소제곱)", "num"], ["낱말 빈도 벡터와 코사인 유사도", "text"], ["이미지 행렬과 거리(최근접 이웃)", "image"], ["조건부확률(나이브 베이즈)", "text num"]]],
    ["평가 방법", [["학습에 안 쓴 자료로 오차·정확도 재기", "good"], ["학습에 쓴 자료로 정확도 재기", "train"], ["결과가 그럴듯한지 눈으로 보기", "eye"]]],
  ];
  const pick = [0, 0, 0, 0];
  $(".sets").innerHTML = SETS.map(([nm, opts], s) => `<fieldset><legend>${s + 1}. ${nm}</legend><div class="opts" role="group" aria-label="${nm}">${opts.map(([t], k) => `<button class="chip" type="button" data-s="${s}" data-k="${k}">${t}</button>`).join("")}</div></fieldset>`).join("");
  function update() {
    root.querySelectorAll("[data-s]").forEach((b) => b.setAttribute("aria-pressed", String(pick[+b.dataset.s] === +b.dataset.k)));
    const ch = pick.map((k, s) => SETS[s][1][k]), [q, d, t, e] = ch, W = [];
    if (q[1] === "vague") W.push("질문이 너무 넓어 자료와 수학으로 답할 수 없습니다. 측정할 수 있는 구체적인 질문으로 좁히세요.");
    if (d[1] === "private") W.push("허락받지 않은 개인 정보는 쓸 수 없습니다. 동의를 받거나 공개된 자료를 쓰세요.");
    if (d[1] === "tiny") W.push("자료 5개로는 학습과 평가를 나눌 수 없고, 결과를 믿기 어렵습니다.");
    const kind = q[1] === "vague" ? null : q[1];
    if (kind && !["private", "tiny"].includes(d[1]) && d[1] !== kind) W.push("질문과 자료의 종류가 맞지 않습니다(예: 글을 분류하려면 글 자료가 필요).");
    if (kind && !t[1].split(" ").includes(kind)) W.push("자료의 종류에 맞지 않는 수학 도구입니다.");
    if (e[1] === "train") W.push("학습에 쓴 자료로만 평가하면 과대적합을 알아챌 수 없습니다.");
    if (e[1] === "eye") W.push("눈으로만 보면 기준이 없습니다. 오차나 정확도를 수로 재세요.");
    $(".plan").innerHTML = `<b>탐구 계획서</b><br>질문: ${q[0]}<br>자료: ${d[0]}<br>수학 도구: ${t[0]}<br>평가: ${e[0]}`;
    $(".warnings").innerHTML = W.length ? W.map((w) => `<li>${w}</li>`).join("") : `<li style="color:#3b7c2a">문제가 없는 계획입니다. 자료를 학습용과 평가용으로 어떻게 나눌지(예: 70%와 30%) 정하면 시작할 수 있습니다.</li>`;
  }
  root.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => { pick[+b.dataset.s] = +b.dataset.k; update(); }));
  /* 처음에는 일부러 문제가 있는 조합 */
  pick[0] = 3; pick[1] = 4; pick[2] = 0; pick[3] = 1;
  update();
})();
