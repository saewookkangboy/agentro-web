export type CurriculumTrack = {
  code: string;
  title: string;
  body: string;
  chips: string[];
};

export type CurriculumProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type CurriculumContent = {
  tracksEyebrow: string;
  tracksTitle: string;
  tracksIntro: string;
  tracks: CurriculumTrack[];
  processEyebrow: string;
  processTitle: string;
  processIntro: string;
  processSteps: CurriculumProcessStep[];
};

export const CURRICULUM_SETTING_KEY = "home.curriculum";

export const curriculumDefaults: CurriculumContent = {
  tracksEyebrow: "01 / curriculum tracks",
  tracksTitle: "도구를 배우는 대신,\n업무의 구조를 다시 설계합니다.",
  tracksIntro: "세 개의 실무 트랙은 사용하는 도구가 아니라, 반복되는 업무와 결과물을 중심으로 구성됩니다.",
  tracks: [
    { code: "TRACK / 01", title: "AI Agent Builder", body: "조사·판단·실행·검증을 연결해, 반복 업무를 대신 움직이는 개인 또는 팀용 Agent를 설계합니다.", chips: ["업무 분해", "컨텍스트 설계", "도구 연결"] },
    { code: "TRACK / 02", title: "Content Automation", body: "기획부터 초안, 검수, 재가공, 배포 준비까지 콘텐츠 생산 흐름을 표준화합니다.", chips: ["브랜드 컨텍스트", "멀티채널", "품질 검수"] },
    { code: "TRACK / 03", title: "Marketing Automation", body: "캠페인 운영, 리드 분류, 성과 보고의 반복 업무를 하나의 운영 시스템으로 연결합니다.", chips: ["퍼널 설계", "리드 운영", "성과 측정"] },
  ],
  processEyebrow: "02 / how it works",
  processTitle: "진단에서 운영까지,\n한 번의 완성으로 끝나지 않게.",
  processIntro: "학습이 끝난 뒤에도 다시 사용할 수 있도록 업무 맥락과 운영 기준까지 남깁니다.",
  processSteps: [
    { number: "01", title: "진단", description: "반복 업무와 현재 흐름을 찾습니다." },
    { number: "02", title: "설계", description: "결과물과 판단 기준을 구조화합니다." },
    { number: "03", title: "실습", description: "실제 데이터로 시스템을 연결합니다." },
    { number: "04", title: "피드백", description: "개인·팀 상황에 맞춰 다듬습니다." },
    { number: "05", title: "적용", description: "현업에서 다시 움직이도록 운영합니다." },
  ],
};

export function parseCurriculumContent(value?: string | null): CurriculumContent {
  if (!value) return structuredClone(curriculumDefaults);
  try {
    const parsed = JSON.parse(value) as Partial<CurriculumContent>;
    return {
      tracksEyebrow: typeof parsed.tracksEyebrow === "string" && parsed.tracksEyebrow.trim() ? parsed.tracksEyebrow : curriculumDefaults.tracksEyebrow,
      tracksTitle: typeof parsed.tracksTitle === "string" && parsed.tracksTitle.trim() ? parsed.tracksTitle : curriculumDefaults.tracksTitle,
      tracksIntro: typeof parsed.tracksIntro === "string" && parsed.tracksIntro.trim() ? parsed.tracksIntro : curriculumDefaults.tracksIntro,
      tracks: curriculumDefaults.tracks.map((fallback, index) => ({ ...fallback, ...(parsed.tracks?.[index] ?? {}), chips: Array.isArray(parsed.tracks?.[index]?.chips) && parsed.tracks[index]!.chips!.length ? parsed.tracks[index]!.chips!.filter((chip): chip is string => typeof chip === "string") : fallback.chips })),
      processEyebrow: typeof parsed.processEyebrow === "string" && parsed.processEyebrow.trim() ? parsed.processEyebrow : curriculumDefaults.processEyebrow,
      processTitle: typeof parsed.processTitle === "string" && parsed.processTitle.trim() ? parsed.processTitle : curriculumDefaults.processTitle,
      processIntro: typeof parsed.processIntro === "string" && parsed.processIntro.trim() ? parsed.processIntro : curriculumDefaults.processIntro,
      processSteps: curriculumDefaults.processSteps.map((fallback, index) => ({ ...fallback, ...(parsed.processSteps?.[index] ?? {}) })),
    };
  } catch {
    return structuredClone(curriculumDefaults);
  }
}

export function serializeCurriculumContent(content: CurriculumContent) {
  return JSON.stringify(content);
}
