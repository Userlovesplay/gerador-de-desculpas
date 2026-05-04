import { useEffect, useState } from "react";

export function PageLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 mx-auto border-2 border-foreground/20 rounded-full">
              <div className="absolute inset-0 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
