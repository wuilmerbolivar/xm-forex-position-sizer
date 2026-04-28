import { ExternalLink, ShieldCheck, TimerReset } from 'lucide-react';
import type { MarketProfile } from '../lib/marketProfiles';

interface XMInfoSectionProps {
  profile: MarketProfile;
}

export function XMInfoSection({ profile }: XMInfoSectionProps) {
  return (
    <section className="rounded-[1.9rem] border border-[var(--border-strong)] bg-[var(--panel)] p-5 shadow-[0_22px_44px_rgba(5,9,12,0.24)] md:p-6">
      <div className="flex flex-col gap-4 border-b border-[var(--border-muted)] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Contexto broker</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Como usar la herramienta con una cuenta XM real.</h3>
        </div>
        <span className="rounded-full border border-[var(--border-muted)] bg-black/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-primary)]">
          Base operativa: {profile.instrumentLabel}
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: 'Coherencia de cuenta',
            text: 'Valida que el modo micro o standard de la herramienta coincida con el contrato real que abriste en XM.',
          },
          {
            icon: TimerReset,
            title: 'Recalculo antes de entrar',
            text: 'Si el spread cambia o el ATR se expande, recalcula. Un lote correcto hace 10 minutos puede dejar de serlo ahora.',
          },
          {
            icon: ExternalLink,
            title: 'Checklist previo',
            text: 'Confirma activo, sesion, comision, spread y distancia real de stop en MetaTrader antes de enviar la orden.',
          },
        ].map((item) => (
          <article key={item.title} className="rounded-[1.5rem] border border-[var(--border-muted)] bg-black/12 p-5">
            <item.icon className="text-[var(--accent-primary)]" size={18} />
            <h4 className="mt-4 text-lg font-semibold text-white">{item.title}</h4>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-[1.65rem] border border-[var(--border-muted)] bg-black/12 p-5">
        <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">Inicio rapido en 3 pasos</h4>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            'Abre tu cuenta XM con el enlace oficial y completa KYC antes de fondear.',
            'Configura la herramienta con el mercado real que vas a operar y ajusta spread/ATR del momento.',
            'Pasa el ticket a MetaTrader sin alterar el lote sugerido fuera del plan.',
          ].map((text, index) => (
            <div key={text} className="rounded-2xl border border-[var(--border-muted)] bg-white/3 p-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-amber)]">
                Paso {index + 1}
              </span>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
