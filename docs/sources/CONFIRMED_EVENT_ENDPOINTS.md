# 확정 이벤트 수집 엔드포인트 (v1)

기준일: `2026-03-06`

## 1) 기본 연동 엔드포인트
- `gwosc`
  - `https://gwosc.org/api/v2/event-versions/`
- `gracedb`
  - `https://gracedb.ligo.org/apiweb/superevents/`
- `gcn`
  - `https://gcn.nasa.gov/circulars/archive.json.tar.gz`
- `ztf`
  - `https://irsa.ipac.caltech.edu/cgi-bin/ZTF/nph_light_curves?POS=CIRCLE+298.0025+29.87147+0.0014&BANDNAME=g&FORMAT=CSV`
- `heasarc`
  - `https://heasarc.gsfc.nasa.gov/xamin/query?table=fermigbrst&ResultMax=200&format=stream`

## 2) 파서 매핑
- `gwosc`, `gracedb`: JSON 파서
- `gcn`: `tar.gz` 내부 JSON 파서
- `ztf`: CSV 파서
- `heasarc`: 파이프(`|`) 구분 stream 파서

## 3) 운영 규칙
- 개별 소스 실패 시 전체 파이프라인은 중단하지 않음
- 수집 실패는 `data/processed/live_events.json`의 `errors`에 기록
- 필요 시 환경변수(`*_EVENTS_URL`)로 엔드포인트 교체 가능

## 4) 참고 공식 문서
- GWOSC API: https://gwosc.org/apidocs/v2/
- GraceDB API: https://gracedb.ligo.org/documentation/api.html
- GCN Circular Archive: https://gcn.nasa.gov/docs/circulars
- ZTF IRSA API: https://irsa.ipac.caltech.edu/docs/program_interface/ztf_api.html
- HEASARC APIs: https://heasarc.gsfc.nasa.gov/docs/archive/apis.html
