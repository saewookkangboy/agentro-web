import { Link } from "wouter";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import ShaderCanvas from "@/components/ShaderCanvas";
import AgentOrchestration from "@/components/AgentOrchestration";
import CopySectionLink from "@/components/CopySectionLink";
import { PublicFooter, PublicHeader } from "@/components/PublicChrome";
import { trpc } from "@/lib/trpc";
import { HERO_NODES_SETTING_KEY, parseHeroNodes } from "@shared/hero";
import { CURRICULUM_SETTING_KEY, parseCurriculumContent } from "@shared/curriculum";


const coaches = [
  { name: "코치 프로필 A", role: "AI Agent / Strategy", intro: "복잡한 업무를 실행 가능한 시스템으로 번역합니다.", slug: "coach-a" },
  { name: "코치 프로필 B", role: "Content / Editorial", intro: "브랜드의 언어를 반복 가능한 생산 흐름으로 만듭니다.", slug: "coach-b" },
  { name: "코치 프로필 C", role: "Marketing / Growth", intro: "데이터와 메시지를 연결해 운영 가능한 캠페인을 설계합니다.", slug: "coach-c" },
];
const plans: Array<[string, string, string, string[]]> = [["입문 워크숍","3-4시간","하나의 업무를 빠르게 완성하는 시작점",["완성 경험 중심","라이브 실습","템플릿 제공"]],["프로젝트 코호트","4주","내 업무에 연결된 시스템을 만드는 대표 과정",["주 1회 라이브","개인 피드백","운영 체크리스트"]],["기업 맞춤 과정","맞춤 설계","팀의 업무와 수준에 맞춰 설계하는 AX 교육",["사전 진단","적용 과제","결과 리포트"]]];
const curriculumAnchors = ["curriculum-context", "curriculum-decision", "curriculum-tools"];
const curriculumTargetIds = [...curriculumAnchors, "curriculum-output"];


const faqs = [
  ["개발을 몰라도 참여할 수 있나요?", "코드보다 업무 구조와 결과물 설계를 먼저 다룹니다. 현재 업무를 설명할 수 있다면 시작할 수 있습니다."],
  ["수업에서 어떤 결과물을 완성하나요?", "본인의 실제 업무를 기준으로 Agent, 콘텐츠 생산 시스템, 또는 마케팅 운영 워크플로 가운데 하나를 완성합니다."],
  ["온라인과 오프라인 모두 가능한가요?", "대표 프로그램마다 운영 방식이 고정되어 안내되며, 기업교육은 조직 상황에 맞춰 별도 설계합니다."],
  ["AI가 모든 일을 자동으로 처리하나요?", "아닙니다. 개인정보, 사실 확인, 광고 심의, 예외 처리는 사람이 확인하는 Human-in-the-loop 원칙을 적용합니다."],
];

export default function Home() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [arrivalHighlight, setArrivalHighlight] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const publicContent = trpc.content.public.useQuery();
  const curriculumContent = parseCurriculumContent(publicContent.data?.settings.find(setting => setting.key === CURRICULUM_SETTING_KEY)?.value);
  const curriculumFallbackDescriptions = [...curriculumContent.tracks.map(track => track.body), curriculumContent.processIntro];
  const heroNodes = parseHeroNodes(publicContent.data?.settings.find(setting => setting.key === HERO_NODES_SETTING_KEY)?.value, curriculumFallbackDescriptions);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveNode(visible.target.id);
      else setActiveNode(null);
    }, { rootMargin: "-30% 0px -52% 0px", threshold: [0, 0.3, 0.7, 1] });
    curriculumTargetIds.forEach(id => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activateNode = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    window.history.replaceState(null, "", `#${targetId}`);
    setActiveNode(targetId);
    setArrivalHighlight(targetId);
    window.setTimeout(() => setArrivalHighlight(current => current === targetId ? null : current), 1600);
    window.requestAnimationFrame(() => target.focus({ preventScroll: true }));
  };
  const returnToTop = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    window.history.replaceState(null, "", window.location.pathname);
    setActiveNode(null);
  };
  return <div>
    <PublicHeader />
    <section className="hero hero-orchestrated"><ShaderCanvas /><div className="hero-overlay" /><div className="container hero-content"><div className="hero-copy-column"><div className="eyebrow">AI Agent · AX education</div><h1>AI를 배우는 시간을 넘어,<br /><em>내 업무를 움직이는</em> 시스템을 만듭니다.</h1><p className="hero-copy">Agent 구축부터 콘텐츠·마케팅 운영까지. 실습과 피드백으로 현업에 바로 쓸 결과물을 남깁니다.</p><div className="cta-row"><Link href="/programs" className="btn light">교육 프로그램 보기 <ArrowUpRight size={16} /></Link><Link href="/webinar" className="btn ghost">웨비나 사전 신청</Link></div></div><AgentOrchestration nodes={heroNodes} activeNodeId={activeNode} onNodeActivate={activateNode} /></div></section>
    <section className="metric-ribbon"><div className="container metric-grid">{[["01", "내 업무 기준 설계"],["4주", "프로젝트형 코호트"],["1:1", "개인·팀 피드백"],["HITL", "사람이 검수하는 운영"]].map(([a,b])=><div className="metric" key={a}><strong>{a}</strong><span>{b}</span></div>)}</div></section>
    <section className="section"><div className="container"><div className="section-head"><h2>{curriculumContent.tracksTitle.split("\n").map((line,index)=><span key={line}>{index>0&&<br />}{line}</span>)}</h2><p>{curriculumContent.tracksIntro}</p></div>{curriculumContent.tracks.map((t,index)=><div className={`track-row ${arrivalHighlight === curriculumAnchors[index] ? "arrival-highlight" : ""}`} id={curriculumAnchors[index]} tabIndex={-1} key={t.code}><CopySectionLink targetId={curriculumAnchors[index]} /><div className="track-code">{t.code}</div><div><h3>{t.title}</h3><p>{t.body}</p></div><div className="chips">{t.chips.map(c=><span className="chip" key={c}>{c}</span>)}</div></div>)}</div></section>
    <section id="process" className="section process"><div className="container"><div id="curriculum-output" tabIndex={-1} className={`section-head ${arrivalHighlight === "curriculum-output" ? "arrival-highlight" : ""}`}><CopySectionLink targetId="curriculum-output" /><div className="eyebrow">{curriculumContent.processEyebrow}</div><h2>{curriculumContent.processTitle.split("\n").map((line,index)=><span key={line}>{index>0&&<br />}{line}</span>)}</h2><p>{curriculumContent.processIntro}</p></div><div className="process-grid">{curriculumContent.processSteps.map(step=><div className="process-step" key={step.number}><div className="mono">{step.number}</div><h4>{step.title}</h4><p>{step.description}</p></div>)}</div></div></section>
    <section className="section alt"><div className="container"><div className="section-head"><h2>배운 내용을 설명하는 대신,<br />작동하는 결과물을 보여줍니다.</h2></div><div className="grid3">{[["MARKETING", "광고 리포트 Agent", "주간 데이터를 모아 성과 요약과 다음 액션까지 초안화"],["CONTENT", "멀티채널 콘텐츠 시스템", "하나의 원고를 뉴스레터·블로그·소셜 포맷으로 재가공"],["OPS", "회의 준비 워크플로", "자료 수집부터 아젠다·후속 액션 정리까지 연결"]].map(([tag,title,body])=><article className="card" key={title}><span className="card-tag">{tag}</span><h3>{title}</h3><p>{body}</p><div className="card-meta"><span>DEMO CASE</span><span>↗</span></div></article>)}</div></div></section>
    <section className="section"><div className="container"><div className="section-head"><h2>각자의 현업 언어로<br />시스템을 만드는 코치진.</h2></div><div className="grid3">{coaches.map(i=><Link href={`/coaches/${i.slug}`} className="card coach-card" key={i.slug}><div className="avatar">{i.name.slice(-1)}</div><span className="card-tag">{i.role}</span><h3>{i.name}</h3><p>{i.intro}</p><div className="card-meta"><span>PROFILE</span><ArrowUpRight size={15} /></div></Link>)}</div></div></section>
    <section className="section alt"><div className="container"><div className="section-head"><div className="eyebrow">Programs</div><h2>지금 시작할 수 있는<br />세 가지 방식.</h2></div><div className="plan-grid">{plans.map(([title,price,body,items],idx)=><div className={`plan ${idx===1?"featured":""}`} key={title}><span className="card-tag">PROGRAM 0{idx+1}</span><h3>{title}</h3><div className="price">{price}</div><p>{body}</p><ul>{(items as string[]).map(x=><li key={x}>{x}</li>)}</ul><Link href={idx===2?"/corporate":"/programs"} className="btn primary">자세히 보기 <ArrowUpRight size={15}/></Link></div>)}</div></div></section>
    <section className="section"><div className="container"><div className="section-head"><h2>시작 전에 확인하세요.</h2></div><div className="faq-list">{faqs.map(([q,a])=><details className="faq" key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section>
    <section className="section process cta-band"><div className="container" style={{textAlign:"center"}}><h2 style={{fontSize:"clamp(38px,6vw,72px)",margin:"0 auto 18px",maxWidth:850}}>다음 업무를,<br />다음 시스템으로.</h2><p style={{color:"#f0c9d8",maxWidth:520,margin:"auto"}}>웨비나에서 Agentro의 방식과 실제 작업 흐름을 먼저 경험해보세요.</p><div className="cta-row" style={{justifyContent:"center"}}><Link href="/webinar" className="btn light">웨비나 사전 신청</Link><Link href="/programs" className="btn ghost">프로그램 살펴보기</Link></div></div></section>
    <PublicFooter />
    <button type="button" className={`to-top ${showTop ? "is-visible" : ""}`} onClick={returnToTop} aria-label="Hero 영역으로 돌아가기"><ArrowUp size={16} /><span>TOP</span></button>
  </div>;
}
