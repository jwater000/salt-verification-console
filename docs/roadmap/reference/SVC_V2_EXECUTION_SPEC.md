# SVC v2 실행 설계서

최종 업데이트: `2026-03-11`

## 1) 목적

이 문서는 [`SVC_V2_ERD_IA_PROPOSAL.md`](/home/jwater/Development/salt-verification-console/docs/roadmap/SVC_V2_ERD_IA_PROPOSAL.md) 를 실제 구현 단위로 쪼갠 실행 설계서다.

목표는 다음 2가지다.

- 무엇부터 만들지 우선순위를 고정
- 각 라우트와 데이터 로더가 어떤 책임을 갖는지 명확히 정의

---

## 2) 구현 우선순위

### Phase A: Provenance UI 최소 구현

우선 구현 대상:
- `/runs`
- `/runs/[runId]`
- `/snapshots`
- `/snapshots/[snapshotId]`

이유:
- 현재 사이트에서 가장 부족한 부분이 provenance 노출이기 때문
- 기존 `/evaluation`, `/audit/reproduce`를 크게 깨지 않고 바로 가치가 생김

### Phase B: 모델 설명 계층

다음 구현 대상:
- `/models`
- `/models/[modelId]`

이유:
- 거시 `ΛCDM`, 미시 `SM`, `SALT` 문맥을 명확히 분리
- 책/웹 용어 정합성 유지에 직접 도움

### Phase C: 비교/차이 보기

후속 구현 대상:
- `/snapshots/compare/[left]...[right]`
- `/models/compare/[a]...[b]`

이유:
- 운영형 비교 UX는 가치가 크지만, 기본 provenance 구조가 먼저 필요

---

## 3) 신규 라우트 설계

## 3.1 `/runs`

### 목적
- 어떤 실행이 어떤 결과를 만들었는지 목록으로 보여주는 페이지

### 화면 구성
- 헤더 카드
  - latest run count
  - latest published snapshot
  - pass/fail 요약
- 필터 바
  - snapshot
  - domain
  - run type
  - status
- run table
  - `run_id`
  - `snapshot`
  - `domain`
  - `run_type`
  - `status`
  - `verdict`
  - `completed_at_utc`
  - `artifact_count`

### 사용자 질문
- 최근 공개 결과는 어떤 실행에서 나왔는가?
- 검증이 실패한 run은 무엇인가?
- micro와 cosmic의 마지막 실행 상태는 어떤가?

### 필요 데이터 타입

```ts
type RunSummary = {
  run_id: string;
  snapshot_id: string;
  dataset_version: string;
  domain: "cosmic" | "micro" | "shared";
  run_type: "predict" | "score" | "fit" | "verify" | "publish";
  status: "passed" | "failed" | "running";
  verdict?: string | null;
  verdict_reason?: string | null;
  completed_at_utc?: string | null;
  artifact_count: number;
};
```

### 필요 로더
- `loadRuns()`
- `loadRunSummariesBySnapshot(snapshotId)`

---

## 3.2 `/runs/[runId]`

### 목적
- 단일 실행의 provenance를 끝까지 보여주는 상세 페이지

### 화면 구성
- run header
  - `run_id`, `status`, `domain`, `run_type`
- execution block
  - `command`
  - `code_ref`
  - `started_at_utc`
  - `completed_at_utc`
- verdict block
  - `verdict`
  - `verdict_reason`
- artifact block
  - artifact list
  - path
  - sha256
- linked snapshot block
  - snapshot ID
  - dataset_version
  - manifest_sha256

### 사용자 질문
- 이 결과는 어떤 명령으로 만들어졌는가?
- 어떤 artifact가 산출되었는가?
- 이 run은 어떤 snapshot에 귀속되는가?

### 필요 데이터 타입

```ts
type RunArtifact = {
  artifact_id: string;
  artifact_type: string;
  path: string;
  sha256?: string | null;
  created_at_utc: string;
};

type RunDetail = RunSummary & {
  command: string;
  code_ref?: string | null;
  started_at_utc?: string | null;
  artifacts: RunArtifact[];
};
```

### 필요 로더
- `loadRunDetail(runId)`

---

## 3.3 `/snapshots`

### 목적
- 공개 snapshot 목록과 상태를 보여주는 페이지

### 화면 구성
- published snapshot summary
- snapshot timeline
- snapshot table
  - `snapshot_id`
  - `dataset_version`
  - `status`
  - `created_at_utc`
  - `manifest_sha256`
  - linked runs count

### 사용자 질문
- 지금 공개 중인 snapshot은 무엇인가?
- 과거 snapshot은 몇 개가 있었는가?
- 최근 데이터셋 갱신이 언제 있었는가?

### 필요 데이터 타입

```ts
type SnapshotSummary = {
  snapshot_id: string;
  dataset_version: string;
  status: "draft" | "candidate" | "published" | "archived";
  created_at_utc: string;
  manifest_sha256?: string | null;
  run_count: number;
};
```

### 필요 로더
- `loadSnapshots()`

---

## 3.4 `/snapshots/[snapshotId]`

### 목적
- 단일 snapshot의 공개 기준과 산출 결과를 보여주는 페이지

### 화면 구성
- snapshot hero
  - dataset version
  - created_at
  - manifest sha
  - status
- linked runs
- linked result summary
  - total winners
  - domain summary
  - decision rule versions
- linked artifacts

### 사용자 질문
- 이 snapshot의 기준 해시는 무엇인가?
- 어떤 run들이 이 snapshot에 귀속되는가?
- 현재 공개 수치는 어떤 snapshot 기준인가?

### 필요 데이터 타입

```ts
type SnapshotDetail = SnapshotSummary & {
  notes?: string | null;
  runs: RunSummary[];
  formula_versions: string[];
  decision_rule_versions: string[];
  result_summary?: {
    salt: number;
    baseline: number;
    tie: number;
  };
};
```

### 필요 로더
- `loadSnapshotDetail(snapshotId)`

---

## 3.5 `/models`

### 목적
- 기준 이론과 SALT 계열 모델을 설명하는 페이지

### 화면 구성
- model family cards
  - baseline
  - salt
  - candidate
- model table
  - `model_id`
  - `name`
  - `domain`
  - `formula_version`
  - `decision_rule_version`
  - `active`

### 사용자 질문
- 거시 기준은 무엇이고 미시 기준은 무엇인가?
- 현재 활성 SALT 모델은 무엇인가?

### 필요 로더
- `loadModels()`

---

## 3.6 `/models/[modelId]`

### 목적
- 단일 모델의 의미와 버전 정보를 설명하는 페이지

### 화면 구성
- model header
- domain applicability
- formula version history
- linked snapshots
- linked scores summary

### 사용자 질문
- 이 모델은 어떤 관측 채널에 적용되는가?
- 어떤 버전이 현재 공개 결과에 쓰였는가?

### 필요 로더
- `loadModelDetail(modelId)`

---

## 4) 권장 폴더 구조

```text
web/src/app/runs/page.tsx
web/src/app/runs/[runId]/page.tsx
web/src/app/snapshots/page.tsx
web/src/app/snapshots/[snapshotId]/page.tsx
web/src/app/models/page.tsx
web/src/app/models/[modelId]/page.tsx

web/src/components/runs/
web/src/components/snapshots/
web/src/components/models/

web/src/lib/v2-data.ts
```

권장 이유:
- 기존 `data.ts`를 깨지 않고 v2 로더를 병행 도입 가능
- provenance 기능이 안정되면 점진적으로 통합 가능

---

## 5) `web/src/lib/v2-data.ts` 초안 책임

### 5.1 최소 함수 목록
- `loadRuns()`
- `loadRunDetail(runId)`
- `loadSnapshots()`
- `loadSnapshotDetail(snapshotId)`
- `loadModels()`
- `loadModelDetail(modelId)`

### 5.2 초기 구현 방침
- 1단계에서는 실제 DB가 아니라 기존 JSON/manifest를 조합한 adapter 형태로 구현 가능
- 즉 DB migration 이전에도 UI부터 착수 가능

### 5.3 adapter 우선순위
- `data/frozen/current/model_eval_manifest.json`
- `data/frozen/current/manifest.json`
- `data/frozen/current/micro_snapshot.json`
- `data/processed/live_snapshot.json`

---

## 6) 초기 UI 동작 원칙

### 6.1 Empty-safe
- 새 provenance 페이지는 데이터가 일부 비어도 렌더되어야 한다.
- placeholder 문구:
  - `No run records yet`
  - `Snapshot metadata unavailable`
  - `Model registry not populated yet`

### 6.2 Read-first
- 편집 UI보다 읽기 UI를 먼저 만든다.
- 운영자 입력 페이지는 후순위

### 6.3 Audit-first labeling
- 모든 신규 페이지 헤더에 아래 중 최소 2개 표시
  - `dataset_version`
  - `formula_version`
  - `decision_rule_version`
  - `manifest_sha256`

---

## 7) 기존 페이지 개선 포인트

## 7.1 `/evaluation`
- 상단에 `snapshot` 배지 추가
- 결과 카드 아래에 `linked run` 링크 추가
- `compare baseline/candidate` 필터 슬롯 확보

## 7.2 `/audit/reproduce`
- 설명 중심 페이지에서 provenance 허브로 전환
- `latest run`, `linked snapshot`, `artifact hash` 카드 추가

## 7.3 `/notice`
- snapshot 갱신 공지를 `/snapshots/[snapshotId]` 링크와 연결

---

## 8) 구현 순서

### Step 1
- `web/src/lib/v2-data.ts` 추가
- mock/adapter 기반 로더 구현

### Step 2
- `/runs`
- `/snapshots`

### Step 3
- `/runs/[runId]`
- `/snapshots/[snapshotId]`

### Step 4
- `/models`
- `/models/[modelId]`

### Step 5
- `/evaluation`, `/audit/reproduce`와 상호 링크 연결

---

## 9) 완료 기준

- `/runs`에서 최신 실행 목록을 볼 수 있다.
- `/snapshots`에서 공개 snapshot 목록을 볼 수 있다.
- `/runs/[runId]`에서 명령, verdict, artifact를 볼 수 있다.
- `/snapshots/[snapshotId]`에서 manifest, linked run, result summary를 볼 수 있다.
- `/evaluation`과 `/audit/reproduce`에서 provenance 페이지로 이동할 수 있다.

---

## 10) 한 줄 결론

v2의 첫 구현 대상은 DB 전체 재설계가 아니다.

먼저 provenance를 읽을 수 있는 웹 구조를 만들고, 그다음 그 웹 구조에 맞춰 DB를 옮기는 편이 더 안전하고 실제 사용자 가치도 빠르게 나온다.
