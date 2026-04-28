import { BookOpen, ExternalLink, MessageCircle, Users } from 'lucide-react';
import { XM_ASSOCIATE_CODE, XM_AFFILIATE_LINKS } from '../lib/xmAffiliate';

interface AffiliateSectionProps {
  onOpenDirectory: () => void;
}

const XM_PREVIEW_CARDS = [
  {
    title: 'Cuenta y registro',
    text: 'Cuenta real, demo y tipos de cuenta quedan agrupados en una sola capa de navegacion.',
  },
  {
    title: 'Plataformas y acceso',
    text: 'MT5, app, acceso de usuarios y calculadoras se consultan sin abandonar el flujo principal.',
  },
  {
    title: 'Soporte y contexto',
    text: 'Formacion, promociones, copy trading y atencion oficial viven en el mismo panel de apoyo.',
  },
] as const;

export function AffiliateSection({ onOpenDirectory }: AffiliateSectionProps) {

  return (
    <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <article className="rounded-[1.9rem] border border-[var(--accent-amber)]/25 bg-[linear-gradient(135deg,rgba(247,185,85,0.16),rgba(90,208,196,0.08))] p-6 shadow-[0_22px_44px_rgba(5,9,12,0.24)]">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--accent-amber)]">Enlaces XM con referido</p>
        <h3 className="mt-3 text-xl font-semibold text-white">Todo acceso a XM desde esta herramienta aplica tu asociado {XM_ASSOCIATE_CODE}.</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
          La apertura principal queda visible aqui y el resto del ecosistema XM se concentra en un directorio dedicado
          para consulta rapida desde una herramienta publica y de acceso libre.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.4rem] border border-[var(--accent-amber)]/20 bg-black/12 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-faint)]">Codigo de asociado</p>
            <p className="mt-2 text-lg font-semibold text-white">{XM_ASSOCIATE_CODE}</p>
          </div>
          <div className="rounded-[1.4rem] border border-[var(--accent-amber)]/20 bg-black/12 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-faint)]">Ruta principal</p>
            <p className="mt-2 text-sm leading-6 text-white">{XM_AFFILIATE_LINKS.realAccount.label}</p>
            <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">{XM_AFFILIATE_LINKS.realAccount.description}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <a
            href={XM_AFFILIATE_LINKS.realAccount.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-between rounded-2xl bg-[var(--accent-amber)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5 md:col-span-2"
          >
            Abrir cuenta real
            <ExternalLink size={14} />
          </a>
          <a
            href={XM_AFFILIATE_LINKS.demoAccount.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-between rounded-2xl border border-[var(--border-strong)] bg-black/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:border-[var(--accent-amber)] hover:text-[var(--accent-amber)]"
          >
            Abrir demo
            <ExternalLink size={14} />
          </a>
          <a
            href="https://wa.me/51987435331?text=Hola,%20vengo%20de%20XM%20Forex%20Position%20Sizer%20y%20quiero%20acompanamiento%20para%20mi%20cuenta."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300 transition-colors hover:bg-emerald-400/16"
          >
            <span className="inline-flex items-center gap-2">
              <MessageCircle size={14} />
              Hablar por WhatsApp
            </span>
            <ExternalLink size={14} />
          </a>
        </div>
      </article>

      <article className="rounded-[1.9rem] border border-[var(--border-strong)] bg-[var(--panel)] p-6 shadow-[0_22px_44px_rgba(5,9,12,0.24)]">
        <div className="flex items-center gap-3">
          <Users className="text-[var(--accent-amber)]" size={18} />
          <h3 className="text-lg font-semibold text-white">Directorio XM</h3>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          Consulta las rutas oficiales de XM agrupadas por apertura, plataformas, soporte y recursos complementarios.
        </p>
        <div className="mt-5 grid gap-3">
          {XM_PREVIEW_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-[1.35rem] border border-[var(--border-muted)] bg-black/12 p-4"
            >
              <p className="text-sm font-semibold text-white">{card.title}</p>
              <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">{card.text}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onOpenDirectory}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-white/4 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
        >
          <BookOpen size={14} />
          Abrir directorio XM
        </button>
      </article>
    </section>
  );
}
