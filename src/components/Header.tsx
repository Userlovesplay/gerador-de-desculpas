import { Link } from "wouter";
import { img } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex flex-col gap-10 border-b border-foreground/20 pb-12 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-muted-foreground">
          {t("subtitle")}
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.9] tracking-tight md:text-6xl">
          {t("heroTitle")}
          <br />
          {t("heroSubtitle")}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setLanguage(language === "pt-BR" ? "en" : "pt-BR")}
          className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80 hover:text-foreground transition-colors"
        >
          {language === "pt-BR" ? "EN" : "PT"}
        </button>
        <button
          onClick={toggleTheme}
          className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80 hover:text-foreground transition-colors"
        >
          {theme === "dark" ? "LIGHT" : "DARK"}
        </button>
      </div>
      <p className="max-w-md font-serif text-lg leading-relaxed text-foreground/90 md:text-right">
        {t("heroDescription")}
      </p>
    </header>
  );
}
