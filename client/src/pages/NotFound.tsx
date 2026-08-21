import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-lg mx-4 text-center py-16">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-14 w-14" style={{ color: "var(--brand-magenta, #D10056)" }} />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="mb-8 leading-relaxed" style={{ color: "var(--ink-2)" }}>
          요청하신 주소가 없거나 이동되었을 수 있습니다.
        </p>
        <Button onClick={() => setLocation("/")} className="px-6">
          <Home className="w-4 h-4 mr-2" />
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  );
}
