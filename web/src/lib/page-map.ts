export type SitePage = {
  path:
    | "/"
    | "/core"
    | "/verification"
    | "/verification/results"
    | "/verification/pending"
    | "/engineering"
    | "/reference"
    | "/audit/reproduce";
  title: string;
  subtitle: string;
  chapters: string[];
  dependsOn: SitePage["path"][];
};

export const SITE_PAGES: SitePage[] = [
  {
    path: "/",
    title: "Home",
    subtitle: "SALT 검증 콘솔의 첫 진입점과 전체 요약",
    chapters: ["00장", "18장", "19장"],
    dependsOn: [],
  },
  {
    path: "/core",
    title: "Core",
    subtitle: "이론 코어와 17장 중심 개념",
    chapters: ["06장", "12장", "17장"],
    dependsOn: ["/"],
  },
  {
    path: "/verification",
    title: "Verification",
    subtitle: "검증 채널 개요와 현재 판정 상태",
    chapters: ["18장", "27장"],
    dependsOn: ["/", "/core"],
  },
  {
    path: "/verification/results",
    title: "Verification Results",
    subtitle: "고정 채널별 승패와 세부 판정 결과",
    chapters: ["18장", "27장"],
    dependsOn: ["/verification"],
  },
  {
    path: "/verification/pending",
    title: "Verification Pending",
    subtitle: "운영 잠금 전 후보 가설과 검증 대기 항목",
    chapters: ["20장", "27장"],
    dependsOn: ["/verification"],
  },
  {
    path: "/engineering",
    title: "Engineering",
    subtitle: "공학적 함의와 설계 가설",
    chapters: ["19장"],
    dependsOn: ["/verification"],
  },
  {
    path: "/reference",
    title: "Reference",
    subtitle: "도해, 용어, FAQ, 책 구조도",
    chapters: ["21장", "24장", "28장"],
    dependsOn: ["/", "/core", "/verification"],
  },
  {
    path: "/audit/reproduce",
    title: "Audit Reproduce",
    subtitle: "재현 절차와 잠금 해시 검증",
    chapters: ["26장", "27장", "28장"],
    dependsOn: ["/verification/results"],
  },
];

export const PAGE_INDEX = Object.fromEntries(SITE_PAGES.map((p) => [p.path, p]));
