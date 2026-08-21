import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CopySectionLinkProps = {
  targetId: string;
  label?: string;
};

export default function CopySectionLink({ targetId, label = "섹션 링크 복사" }: CopySectionLinkProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${targetId}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("textarea");
        input.value = url;
        input.setAttribute("readonly", "true");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className={`copy-section-link ${copied ? "is-copied" : ""}`} onClick={copyLink} aria-label={copied ? "섹션 링크가 복사되었습니다" : label}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
      <span>{copied ? "COPIED" : "LINK"}</span>
    </button>
  );
}
