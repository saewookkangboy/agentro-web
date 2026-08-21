import { ArrowUpRight, BrainCircuit, Database, GitBranch, Wrench } from "lucide-react";
import type { HeroNode } from "@shared/hero";

type AgentOrchestrationProps = {
  activeNodeId?: string | null;
  onNodeActivate: (targetId: string) => void;
  nodes: HeroNode[];
};

const icons = [Database, BrainCircuit, Wrench, GitBranch];
const classNames = ["node-context", "node-decision", "node-tools", "node-output"];

function OrbitMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path
        d="M39.52 11.32 A 22 22 0 1 0 52.68 24.48"
        fill="none"
        stroke="#3d97d8"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <rect x="24.5" y="24.5" width="15" height="15" rx="5.5" fill="#3d97d8" />
      <circle cx="47.6" cy="16.4" r="7.5" fill="#FFB900" />
    </svg>
  );
}

export default function AgentOrchestration({ activeNodeId, onNodeActivate, nodes }: AgentOrchestrationProps) {
  return (
    <div className="orchestration" role="img" aria-label="업무 맥락, 판단 기준, 도구 연결, 운영 결과가 하나의 Agent 시스템으로 연결되는 애니메이션">
      <div className="orchestration-grid" aria-hidden="true" />
      <div className="orchestration-ring ring-one" aria-hidden="true" />
      <div className="orchestration-ring ring-two" aria-hidden="true" />
      <div className="orchestration-orbit" aria-hidden="true">
        <OrbitMark />
      </div>
      <div className="orchestration-line line-one" aria-hidden="true" />
      <div className="orchestration-line line-two" aria-hidden="true" />
      <div className="orchestration-line line-three" aria-hidden="true" />
      <div className="orchestration-line line-four" aria-hidden="true" />
      {nodes.map((node, index) => {
        const Icon = icons[index] ?? Database;
        return (
          <button className={`agent-node ${classNames[index] ?? ""} ${activeNodeId === node.targetId ? "is-active" : ""}`} key={node.key} type="button" onClick={() => onNodeActivate(node.targetId)} aria-label={`${node.title} 커리큘럼으로 이동`} title={node.description}>
            <span className="agent-node-icon"><Icon size={16} /></span>
            <span className="agent-node-copy"><span>{node.label}</span><strong>{node.title}</strong><small>{node.description}</small></span>
            <span className="agent-node-dot" aria-hidden="true" />
          </button>
        );
      })}
      <div className="agent-core">
        <div className="agent-core-pulse" />
        <OrbitMark className="agent-core-mark" />
        <span>AGENTRO</span>
        <strong>WORKFLOW<br />ORCHESTRATOR</strong>
        <small><i /> LIVE SYSTEM</small>
      </div>
      <div className="orchestration-footer"><span>CONTEXT TO OUTPUT</span><span>HUMAN IN THE LOOP <ArrowUpRight size={12} /></span></div>
    </div>
  );
}
