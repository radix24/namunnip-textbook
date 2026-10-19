#!/usr/bin/env python3
"""AI 출제 연습 문항(문제은행) 도구. 문항은 과목마다 exams/bank/<과목>.json 한 파일에 둔다.

사용:
  python3 tools/bank.py import <원고.txt> [...]   원고를 읽어 exams/bank/<과목>.json을 새로 쓴다(검사 포함)
  python3 tools/bank.py check                     모든 문제은행 파일을 배치표(curricula/2022.json)와 맞춰 검사
  python3 tools/bank.py stat                      과목별 문항 수와 중간·기말 시험지 수

JSON 형식 (exams/bank/<과목>.json) — 카드 HTML과 따로 두어 나중에 문항 DB로 옮기기 쉽게 한다:
  { "course": "dmath", "kind": "ai", "note": "...",
    "items": [ { "id": "ai-dmath-1-1-01", "sec": "1-1", "type": "mc" | "short",
                 "q": "<p>문제 HTML(수식은 \\( … \\))</p>", "choices": ["…" ×5](mc만), "answer": "3",
                 "alt": ["다른 표기의 정답", …](short 선택), "sol": "<p>풀이 HTML</p>" } ] }
  - mc의 answer는 "1"~"5", short는 숫자나 짧은 글. 채점은 js/bank.js가 한다(공백 무시, 분수·소수는 값으로 비교).

원고 형식 (줄 단위, 빈 줄은 무시):
  # dmath                과목 코드 (첫 줄)
  ## 1-1                 절 (대단원-절). 아래 문항은 이 절에 속한다
  ? 문제 첫 문단         문항 시작. 이어지는 표시 없는 줄은 새 문단
  ㄱ. … / ㄴ. … / ㄷ. …  <보기> 상자
  | a | b |              표 한 줄(첫 줄은 머리)
  1) … ~ 5) …            선택지(있으면 객관식, 없으면 단답형)
  = 3                    정답. 단답형은 '= 12 | 12.0'처럼 다른 표기를 |로 더할 수 있다
  > 풀이 문단            풀이(여러 줄이면 문단 여러 개)
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
BANK = ROOT / "exams" / "bank"
NOTE = "AI가 고등학교 교육과정 범위에서 출제한 연습 문항입니다. 실제 시험에 나온 문항이 아닙니다."
SHEET = 20   # 시험지 한 장의 문항 수(대략)


def rd(p):
    return p.read_text(encoding="utf-8")


def wr(p, s):
    p.write_text(s, encoding="utf-8", newline="\n")


def courses():
    cur = json.loads(rd(ROOT / "curricula" / "2022.json"))
    return {c["id"]: c for c in cur["courses"]}


def split(course):
    """tools/build.py의 exam_split과 같다. 중간고사 범위 = 앞쪽 절 몇 개(목차 순서). 절 수의 절반에서 1절 이내에 대단원 경계가 있으면 그 경계에서,
    없으면 대단원 중간이라도 절반(올림)에서 나눈다. 기말고사 범위는 나머지 절이다."""
    sizes = [len(ch["sections"]) for ch in course["chapters"]]
    total = sum(sizes)
    cuts = [sum(sizes[:k]) for k in range(1, len(sizes))]
    near = [x for x in cuts if abs(x - total / 2) <= 1]
    return min(near, key=lambda x: (abs(x - total / 2), -x)) if near else (total + 1) // 2


def parse(path):
    lines = rd(path).split("\n")
    cid, sec, items, cur = None, None, [], None

    def close():
        nonlocal cur
        if cur:
            if cur["gana"]:
                cur["q"].append('<ol class="gana">' + "".join(f"<li>{g}</li>" for g in cur["gana"]) + "</ol>")
            if cur["table"]:
                head, *rows = cur["table"]
                cur["q"].append("<table><tr>" + "".join(f"<th>{x}</th>" for x in head) + "</tr>"
                                + "".join("<tr>" + "".join(f"<td>{x}</td>" for x in r) + "</tr>" for r in rows) + "</table>")
            items.append(cur)
        cur = None

    for ln, raw in enumerate(lines, 1):
        line = raw.rstrip()
        if not line.strip():
            continue
        where = f"{path.name}:{ln}"
        if line.startswith("## "):
            close(); sec = line[3:].strip()
            if not re.fullmatch(r"\d+-\d+", sec):
                raise SystemExit(f"{where}: 절 표기는 '## 1-2' 꼴이어야 합니다")
        elif line.startswith("# "):
            close(); cid = line[2:].strip()
        elif line.startswith("? "):
            close()
            if not (cid and sec):
                raise SystemExit(f"{where}: 과목(# …)과 절(## …)을 먼저 적어야 합니다")
            cur = {"sec": sec, "q": [line[2:].strip()], "gana": [], "table": [], "choices": [], "answer": None, "sol": [], "ln": where}
        elif cur is None:
            raise SystemExit(f"{where}: 문항(? …) 밖의 줄입니다: {line[:40]}")
        elif re.match(r"^[ㄱㄴㄷㄹ]\. ", line):
            cur["gana"].append(line)
        elif line.startswith("|"):
            cur["table"].append([x.strip() for x in line.strip().strip("|").split("|")])
        elif re.match(r"^[1-5]\) ", line):
            cur["choices"].append(line[3:].strip())
        elif line.startswith("= "):
            cur["answer"] = [x.strip() for x in line[2:].split("|") if x.strip()]
        elif line.startswith("> "):
            cur["sol"].append(line[2:].strip())
        else:
            if cur["sol"]:
                cur["sol"].append(line.strip())
            else:
                cur["q"].append(line.strip())
    close()
    if not cid:
        raise SystemExit(f"{path}: 첫 줄에 '# 과목코드'가 없습니다")

    out, seen = [], {}
    for it in items:
        k = seen[it["sec"]] = seen.get(it["sec"], 0) + 1
        o = {"id": f'ai-{cid}-{it["sec"]}-{k:02d}', "sec": it["sec"], "type": "mc" if it["choices"] else "short",
             "q": "".join(x if x.startswith("<") else f"<p>{x}</p>" for x in it["q"])}
        if it["choices"]:
            o["choices"] = it["choices"]
        if not it["answer"]:
            raise SystemExit(f'{it["ln"]}: 정답(= …)이 없습니다')
        o["answer"] = it["answer"][0]
        if len(it["answer"]) > 1:
            o["alt"] = it["answer"][1:]
        o["sol"] = "".join(f"<p>{x}</p>" for x in it["sol"])
        o["_ln"] = it["ln"]
        out.append(o)
    return cid, out


def check_items(cid, items, cs):
    errs = []
    c = cs.get(cid)
    if not c:
        return [f"배치표에 없는 과목: {cid}"]
    secs = {f'{ch["n"]}-{s["n"]}' for ch in c["chapters"] for s in ch["sections"]}
    ids = set()
    for it in items:
        w = it.get("_ln") or it["id"]
        if it["id"] in ids:
            errs.append(f"{w}: id 중복 {it['id']}")
        ids.add(it["id"])
        if it["sec"] not in secs:
            errs.append(f"{w}: 이 과목에 없는 절 {it['sec']}")
        if it["type"] == "mc":
            if len(it.get("choices", [])) != 5:
                errs.append(f"{w}: 선택지가 5개가 아님({len(it.get('choices', []))}개)")
            if it["answer"] not in list("12345"):
                errs.append(f"{w}: 객관식 정답은 1~5 ({it['answer']})")
            if len(set(it.get("choices", []))) != len(it.get("choices", [])):
                errs.append(f"{w}: 같은 선택지가 두 번 있음")
        if not it.get("sol"):
            errs.append(f"{w}: 풀이가 없음")
        text = it["q"] + "".join(it.get("choices", [])) + it.get("sol", "")
        if text.count("\\(") != text.count("\\)") or text.count("\\[") != text.count("\\]"):
            errs.append(f"{w}: 수식 괄호 \\( \\) 짝이 맞지 않음")
        if re.search(r"[\U0001F300-\U0001FAFF\u2600-\u27BF]", text):
            errs.append(f"{w}: 이모지")
    return errs


def write(cid, items):
    BANK.mkdir(parents=True, exist_ok=True)
    rows = [json.dumps({k: v for k, v in it.items() if not k.startswith("_")}, ensure_ascii=False) for it in items]
    head = json.dumps({"course": cid, "kind": "ai", "note": NOTE}, ensure_ascii=False)[:-1]
    wr(BANK / f"{cid}.json", head + ',\n"items": [\n' + ",\n".join(rows) + "\n]}\n")   # 문항 한 줄에 하나: diff를 읽기 쉽게


def load(cid):
    return json.loads(rd(BANK / f"{cid}.json"))


def stat_line(c, items):
    order = [f'{ch["n"]}-{s["n"]}' for ch in c["chapters"] for s in ch["sections"]]
    k = split(c)
    mid = sum(1 for it in items if order.index(it["sec"]) < k)
    fin = len(items) - mid
    sh = lambda n: max(1, round(n / SHEET)) if n else 0
    return f'{c["id"]:9} {c["name"]:14} 문항 {len(items):4}  중간 {mid:3}({sh(mid)}장)  기말 {fin:3}({sh(fin)}장)'


def main():
    a = sys.argv[1:]
    cs = courses()
    if not a or a[0] not in ("import", "check", "stat"):
        print(__doc__); return
    if a[0] == "import":
        bad = False
        for f in a[1:]:
            cid, items = parse(pathlib.Path(f))
            errs = check_items(cid, items, cs)
            if errs:
                bad = True
                print(f"{f}: 문제 {len(errs)}개\n  " + "\n  ".join(errs))
                continue
            write(cid, items)
            print(stat_line(cs[cid], items))
        sys.exit(1 if bad else 0)
    files = sorted(BANK.glob("*.json")) if BANK.exists() else []
    bad, total = False, 0
    for f in files:
        d = json.loads(rd(f))
        if a[0] == "check":
            errs = check_items(d["course"], d["items"], cs)
            if errs:
                bad = True
                print(f"{f.name}: 문제 {len(errs)}개\n  " + "\n  ".join(errs))
        else:
            print(stat_line(cs[d["course"]], d["items"]))
        total += len(d["items"])
    print(f"과목 {len(files)}개, 문항 {total}개" + ("" if bad else (" — 모두 OK" if a[0] == "check" else "")))
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
