# g** 인덱스(코드/이미지) 변환계획

## 1. 목표
1. 본문 페이지(챕터)에서 등장하는 순서와 `gNN` 번호를 동일하게 유지한다.
2. 코드(`makegraph/gNN_*.py`)와 이미지(`graph/gNN_*.jpg`)의 번호를 1:1로 맞춘다.
3. 본문 링크(`Images/gNN_*.jpg`)와 `makegraph/INDEX.md`를 항상 동기화한다.

## 2. 현재 진단
1. 페이지 순서 기준으로 기존 그래프를 재배치하고 신규 그래프를 삽입해 `g00 ~ g32` 체계를 적용했다.
2. 본문, 코드, 이미지, `INDEX.md`가 동일 번호 체계로 동기화된 상태다.
3. 현재는 추가 리넘버링 없이 신규 확장만 관리하면 된다.

## 3. 운영 원칙
1. 새 그래프를 추가할 때는 마지막 번호 다음(`g33`, `g34`...)을 사용한다.
2. 이미 배치된 번호는 가급적 변경하지 않는다.
3. 번호를 바꿔야 할 때는 코드, 이미지, 본문 링크, 인덱스를 한 번에 바꾼다.

## 4. 리넘버링 필요 시 표준 절차
1. 변경 맵 확정: `old_gNN -> new_gNN` 표 작성
2. 코드 파일명 변경: `makegraph/gNN_*.py`
3. 이미지 파일명 변경: `graph/gNN_*.jpg`
4. 본문 링크 일괄 변경: `*.md`의 `Images/gNN_*.jpg`
5. 인덱스 갱신: `makegraph/INDEX.md`
6. 전체 생성/검증: `python makegraph/run_all_graphs.py`
7. 잔존 문자열 검사: 이전 번호 참조가 남았는지 검색

## 5. 검증 명령어
```bash
cd /home/jwater/Development/principleofphysics/roadmap_structured/SALT_Manuscript

# 본문 이미지 참조 점검
find . -maxdepth 1 -name "[0-2][0-9]_*.md" -print0 | sort -zV | \
while IFS= read -r -d '' f; do
  rg -nH "Images/g[0-9]{2}_[A-Za-z0-9_]+\\.jpg" "$f"
done

# 인덱스 목록 점검
sed -n '1,260p' makegraph/INDEX.md

# 그래프 코드 일괄 생성 테스트
python makegraph/run_all_graphs.py
```

## 6. 지금 시점의 권장 결론
1. 현재 상태는 연속 번호 체계를 만족하므로 **번호 재배치 없이 유지**한다.
2. 앞으로 추가되는 신규 시각화는 `g31+`로 확장한다.
