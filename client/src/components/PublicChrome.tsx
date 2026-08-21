import { Moon, Sun } from "lucide-react";
import { Link } from "wouter";
import Brand from "@/components/Brand";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

export function PublicHeader() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);
  return (
    <header className="site-nav">
      <div className="container nav-inner">
        <Brand />
        <nav className="nav-links" aria-label="주요 메뉴">
          <Link href="/programs">프로그램</Link>
          <Link href="/instructors">강사진</Link>
          <Link href="/webinar">웨비나</Link>
          <Link href="/#process">운영 방식</Link>
        </nav>
        <div className="nav-spacer" />
        <div className="nav-actions">
          <Link className="nav-btn primary" href="/webinar">사전 신청</Link>
          <button className="nav-btn" type="button" onClick={() => toggleTheme?.()} aria-label="테마 전환">
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
        <button className="menu-button" type="button" aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(value => !value)}>
          {mobileOpen ? "×" : "☰"}
        </button>
      </div>
      {mobileOpen && (
        <nav className="mobile-menu" aria-label="모바일 주요 메뉴">
          <Link href="/programs" onClick={close}>프로그램</Link>
          <Link href="/instructors" onClick={close}>강사진</Link>
          <Link href="/webinar" onClick={close}>웨비나</Link>
          <Link href="/#process" onClick={close}>운영 방식</Link>
        </nav>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><Brand surface="night" /><p style={{ marginTop: 14 }}>현업을 움직이는 AI 교육 플랫폼.</p></div>
        <div><h4>EXPLORE</h4><ul><li><Link href="/programs">프로그램</Link></li><li><Link href="/instructors">강사진</Link></li><li><Link href="/webinar">웨비나</Link></li></ul></div>
        <div><h4>FOR TEAMS</h4><ul><li><Link href="/corporate">기업교육</Link></li><li><Link href="/contact">문의하기</Link></li></ul></div>
        <div><h4>POLICY</h4><ul><li><Link href="/privacy">개인정보처리방침</Link></li><li><Link href="/terms">이용약관</Link></li></ul></div>
        <div className="footer-admin-cell">
          <Link className="footer-admin-mark" href="/admin" tabIndex={-1}>
            <span className="footer-admin-mark-circle" aria-hidden="true">
              <span className="footer-admin-mark-triangle" />
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
