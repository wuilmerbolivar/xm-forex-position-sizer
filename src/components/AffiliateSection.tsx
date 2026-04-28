import { ExternalLink, MessageCircle, Users } from 'lucide-react';

export function AffiliateSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <article className="rounded-[1.9rem] border border-[var(--accent-amber)]/25 bg-[linear-gradient(135deg,rgba(247,185,85,0.16),rgba(90,208,196,0.08))] p-6 shadow-[0_22px_44px_rgba(5,9,12,0.24)]">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--accent-amber)]">Bono disponible por referido</p>
        <h3 className="mt-3 text-xl font-semibold text-white">Crea tu cuenta XM con este enlace y destaca el bono de $30.</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
          Si abres tu cuenta XM desde este enlace de referido puedes acceder al bono promocional disponible de <span className="font-semibold text-white">$30</span>. Tambien facilita el seguimiento y el soporte durante tu arranque.
        </p>

        <div className="mt-5 rounded-[1.4rem] border border-[var(--accent-amber)]/20 bg-black/12 p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-faint)]">Enlace de apertura</p>
          <p className="mt-2 break-all text-sm leading-6 text-white">
            https://www.xmglobal.com/referral?token=M2_3lRF5_nQchoRj09mZeQ
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="https://www.xmglobal.com/referral?token=M2_3lRF5_nQchoRj09mZeQ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent-amber)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
          >
            Crear cuenta XM
            <ExternalLink size={14} />
          </a>
          <a
            href="https://wa.me/51987435331?text=Hola,%20vengo%20de%20XM%20Forex%20Position%20Sizer%20y%20quiero%20acompanamiento%20para%20mi%20cuenta."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300 transition-colors hover:bg-emerald-400/16"
          >
            <MessageCircle size={14} />
            Hablar por WhatsApp
          </a>
        </div>
      </article>

      <article className="rounded-[1.9rem] border border-[var(--border-strong)] bg-[var(--panel)] p-6 shadow-[0_22px_44px_rgba(5,9,12,0.24)]">
        <div className="flex items-center gap-3">
          <Users className="text-[var(--accent-amber)]" size={18} />
          <h3 className="text-lg font-semibold text-white">Comunidad y soporte</h3>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          La herramienta gana valor cuando la usas junto a una rutina real: checklist previo, bitacora, control de
          riesgo y feedback de ejecucion. El soporte por WhatsApp acelera esa parte.
        </p>
        <div className="mt-5 rounded-[1.5rem] border border-[var(--border-muted)] bg-black/12 p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-faint)]">Recomendacion</p>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            Usa la cuenta micro para aprendizaje, verifica el lote sugerido y guarda cada escenario en la bitacora.
          </p>
        </div>
      </article>
    </section>
  );
}
