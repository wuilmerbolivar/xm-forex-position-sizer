import { BarChart3, Gauge, LineChart, ShieldAlert } from 'lucide-react';
import type { MarketProfile } from '../lib/marketProfiles';
import { getPlanTargetSnapshot } from '../lib/tradingPlan';
import type { AppConfig, CalculationResults, TradingPlan } from '../types';

interface AnalyticsPanelProps {
  results: CalculationResults;
  capital: number;
  config: AppConfig;
  plan: TradingPlan;
  profile: MarketProfile;
}

export function AnalyticsPanel({ results, capital, config, plan, profile }: AnalyticsPanelProps) {
  const dailyLossBudget = (capital * plan.maxDailyLossPct) / 100;
  const maxLossesPerDay = results.riesgoUSD > 0 ? Math.floor(dailyLossBudget / results.riesgoUSD) : 0;
  const spreadDragPct = results.grossRewardUSD > 0 ? (results.spreadCostUSD / results.grossRewardUSD) * 100 : 0;
  const planSnapshot = getPlanTargetSnapshot({
    plan,
    capital,
    targetEquity: config.targetProfit,
    marketType: config.marketType,
    accountType: config.accountType,
    expectancyUsd: results.expectativaUSD,
  });
  const progressToTarget = planSnapshot.progressPct;
  const dailyUsagePct = dailyLossBudget > 0 ? (results.riesgoUSD / dailyLossBudget) * 100 : 0;
  const tradesPerDayMessage =
    planSnapshot.tradesPerDayNeeded === null
      ? `Sin expectativa positiva no hay ritmo diario sostenible con ${config.marketType} ${config.accountType}.`
      : planSnapshot.tradesPerDayNeeded === 0
        ? `La meta ya esta cubierta con el capital actual en ${config.marketType} ${config.accountType}.`
        : `${planSnapshot.tradesPerDayNeeded.toFixed(1)} trades de expectativa al dia con ${config.marketType} ${config.accountType}.`;
  const capitalSeries = [
    { label: 'Capital', value: capital },
    { label: 'Post SL', value: capital - results.riesgoUSD },
    { label: 'Dia', value: capital - dailyLossBudget },
    { label: 'Racha', value: capital - results.perdidaRacha },
    { label: 'EV+', value: capital + results.expectativaUSD },
    { label: 'Meta', value: config.targetProfit },
  ];
  const chartWidth = 320;
  const chartHeight = 120;
  const minSeriesValue = Math.min(...capitalSeries.map((point) => point.value), capital * 0.35);
  const maxSeriesValue = Math.max(...capitalSeries.map((point) => point.value), capital);
  const seriesRange = Math.max(1, maxSeriesValue - minSeriesValue);
  const chartPoints = capitalSeries.map((point, index) => {
    const x = capitalSeries.length === 1 ? chartWidth / 2 : (index / (capitalSeries.length - 1)) * chartWidth;
    const y = chartHeight - ((point.value - minSeriesValue) / seriesRange) * chartHeight;

    return { ...point, x, y };
  });
  const linePoints = chartPoints.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPoints = `0,${chartHeight} ${linePoints} ${chartWidth},${chartHeight}`;

  return (
    <section className="rounded-[1.75rem] border border-[var(--border-strong)] bg-[var(--panel)] p-4 shadow-[0_22px_44px_rgba(5,9,12,0.24)] md:p-5">
      <div className="flex flex-col gap-4 border-b border-[var(--border-muted)] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-[var(--text-faint)]">Analitica de supervivencia</p>
          <h2 className="mt-2 text-xl font-semibold text-white">El foco no es acertar, es seguir vivo.</h2>
          <p className="mt-2 max-w-3xl text-[13px] leading-6 text-[var(--text-secondary)]">
            El panel estima la friccion del spread, la racha de perdidas probable y cuantas decisiones aguanta la
            cuenta antes de tocar un drawdown severo.
          </p>
        </div>
        <div className="rounded-full border border-[var(--border-muted)] bg-black/14 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-amber)]">
          Modelo {profile.instrumentLabel}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-3">
          <div className="rounded-[1.5rem] border border-[var(--border-muted)] bg-black/12 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Plan mensual</p>
                <h3 className="mt-1 text-base font-semibold text-white">Meta diaria y calendario operativo</h3>
              </div>
              <div className="rounded-full border border-[var(--border-muted)] bg-black/14 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
                {planSnapshot.cycleLabel}
              </div>
            </div>

            <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Meta mensual</p>
                <p className="mt-2 font-mono text-[1.45rem] text-white">+${planSnapshot.monthlyGoalUsd.toFixed(2)}</p>
                <p className="mt-1 text-[11px] leading-5 text-[var(--text-secondary)]">
                  Equity objetivo ${planSnapshot.targetEquity.toFixed(2)}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Meta diaria requerida</p>
                <p className="mt-2 font-mono text-[1.45rem] text-white">+${planSnapshot.requiredDailyGoalUsd.toFixed(2)}</p>
                <p className="mt-1 text-[11px] leading-5 text-[var(--text-secondary)]">
                  {planSnapshot.requiredDailyGoalPct.toFixed(2)}% del capital actual
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Checkpoint de hoy</p>
                <p className="mt-2 font-mono text-[1.45rem] text-white">${planSnapshot.equityCheckpointToday.toFixed(2)}</p>
                <p className="mt-1 text-[11px] leading-5 text-[var(--text-secondary)]">
                  Ritmo base ${planSnapshot.baselineDailyGoalUsd.toFixed(2)} por rueda habil
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Ruedas restantes</p>
                <p className="mt-2 font-mono text-[1.45rem] text-white">{planSnapshot.tradingDaysRemaining}</p>
                <p className="mt-1 text-[11px] leading-5 text-[var(--text-secondary)]">
                  de {planSnapshot.tradingDaysTotal} en {planSnapshot.availabilityLabel.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="mt-3.5 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-black/14 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Lectura de horario</p>
                <p className="mt-2 text-sm font-semibold text-white">{planSnapshot.marketStatusLabel}</p>
                <p className="mt-2 text-[11px] leading-5 text-[var(--text-secondary)]">
                  Ventana sugerida: {planSnapshot.recommendedWindowLabel}. {planSnapshot.cadenceNote}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-black/14 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Riesgo y ritmo</p>
                <p className="mt-2 text-sm font-semibold text-white">
                  Riesgo sugerido {planSnapshot.recommendedRiskPct.toFixed(1)}%
                </p>
                <p className="mt-2 text-[11px] leading-5 text-[var(--text-secondary)]">{tradesPerDayMessage}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border-muted)] bg-black/12 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className={results.isHighRisk ? 'text-rose-300' : 'text-emerald-300'} size={18} />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Drawdown probable</h3>
              </div>
              <span className="font-mono text-base text-white">-{results.drawdownPct.toFixed(1)}%</span>
            </div>
            <div className="mt-3.5 h-2.5 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
              <div
                className={`h-full rounded-full ${
                  results.isHighRisk ? 'bg-[linear-gradient(90deg,#ff6b6b,#ff9c9c)]' : 'bg-[linear-gradient(90deg,#5ad0c4,#7bdcb7)]'
                }`}
                style={{ width: `${Math.min(100, results.drawdownPct)}%` }}
              />
            </div>
            <p className="mt-3 text-[11px] leading-5 text-[var(--text-secondary)]">
              Basado en una racha operativa de {results.rachaHistorica} perdidas consecutivas con el riesgo actual.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border-muted)] bg-black/12 p-4">
            <div className="flex items-center gap-3">
              <Gauge className="text-[var(--accent-primary)]" size={18} />
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Budget diario</h3>
            </div>
            <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Perdida diaria max.</p>
                <p className="mt-2 font-mono text-[1.45rem] text-white">${dailyLossBudget.toFixed(2)}</p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Errores tolerables</p>
                <p className="mt-2 font-mono text-[1.45rem] text-white">{maxLossesPerDay}</p>
              </div>
            </div>
            <div className="mt-3.5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                <span>Uso del budget</span>
                <span>{Math.min(999, dailyUsagePct).toFixed(0)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(90,208,196,0.88),rgba(247,185,85,0.88))]"
                  style={{ width: `${Math.min(100, dailyUsagePct)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[var(--border-muted)] bg-black/12 p-4 sm:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Ruta de capital</p>
                <h3 className="mt-1 text-base font-semibold text-white">Impacto del escenario sobre la cuenta</h3>
              </div>
              <div className="rounded-full border border-[var(--border-muted)] bg-black/14 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
                Meta ${config.targetProfit.toFixed(0)}
              </div>
            </div>

            <div className="mt-4 rounded-[1.25rem] border border-[var(--border-muted)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-3">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-32 w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="capital-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(90,208,196,0.28)" />
                    <stop offset="100%" stopColor="rgba(90,208,196,0.02)" />
                  </linearGradient>
                </defs>
                <path d={`M ${areaPoints} Z`} fill="url(#capital-area)" />
                <polyline
                  fill="none"
                  stroke="rgba(90,208,196,0.92)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={linePoints}
                />
                {chartPoints.map((point) => (
                  <circle key={point.label} cx={point.x} cy={point.y} r="4" fill="rgba(247,185,85,0.96)" />
                ))}
              </svg>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)] sm:grid-cols-6">
                {capitalSeries.map((point) => (
                  <div key={point.label}>
                    <p>{point.label}</p>
                    <p className="mt-1 font-mono text-[11px] text-white">${point.value.toFixed(0)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {[
            {
              icon: BarChart3,
              label: 'Kelly sugerido',
              value: `${results.kellySuggested.toFixed(1)}%`,
              hint: 'Solo como techo matematico',
            },
            {
              icon: LineChart,
              label: 'Expectativa',
              value: `${results.expectativaUSD >= 0 ? '+' : ''}$${results.expectativaUSD.toFixed(2)}`,
              hint: 'Promedio esperado por trade',
            },
            {
              icon: Gauge,
              label: 'Spread drag',
              value: `${spreadDragPct.toFixed(1)}%`,
              hint: 'Cuanto muerde el spread',
            },
            {
              icon: ShieldAlert,
              label: '50% drawdown',
              value: `${results.tradesToRuin50}`,
              hint: 'SL hasta perder media cuenta',
            },
            {
              icon: BarChart3,
              label: 'Trades a meta',
              value: results.expectativaUSD > 0 ? `${results.tradesToTarget}` : 'N/A',
              hint: 'Segun la expectativa actual',
            },
            {
              icon: LineChart,
              label: 'Progreso a meta',
              value: `${progressToTarget.toFixed(0)}%`,
              hint: 'Desde el capital base del plan',
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[1.4rem] border border-[var(--border-muted)] bg-black/12 p-3.5">
              <div className="flex items-center gap-3">
                <stat.icon size={16} className="text-[var(--accent-primary)]" />
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">{stat.label}</p>
              </div>
              <p className="mt-3 font-mono text-[1.45rem] text-white">{stat.value}</p>
              <p className="mt-2 text-[11px] leading-5 text-[var(--text-secondary)]">{stat.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
