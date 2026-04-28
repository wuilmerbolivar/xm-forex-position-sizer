import { BookOpen, CandlestickChart, ClipboardList, MessageCircle, ShieldCheck, Target } from 'lucide-react';
import type { AppConfig, CalculationResults } from '../types';
import type { MarketProfile } from '../lib/marketProfiles';

interface HeaderProps {
  config: AppConfig;
  results: CalculationResults;
  profile: MarketProfile;
  onOpenManual: () => void;
  onOpenPlan: () => void;
}

const CANDLES = [
  { body: 36, wickTop: 10, wickBottom: 16, bullish: true },
  { body: 22, wickTop: 18, wickBottom: 10, bullish: false },
  { body: 44, wickTop: 8, wickBottom: 12, bullish: true },
  { body: 30, wickTop: 14, wickBottom: 8, bullish: true },
  { body: 18, wickTop: 6, wickBottom: 20, bullish: false },
  { body: 38, wickTop: 10, wickBottom: 12, bullish: true },
  { body: 26, wickTop: 12, wickBottom: 18, bullish: false },
  { body: 34, wickTop: 7, wickBottom: 14, bullish: true },
] as const;

export function Header({ config, results, profile, onOpenManual, onOpenPlan }: HeaderProps) {
  const accountLabel = config.accountType === 'standard' ? 'Standard' : 'Micro';

  return (
    <header className="overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-[linear-gradient(135deg,rgba(11,17,23,0.96),rgba(19,27,36,0.88))] shadow-[0_28px_60px_rgba(5,9,12,0.45)]">
      <div className="grid gap-5 px-5 py-6 md:px-7 md:py-7 xl:grid-cols-[1.35fr_0.95fr] xl:gap-8">
        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-muted)] bg-white/4 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-primary)]">
              <CandlestickChart size={14} />
              XM Forex Position Sizer
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
              <ShieldCheck size={14} />
              Control de riesgo en vivo
            </span>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="max-w-2xl break-words text-[2.35rem] font-semibold leading-[1.02] text-white sm:text-[2.75rem] xl:text-[2.55rem]">
              XM Forex Position Sizer para lotaje, drawdown y ejecucion disciplinada.
            </h1>
            <p className="max-w-2xl text-[13px] leading-7 text-[var(--text-secondary)] md:text-[15px]">
              Calculadora profesional para XM enfocada en XAUUSD, Forex e indices. Convierte riesgo porcentual,
              volatilidad ATR y spread en una posicion ejecutable, con lectura clara para traders principiantes y
              operadores con plan avanzado.
            </p>
          </div>

          <div className="max-w-2xl rounded-[1.3rem] border border-[var(--accent-amber)]/25 bg-[linear-gradient(135deg,rgba(247,185,85,0.14),rgba(247,185,85,0.05))] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-amber)]">Bono XM para nuevas cuentas</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <p className="text-[13px] leading-6 text-[var(--text-secondary)]">
                Si abres tu cuenta XM con este enlace de referido puedes recibir el bono disponible de <span className="font-semibold text-white">$30</span> y quedar identificado para soporte.
              </p>
              <a
                href="https://www.xmglobal.com/referral?token=M2_3lRF5_nQchoRj09mZeQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl bg-[var(--accent-amber)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
              >
                Abrir cuenta XM
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border-muted)] bg-white/4 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Mercado</p>
              <p className="mt-2 text-base font-semibold text-white">{profile.label}</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">{profile.instrumentLabel} como modelo base</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-muted)] bg-white/4 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Riesgo por trade</p>
              <p className="mt-2 text-base font-semibold text-white">${results.riesgoUSD.toFixed(2)}</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">{results.capitalAtRiskPct.toFixed(2)}% del capital</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-muted)] bg-white/4 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Sesion objetivo</p>
              <p className="mt-2 text-base font-semibold text-white">1:{results.netRRR.toFixed(2)}</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Expectativa {results.expectativaUSD >= 0 ? '+' : ''}${results.expectativaUSD.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <a
              href="#calculator"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
            >
              <Target size={14} />
              Calcular posicion
            </a>
            <button
              onClick={onOpenPlan}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-white/4 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
            >
              <ClipboardList size={14} />
              Plan de trading
            </button>
            <button
              onClick={onOpenManual}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border-muted)] bg-transparent px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-amber)] hover:text-[var(--accent-amber)]"
            >
              <BookOpen size={14} />
              Manual operativo
            </button>
            <a
              href="https://wa.me/51987435331?text=Hola,%20vengo%20de%20XM%20Forex%20Position%20Sizer%20y%20quiero%20ayuda%20para%20mi%20cuenta."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300 transition-colors hover:bg-emerald-400/16"
            >
              <MessageCircle size={14} />
              Soporte
            </a>
          </div>
        </div>

        <div className="min-w-0 rounded-[1.7rem] border border-[var(--border-muted)] bg-[linear-gradient(180deg,rgba(18,25,34,0.92),rgba(12,18,25,0.92))] p-4 md:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[var(--text-faint)]">Market board</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{profile.instrumentLabel}</h2>
              <p className="mt-1 text-xs leading-6 text-[var(--text-secondary)]">{profile.description}</p>
            </div>
            <span className="rounded-full border border-[var(--border-muted)] bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-amber)]">
              {accountLabel}
            </span>
          </div>

          <div className="mt-5 rounded-[1.45rem] border border-[var(--border-muted)] bg-[radial-gradient(circle_at_top,rgba(90,208,196,0.14),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Execution model</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {config.calcMode === 'atr' ? 'ATR adaptativo' : 'SL/TP manual'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Win rate</p>
                <p className="mt-1 font-mono text-sm text-[var(--accent-primary)]">{config.winRate.toFixed(0)}%</p>
              </div>
            </div>

            <div className="relative h-44 overflow-hidden rounded-[1.25rem] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-4 py-4">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,transparent_49.6%,rgba(255,255,255,0.05)_50%,transparent_50.4%,transparent_100%),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:100%_100%,100%_24%]" />
              <div className="relative flex h-full items-end justify-between gap-2">
                {CANDLES.map((candle, index) => (
                  <div key={index} className="relative flex flex-1 items-end justify-center">
                    <span
                      className="absolute bottom-0 w-px rounded-full bg-white/30"
                      style={{ height: `${candle.body + candle.wickTop + candle.wickBottom}px` }}
                    />
                    <div
                      className={`relative z-10 w-full max-w-7 rounded-md border ${
                        candle.bullish
                          ? 'border-emerald-300/40 bg-emerald-300/70'
                          : 'border-rose-300/40 bg-rose-300/70'
                      }`}
                      style={{ height: `${candle.body}px`, marginBottom: `${candle.wickBottom}px` }}
                    />
                  </div>
                ))}
                <div className="absolute inset-x-4 top-[32%] border-t border-dashed border-[var(--accent-primary)]/30" />
                <div className="absolute inset-x-4 top-[61%] border-t border-dashed border-[var(--accent-amber)]/30" />
                <span className="absolute right-4 top-[28%] rounded-full bg-[var(--accent-primary)]/14 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-primary)]">
                  Entry frame
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border-muted)] bg-black/14 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Valor por {results.unitLabel.slice(0, -1)}</p>
                <p className="mt-2 font-mono text-lg text-white">${results.pipValue.toFixed(2)}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-muted)] bg-black/14 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Spread efectivo</p>
                <p className="mt-2 font-mono text-lg text-white">${results.spreadCostUSD.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
