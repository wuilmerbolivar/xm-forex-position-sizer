import { Check, Copy, Save, Shield, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { AccountType, CalculationResults, MarketType } from '../types';

interface ResultsDisplayProps {
  results: CalculationResults;
  accountType: AccountType;
  marketType: MarketType;
  winRate: number;
  onSave?: () => void;
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function formatLots(value: number) {
  return value < 0.1 ? value.toFixed(3) : value.toFixed(2);
}

export function ResultsDisplay({ results, accountType, marketType, winRate, onSave }: ResultsDisplayProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const accountLabel = accountType === 'standard' ? 'Standard' : 'Micro';

  const copyReport = async () => {
    const report = [
      'XM FOREX POSITION SIZER - TRADE REPORT',
      '-------------------------------------',
      `Activo modelo: ${results.instrumentLabel}`,
      `Mercado: ${marketType.toUpperCase()}`,
      `Cuenta: ${accountType.toUpperCase()}`,
      `Lote sugerido: ${results.lotes.toFixed(3)}`,
      `Stop Loss: ${results.sl.toFixed(1)} ${results.unitLabel} (-$${results.riesgoUSD.toFixed(2)})`,
      `Take Profit: ${results.tp.toFixed(1)} ${results.unitLabel} (+$${results.ganancia.toFixed(2)} neto)`,
      `Ratio tecnico: 1:${results.currentRRR.toFixed(2)}`,
      `Ratio neto: 1:${results.netRRR.toFixed(2)}`,
      `Win rate usado: ${winRate.toFixed(0)}%`,
      '-------------------------------------',
      'Calculado con XM Forex Position Sizer',
      'Reporte obtenido desde: xmsizer.vercel.app',
    ].join('\n');

    try {
      await copyText(report);
      setCopyState('copied');
    } catch (error) {
      console.error('Unable to copy report', error);
      setCopyState('failed');
    } finally {
      window.setTimeout(() => setCopyState('idle'), 2200);
    }
  };

  const rewardWidth = results.sl + results.tp > 0 ? (results.tp / (results.sl + results.tp)) * 100 : 0;
  const riskWidth = 100 - rewardWidth;
  const chartMetrics = [
    { label: 'Spread', value: results.spreadCostUSD, color: 'rgba(253, 224, 71, 0.95)' },
    { label: 'Risk', value: results.riesgoUSD, color: 'rgba(251, 113, 133, 0.95)' },
    { label: 'Bruto', value: results.grossRewardUSD, color: 'rgba(125, 211, 252, 0.95)' },
    { label: 'Neto', value: Math.max(results.ganancia, 0), color: 'rgba(110, 231, 183, 0.95)' },
  ];
  const maxChartMetric = Math.max(...chartMetrics.map((metric) => metric.value), 1);
  const cardMeters = [
    results.lotes * 70,
    results.capitalAtRiskPct * 20,
    results.netRRR * 34,
    results.lotes * 55,
  ];

  return (
    <section className="space-y-5 rounded-[1.75rem] border border-[var(--border-strong)] bg-[var(--panel)] p-4 shadow-[0_22px_44px_rgba(5,9,12,0.24)] md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-[var(--text-faint)]">Ticket de ejecucion</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Posicion lista para validar en plataforma.</h2>
          <p className="mt-2 text-[13px] leading-6 text-[var(--text-secondary)]">
            El lote ya incorpora spread estimado dentro del riesgo. Verifica solo que el simbolo y la cuenta XM
            coincidan antes de lanzar la orden.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[var(--border-muted)] bg-black/14 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
          <Shield size={14} />
          {results.isHighRisk ? 'Escenario delicado' : 'Escenario validable'}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Lote sugerido',
            value: formatLots(results.lotes),
            hint: `${accountLabel} lot`,
          },
          {
            label: 'Riesgo real',
            value: `$${results.riesgoUSD.toFixed(2)}`,
            hint: 'Incluye coste de entrada',
          },
          {
            label: 'Recompensa neta',
            value: `$${results.ganancia.toFixed(2)}`,
            hint: 'Despues del spread',
          },
          {
            label: 'Exposicion modelada',
            value: results.positionUnits.toFixed(1),
            hint: 'Unidades del contrato base',
          },
        ].map((card, index) => (
          <div key={card.label} className="rounded-[1.35rem] border border-[var(--border-muted)] bg-white/4 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">{card.label}</p>
            <p className="mt-2.5 font-mono text-[1.6rem] leading-none text-white md:text-[1.72rem]">{card.value}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/6">
              <div
                className={`h-full rounded-full ${
                  index === 0
                    ? 'bg-[linear-gradient(90deg,rgba(90,208,196,0.85),rgba(90,208,196,0.35))'
                    : index === 1
                      ? 'bg-[linear-gradient(90deg,rgba(255,107,107,0.85),rgba(255,107,107,0.35))'
                      : index === 2
                        ? 'bg-[linear-gradient(90deg,rgba(123,220,183,0.85),rgba(123,220,183,0.35))'
                        : 'bg-[linear-gradient(90deg,rgba(247,185,85,0.85),rgba(247,185,85,0.35))'
                }`}
                style={{ width: `${Math.max(22, Math.min(100, cardMeters[index] ?? 22))}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] leading-5 text-[var(--text-secondary)]">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.55rem] border border-[var(--border-muted)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Mapa riesgo / retorno</p>
              <h3 className="mt-1.5 text-base font-semibold text-white">Blueprint del trade</h3>
            </div>
            <div className="rounded-full border border-[var(--border-muted)] bg-black/14 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-amber)]">
              Neto 1:{results.netRRR.toFixed(2)}
            </div>
          </div>

          <div className="mt-5">
            <div className="relative overflow-hidden rounded-[1.2rem] border border-[var(--border-muted)] bg-[var(--bg-secondary)] p-2">
              <div className="flex h-16 overflow-hidden rounded-xl">
                <div
                  className="relative flex items-center justify-center bg-rose-400/12 text-rose-300"
                  style={{ width: `${riskWidth}%` }}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Risk</span>
                </div>
                <div
                  className="relative flex items-center justify-center bg-emerald-400/12 text-emerald-300"
                  style={{ width: `${rewardWidth}%` }}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Reward</span>
                </div>
              </div>
              <div className="absolute inset-y-2 left-[50%] border-l border-dashed border-white/25" />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-black/12 p-3.5">
                <div className="flex items-center gap-2 text-rose-300">
                  <TrendingDown size={16} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Stop loss</span>
                </div>
                <p className="mt-2.5 font-mono text-[1.45rem] text-white">
                  {results.sl.toFixed(1)} {results.unitLabel}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-black/12 p-3.5">
                <div className="flex items-center gap-2 text-emerald-300">
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Take profit</span>
                </div>
                <p className="mt-2.5 font-mono text-[1.45rem] text-white">
                  {results.tp.toFixed(1)} {results.unitLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.55rem] border border-[var(--border-muted)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Chequeo rapido</p>
          <div className="mt-4 rounded-[1.2rem] border border-[var(--border-muted)] bg-black/12 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Pulso del escenario</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--accent-primary)]">USD</p>
            </div>
            <div className="mt-4 flex h-24 items-end gap-2" aria-hidden="true">
              {chartMetrics.map((metric) => (
                <div key={metric.label} className="flex min-h-0 flex-1 flex-col items-center gap-2">
                  <div className="flex min-h-0 flex-1 w-full items-end rounded-xl bg-black/18 p-1">
                    <div
                      className="w-full rounded-lg"
                      style={{
                        height: `${Math.max(18, (metric.value / maxChartMetric) * 100)}%`,
                        backgroundColor: metric.color,
                        boxShadow: `0 0 18px ${metric.color}`,
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[11px] text-white">${metric.value.toFixed(0)}</p>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-faint)]">{metric.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-2.5">
            {[
              { label: `Valor por ${results.unitLabel.slice(0, -1)}`, value: `$${results.pipValue.toFixed(2)}` },
              { label: 'Spread estimado', value: `$${results.spreadCostUSD.toFixed(2)}` },
              { label: 'Reward bruto', value: `$${results.grossRewardUSD.toFixed(2)}` },
              { label: 'Drawdown de racha', value: `${results.drawdownPct.toFixed(1)}%` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-[1.1rem] border border-[var(--border-muted)] bg-black/12 px-3.5 py-3">
                <span className="text-[12px] text-[var(--text-secondary)]">{item.label}</span>
                <span className="font-mono text-[13px] text-white">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={copyReport}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-black/14 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)] transition-colors hover:border-[var(--accent-primary)]"
            >
              {copyState === 'copied' ? <Check size={14} /> : <Copy size={14} />}
              {copyState === 'copied' ? 'Copiado' : copyState === 'failed' ? 'Reintentar copia' : 'Copiar reporte'}
            </button>
            <button
              onClick={onSave}
              disabled={!onSave}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={14} />
              Guardar sesion
            </button>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-[var(--text-secondary)]">
            El reporte copiado incluye la referencia de origen requerida para compartirlo desde WhatsApp o soporte.
          </p>
        </div>
      </div>
    </section>
  );
}
