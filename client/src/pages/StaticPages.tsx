import { Link } from "wouter";
import { PublicFooter, PublicHeader } from "@/components/PublicChrome";

type StaticPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function StaticPage({ eyebrow, title, description, children }: StaticPageProps) {
  return (
    <div>
      <PublicHeader />
      <section className="subnav">
        <div className="container">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          {children}
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}

export default function Corporate() {
  return (
    <StaticPage
      eyebrow="FOR TEAMS / CORPORATE"
      title="기업교육을 업무 시스템에 연결합니다."
      description="팀의 실제 업무 흐름을 기준으로 AI Agent·콘텐츠·마케팅 자동화를 설계하고, 현업에 남는 운영 체계를 만듭니다."
    >
      <p style={{ color: "var(--ink-2)", fontSize: 17, lineHeight: 1.7 }}>
        기업 맞춤 과정은 진단 → 설계 → 실습 → 피드백 → 적용 순으로 진행합니다. 팀의
        현업 언어와 도구 환경을 반영해, 교육이 끝난 뒤에도 운영 가능한 결과물을
        남기는 것이 목표입니다.
      </p>
      <div className="cta-row" style={{ marginTop: 28 }}>
        <Link href="/webinar" className="btn primary">
          웨비나로 먼저 경험하기
        </Link>
        <Link href="/programs" className="btn ghost">
          공개 프로그램 보기
        </Link>
      </div>
    </StaticPage>
  );
}

export function Contact() {
  return (
    <StaticPage
      eyebrow="CONTACT"
      title="문의하기"
      description="기업교육, 맞춤 커리큘럼, 협업 제안을 남겨 주세요. 웨비나 사전 신청으로도 빠르게 연결할 수 있습니다."
    >
      <p style={{ color: "var(--ink-2)", fontSize: 17, lineHeight: 1.7 }}>
        현재는 웨비나 사전 신청 폼을 통해 연락을 받고 있습니다. 신청 시 역할과
        관심사를 함께 적어 주시면 우선 안내드립니다.
      </p>
      <div className="cta-row" style={{ marginTop: 28 }}>
        <Link href="/webinar" className="btn primary">
          웨비나 사전 신청
        </Link>
        <Link href="/" className="btn ghost">
          홈으로
        </Link>
      </div>
    </StaticPage>
  );
}

export function Privacy() {
  return (
    <StaticPage
      eyebrow="POLICY"
      title="개인정보처리방침"
      description="Agentro는 서비스 제공에 필요한 범위에서만 개인정보를 수집·이용합니다."
    >
      <div style={{ color: "var(--ink-2)", fontSize: 16, lineHeight: 1.75, display: "grid", gap: 16 }}>
        <p>1. 수집 항목: 이름, 이메일, 직무(선택), 웨비나 신청 시 작성한 내용</p>
        <p>2. 이용 목적: 웨비나·교육 안내, 신청자 관리, 서비스 개선</p>
        <p>3. 보관 기간: 목적 달성 후 또는 관련 법령이 정한 기간까지</p>
        <p>4. 문의: 웨비나 신청 또는 사이트 문의를 통해 요청해 주세요.</p>
      </div>
    </StaticPage>
  );
}

export function Terms() {
  return (
    <StaticPage
      eyebrow="POLICY"
      title="이용약관"
      description="Agentro 웹사이트와 교육 관련 서비스 이용에 관한 기본 안내입니다."
    >
      <div style={{ color: "var(--ink-2)", fontSize: 16, lineHeight: 1.75, display: "grid", gap: 16 }}>
        <p>1. 본 사이트는 교육 소개, 웨비나 신청, 콘텐츠 안내를 목적으로 합니다.</p>
        <p>2. 공개된 프로그램·일정·가격 정보는 사전 고지 없이 변경될 수 있습니다.</p>
        <p>3. 관리자 영역은 승인된 운영자만 접근할 수 있습니다.</p>
        <p>4. 문의와 신청 정보는 운영 목적 범위에서만 사용합니다.</p>
      </div>
    </StaticPage>
  );
}
