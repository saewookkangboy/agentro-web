import { Link } from "wouter";
import { useState } from "react";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import ShaderCanvas from "@/components/ShaderCanvas";
import Brand from "@/components/Brand";
import AgentOrchestration from "@/components/AgentOrchestration";
import { useTheme } from "@/contexts/ThemeContext";

const tracks = [
  { code: "TRACK / 01", title: "AI Agent Builder", body: "조사·판단·실행·검증을 연결해, 반복 업무를 대신 움직이는 개인 또는 팀용 Agent를 설계합니다.", chips: ["업무 분해", "컨텍스트 설계", "도구 연결"] },
  { code: "TRACK / 02", title: "Content Automation", body: "기획부터 초안, 검수, 재가공, 배포 준비까지 콘텐츠 생산 흐름을 표준화합니다.", chips: ["브랜드 컨텍스트", "멀티채널", "품질 검수"] },
  { code: "TRACK / 03", title: "Marketing Automation", body: "캠페인 운영, 리드 분류, 성과 보고의 반복 업무를 하나의 운영 시스템으로 연결합니다.", chips: ["퍼널 설계", "리드 운영", "성과 측정"] },
];
const instructors = [
  { name: "강사 프로필 A", role: "AI Agent / Strategy", intro: "복잡한 업무를 실행 가능한 시스템으로 번역합니다.", slug: "instructor-a" },
  { name: "강사 프로필 B", role: "Content / Editorial", intro: "브랜드의 언어를 반복 가능한 생산 흐름으로 만듭니다.", slug: "instructor-b" },
  { name: "강사 프로필 C", role: "Marketing / Growth", intro: "데이터와 메시지를 연결해 운영 가능한 캠페인을 설계합니다.", slug: "instructor-c" },
];
const plans: Array<[string, string, string, string[]]> = [["입문 워크숍","3–4시간","하나의 업무를 빠르게 완성하는 시작점",["완성 경험 중심","라이브 실습","템플릿 제공"]],["프로젝트 코호트","4주","내 업무에 연결된 시스템을 만드는 대표 과정",["주 1회 라이브","개인 피드백","운영 체크리스트"]],["기업 맞춤 과정","맞춤 설계","팀의 업무와 수준에 맞춰 설계하는 AX 교육",["사전 진단","적용 과제","결과 리포트"]]];
const faqs = [
  ["개발을 몰라도 참여할 수 있나요?", "코드보다 업무 구조와 결과물 설계를 먼저 다룹니다. 현재 업무를 설명할 수 있다면 시작할 수 있습니다."],
  ["수업에서 어떤 결과물을 완성하나요?", "본인의 실제 업무를 기준으로 Agent, 콘텐츠 생산 시스템, 또는 마케팅 운영 워크플로 가운데 하나를 완성합니다."],
  ["온라인과 오프라인 모두 가능한가요?", "대표 프로그램마다 운영 방식이 고정되어 안내되며, 기업교육은 조직 상황에 맞춰 별도 설계합니다."],
  ["AI가 모든 일을 자동으로 처리하나요?", "아닙니다. 개인정보, 사실 확인, 광고 심의, 예외 처리는 사람이 확인하는 Human-in-the-loop 원칙을 적용합니다."],
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activateNode = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    window.history.replaceState(null, "", `#${targetId}`);
    window.requestAnimationFrame(() => target.focus({ preventScroll: true }));
  };
  const curriculumAnchors = ["curriculum-context", "curriculum-decision", "curriculum-tools"];
  return <div>
    <header className="site-nav"><div className="container nav-inner"><Brand /><nav className="nav-links"><Link href="/programs">프로그램</Link><Link href="/instructors">강사진</Link><Link href="/webinar">웨비나</Link><a href="#process">운영 방식</a></nav><div className="nav-spacer" /><div className="nav-actions"><Link className="nav-btn" href="/admin">관리자</Link><Link className="nav-btn primary" href="/webinar">사전 신청</Link><button className="nav-btn" onClick={toggleTheme} aria-label="테마 전환">{theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}</button></div><button className="menu-button" aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? "×" : "☰"}</button></div>{mobileOpen && <div className="mobile-menu"><Link href="/programs" onClick={() => setMobileOpen(false)}>프로그램</Link><Link href="/instructors" onClick={() => setMobileOpen(false)}>강사진</Link><Link href="/webinar" onClick={() => setMobileOpen(false)}>웨비나</Link><Link href="/admin" onClick={() => setMobileOpen(false)}>관리자</Link></div>}</header>
    <section className="hero hero-orchestrated"><ShaderCanvas /><div className="hero-overlay" /><div className="container hero-content"><div className="hero-copy-column"><div className="eyebrow">Agentro education / Build what moves</div><h1>AI를 배우는 시간을 넘어,<br /><em>내 업무를 움직이는</em> 시스템을 만듭니다.</h1><p className="hero-copy">AI Agent 구축부터 콘텐츠 제작, 마케팅 운영 자동화까지. 실습과 피드백을 통해 현업에 바로 적용할 결과물을 완성합니다.</p><div className="cta-row"><Link href="/programs" className="btn light">교육 프로그램 보기 <ArrowUpRight size={16} /></Link><Link href="/webinar" className="btn ghost">웨비나 사전 신청</Link></div></div><AgentOrchestration onNodeActivate={activateNode} /></div></section>
    <section className="metric-ribbon"><div className="container metric-grid">{[["01", "내 업무 기준 설계"],["4주", "프로젝트형 코호트"],["1:1", "개인·팀 피드백"],["HITL", "사람이 검수하는 운영"]].map(([a,b])=><div className="metric" key={a}><strong>{a}</strong><span>{b}</span></div>)}</div></section>
    <section className="section"><div className="container"><div className="section-head"><div className="eyebrow">01 / curriculum tracks</div><h2>도구를 배우는 대신,<br />업무의 구조를 다시 설계합니다.</h2><p>세 개의 실무 트랙은 사용하는 도구가 아니라, 반복되는 업무와 결과물을 중심으로 구성됩니다.</p></div>{tracks.map((t,index)=><div className="track-row" id={curriculumAnchors[index]} tabIndex={-1} key={t.code}><div className="track-code">{t.code}</div><div><h3>{t.title}</h3><p>{t.body}</p></div><div className="chips">{t.chips.map(c=><span className="chip" key={c}>{c}</span>)}</div></div>)}</div></section>
    <section id="process" className="section process"><div className="container"><div id="curriculum-output" tabIndex={-1} className="section-head"><div className="eyebrow">02 / how it works</div><h2>진단에서 운영까지,<br />한 번의 완성으로 끝나지 않게.</h2><p>학습이 끝난 뒤에도 다시 사용할 수 있도록 업무 맥락과 운영 기준까지 남깁니다.</p></div><div className="process-grid">{[["01","진단","반복 업무와 현재 흐름을 찾습니다."],["02","설계","결과물과 판단 기준을 구조화합니다."],["03","실습","실제 데이터로 시스템을 연결합니다."],["04","피드백","개인·팀 상황에 맞춰 다듬습니다."],["05","적용","현업에서 다시 움직이도록 운영합니다."]].map(([n,t,d])=><div className="process-step" key={n}><div className="mono">{n}</div><h4>{t}</h4><p>{d}</p></div>)}</div></div></section>
    <section className="section alt"><div className="container"><div className="section-head"><div className="eyebrow">03 / proof of work</div><h2>배운 내용을 설명하는 대신,<br />작동하는 결과물을 보여줍니다.</h2></div><div className="grid3">{[["MARKETING", "광고 리포트 Agent", "주간 데이터를 모아 성과 요약과 다음 액션까지 초안화"],["CONTENT", "멀티채널 콘텐츠 시스템", "하나의 원고를 뉴스레터·블로그·소셜 포맷으로 재가공"],["OPS", "회의 준비 워크플로", "자료 수집부터 아젠다·후속 액션 정리까지 연결"]].map(([tag,title,body])=><article className="card" key={title}><span className="eyebrow">{tag}</span><h3>{title}</h3><p>{body}</p><div className="card-meta"><span>DEMO CASE</span><span>↗</span></div></article>)}</div></div></section>
    <section className="section"><div className="container"><div className="section-head"><div className="eyebrow">04 / instructors</div><h2>각자의 현업 언어로<br />시스템을 만드는 강사진.</h2></div><div className="grid3">{instructors.map(i=><Link href={`/instructors/${i.slug}`} className="card instructor-card" key={i.slug}><div className="avatar">{i.name.slice(-1)}</div><span className="eyebrow">{i.role}</span><h3>{i.name}</h3><p>{i.intro}</p><div className="card-meta"><span>PROFILE</span><ArrowUpRight size={15} /></div></Link>)}</div></div></section>
    <section className="section alt"><div className="container"><div className="section-head"><div className="eyebrow">05 / programs</div><h2>지금 시작할 수 있는<br />세 가지 방식.</h2></div><div className="plan-grid">{plans.map(([title,price,body,items],idx)=><div className={`plan ${idx===1?"featured":""}`} key={title}><span className="eyebrow">PROGRAM / 0{idx+1}</span><h3>{title}</h3><div className="price">{price}</div><p>{body}</p><ul>{(items as string[]).map(x=><li key={x}>{x}</li>)}</ul><Link href={idx===2?"/corporate":"/programs"} className="btn primary">자세히 보기 <ArrowUpRight size={15}/></Link></div>)}</div></div></section>
    <section className="section"><div className="container"><div className="section-head"><div className="eyebrow">06 / faq</div><h2>시작 전에 확인하세요.</h2></div><div className="faq-list">{faqs.map(([q,a])=><details className="faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section>
    <section className="section process"><div className="container" style={{textAlign:"center"}}><div className="eyebrow">READY WHEN YOU ARE</div><h2 style={{fontSize:"clamp(38px,6vw,76px)",margin:"18px auto",maxWidth:850}}>다음 업무를,<br />다음 시스템으로.</h2><p style={{color:"#a7b8aa",maxWidth:560,margin:"auto"}}>웨비나에서 Agentro의 방식과 실제 작업 흐름을 먼저 경험해보세요.</p><div className="cta-row" style={{justifyContent:"center"}}><Link href="/webinar" className="btn light">웨비나 사전 신청</Link><Link href="/programs" className="btn ghost">프로그램 살펴보기</Link></div></div></section>
    <footer className="footer"><div className="container footer-grid"><div><Brand /><p style={{marginTop:14}}>현업을 움직이는 AI 교육 플랫폼.</p></div><div><h4>EXPLORE</h4><ul><li><Link href="/programs">프로그램</Link></li><li><Link href="/instructors">강사진</Link></li><li><Link href="/webinar">웨비나</Link></li></ul></div><div><h4>FOR TEAMS</h4><ul><li><Link href="/corporate">기업교육</Link></li><li><Link href="/contact">문의하기</Link></li></ul></div><div><h4>POLICY</h4><ul><li><Link href="/privacy">개인정보처리방침</Link></li><li><Link href="/terms">이용약관</Link></li></ul></div></div></footer>
  </div>;
}
