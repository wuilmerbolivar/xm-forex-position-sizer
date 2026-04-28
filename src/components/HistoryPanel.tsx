import { Clock3, History, Target, Trash2, XCircle } from 'lucide-react';
import { MARKET_PROFILES } from '../lib/marketProfiles';
import type { TradeSession } from '../types';

interface HistoryPanelProps {
  sessions: TradeSession[];
  onClear: () => void;
  onRemove: (id: string) => void;
}

function formatLots(value: number) {
  return value < 0.1 ? value.toFixed(3) : value.toFixed(2);
}

export function HistoryPanel({ sessions, onClear, onRemove }: HistoryPanelProps) {
  if (sessions.length === 0) {
    return null;
  }

  const recentRatios = sessions.slice(0, 6).reverse();
  const averageLot = sessions.reduce((total, session) => total + session.lots, 0) / sessions.length;
  const averageReward = sessions.reduce((total, session) => total + session.rewardUSD, 0) / sessions.length;
  const bestRatio = Math.max(...sessions.map((session) => session.rrr), 0);
  const maxRatio = Math.max(...recentRatios.map((session) => session.rrr), 1);

  return (
    <section className="rounded-[1.75rem] border border-[var(--border-strong)] bg-[var(--panel)] p-4 shadow-[0_22px_44px_rgba(5,9,12,0.24)] md:p-5">
      <div className="flex flex-col gap-4 border-b border-[var(--border-muted)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <History className="text-[var(--accent-primary)]" size={18} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Bitacora</p>
            <h3 className="mt-1 text-lg font-semibold text-white">Ultimos escenarios guardados</h3>
          </div>
        </div>
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/8 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-300 transition-colors hover:bg-rose-400/12"
        >
          <Trash2 size={14} />
          Limpiar bitacora
        </button>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex flex-wrap gap-3">
          {sessions.map((session) => (
            <article key={session.id} className="relative w-full max-w-[320px] flex-none rounded-[1.45rem] border border-[var(--border-muted)] bg-black/12 p-4">
              <button
                onClick={() => onRemove(session.id)}
                className="absolute right-3.5 top-3.5 text-[var(--text-faint)] transition-colors hover:text-rose-300"
                aria-label="Eliminar sesion"
              >
                <XCircle size={15} />
              </button>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent-primary)]">
                    {MARKET_PROFILES[session.market].label}
                  </p>
                  <h4 className="mt-1.5 text-[1.4rem] font-semibold text-white">{session.instrumentLabel}</h4>
                </div>
                <div className="text-right text-[11px] text-[var(--text-secondary)]">
                  <div className="flex items-center justify-end gap-1.5">
                    <Clock3 size={12} />
                    <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1">{new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 p-3.5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Lote</p>
                  <p className="mt-2 font-mono text-[1.55rem] text-white">{formatLots(session.lots)}</p>
                </div>
                <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 p-3.5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Ratio</p>
                  <p className="mt-2 font-mono text-[1.55rem] text-white">1:{session.rrr.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 px-3.5 py-3">
                <div className="flex items-center gap-2 text-rose-300">
                  <Target size={14} />
                  <span className="font-mono text-[13px]">-{session.slPips.toFixed(1)}</span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[13px] text-white">${session.rewardUSD.toFixed(2)}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Reward neto</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-[1.45rem] border border-[var(--border-muted)] bg-black/12 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Lectura rapida</p>
          <h4 className="mt-1.5 text-base font-semibold text-white">Pulso de ratios recientes</h4>
          <div className="mt-4 flex h-28 items-end gap-2" aria-hidden="true">
            {recentRatios.map((session, index) => (
              <div key={session.id} className="flex min-h-0 flex-1 flex-col items-center gap-2">
                <div className="flex min-h-0 flex-1 w-full items-end rounded-xl bg-black/18 p-1">
                  <div
                    className="w-full rounded-lg"
                    style={{
                      height: `${Math.max(16, (session.rrr / maxRatio) * 100)}%`,
                      backgroundColor:
                        session.rrr >= 1.5
                          ? 'rgba(110, 231, 183, 0.96)'
                          : session.rrr >= 1
                            ? 'rgba(253, 224, 71, 0.96)'
                            : 'rgba(251, 113, 133, 0.96)',
                      boxShadow:
                        session.rrr >= 1.5
                          ? '0 0 18px rgba(110, 231, 183, 0.45)'
                          : session.rrr >= 1
                            ? '0 0 18px rgba(253, 224, 71, 0.4)'
                            : '0 0 18px rgba(251, 113, 133, 0.42)',
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="font-mono text-[11px] text-white">1:{session.rrr.toFixed(1)}</p>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-faint)]">S{index + 1}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2.5">
            {[
              { label: 'Escenarios', value: `${sessions.length}` },
              { label: 'Prom. lote', value: formatLots(averageLot) },
              { label: 'Reward prom.', value: `$${averageReward.toFixed(2)}` },
              { label: 'Mejor ratio', value: `1:${bestRatio.toFixed(2)}` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-[1.1rem] border border-[var(--border-muted)] bg-white/3 px-3.5 py-3">
                <span className="text-[12px] text-[var(--text-secondary)]">{item.label}</span>
                <span className="font-mono text-[13px] text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
