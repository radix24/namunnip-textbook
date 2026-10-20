/* 연습 시험 화면 (bank.html): 과목의 AI 출제 연습 문항으로 중간·기말 범위 시험지를 풀고 채점한다.
   bank.html?c=<과목>                 시험지 고르기(중간고사·기말고사 범위, 절별 연습)
   bank.html?c=<과목>&r=mid|fin&s=2   그 범위의 2번 시험지(r=all은 전 범위). &s=x면 무작위로 새로 뽑은 시험지
   bank.html?c=<과목>&sec=1-2         그 절의 문항만, 한 문항씩 바로 채점
   &lv=b|ah|h                         무작위 시험지와 절별 연습에서 난이도 고르기(기본 / 응용·심화 / 심화)
   문항: exams/bank/<과목>.json (형식은 tools/bank.py 머리말). 중간고사 범위는 목차 순서로 앞쪽 절 TOC[c].split개(tools/build.py exam_split), 기말고사는 나머지.
   시험지: 범위의 문항을 절 순서대로 늘어놓고 차례로 1, 2, …, n번 시험지에 나눠 담는다(장마다 문항이 겹치지 않고 모든 절이 고루 들어간다).
           서술형(free)은 따로 이어서 나눠 담아 장마다 고르게 들어가고 시험지 끝에 온다. 서술형은 모범 답안과 채점 기준을 보고 학생이 스스로 채점한다.
   기록: 문항마다 NMStore.recordAnswer(id, 0, …) — 처음에 틀린 문항은 오답노트(notes.html)에 모인다.
         시험지 점수는 localStorage "namunnip-bank-v3" = { "<과목>/<범위>/<장>": { n, ok, at } } (없어도 화면은 돈다). */
(() => {
  "use strict";
  const S = window.NMStore;
  const body = document.getElementById("bk-body");
  if (!body || !window.TOC) return;
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const CIRCLE = ["①", "②", "③", "④", "⑤"];
  const R = ["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ"];
  const PER = 20;   // 시험지 한 장의 문항 수(대략). tools/bank.py의 SHEET와 같게
  const KEY = "namunnip-bank-v3";  // v1·v2는 층별 재배치·문항 교체 전 시험지 점수라 버린다
  const AI = `<span class="bk-ai">AI 출제 연습 문항</span>`;

  const P = new URLSearchParams(location.search);
  const c = TOC.find((x) => x.id === P.get("c"));
  const head = document.getElementById("px-head");
  if (!c) { head.innerHTML = `<h1>연습 시험</h1><p class="lead">과목을 찾을 수 없습니다. <a href="./">전체 목차</a>에서 과목을 고른 뒤 <b>연습 시험</b>을 눌러 주세요.</p>`; return; }
  document.getElementById("px-back").href = `c/${c.id}/`;

  const secOrder = {}, flat = [];
  c.chapters.forEach((ch) => ch.sections.forEach((s) => { secOrder[`${ch.n}-${s.n}`] = { ch, s, i: flat.length }; flat.push({ ch, s }); }));
  const split = Math.min(c.split || flat.length, flat.length);
  const part = (a, b) => { const fs = flat.slice(a, b); return { fs, chs: c.chapters.filter((ch) => fs.some((f) => f.ch === ch)), lo: a, hi: b }; };
  const RANGES = { mid: { name: "중간고사", ...part(0, split) }, fin: { name: "기말고사", ...part(split, flat.length) }, all: { name: "전 범위", ...part(0, flat.length) } };
  if (!RANGES.fin.fs.length) delete RANGES.fin;
  const inRange = (r) => (it) => secOrder[it.sec].i >= RANGES[r].lo && secOrder[it.sec].i < RANGES[r].hi;
  /* 범위 이름: 대단원 경계면 'Ⅰ~Ⅱ단원', 대단원 중간에서 나뉘면 'Ⅰ단원~Ⅱ.3' */
  const rangeLabel = (r) => {
    const { fs } = RANGES[r], a = fs[0], b = fs[fs.length - 1];
    const whole = (f, end) => (end ? f.s === f.ch.sections[f.ch.sections.length - 1] : f.s === f.ch.sections[0]);
    const A = whole(a, false) ? `${R[a.ch.n]}` : `${R[a.ch.n]}.${a.s.n}`, B = whole(b, true) ? `${R[b.ch.n]}` : `${R[b.ch.n]}.${b.s.n}`;
    return A === B ? `${A}단원` : whole(a, false) && whole(b, true) ? `${A}~${B}단원` : `${A}~${B}`;
  };

  let scores = {};
  try { scores = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { scores = {}; }
  try { ["namunnip-bank-v1", "namunnip-bank-v2"].forEach((k) => localStorage.removeItem(k)); } catch (e) { /* 지울 수 없어도 v3만 읽는다 */ }
  const saveScore = (k, v) => { scores[k] = v; try { localStorage.setItem(KEY, JSON.stringify(scores)); } catch (e) { /* 저장 못 해도 채점은 된다 */ } };

  const bySec = (a, b) => secOrder[a.sec].i - secOrder[b.sec].i || (a.id < b.id ? -1 : 1);
  const freeLast = (a, b) => (a.type === "free") - (b.type === "free");
  /* 난이도 층: 객관식·단답형을 기본→응용→심화로, 그다음 서술형을 같은 순서로 늘어놓는다(층 안은 단원 순서).
     이 순서대로 돌려 담거나 뽑으면 장마다 층별 문항 수가 ±1 안에서 같고 단원도 고르게 섞인다. tools/bank.py balance와 같은 규칙 */
  const LV_ORDER = ["기본", "응용", "심화"];
  const tierOf = (it) => (it.type === "free" ? 3 : 0) + Math.max(0, LV_ORDER.indexOf(it.lv));
  const byTier = (a, b) => tierOf(a) - tierOf(b) || bySec(a, b);
  function sheets(items, r) {
    const pool = items.filter(inRange(r)).sort(byTier);
    const n = pool.length ? Math.max(1, Math.round(pool.length / PER)) : 0;
    const out = Array.from({ length: n }, () => []);
    pool.forEach((it, i) => out[i % n].push(it));
    return out.map((s) => s.sort(bySec).sort(freeLast));
  }
  /* 무작위 시험지: 층마다 범위 안 비율대로 몫을 정하고(최대 나머지 방식), 층 안에서는 단원을 번갈아 가며 뽑는다 */
  function randomSheet(pool) {
    const want = Math.min(PER, pool.length);
    const tiers = {};
    pool.forEach((it) => (tiers[tierOf(it)] = tiers[tierOf(it)] || []).push(it));
    const keys = Object.keys(tiers);
    const quota = {}; let given = 0;
    keys.forEach((t) => { quota[t] = Math.floor(want * tiers[t].length / pool.length); given += quota[t]; });
    keys.slice().sort((a, b) => (want * tiers[b].length / pool.length % 1) - (want * tiers[a].length / pool.length % 1))
      .forEach((t) => { if (given < want && quota[t] < tiers[t].length) { quota[t]++; given++; } });
    const out = [];
    keys.forEach((t) => {
      const bucket = {};
      shuffle(tiers[t]).forEach((it) => (bucket[it.sec] = bucket[it.sec] || []).push(it));
      const secs = shuffle(Object.keys(bucket));
      for (let i = 0, got = 0; got < quota[t]; i++) {
        const b = bucket[secs[i % secs.length]];
        if (b.length) { out.push(b.pop()); got++; }
      }
    });
    return out.sort(bySec).sort(freeLast);
  }
  const lvMix = (xs) => {
    const n = lvCount(xs), m = n.기본 + n.응용 + n.심화;
    const avg = m ? (n.기본 + 2 * n.응용 + 3 * n.심화) / m : 0;
    return `기본 ${n.기본} · 응용 ${n.응용} · 심화 ${n.심화}${n.free ? ` · 서술형 ${n.free}` : ""} · 평균 난이도 ${avg.toFixed(2)}`;
  };
  /* 난이도 거르기: lv=b 기본, ah 응용·심화, h 심화 */
  const LVF = { b: ["기본"], ah: ["응용", "심화"], h: ["심화"] };
  const LVN = { b: "기본", ah: "응용·심화", h: "심화" };
  const lvKey = LVF[P.get("lv")] ? P.get("lv") : "";
  const lvOk = (it) => !lvKey || LVF[lvKey].includes(it.lv);
  const lvCount = (xs) => { const n = { 기본: 0, 응용: 0, 심화: 0, free: 0 }; xs.forEach((it) => { if (n[it.lv] != null) n[it.lv]++; if (it.type === "free") n.free++; }); return n; };
  const lvLinks = (base) => `<span class="bk-lvs">${[["", "전체"], ["b", "기본"], ["ah", "응용·심화"], ["h", "심화"]].map(([k, t]) => `<a href="${base}${k ? `&lv=${k}` : ""}"${k === lvKey ? ' aria-current="true"' : ""}>${t}</a>`).join("")}</span>`;
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  const crumbs = document.querySelector(".crumbs");
  const crumb = (last) => { crumbs.innerHTML = `<span aria-hidden="true">/</span><a href="c/${c.id}/">${esc(c.name)}</a><span aria-hidden="true">/</span>${last ? `<a href="bank.html?c=${c.id}">연습 시험</a><span aria-hidden="true">/</span><b>${esc(last)}</b>` : "<b>연습 시험</b>"}`; };
  const recOf = (it) => { const r = S && S.get(it.id); return r && r.quiz && r.quiz[0]; };
  const secName = (sec) => { const o = secOrder[sec]; return o ? `${o.ch.n}.${o.s.n} ${o.s.title}` : sec; };

  /* ───── 채점: 객관식은 번호, 단답형은 공백·전각 무시, 숫자(분수·소수)는 값으로 비교 ───── */
  const norm = (v) => String(v ?? "").normalize("NFKC").replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/^\+/, "").toLowerCase();
  const num = (v) => { const s = norm(v); let m; if ((m = /^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(s))) return +m[1] / +m[2]; return /^-?\d*\.?\d+$/.test(s) ? +s : NaN; };
  function correct(it, v) {
    if (it.type === "mc") return String(v) === String(it.answer);
    return [it.answer, ...(it.alt || [])].some((a) => { const x = num(a), y = num(v); return !isNaN(x) && !isNaN(y) ? Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(x)) : norm(a) === norm(v); });
  }
  const shown = (it) => (it.type === "mc" ? CIRCLE[+it.answer - 1] : it.answer);

  const fullPt = (it) => (it.rubric || []).reduce((s, x) => s + x.pt, 0);
  function itemHtml(it, k, instant) {
    const r = recOf(it), o = secOrder[it.sec], free = it.type === "free";
    const ans = it.type === "mc"
      ? `<div class="px-opts long" role="group" aria-label="답 고르기">${it.choices.map((t, i) => `<button type="button" class="px-opt" data-v="${i + 1}" aria-pressed="false"><span class="n">${CIRCLE[i]}</span><span class="c">${t}</span></button>`).join("")}</div>`
      : free ? `<div class="bk-free"><textarea rows="6" aria-label="풀이 과정과 답 쓰기" placeholder="풀이 과정과 답을 쓰세요(종이에 써도 됩니다)"></textarea>${instant ? `<button type="button" class="btn bk-show">모범 답안 보고 채점하기</button>` : ""}</div>`
      : `<form class="px-short"><input type="text" aria-label="답 쓰기" placeholder="답" autocomplete="off">${instant ? `<button type="submit" class="btn">확인</button>` : ""}</form>`;
    const hints = it.hints && it.hints.length ? `<details class="bk-hint"><summary>힌트</summary>${it.hints.map((h, i) => `<p><span class="mono">${i + 1}</span> ${h}</p>`).join("")}</details>` : "";
    const rub = free ? `<div class="bk-rub"><b>채점 기준</b><span class="small dim"> 내 답안에 들어 있는 요소를 고르세요.</span>
        ${it.rubric.map((x, i) => `<label><input type="checkbox" data-pt="${x.pt}" data-i="${i}"> <span>${x.t}</span> <span class="mono">${x.pt}점</span></label>`).join("")}
        <p class="bk-self mono">자기 채점 <b>0</b> / ${fullPt(it)}점</p></div>` : "";
    return `<article class="px-item bk-item${free ? " free" : ""}" id="${esc(it.id)}" data-id="${esc(it.id)}">
      <header><span class="bk-no">${k}</span><a class="mono dim" href="c/${c.id}/${o.ch.n}-${o.s.n}.html">${esc(secName(it.sec))}</a>${it.lv ? `<span class="bk-lv lv-${esc(it.lv)}">${esc(it.lv)}</span>` : ""}${it.type === "short" ? `<span class="mono dim">단답형</span>` : free ? `<span class="mono dim">서술형 ${fullPt(it)}점</span>` : ""}${r ? `<span class="mono px-prev ${r.firstOk ? "ok" : "bad"}">${r.firstOk ? "전에 맞힘" : "오답노트에 있음"}</span>` : ""}</header>
      <div class="px-text"><div class="px-stem">${it.q}</div></div>
      ${hints}${ans}
      <p class="px-result" aria-live="polite"></p>
      <div class="bk-sol" hidden><b>${free ? "모범 답안" : "풀이"}</b>${it.sol}${rub}<p class="mono small"><a href="c/${c.id}/${o.ch.n}-${o.s.n}.html">이 절 다시 보기 · ${esc(secName(it.sec))}</a></p></div>
    </article>`;
  }

  /* 서술형: 답안을 잠그고 모범 답안·채점 기준을 연다. 점수는 학생이 기준을 골라 매긴다 */
  function openFree(card, it) {
    const ta = card.querySelector("textarea"); if (ta) ta.readOnly = true;
    const b = card.querySelector(".bk-show"); if (b) b.remove();
    card.querySelector(".px-result").innerHTML = `<b>결론</b> ${it.answer}`;
    card.querySelector(".bk-sol").hidden = false;
    if (S) S.markSeen(it.id);
  }
  const selfPt = (card) => [...card.querySelectorAll(".bk-rub input:checked")].reduce((s, x) => s + +x.dataset.pt, 0);
  function onRubric(e, after) {
    const box = e.target.closest(".bk-rub input"); if (!box) return;
    const card = box.closest(".bk-item");
    card.querySelector(".bk-self b").textContent = selfPt(card);
    if (after) after();
  }

  function mark(card, it, v) {
    const ok = correct(it, v);
    card.querySelectorAll(".px-opt").forEach((b) => {
      b.disabled = true;
      b.classList.toggle("right", b.dataset.v === String(it.answer));
      b.classList.toggle("wrong", !ok && b.dataset.v === String(v));
    });
    const inp = card.querySelector(".px-short input"); if (inp) inp.disabled = true;
    const btn = card.querySelector(".px-short button"); if (btn) btn.disabled = true;
    const got = v === "" || v == null ? "답 없음" : it.type === "mc" ? CIRCLE[+v - 1] : v;
    card.querySelector(".px-result").innerHTML = ok ? `<b>맞았습니다.</b> 정답 ${esc(shown(it))}` : `<b>틀렸습니다.</b> 고른 답 ${esc(got)} · 정답 ${esc(shown(it))}`;
    card.classList.toggle("bad", !ok); card.classList.toggle("ok", ok);
    card.querySelector(".bk-sol").hidden = false;
    if (S) {
      S.recordAnswer(it.id, 0, {
        ok, q: `${c.name} 연습 · ${secName(it.sec)}`, answer: shown(it), why: it.sol.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300),
        chosen: got, chosenWhy: "",
        extra: { src: `AI 연습 · ${c.name} ${secName(it.sec)}`, sec: `${c.id}-${it.sec}`, href: `bank.html?c=${c.id}&sec=${it.sec}#${it.id}`, html: it.q, choices: it.choices || null, ai: true },
      });
      S.markSeen(it.id);
    }
    return ok;
  }

  /* ───── 시험지 고르기 ───── */
  function hub(items) {
    crumb("");
    document.title = `연습 시험 · ${c.name} — 나뭇잎 교과서`;
    head.innerHTML = `<span class="mono dim">${esc(c.name)} · ${esc(c.meta)}</span>
      <h1>${esc(c.name)} <em>연습 시험</em></h1>
      <p class="lead">${AI} 중간고사(${rangeLabel("mid")})${RANGES.fin ? `와 기말고사(${rangeLabel("fin")})` : ""} 범위로 시험지를 골라 푸세요. 한 장에 ${PER}문항 안팎이며, 장마다 문항이 겹치지 않습니다. 다 풀고 <b>채점하기</b>를 누르면 점수와 풀이가 나옵니다.</p>
      <p class="mono small dim">문항 ${items.length} · 실제 시험 문항이 아니라 AI가 고등학교 교육과정 범위에서 출제한 문항입니다.</p>`;
    const range = (r) => {
      const sh = sheets(items, r);
      if (!sh.length) return "";
      return `<section class="bk-range">
        <h2>${RANGES[r].name} <span class="mono dim">${r === "all" ? "" : rangeLabel(r)}</span></h2>
        <p class="small dim">${RANGES[r].chs.map((ch) => { const n = RANGES[r].fs.filter((f) => f.ch === ch).length; return `${R[ch.n]}. ${esc(ch.title)}${n < ch.sections.length ? ` (${n}절)` : ""}`; }).join(" · ")}</p>
        <div class="bk-sheets">${sh.map((s, i) => { const sc = scores[`${c.id}/${r}/${i + 1}`]; return `<a class="bk-sheet" href="bank.html?c=${c.id}&r=${r}&s=${i + 1}"><b>시험지 ${i + 1}</b><span class="mono">${s.length}문항</span><span class="mono dim">${(() => { const n = lvCount(s); return `기본 ${n.기본} · 응용 ${n.응용} · 심화 ${n.심화}`; })()}</span><span class="mono ${sc ? "ok" : "dim"}">${sc ? `최근 ${sc.ok}/${sc.n}` : "아직 안 풂"}</span></a>`; }).join("")}
          <a class="bk-sheet rand" href="bank.html?c=${c.id}&r=${r}&s=x"><b>무작위 시험지</b><span class="mono">${Math.min(PER, items.filter(inRange(r)).length)}문항</span><span class="mono dim">풀 때마다 새로 뽑음</span></a></div>
        <p class="small bk-lvrow">${(() => { const n = lvCount(items.filter(inRange(r))); return `<span class="mono dim">기본 ${n.기본} · 응용 ${n.응용} · 심화 ${n.심화}${n.free ? ` · 서술형 ${n.free}` : ""}</span>`; })()} 난이도를 골라 무작위로 풀기 ${lvLinks(`bank.html?c=${c.id}&r=${r}&s=x`)}</p>
      </section>`;
    };
    const perSec = {}; items.forEach((it) => { perSec[it.sec] = (perSec[it.sec] || 0) + 1; });
    body.innerHTML = range("mid") + (RANGES.fin ? range("fin") : "") + `
      <section class="bk-range"><h2>절별 연습 <span class="mono dim">한 문항씩 바로 채점</span></h2>
        ${c.chapters.map((ch) => `<h3 class="bk-ch">${R[ch.n]}. ${esc(ch.title)}</h3><ul class="bk-secs">${ch.sections.map((s) => { const k = `${ch.n}-${s.n}`, n = perSec[k] || 0;
          return `<li>${n ? `<a href="bank.html?c=${c.id}&sec=${k}">` : "<span class=\"dim\">"}<span class="mono">${ch.n}.${s.n}</span> ${esc(s.title)}${n ? "</a>" : "</span>"}<span class="mono dim">${n ? `${n}문항` : "준비 중"}${s.ex ? ` · <a href="practice.html?sec=${c.id}-${k}">기출 ${s.ex}</a>` : ""}</span></li>`; }).join("")}</ul>`).join("")}
      </section>`;
  }

  /* ───── 시험지: 다 풀고 한꺼번에 채점 ───── */
  function sheet(items, r, sNo) {
    if (!RANGES[r]) r = "mid";
    const sh = sheets(items, r);
    const rand = sNo === "x";
    const k = rand ? 0 : Math.min(Math.max(1, +sNo || 1), sh.length || 1);
    const list = rand ? randomSheet(items.filter(inRange(r)).filter(lvOk)) : sh[k - 1] || [];
    const title = `${RANGES[r].name} ${rand ? `무작위 시험지${lvKey ? ` · ${LVN[lvKey]}` : ""}` : `시험지 ${k}`}`;
    crumb(title);
    document.title = `${title} · ${c.name} — 나뭇잎 교과서`;
    head.innerHTML = `<span class="mono dim">${esc(c.name)} · ${RANGES[r].name} 범위 ${r === "all" ? "" : rangeLabel(r)}</span>
      <h1>${esc(c.name)} <em>${esc(title)}</em></h1>
      <p class="lead">${AI} ${list.length}문항입니다. 객관식은 번호를 고르고, 단답형은 답을 적으세요.${list.some((it) => it.type === "free") ? " 서술형은 풀이 과정을 쓰고, 채점 뒤 모범 답안과 채점 기준을 보고 스스로 점수를 매깁니다." : ""} 다 풀면 맨 아래 <b>채점하기</b>를 누릅니다.</p>
      <p class="mono small bk-lvrow">난이도 구성: ${lvMix(list)} <span class="dim">(기본 1 · 응용 2 · 심화 3으로 평균)</span></p>
      <p class="mono small dim">실제 시험 문항이 아닙니다. 고등학교 교육과정 범위에서 AI가 출제했습니다.</p>`;
    const nav = rand ? `<a class="btn ghost" href="bank.html?c=${c.id}&r=${r}&s=x${lvKey ? `&lv=${lvKey}` : ""}">다른 무작위 시험지</a>`
      : `${k > 1 ? `<a class="btn ghost" href="bank.html?c=${c.id}&r=${r}&s=${k - 1}">← 시험지 ${k - 1}</a>` : ""}${k < sh.length ? `<a class="btn ghost" href="bank.html?c=${c.id}&r=${r}&s=${k + 1}">시험지 ${k + 1} →</a>` : ""}`;
    body.innerHTML = `<div class="px-list bk-list">${list.map((it, i) => itemHtml(it, i + 1, false)).join("")}</div>
      <div class="bk-submit"><button type="button" class="btn" id="bk-grade">채점하기</button><span class="mono small dim" id="bk-left"></span></div>
      <div class="bk-score" id="bk-score" hidden></div>
      <p class="bk-nav"><a class="btn ghost" href="bank.html?c=${c.id}">시험지 목록</a>${nav}</p>`;
    if (window.NMMath) NMMath.render(body);
    const pick = {};
    const left = () => { const n = list.filter((it) => (pick[it.id] ?? "") === "").length; document.getElementById("bk-left").textContent = n ? `안 푼 문항 ${n}` : "모두 풀었습니다"; };
    body.addEventListener("click", (e) => {
      const b = e.target.closest(".px-opt"); if (!b || b.disabled) return;
      const card = b.closest(".bk-item");
      card.querySelectorAll(".px-opt").forEach((x) => { x.setAttribute("aria-pressed", String(x === b)); x.classList.toggle("sel", x === b); });
      pick[card.dataset.id] = b.dataset.v; left();
    });
    body.addEventListener("input", (e) => { const card = e.target.closest(".bk-item"); if (card) { pick[card.dataset.id] = e.target.value.trim(); left(); } });
    body.addEventListener("submit", (e) => e.preventDefault());
    left();
    document.getElementById("bk-grade").addEventListener("click", (e) => {
      const n = list.filter((it) => (pick[it.id] ?? "") === "").length;
      if (n && e.target.dataset.warned !== "1") {   // 안 푼 문항이 있으면 한 번 알려 주고, 다시 누르면 채점한다
        e.target.dataset.warned = "1";
        e.target.textContent = "그래도 채점하기";
        document.getElementById("bk-left").textContent = `안 푼 문항이 ${n}개 있습니다. 한 번 더 누르면 빈 답은 틀린 것으로 채점합니다.`;
        return;
      }
      let ok = 0;
      const wrong = [], obj = list.filter((it) => it.type !== "free"), fr = list.filter((it) => it.type === "free");
      list.forEach((it, i) => {
        const card = body.querySelector(`[data-id="${it.id}"]`);
        if (it.type === "free") openFree(card, it);
        else if (mark(card, it, pick[it.id] ?? "")) ok++;
        else wrong.push(i + 1);
      });
      e.target.disabled = true;
      const fmax = fr.reduce((s, it) => s + fullPt(it), 0);
      const box = document.getElementById("bk-score");
      const show = () => {
        const fp = fr.reduce((s, it) => s + selfPt(body.querySelector(`[data-id="${it.id}"]`)), 0);
        if (!rand) saveScore(`${c.id}/${r}/${k}`, { n: obj.length, ok, ...(fr.length ? { fp, fmax } : {}), at: Date.now() });
        box.innerHTML = `<b>${ok} / ${obj.length}</b><span>${obj.length ? `${Math.round((100 * ok) / obj.length)}점 환산` : ""}${fr.length ? ` · 서술형 자기 채점 ${fp} / ${fmax}점` : ""}</span>${wrong.length ? `<p class="small">틀린 문항: ${wrong.map((w) => `<a href="#${list[w - 1].id}">${w}번</a>`).join(" · ")}. 문항마다 풀이와 해당 절 링크가 열렸습니다. 처음 풀 때 틀린 문항은 <a href="notes.html#wrong">오답노트</a>에 모입니다.</p>` : obj.length ? `<p class="small">객관식·단답형을 모두 맞았습니다.</p>` : ""}${fr.length ? `<p class="small">서술형 ${fr.length}문항은 모범 답안 아래 채점 기준에서 내 답안에 있는 요소를 고르면 점수가 더해집니다.</p>` : ""}`;
      };
      box.hidden = false;
      show();
      body.addEventListener("change", (ev) => onRubric(ev, show));
      box.scrollIntoView({ block: "center" });
      if (window.NMMath) NMMath.render(body);
    });
  }

  /* ───── 절별 연습: 한 문항씩 바로 채점 ───── */
  function section(items, sec) {
    const o = secOrder[sec];
    if (!o) return hub(items);
    const all = items.filter((it) => it.sec === sec);
    const list = all.filter(lvOk).sort(freeLast);
    crumb(`${o.ch.n}.${o.s.n} ${o.s.title}`);
    document.title = `연습문제 · ${o.s.title} — 나뭇잎 교과서`;
    const rng = o.i < split ? "mid" : "fin";
    head.innerHTML = `<span class="mono dim">${esc(c.name)} · ${o.ch.n}.${o.s.n}${/\d/.test(o.s.code || "") ? ` · [${esc(o.s.code)}]` : ""}</span>
      <h1>${esc(o.s.title)} <em>연습문제</em></h1>
      <p class="lead">${AI} 이 절의 문항 ${list.length}개입니다${lvKey ? `(${LVN[lvKey]}만, 전체 ${all.length}개)` : ""}. 답을 고르면 바로 채점하고 풀이를 보여 줍니다. 서술형은 답안을 쓴 뒤 모범 답안을 보고 스스로 채점합니다. 범위 전체를 시험처럼 풀려면 <a href="bank.html?c=${c.id}">${RANGES[rng] ? RANGES[rng].name : ""} 시험지</a>로 가세요.</p>
      <p class="small bk-lvrow">난이도 ${lvLinks(`bank.html?c=${c.id}&sec=${sec}`)}</p>
      <p class="mono small dim"><a href="c/${c.id}/${o.ch.n}-${o.s.n}.html">← 이 절로 돌아가기</a>${o.s.ex ? ` · <a href="practice.html?sec=${c.id}-${sec}">이 절의 기출문제 ${o.s.ex}문항</a>` : ""}</p>`;
    document.getElementById("px-back").href = `c/${c.id}/${o.ch.n}-${o.s.n}.html`;
    document.getElementById("px-back").textContent = "← 절로 돌아가기";
    body.innerHTML = list.length ? `<div class="px-list bk-list">${list.map((it, i) => itemHtml(it, i + 1, true)).join("")}</div>`
      : `<p class="px-empty">이 절의 연습 문항은 아직 없습니다. <a href="bank.html?c=${c.id}">시험지 목록</a>에서 범위 시험지를 풀어 보세요.</p>`;
    if (window.NMMath) NMMath.render(body);
    const find = (card) => list.find((x) => x.id === card.dataset.id);
    body.addEventListener("click", (e) => {
      const f = e.target.closest(".bk-show");
      if (f) { const card = f.closest(".bk-item"); openFree(card, find(card)); if (window.NMMath) NMMath.render(card); return; }
      const b = e.target.closest(".px-opt"); if (!b || b.disabled) return;
      const card = b.closest(".bk-item"); mark(card, find(card), b.dataset.v); if (window.NMMath) NMMath.render(card);
    });
    body.addEventListener("change", (e) => onRubric(e));
    body.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = e.target.querySelector("input").value.trim(); if (!v) return;
      const card = e.target.closest(".bk-item"); mark(card, find(card), v); if (window.NMMath) NMMath.render(card);
    });
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }

  fetch(`exams/bank/${c.id}.json`).then((r) => (r.ok ? r.json() : { items: [] })).catch(() => ({ items: [] })).then((d) => {
    const items = (d.items || []).filter((it) => secOrder[it.sec]);
    if (!items.length) {
      crumb("");
      head.innerHTML = `<h1>${esc(c.name)} <em>연습 시험</em></h1><p class="lead">이 과목의 AI 출제 연습 문항은 아직 준비 중입니다.</p>`;
      return;
    }
    if (P.get("sec")) section(items, P.get("sec"));
    else if (P.get("r")) sheet(items, P.get("r"), P.get("s"));
    else hub(items);
  });
})();
