import { Activity, Gauge, ShieldCheck, Sparkles } from 'lucide-react';
import type { CalculationResults, AppConfig } from '../types';
import type { MarketProfile } from '../lib/marketProfiles';

interface ProtocolDescriptionProps {
  config: AppConfig;
  results: CalculationResults;
  profile: MarketProfile;
}

const STEPS = [
  'Define el capital disponible para la sesion.',
  'Selecciona tu riesgo maximo y valida el spread.',
  'Carga ATR o distancia manual de SL/TP.',
  'Ejecuta solo el lote sugerido por la herramienta.',
] as const;

export function ProtocolDescription({ config, results, profile }: ProtocolDescriptionProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[1.75rem] border border-[var(--border-strong)] bg-[var(--panel)] p-5 shadow-[0_22px_44px_rgba(5,9,12,0.24)] md:p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--accent-primary)]/12 p-3 text-[var(--accent-primary)]">
            <Activity size={20} />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Protocolo operativo</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Un ticket de riesgo antes de abrir MetaTrader.</h2>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
              XM Forex Position Sizer no busca predecir el mercado. Su trabajo es traducir tu escenario en una
              posicion medible: riesgo en dolares, stop tecnico, take profit, coste de spread y drawdown probable.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {STEPS.map((step, index) => (
                <div key={step} className="rounded-2xl border border-[var(--border-muted)] bg-white/3 p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-amber)]">
                    Paso {index + 1}
                  </span>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[1.75rem] border border-[var(--border-strong)] bg-[var(--panel)] p-5">
          <div className="flex items-center gap-3">
            <Gauge className="text-[var(--accent-amber)]" size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">Lectura del modelo</h3>
          </div>
          <div className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              Mercado base: <span className="font-semibold text-white">{profile.instrumentLabel}</span>
            </p>
            <p>
              Modo actual: <span className="font-semibold text-white">{config.calcMode === 'atr' ? 'ATR adaptativo' : 'Manual'}</span>
            </p>
            <p>
              Ratio neto estimado: <span className="font-semibold text-white">1:{results.netRRR.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--border-strong)] bg-[linear-gradient(135deg,rgba(247,185,85,0.14),rgba(90,208,196,0.08))] p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[var(--accent-primary)]" size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">Supuesto de seguridad</h3>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{results.marketComment}</p>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--border-strong)] bg-[var(--panel)] p-5">
          <div className="flex items-center gap-3">
            <Sparkles className="text-[var(--accent-primary)]" size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">Disciplina</h3>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
            Si cambias el tamaño de lote fuera de este ticket, el analisis deja de ser valido. Ajusta el escenario
            aqui primero y ejecuta despues.
          </p>
        </div>
      </div>
    </section>
  );
}
