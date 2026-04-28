import type { MarketProfile } from '../lib/marketProfiles';
import { XM_ASSOCIATE_CODE } from '../lib/xmAffiliate';

interface FooterProps {
  profile: MarketProfile;
}

export function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-6 border-t border-[var(--border-muted)] px-1 pt-6">
      <div className="flex flex-col gap-4 text-sm text-[var(--text-secondary)] md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p>
            © {currentYear} XM Forex Position Sizer. Creado por{' '}
            <a
              href="https://www.linkedin.com/in/wuilmerbolivar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors hover:text-[var(--accent-primary)]"
            >
              Wuilmer Bolívar
            </a>
            .
          </p>
          <p className="text-xs leading-6 text-[var(--text-faint)]">
            Modelo base actual: {profile.instrumentLabel}. Usa la herramienta como apoyo de gestion, no como promesa de
            rentabilidad.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-muted)] bg-white/3 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
          <span className="text-[var(--text-faint)]">Asociado XM</span>
          <span>{XM_ASSOCIATE_CODE}</span>
        </div>
      </div>
    </footer>
  );
}
