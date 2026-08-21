import { Link } from "wouter";

export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Agentro 홈으로 이동">
      <img className="brand-wordmark" src="/agentro-wordmark.svg" alt="Agentro" />
    </Link>
  );
}
