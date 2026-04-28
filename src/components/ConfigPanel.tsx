import { AlertTriangle, SlidersHorizontal, Sparkles, Target, Wallet } from 'lucide-react';
import type { MarketProfile } from '../lib/marketProfiles';
import type { AppConfig, CalculationResults, TradingPlan } from '../types';

interface ConfigPanelProps {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
  results: CalculationResults;
  plan: TradingPlan;
  profile: MarketProfile;
}

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (value: number) => void;
}

const ACCOUNT_OPTIONS = [
  { value: 'micro', label: 'Micro', description: 'Mas precision para cuentas pequenas' },
  { value: 'standard', label: 'Standard', description: 'Contrato completo en XM' },
] as const;

function SliderField({ label, value, min, max, step, displayValue, onChange }: SliderFieldProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-end justify-between gap-3">
        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          {label}
        </label>
        <span className="font-mono text-[13px] text-white">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="trading-slider w-full"
      />
    </div>
  );
}

export function ConfigPanel({ config, updateConfig, results, plan, profile }: ConfigPanelProps) {
  const riskBudgetByPlan = (config.capital * plan.maxDailyLossPct) / 100;
  const maxTradesByPlan = results.riesgoUSD > 0 ? Math.floor(riskBudgetByPlan / results.riesgoUSD) : 0;

  return (
    <aside className="space-y-5 xl:sticky xl:top-6 xl:col-span-4">
      <section className="rounded-[1.65rem] border border-[var(--border-strong)] bg-[var(--panel)] p-4 shadow-[0_22px_44px_rgba(5,9,12,0.24)] md:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] text-[var(--text-faint)]">Panel de control</p>
            <h2 className="mt-2 text-lg font-semibold text-white">Configura ticket y riesgo antes de entrar.</h2>
          </div>
          <div className="rounded-2xl border border-[var(--border-muted)] bg-white/4 p-2.5 text-[var(--accent-primary)]">
            <SlidersHorizontal size={18} />
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <div className="space-y-2.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Tipo de cuenta XM
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {ACCOUNT_OPTIONS.map((accountType) => (
                <button
                  key={accountType.value}
                  onClick={() => updateConfig({ accountType: accountType.value })}
                  className={`rounded-[1.35rem] border px-3.5 py-3 text-left transition-colors ${
                    config.accountType === accountType.value
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/14 text-white'
                      : 'border-[var(--border-muted)] bg-white/3 text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/35'
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">{accountType.label}</p>
                  <p className="mt-1 text-[11px] leading-5">{accountType.description}</p>
                </button>
              ))}
            </div>
            <p className="text-xs leading-6 text-[var(--text-secondary)]">{profile.contractDescription}</p>
          </div>

          <div className="space-y-2.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Mercado
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {([
                { value: 'metals', label: 'Metales' },
                { value: 'forex', label: 'Forex' },
                { value: 'indices', label: 'Indices' },
              ] as const).map((market) => (
                <button
                  key={market.value}
                  onClick={() => updateConfig({ marketType: market.value })}
                  className={`rounded-[1.35rem] border px-2.5 py-3 text-center transition-colors ${
                    config.marketType === market.value
                      ? 'border-[var(--accent-amber)] bg-[var(--accent-amber)]/12 text-white'
                      : 'border-[var(--border-muted)] bg-white/3 text-[var(--text-secondary)] hover:border-[var(--accent-amber)]/35'
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">{market.label}</p>
                  <p className="mt-1 text-[10px] text-[var(--text-faint)]">
                    {market.value === 'metals' ? 'XAUUSD' : market.value === 'forex' ? 'EURUSD' : 'US30'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.35rem] border border-[var(--border-muted)] bg-black/12 p-3.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                Capital
              </label>
              <div className="mt-2.5 flex items-center gap-2.5 rounded-[1.2rem] border border-[var(--border-muted)] bg-[var(--bg-secondary)] px-3 py-2.5">
                <Wallet size={15} className="text-[var(--accent-primary)]" />
                <input
                  type="number"
                  inputMode="decimal"
                  min={100}
                  max={1000000}
                  step={25}
                  value={config.capital}
                  onChange={(event) => updateConfig({ capital: Number(event.target.value) })}
                  className="w-full bg-transparent text-right font-mono text-[1.15rem] text-white outline-none"
                />
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[var(--border-muted)] bg-black/12 p-3.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                Meta de equity
              </label>
              <div className="mt-2.5 flex items-center gap-2.5 rounded-[1.2rem] border border-[var(--border-muted)] bg-[var(--bg-secondary)] px-3 py-2.5">
                <Target size={15} className="text-[var(--accent-amber)]" />
                <input
                  type="number"
                  inputMode="decimal"
                  min={config.capital}
                  max={5000000}
                  step={1}
                  value={config.targetProfit}
                  onChange={(event) => updateConfig({ targetProfit: Number(event.target.value) })}
                  className="w-full bg-transparent text-right font-mono text-[1.15rem] text-white outline-none"
                />
              </div>
            </div>
          </div>

          <SliderField
            label="Riesgo por trade"
            value={config.riesgoPct}
            min={0.1}
            max={5}
            step={0.1}
            displayValue={`${config.riesgoPct.toFixed(1)}%`}
            onChange={(value) => updateConfig({ riesgoPct: value })}
          />

          <SliderField
            label="Win rate esperado"
            value={config.winRate}
            min={20}
            max={90}
            step={1}
            displayValue={`${config.winRate.toFixed(0)}%`}
            onChange={(value) => updateConfig({ winRate: value })}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <SliderField
              label={`ATR (${results.unitLabel})`}
              value={config.atr}
              min={1}
              max={config.marketType === 'forex' ? 200 : 1000}
              step={1}
              displayValue={config.atr.toFixed(0)}
              onChange={(value) => updateConfig({ atr: value })}
            />
            <SliderField
              label="Spread"
              value={config.spread}
              min={0}
              max={config.marketType === 'forex' ? 10 : 200}
              step={config.marketType === 'forex' ? 0.1 : 1}
              displayValue={config.spread.toFixed(config.marketType === 'forex' ? 1 : 0)}
              onChange={(value) => updateConfig({ spread: value })}
            />
          </div>

          <div className="rounded-[1.4rem] border border-[var(--border-muted)] bg-black/12 p-3.5">
            <div className="flex flex-wrap gap-2">
              {([
                { value: 'atr', label: 'ATR adaptativo' },
                { value: 'manual', label: 'Manual' },
              ] as const).map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => updateConfig({ calcMode: mode.value })}
                  className={`rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    config.calcMode === mode.value
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/14 text-white'
                      : 'border-[var(--border-muted)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/35'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {config.calcMode === 'atr' ? (
              <div className="mt-5">
                <SliderField
                  label="Ratio R / R"
                  value={config.rrr}
                  min={1}
                  max={6}
                  step={0.1}
                  displayValue={`1:${config.rrr.toFixed(2)}`}
                  onChange={(value) => updateConfig({ rrr: value })}
                />
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <SliderField
                  label={`Stop loss (${results.unitLabel})`}
                  value={config.manualSl}
                  min={1}
                  max={config.marketType === 'forex' ? 300 : 3000}
                  step={config.marketType === 'forex' ? 1 : 5}
                  displayValue={config.manualSl.toFixed(0)}
                  onChange={(value) => updateConfig({ manualSl: value })}
                />
                <SliderField
                  label={`Take profit (${results.unitLabel})`}
                  value={config.manualTp}
                  min={1}
                  max={config.marketType === 'forex' ? 600 : 6000}
                  step={config.marketType === 'forex' ? 1 : 5}
                  displayValue={config.manualTp.toFixed(0)}
                  onChange={(value) => updateConfig({ manualTp: value })}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <div className="rounded-[1.65rem] border border-[var(--border-strong)] bg-[var(--panel)] p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-[var(--accent-primary)]" size={18} />
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Guardrails</h3>
          </div>
          <div className="mt-3.5 space-y-2.5 text-[13px] leading-6 text-[var(--text-secondary)]">
            <p>Limite diario del plan: ${riskBudgetByPlan.toFixed(2)}</p>
            <p>Trades maximos segun plan: {maxTradesByPlan}</p>
            <p>Valor por {results.unitLabel.slice(0, -1)} y lote: ${results.valuePerPointPerLot.toFixed(2)}</p>
          </div>
        </div>

        <div
          className={`rounded-[1.65rem] border p-4 ${
            results.isHighRisk
              ? 'border-rose-400/25 bg-rose-400/10'
              : 'border-emerald-400/20 bg-emerald-400/10'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={results.isHighRisk ? 'text-rose-300' : 'text-emerald-300'}
              size={18}
            />
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                {results.isHighRisk ? 'Ajuste recomendado' : 'Ticket saludable'}
              </h3>
              <p className="mt-2.5 text-[13px] leading-6 text-[var(--text-secondary)]">
                {results.isHighRisk
                  ? 'La combinacion actual castiga demasiado el capital o deja un ratio neto flojo. Reduce riesgo, spread o mejora la distancia objetivo antes de ejecutar.'
                  : 'El escenario mantiene el riesgo dentro de un rango operativo mas razonable para una cuenta disciplinada.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
