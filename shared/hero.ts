export const heroNodeDefaults = [
  {
    key: "context",
    label: "CONTEXT",
    title: "업무 맥락",
    targetId: "curriculum-context",
    description: "반복되는 업무와 필요한 맥락을 찾아 Agent가 이해할 수 있는 기준으로 정리합니다.",
  },
  {
    key: "decision",
    label: "DECISION",
    title: "판단 기준",
    targetId: "curriculum-decision",
    description: "결과물의 품질과 예외 상황을 판단할 수 있도록 사람의 기준을 구조화합니다.",
  },
  {
    key: "tools",
    label: "TOOLS",
    title: "도구 연결",
    targetId: "curriculum-tools",
    description: "필요한 데이터와 도구를 연결해 실제 업무 흐름 안에서 작동하는 시스템을 만듭니다.",
  },
  {
    key: "output",
    label: "OUTPUT",
    title: "운영 결과",
    targetId: "curriculum-output",
    description: "검수와 피드백을 거쳐 다시 사용할 수 있는 운영 결과물과 체크리스트를 남깁니다.",
  },
] as const;

export type HeroNodeKey = (typeof heroNodeDefaults)[number]["key"];
export type HeroNode = {
  key: HeroNodeKey;
  label: string;
  title: string;
  targetId: string;
  description: string;
};

export const HERO_NODES_SETTING_KEY = "home.hero.nodes";

export function parseHeroNodes(value?: string | null, fallbackDescriptions?: string[]): HeroNode[] {
  const fallbacks = heroNodeDefaults.map((node, index) => ({ ...node, description: fallbackDescriptions?.[index]?.trim() || node.description }));
  if (!value) return fallbacks;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) throw new Error("Hero nodes must be an array");
    return fallbacks.map((fallback, index) => {
      const candidate = parsed[index] as Partial<HeroNode> | undefined;
      return {
        ...fallback,
        label: typeof candidate?.label === "string" && candidate.label.trim() ? candidate.label : fallback.label,
        title: typeof candidate?.title === "string" && candidate.title.trim() ? candidate.title : fallback.title,
        description: typeof candidate?.description === "string" && candidate.description.trim() ? candidate.description : fallback.description,
      };
    });
  } catch {
    return fallbacks;
  }
}

export function serializeHeroNodes(nodes: HeroNode[]) {
  return JSON.stringify(nodes.map(({ key, label, title, targetId, description }) => ({ key, label, title, targetId, description })));
}
