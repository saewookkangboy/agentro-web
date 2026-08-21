import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

type BrandProps = {
  /** Force knockout lockup (footer / night surfaces). Default follows theme. */
  surface?: "auto" | "light" | "night";
};

export default function Brand({ surface = "auto" }: BrandProps) {
  const { theme } = useTheme();
  const useKnockout =
    surface === "night" || (surface === "auto" && theme === "dark");
  const src = useKnockout
    ? "/agentro-wordmark-knockout.svg"
    : "/agentro-wordmark.svg";

  return (
    <Link href="/" className="brand" aria-label="Agentro 홈으로 이동">
      <img className="brand-wordmark" src={src} alt="Agentro" width={122} height={36} />
    </Link>
  );
}
