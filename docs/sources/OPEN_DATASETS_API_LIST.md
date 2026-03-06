# 공개 데이터셋 사이트/API 목록 (관측 검증용)

최종 정리: `2026-03-06`

## 우선순위(바로 연동 추천)
1. GWOSC (중력파 공개 데이터 + API)  
   - https://gwosc.org/api/  
   - https://gwosc.org/apidocs/
2. GraceDB Public Alerts (LVK 공개 이벤트/알림)  
   - https://gracedb.ligo.org/superevents/public/  
   - https://gracedb.ligo.org/
3. NASA GCN (실시간 천문 알림 스트림)  
   - https://gcn.nasa.gov/  
   - https://gcn.nasa.gov/docs/
4. HEASARC (NASA 고에너지 천체물리 아카이브 API)  
   - https://heasarc.gsfc.nasa.gov/docs/archive/apis.html
5. IRSA + ZTF API (광학 시변천체)  
   - https://irsa.ipac.caltech.edu/docs/program_interface/ztf_api.html  
   - https://irsa.ipac.caltech.edu/Missions/ztf.html  
   - https://irsa.ipac.caltech.edu/voapi.html

## 추가 후보 소스
6. MAST API (HST/JWST/TESS/Kepler)  
   - https://mast.stsci.edu/api/v0/
7. ESA Gaia Archive (TAP/TAP+)
   - https://gea.esac.esa.int/archive/  
   - https://www.cosmos.esa.int/web/gaia-users/archive/programmatic-access
8. SDSS SkyServer API/REST  
   - https://skyserver.sdss.org/dr18/Support/Api
9. IceCube Data Releases  
   - https://icecube.wisc.edu/science/data-releases/
10. CERN Open Data  
    - https://opendata.cern.ch/about  
    - https://opendata.atlas.cern/
11. NASA Exoplanet Archive (API Queries)  
    - https://exoplanetarchive.ipac.caltech.edu/

## 해석 원칙
- 영상은 설명/맥락용, 판정 근거는 공개 수치 데이터로만 구성
- 동일 입력에서 `Standard vs SALT`를 동시 계산
- 평가 지표(`MAE`, `RMSE`, `DeltaFit`, `Coverage`)를 사전 고정
- 성공/실패 사례를 함께 공개해 선택 편향 방지

