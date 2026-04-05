# 공지

2026-03-13 기준으로 공개 구조와 읽는 흐름을 다시 정리했습니다.

이번 정리의 목적은 세 가지를 더 또렷하게 보이게 만드는 데 있습니다.

- 무엇이 이미 공개 검증 단계에 들어와 있는가
- 무엇이 아직 검증 대기 상태인가
- 같은 절차로 다시 실행해도 같은 결과에 도달할 수 있는가

## 바뀐 점

- `/verification/results`: 현재 고정 데이터셋 기준으로 자동 산출된 검증 결과 보고
- `/verification/pending`: 아직 데이터 연결이 끝나지 않은 검증 대기 가설 공개
- `/audit/reproduce`: 동일 데이터, 동일 식, 동일 판정 규칙으로 재현하는 방법 정리
- `/reference/visual-atlas`: 도식, 이미지, 코드, 해설을 함께 보는 참고 자료
- `/engineering`: 향후 기술 활용 시나리오와 확장 가능성 정리
- 도서 개정 후 장 매핑 반영: Intro `00`, Problem `01~05`, Clue/Concept `06~11`, Unified Solution `12~16`, Theory Core `17`, Prediction & Closure `18~20`, Appendix `21~28`
- 도해 자산(g24~g33 포함)의 번호와 실제 공개 이미지 파일을 다시 일치시킴

## 이번 정리로 더 분명해진 점

- 공개 판정은 frozen dataset 기준으로만 산출합니다.
- 결과 해석과 별개로 출처, 식, 재현 절차를 분리해 공개합니다.
- 검증 완료 항목과 검증 대기 항목을 같은 페이지에 섞지 않습니다.
- 원고 장은 장별 URL로 직접 공개하지 않고, 웹 목적에 맞게 정리한 페이지와 라우트 문서로 반영합니다.

## 바로 가기

- [검증 결과 보고](/verification/results)
- [예측](/verification/pending)
- [재현 방법](/audit/reproduce)
- [출처 공개](/audit/sources)
- [도해 아틀라스](/reference/visual-atlas)

## 참고

이 공지는 사이트 구조와 공개 방식 변경을 알리기 위한 안내입니다. 실제 수치 판정은 각 검증 페이지와 frozen manifest 기준으로 확인할 수 있습니다.
