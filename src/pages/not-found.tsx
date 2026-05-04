import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-noise min-h-screen text-foreground flex items-center justify-center px-6">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            Erro 404
          </p>

          <h1 className="mt-8 font-serif text-8xl font-bold leading-none tracking-tight md:text-9xl">
            4<span className="italic text-foreground/60">0</span>4
          </h1>

          <div className="mt-10 space-y-6">
            <h2 className="font-serif text-3xl italic leading-tight md:text-4xl">
              Página não encontrada
            </h2>
            <p className="mx-auto max-w-md font-serif text-lg leading-relaxed text-foreground/75">
              A página que você procura pode ter sido movida, deletada ou talvez nunca tenha existido. Que tal voltar e gerar uma desculpa para essa situação?
            </p>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-none bg-foreground px-8 py-3 font-mono text-xs uppercase tracking-[0.22em] text-background transition-all hover:bg-foreground/90"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar ao início
            </Link>

            <a
              href="https://github.com/userlovesplay/gerador-de-desculpas/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-none border border-foreground/20 px-8 py-3 font-mono text-xs uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground/40"
            >
              <Search className="h-3.5 w-3.5" />
              Reportar problema
            </a>
          </div>

          <div className="mt-16 border-t border-foreground/20 pt-8">
            <p className="font-serif text-sm italic text-foreground/55">
              "Cada palavra escolhida tem um custo. Escolha bem."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
