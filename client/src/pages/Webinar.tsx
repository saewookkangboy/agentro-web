import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PageMeta from "@/components/PageMeta";
import { PublicFooter, PublicHeader } from "@/components/PublicChrome";

const painPoints = [
  <>보고서는 잘 씁니다.<br />그런데 <strong>내 이름으로 번 돈은 0원</strong>입니다</>,
  <>AI 강의는 들었는데,<br /><strong>정작 내 업무는 하나도 안 바뀌었습니다</strong></>,
  <>5년 안에 나가야 할 것 같은데,<br /><strong>준비한 게 아무것도 없습니다</strong></>,
];

const agenda = [
  { who: "최코치", body: <>25년차가 <strong>AI와 함께 회사를 나온 이야기</strong>, 그리고 기업 현장에서 본 &quot;AI를 쓰는 법과 못 쓰는 법&quot;</> },
  { who: "박코치", body: <>마케팅 에이전트가 <strong>여러 개 동시에 돌아가는 장면</strong>을 눈앞에서 시연합니다</> },
  { who: "황코치", body: <><strong>취미였던 영상이 업이 되기까지</strong> - 실제 만든 결과물과 그 과정 전부 공개</> },
  { who: "코치 3인", body: <>그래서 <strong>당신은 무엇부터 만들면 되는지</strong></> },
];

const coaches = [
  { initial: "최", name: "최코치", tag: "대기업 25년 → 퇴사", desc: "기업·개인 AI 컨설팅 코칭. 방금 강을 건넌 사람.", note: "컨설팅 기업 [　]개사" },
  { initial: "박", name: "박코치", tag: "마케터 독립 10년차", desc: "Agent 전문 코치. 마케팅 전문성을 에이전트로 바꾼 사람.", note: "누적 수강생 [　]명" },
  { initial: "황", name: "황코치", tag: "코칭 독립 15년차", desc: "취미였던 영상이 수익이 된 사람. 기업 AI 강의 진행.", note: "제작 영상 [　]편" },
];

const gifts = [
  { badge: "선물 01", title: "내 업무 AI 진단 체크리스트 30", body: "내가 뭘 시킬 수 있는지부터 확인합니다." },
  { badge: "선물 02", title: "에이전트 실무 프롬프트 10종", body: "내일 아침 업무에 바로 붙입니다." },
  { badge: "선물 03", title: "AI 영상 제작 스킬팩", body: "취미를 콘텐츠로 만드는 전 과정." },
];

const steps = [
  { title: "사전 신청", body: "아래 양식으로 자리를 확보합니다." },
  { title: "웨비나 링크 수신", body: "당일 접속 안내와 리마인드를 보내드립니다." },
  { title: "참석 후 선물 3종 수령", body: "세션이 끝날 때마다 하나씩 전달됩니다." },
];

function RegisterCta({ ghost = false, label = "무료로 사전 신청하기" }: { ghost?: boolean; label?: string }) {
  return (
    <a href="#register" className={ghost ? "btn ghost" : "btn light"}>
      {label}
    </a>
  );
}

export default function Webinar() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", role: "", consent: false });
  const register = trpc.content.registerWebinar.useMutation({
    onSuccess: () => setDone(true),
    onError: e => setError(e.message),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.consent) return setError("개인정보 수집 및 이용에 동의해 주세요.");
    register.mutate({ ...form, consent: true });
  };

  return (
    <div>
      <PageMeta
        title="Agentro 웨비나 - 당신이 자는 동안 일하는 AI 에이전트"
        description="대기업 25년차가 회사를 나와 증명한 방법. 9월 6일(일) 저녁 8시, 온라인 무료. 다시보기 없음."
        image="/manus-storage/agentro-og-webinar_efbd44e7.svg"
      />
      <PublicHeader />

      <div className="orb-page">
        <div className="container orb-inner">
          <div>
            <div className="eyebrow">WEBINAR / EARLY ACCESS</div>
            <h1 style={{ fontSize: "clamp(42px,6vw,78px)", margin: "20px 0" }}>
              내 업무를 움직이는
              <br />
              <span style={{ color: "#FFB900" }}>AI 시스템의 첫 장면.</span>
            </h1>
            <p style={{ color: "#f0c9d8", maxWidth: 570, fontSize: 17 }}>
              Agentro의 교육 방식과 실무형 AI Agent 설계 과정을 라이브로 경험해보세요. 신청자에게는 사전 안내를 보내드리며, 다시보기는 제공되지 않습니다.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 28 }}>
              <span className="badge" style={{ background: "rgba(255,255,255,.08)", color: "#f0c9d8" }}>LIVE · 2026. 09. 06 저녁 8시</span>
              <span className="badge" style={{ background: "rgba(255,255,255,.08)", color: "#f0c9d8" }}>온라인 · 무료</span>
              <span className="badge" style={{ background: "rgba(255,255,255,.08)", color: "#f0c9d8" }}>다시보기 없음</span>
            </div>
          </div>

          <div className="waitlist-card" id="register">
            {done ? (
              <div style={{ padding: "35px 10px", textAlign: "center" }}>
                <div className="avatar" style={{ margin: "0 auto 20px", background: "rgba(255,185,0,.15)" }}>
                  <Check />
                </div>
                <h2 style={{ fontSize: 28 }}>신청이 완료되었습니다.</h2>
                <p style={{ color: "#d7a9bf", marginTop: 12 }}>입력하신 이메일로 웨비나 안내를 보내드릴게요.</p>
                <Link href="/" className="btn light" style={{ marginTop: 24 }}>홈으로 돌아가기</Link>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="eyebrow">SAVE YOUR SEAT</div>
                <h2 style={{ fontSize: 28, margin: "12px 0 8px" }}>먼저 자리를 확보하세요.</h2>
                <p style={{ fontSize: 13, color: "#d7a9bf", marginBottom: 18 }}>
                  신청자에게만 사전 안내와 접속 링크를 보냅니다. 참석자 전용 자료 3종은 라이브에서만 전달됩니다.
                </p>
                <label>
                  이름
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="홍길동" />
                </label>
                <label>
                  이메일
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
                </label>
                <label>
                  현재 직무
                  <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="마케터, 기획자, 대표 등" />
                </label>
                <label className="check">
                  <input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} />
                  신청 안내를 위한 개인정보 수집·이용에 동의합니다.
                </label>
                {error && <p style={{ color: "#FFB900", fontSize: 12 }}>{error}</p>}
                <button className="btn light" style={{ width: "100%", marginTop: 10 }} disabled={register.isPending}>
                  {register.isPending ? "신청 중…" : "무료로 사전 신청하기"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1, paddingBottom: 80 }}>
          <div className="grid3">
            <div className="card" style={{ background: "rgba(61,11,43,.72)", borderColor: "rgba(255,185,0,.24)", color: "#fff2f7" }}>
              <span className="eyebrow">01</span>
              <h3>실무 흐름 해부</h3>
              <p style={{ color: "#d7a9bf" }}>반복 업무를 Agent가 이해할 수 있는 단위로 쪼개는 방법.</p>
            </div>
            <div className="card" style={{ background: "rgba(61,11,43,.72)", borderColor: "rgba(255,185,0,.24)", color: "#fff2f7" }}>
              <span className="eyebrow">02</span>
              <h3>작동하는 데모</h3>
              <p style={{ color: "#d7a9bf" }}>콘텐츠와 마케팅 업무가 연결되는 실제 워크플로.</p>
            </div>
            <div className="card" style={{ background: "rgba(61,11,43,.72)", borderColor: "rgba(255,185,0,.24)", color: "#fff2f7" }}>
              <span className="eyebrow">03</span>
              <h3>다음 단계 설계</h3>
              <p style={{ color: "#d7a9bf" }}>내 업무에 적용할 첫 번째 시스템을 정의합니다.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head" style={{ textAlign: "center", marginInline: "auto" }}>
            <div className="eyebrow">혹시 지금</div>
            <h2>이런 상태이신가요</h2>
          </div>
          <div className="grid3">
            {painPoints.map((point, index) => (
              <article className="card" key={index}>
                <span className="card-tag">CHECK 0{index + 1}</span>
                <p style={{ fontSize: 18, lineHeight: 1.55, marginTop: 12 }}>{point}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section process">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="eyebrow">관점을 바꿔야 합니다</div>
          <h2 style={{ fontSize: "clamp(32px,4.5vw,48px)", margin: "14px auto 22px", maxWidth: 720, color: "#fff2f7" }}>
            당신에게 필요한 건<br />공부가 아니라,<br />
            <span style={{ color: "#FFB900" }}>당신 대신 일하는 직원</span>입니다
          </h2>
          <p style={{ color: "#f0c9d8", maxWidth: 480, margin: "0 auto 28px", fontSize: 17 }}>
            챗봇에게 질문하는 게 아닙니다. 내 업무 흐름을 아는 에이전트를 <strong style={{ color: "#fff" }}>하나 만들어 두는</strong> 겁니다.
          </p>
          <div className="cta-row" style={{ justifyContent: "center" }}>
            <RegisterCta ghost />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Live · 2시간</div>
            <h2>이 2시간에<br />보시게 될 것</h2>
          </div>
          {agenda.map((item, index) => (
            <div className="track-row" style={{ gridTemplateColumns: "72px 1fr" }} key={item.who + index}>
              <div className="track-code">0{index + 1}</div>
              <div>
                <p style={{ fontSize: 18, maxWidth: 720 }}>{item.body}</p>
                <span className="chip" style={{ marginTop: 12, display: "inline-block" }}>{item.who}</span>
              </div>
            </div>
          ))}
          <div className="cta-row" style={{ marginTop: 36 }}>
            <RegisterCta />
          </div>
        </div>
      </section>

      <section className="section process">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Coaches</div>
            <h2 style={{ color: "#fff2f7" }}>
              우리는 10년, 15년이<br />걸렸습니다.<br />
              <span style={{ color: "#FFB900" }}>에이전트가 있는 당신은<br />다릅니다.</span>
            </h2>
          </div>
          <div className="grid3">
            {coaches.map(coach => (
              <article className="card" key={coach.name} style={{ background: "rgba(61,11,43,.55)", borderColor: "rgba(255,185,0,.24)", color: "#fff2f7" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div className="avatar" style={{ background: "rgba(0,125,204,.2)", color: "#7ec8ff" }}>{coach.initial}</div>
                  <div>
                    <h3 style={{ margin: 0 }}>{coach.name}</h3>
                    <span className="card-tag" style={{ marginTop: 6, display: "inline-block" }}>{coach.tag}</span>
                  </div>
                </div>
                <p style={{ color: "#d7a9bf" }}>{coach.desc}</p>
                <div className="card-meta"><span>{coach.note}</span></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head" style={{ textAlign: "center", marginInline: "auto" }}>
            <div className="eyebrow">Bonus</div>
            <h2>참석하신 분께<br />3가지를 드립니다</h2>
          </div>
          <div className="grid3">
            {gifts.map(gift => (
              <article className="card" key={gift.badge}>
                <span className="card-tag">{gift.badge}</span>
                <h3>{gift.title}</h3>
                <p>{gift.body}</p>
              </article>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 28, color: "var(--muted-foreground)", maxWidth: 520, marginInline: "auto" }}>
            3가지 모두 <strong style={{ color: "var(--primary)" }}>웨비나 참석자에게만</strong> 전달됩니다. 다시보기는 제공되지 않습니다.
          </p>
          <div className="cta-row" style={{ justifyContent: "center", marginTop: 28 }}>
            <RegisterCta />
          </div>
        </div>
      </section>

      <section className="section process cta-band" id="final">
        <div className="container">
          <div className="section-head" style={{ textAlign: "center", marginInline: "auto" }}>
            <div className="eyebrow">Last Call</div>
            <h2 style={{ color: "#fff2f7" }}>
              9월 6일 저녁 8시,<br />
              <span style={{ color: "#FFB900" }}>이 자리에서만</span> 열립니다
            </h2>
          </div>
          <div className="grid3" style={{ marginBottom: 36 }}>
            {steps.map((step, index) => (
              <article className="card" key={step.title} style={{ background: "rgba(61,11,43,.55)", borderColor: "rgba(255,185,0,.24)", color: "#fff2f7" }}>
                <span className="eyebrow">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p style={{ color: "#d7a9bf" }}>{step.body}</p>
              </article>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <RegisterCta label="지금 자리 확보하기" />
            <p style={{ color: "#d7a9bf", marginTop: 18, fontSize: 14 }}>참여는 무료이며, 언제든 나가실 수 있습니다.</p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
