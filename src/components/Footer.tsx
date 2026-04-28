import type { MarketProfile } from '../lib/marketProfiles';

interface FooterProps {
  profile: MarketProfile;
}

export function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-6 border-t border-[var(--border-muted)] px-1 pt-6">
      <div className="space-y-2 text-sm text-[var(--text-secondary)]">
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
    </footer>
  );
}
