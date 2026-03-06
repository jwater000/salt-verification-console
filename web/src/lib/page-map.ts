export type SitePage = {
  path: "/" | "/evidence" | "/events" | "/method" | "/limits";
  title: string;
  subtitle: string;
  chapters: string[];
  dependsOn: Array<"/" | "/evidence" | "/events" | "/method" | "/limits">;
};

export const SITE_PAGES: SitePage[] = [
  {
    path: "/",
    title: "Home",
    subtitle: "검증 개요와 전체 승패 요약",
    chapters: ["00장", "17장", "18장"],
    dependsOn: [],
  },
  {
    path: "/method",
    title: "Method",
    subtitle: "판정 규칙과 재현 절차",
    chapters: ["17장", "24장", "25장", "26장"],
    dependsOn: ["/"],
  },
  {
    path: "/events",
    title: "Events",
    subtitle: "이벤트 단위 원자료/오차",
    chapters: ["05장", "06장", "17장", "24장"],
    dependsOn: ["/method"],
  },
  {
    path: "/evidence",
    title: "Evidence",
    subtitle: "실측-표준우주론(ΛCDM)-SALT 정량 비교",
    chapters: ["10장", "13장", "17장", "24장"],
    dependsOn: ["/method", "/events"],
  },
  {
    path: "/limits",
    title: "Limits",
    subtitle: "표준우주론(ΛCDM) 우세/동률/한계 공개",
    chapters: ["18장", "22장", "25장"],
    dependsOn: ["/evidence"],
  },
];

export const PAGE_INDEX = Object.fromEntries(SITE_PAGES.map((p) => [p.path, p]));
