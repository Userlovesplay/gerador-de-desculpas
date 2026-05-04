import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Sparkles, ArrowRight, RotateCcw, Github, ExternalLink } from "lucide-react";
import {
  TOM_OPTIONS,
  TOM_OPTIONS_EN,
  FORM_OPTIONS,
  FORM_OPTIONS_EN,
  CANAL_OPTIONS,
  CANAL_OPTIONS_EN,
  EXEMPLOS,
  EXEMPLOS_EN,
  PENSANDO,
  PENSANDO_EN,
  RISCO_LABELS,
  RISCO_LABELS_EN,
  RISCO_STYLES,
  type Tom,
  type Formalidade,
  type Canal,
} from "@/constants";
import type { Desculpa } from "@/types";
import { generateMockExcuses } from "@/lib/mock-api";
import { generateExcusesWithGroq } from "@/lib/groq-api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";

type HistoryEntry = {
  id: string;
  situacao: string;
  tom: Tom;
  formalidade: Formalidade;
  canal: Canal;
  desculpas: Desculpa[];
  createdAt: number;
};

export default function Home() {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const tomOptions = language === "en" ? TOM_OPTIONS_EN : TOM_OPTIONS;
  const formOptions = language === "en" ? FORM_OPTIONS_EN : FORM_OPTIONS;
  const canalOptions = language === "en" ? CANAL_OPTIONS_EN : CANAL_OPTIONS;
  const exemplos = language === "en" ? EXEMPLOS_EN : EXEMPLOS;
  const pensando = language === "en" ? PENSANDO_EN : PENSANDO;
  const riscoLabels = language === "en" ? RISCO_LABELS_EN : RISCO_LABELS;

  const [situacao, setSituacao] = useState("");
  const [tom, setTom] = useState<Tom>("diplomatico");
  const [formalidade, setFormalidade] = useState<Formalidade>("formal");
  const [canal, setCanal] = useState<Canal>("email");
  const [destinatario, setDestinatario] = useState("");
  const [incluirJustificativa, setIncluirJustificativa] = useState(true);
  const [incluirReparo, setIncluirReparo] = useState(true);

  const [resultado, setResultado] = useState<Desculpa[] | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem("excuses-history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [pensandoIdx, setPensandoIdx] = useState(0);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("excuses-history", JSON.stringify(history));
    } catch {
      // localStorage might be full or unavailable
    }
  }, [history]);

  useEffect(() => {
    if (!isPending) return;
    setPensandoIdx(0);
    const id = setInterval(() => {
      setPensandoIdx((i) => (i + 1) % pensando.length);
    }, 1600);
    return () => clearInterval(id);
  }, [isPending, pensando.length]);

  const charCount = situacao.trim().length;
  const isValid = charCount >= 4 && charCount <= 600;

  const tomHint = useMemo(
    () => tomOptions.find((o) => o.value === tom)?.hint ?? "",
    [tom, tomOptions],
  );

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!isValid || isPending) return;

    setIsPending(true);

    const generateExcuses = async () => {
      try {
        // Try to use Groq API if configured
        const data = await generateExcusesWithGroq(
          situacao.trim(),
          tom,
          formalidade,
          destinatario || undefined,
          incluirJustificativa,
          incluirReparo,
          language,
        );
        setResultado(data);
        setHistory((prev) => [
          {
            id: crypto.randomUUID(),
            situacao,
            tom,
            formalidade,
            canal,
            desculpas: data,
            createdAt: Date.now(),
          },
          ...prev,
        ].slice(0, 5));
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn("Groq API failed, using mock data:", error);
        const mockData = generateMockExcuses(situacao.trim(), tom, formalidade, language);
        setResultado(mockData);
        setHistory((prev) => [
          {
            id: crypto.randomUUID(),
            situacao,
            tom,
            formalidade,
            canal,
            desculpas: mockData,
            createdAt: Date.now(),
          },
          ...prev,
        ].slice(0, 5));
        toast({
          title: "Using Demo Data",
          description: "Groq API not available. Showing demonstration data.",
          variant: "default",
        });
      } finally {
        setIsPending(false);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 60);
      }
    };

    generateExcuses();
  }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      toast({
        title: t("copiedToast"),
        description: t("copiedDesc"),
      });
      setTimeout(() => setCopiedIdx((curr) => (curr === idx ? null : curr)), 1800);
    }).catch(() => {
      toast({
        title: t("copyError"),
        description: t("copyErrorDesc"),
        variant: "destructive",
      });
    });
  }

  function handleReset() {
    setResultado(null);
    setSituacao("");
    setDestinatario("");
  }

  function loadHistory(entry: HistoryEntry) {
    setSituacao(entry.situacao);
    setTom(entry.tom);
    setFormalidade(entry.formalidade);
    setCanal(entry.canal);
    setResultado(entry.desculpas);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  return (
    <div className="bg-noise min-h-screen text-foreground">
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <div className="fade-slide-up delay-100">
          <Header />
        </div>
        
        <main className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          {/* Form column */}
          <section className="fade-slide-up delay-200">
            <form onSubmit={handleSubmit} className="space-y-10">
              <SituacaoField
                value={situacao}
                onChange={setSituacao}
                charCount={charCount}
                exemplos={exemplos}
                onPickExample={(s) => setSituacao(s)}
              />

              <DialField
                label={t("tomLabel")}
                index="01"
                hint={tomHint}
              >
                <Select value={tom} onValueChange={(v) => setTom(v as Tom)}>
                  <SelectTrigger className="h-12 w-full rounded-none border-0 border-b border-foreground/25 bg-transparent px-0 text-lg font-serif italic focus:border-foreground focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tomOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        <span className="font-serif italic mr-2">{o.label}</span>
                        <span className="text-muted-foreground/80 text-sm">— {o.hint}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DialField>

              <div className="grid gap-10 md:grid-cols-2">
                <DialField label={t("formalidadeLabel")} index="02">
                  <Select value={formalidade} onValueChange={(v) => setFormalidade(v as Formalidade)}>
                    <SelectTrigger className="h-12 w-full rounded-none border-0 border-b border-foreground/25 bg-transparent px-0 text-lg font-serif italic focus:border-foreground focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          <span className="font-serif italic">{o.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </DialField>

                <DialField label={t("canalLabel")} index="03">
                  <Select value={canal} onValueChange={(v) => setCanal(v as Canal)}>
                    <SelectTrigger className="h-12 w-full rounded-none border-0 border-b border-foreground/25 bg-transparent px-0 text-lg font-serif italic focus:border-foreground focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {canalOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          <span className="font-serif italic">{o.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </DialField>
              </div>

              <DialField label={t("destinatarioLabel")} index="04" hint={t("destinatarioHint")}>
                <Input
                  value={destinatario}
                  onChange={(e) => setDestinatario(e.target.value)}
                  placeholder={t("destinatarioPlaceholder")}
                  className="h-12 rounded-none border-0 border-b border-foreground/25 bg-transparent px-0 text-lg font-serif italic placeholder:text-foreground/50 focus-visible:border-foreground focus-visible:ring-0"
                />
              </DialField>

              <DialField label={t("detalhesLabel")} index="05">
                <div className="space-y-4 pt-2">
                  <Toggle
                    id="incluir-just"
                    label={t("toggleJustificativa")}
                    description={t("toggleJustificativaDesc")}
                    checked={incluirJustificativa}
                    onChange={setIncluirJustificativa}
                  />
                  <Toggle
                    id="incluir-reparo"
                    label={t("toggleReparo")}
                    description={t("toggleReparoDesc")}
                    checked={incluirReparo}
                    onChange={setIncluirReparo}
                  />
                </div>
              </DialField>

              <div className="flex flex-col gap-4 border-t border-foreground/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {t("variationsPerGeneration")}
                </p>
                <div className="flex items-center gap-3">
                  {resultado && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleReset}
                      className="font-mono text-xs uppercase tracking-[0.22em]"
                    >
                      <RotateCcw className="mr-2 h-3.5 w-3.5" />
                      {t("resetButton")}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={!isValid || isPending}
                    className="group h-12 rounded-none bg-foreground px-8 font-mono text-xs uppercase tracking-[0.22em] text-background transition-all hover:bg-foreground/90 disabled:opacity-40"
                  >
                    {isPending ? (
                      <span className="flex items-center">
                        <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                        {t("generatingButton")}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {t("generateButton")}
                        <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>

             {/* Results */}
            <div ref={resultsRef} className="mt-20 scroll-mt-12 fade-slide-up delay-300">
              {isPending ? (
                <div className="border-y border-foreground/20 py-24 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center">
                    <span className="block h-2 w-2 animate-pulse rounded-full bg-foreground/80" />
                  </div>
                  <p className="mt-6 font-serif text-2xl italic text-foreground/90">
                    {pensando[pensandoIdx]}
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                    {t("preparingVersions")}
                  </p>
                </div>
              ) : resultado ? (
                <div className="fade-slide-up delay-100">
                  <div className="mb-10 flex items-baseline justify-between border-b border-foreground/20 pb-4">
                    <h2 className="font-serif text-2xl italic">{t("results")}</h2>
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
                      {t("resultsHint")}
                    </span>
                  </div>
                  <div className="space-y-10">
                    {resultado.map((d, i) => (
                      <article
                        key={i}
                        className="group relative border border-foreground/20 bg-card/60 p-8 transition-colors hover:border-foreground/40 md:p-10 fade-slide-up"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <header className="flex items-start justify-between gap-6 border-b border-foreground/20 pb-5">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/60">
                              {t("versaoLabel")} {String(i + 1).padStart(2, "0")}
                            </p>
                            <h3 className="mt-2 font-serif text-2xl leading-tight md:text-3xl">
                              {d.titulo}
                            </h3>
                          </div>
                          <span
                            className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${RISCO_STYLES[d.nivelDeRisco]}`}
                          >
                            {riscoLabels[d.nivelDeRisco]}
                          </span>
                        </header>

                        <p className="mt-7 whitespace-pre-line font-serif text-lg leading-[1.7] text-foreground/90 md:text-xl">
                          {d.texto}
                        </p>

                        <div className="mt-8 border-t border-dashed border-foreground/25 pt-5">
                          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
                            {t("analysis")}
                          </p>
                          <p className="mt-2 font-serif text-base italic leading-relaxed text-foreground/80">
                            {d.analise}
                          </p>
                        </div>

                        <div className="mt-8 flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleCopy(d.texto, i)}
                            className="rounded-none font-mono text-[10px] uppercase tracking-[0.22em]"
                          >
                            {copiedIdx === i ? (
                              <>
                                <Check className="mr-2 h-3.5 w-3.5" />
                                {t("copied")}
                              </>
                            ) : (
                              <>
                                <Copy className="mr-2 h-3.5 w-3.5" />
                                {t("copy")}
                              </>
                            )}
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
            <div className="border-y border-foreground/20 py-20">
              <div className="grid gap-12 md:grid-cols-3">
                {[
                  {
                    n: t("emptyStateI"),
                    t: t("emptyStateIDesc"),
                    d: t("emptyStateIDescDetail"),
                  },
                  {
                    n: t("emptyStateII"),
                    t: t("emptyStateIIDesc"),
                    d: t("emptyStateIIDescDetail"),
                  },
                  {
                    n: t("emptyStateIII"),
                    t: t("emptyStateIIIDesc"),
                    d: t("emptyStateIIIDescDetail"),
                  },
                ].map((item) => (
                  <div key={item.n}>
                    <p className="font-serif text-3xl italic text-foreground/50">{item.n}</p>
                    <p className="mt-4 font-serif text-xl">{item.t}</p>
                    <p className="mt-3 font-serif text-base leading-relaxed text-foreground/80">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>
            </div>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-12 lg:self-start fade-slide-up delay-400">
            <HistoryPanel history={history} onLoad={loadHistory} tomOptions={tomOptions} formOptions={formOptions} canalOptions={canalOptions} />
            <Manifesto />
          </aside>
        </main>

        <Footer />
      </div>
    </div>
  );
}

function SituacaoField({
  value,
  onChange,
  charCount,
  exemplos,
  onPickExample,
}: {
  value: string;
  onChange: (v: string) => void;
  charCount: number;
  exemplos: string[];
  onPickExample: (s: string) => void;
}) {
  const { t } = useLanguage();
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <Label className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          <span className="mr-3 text-foreground/60">00</span>{t("situacaoLabel")}
        </Label>
        <span
          className={`font-mono text-xs ${
            charCount > 600
              ? "text-destructive"
              : charCount >= 4
              ? "text-muted-foreground"
              : "text-foreground/30"
          }`}
        >
          {charCount}/600
        </span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder={t("situacaoPlaceholder")}
        maxLength={600}
        className="mt-4 min-h-[140px] resize-none rounded-none border-0 border-b border-foreground/25 bg-transparent px-0 py-3 font-serif text-xl leading-relaxed placeholder:text-foreground/50 focus-visible:border-foreground focus-visible:ring-0"
      />
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
          {t("exemplosLabel")}
        </span>
        {exemplos.slice(0, 3).map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => onPickExample(ex)}
            className="rounded-full border border-foreground/25 px-3 py-1 font-serif text-xs italic text-foreground/85 transition-colors hover:border-foreground/50 hover:bg-foreground/10"
          >
            {ex.split(" ").slice(0, 6).join(" ")}…
          </button>
        ))}
      </div>
    </div>
  );
}

function DialField({
  label,
  index,
  hint,
  children,
}: {
  label: string;
  index: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <Label className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          <span className="mr-3 text-foreground/60">{index}</span>
          {label}
        </Label>
        {hint && (
          <span className="font-serif text-xs italic text-foreground/70">{hint}</span>
        )}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-4 rounded-none border border-foreground/20 bg-card/40 p-4 transition-colors hover:border-foreground/40"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(Boolean(v))}
        className="mt-1 rounded-none border-foreground/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
      />
      <div className="flex-1">
        <p className="font-serif text-base">{label}</p>
        <p className="mt-1 font-serif text-sm italic text-foreground/75">
          {description}
        </p>
      </div>
    </label>
  );
}

function HistoryPanel({
  history,
  onLoad,
  tomOptions,
  formOptions,
  canalOptions,
}: {
  history: HistoryEntry[];
  onLoad: (entry: HistoryEntry) => void;
  tomOptions: { value: Tom; label: string; hint: string }[];
  formOptions: { value: Formalidade; label: string }[];
  canalOptions: { value: Canal; label: string }[];
}) {
  const { t } = useLanguage();
  if (history.length === 0) {
    return (
      <div className="border border-dashed border-foreground/25 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
          {t("historicoTitle")}
        </p>
        <p className="mt-3 font-serif text-base italic leading-relaxed text-foreground/75">
          {t("historicoEmpty")}
        </p>
      </div>
    );
  }
  return (
    <div className="border border-foreground/20 bg-card/40 p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
        {t("historicoTitle")}
      </p>
      <ul className="mt-4 space-y-3">
        {history.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onLoad(entry)}
              className="group block w-full border-l-2 border-foreground/20 pl-4 text-left transition-colors hover:border-foreground"
            >
              <p className="font-serif text-sm leading-snug text-foreground/85 line-clamp-2">
                {entry.situacao}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                {tomOptions.find((t) => t.value === entry.tom)?.label}
                {" · "}
                {formOptions.find((f) => f.value === entry.formalidade)?.label}
                {" · "}
                {canalOptions.find((c) => c.value === entry.canal)?.label}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Manifesto() {
  const { t } = useLanguage();
  return (
    <div className="mt-10 border-t border-foreground/20 pt-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
        {t("manifesto")}
      </p>
      <p className="mt-4 font-serif text-base italic leading-relaxed text-foreground/80">
        {t("manifestoText")}
      </p>
    </div>
  );
}

function Footer() {
  const { t } = useLanguage();
  return (
    <div className="mt-32 border-t border-foreground/20 pt-8 fade-in delay-300">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
          {t("footerRights")}
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/seu-usuario/gerador-de-desculpas"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Github className="h-3.5 w-3.5" />
            {t("repository")}
          </a>
          <a
            href="https://seu-portfolio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t("portfolio")}
          </a>
        </div>
        <p className="font-serif text-sm italic text-foreground/75">
          {t("footerText")}
        </p>
      </div>
    </div>
  );
}