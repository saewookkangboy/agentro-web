import { ArrowUpRight, BrainCircuit, Database, GitBranch, Sparkles, Wrench } from "lucide-react";

type AgentOrchestrationProps = {
  onNodeActivate: (targetId: string) => void;
};

const nodes = [
  { label: "CONTEXT", title: "업무 맥락", icon: Database, className: "node-context", targetId: "curriculum-context" },
  { label: "DECISION", title: "판단 기준", icon: BrainCircuit, className: "node-decision", targetId: "curriculum-decision" },
  { label: "TOOLS", title: "도구 연결", icon: Wrench, className: "node-tools", targetId: "curriculum-tools" },
  { label: "OUTPUT", title: "운영 결과", icon: GitBranch, className: "node-output", targetId: "curriculum-output" },
];

export default function AgentOrchestration({ onNodeActivate }: AgentOrchestrationProps) {
  return (
    <div className="orchestration" role="img" aria-label="업무 맥락, 판단 기준, 도구 연결, 운영 결과가 하나의 Agent 시스템으로 연결되는 애니메이션">
      <div className="orchestration-grid" aria-hidden="true" />
      <div className="orchestration-ring ring-one" aria-hidden="true" />
      <div className="orchestration-ring ring-two" aria-hidden="true" />
      <div className="orchestration-line line-one" aria-hidden="true" />
      <div className="orchestration-line line-two" aria-hidden="true" />
      <div className="orchestration-line line-three" aria-hidden="true" />
      <div className="orchestration-line line-four" aria-hidden="true" />
      {nodes.map(({ label, title, icon: Icon, className, targetId }) => (
        <button className={`agent-node ${className}`} key={label} type="button" onClick={() => onNodeActivate(targetId)} aria-label={`${title} 커리큘럼으로 이동`}>
          <span className="agent-node-icon"><Icon size={16} /></span>
          <span className="agent-node-copy"><span>{label}</span><strong>{title}</strong></span>
          <span className="agent-node-dot" aria-hidden="true" />
        </button>
      ))}
      <div className="agent-core">
        <div className="agent-core-pulse" />
        <div className="agent-core-icon"><Sparkles size={20} /></div>
        <span>AGENTRO / CORE</span>
        <strong>WORKFLOW<br />ORCHESTRATOR</strong>
        <small><i /> LIVE SYSTEM</small>
      </div>
      <div className="orchestration-footer"><span>01 — 04 / ORCHESTRATED</span><span>HUMAN IN THE LOOP <ArrowUpRight size={12} /></span></div>
    </div>
  );
}
