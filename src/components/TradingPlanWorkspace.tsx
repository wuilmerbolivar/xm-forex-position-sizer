import { AlertTriangle, ArrowLeft, BookOpen, Check, CheckCircle2, ClipboardList, RefreshCcw, RotateCcw, Save, Target } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { sanitizePlan } from '../lib/persistence';
import type { AccountType, AppConfig, MarketType, TradingPlan } from '../types';
import { assessXmPlan, getPlanTargetSnapshot, getSuggestedPlan } from '../lib/tradingPlan';

interface TradingPlanWorkspaceProps {
  currentPlan: TradingPlan;
  currentConfig: AppConfig;
  onSave: (plan: TradingPlan) => void;
  onClose: () => void;
  onApply: (plan: TradingPlan) => void;
  onOpenManual: () => void;
}

function getMarketLabel(marketType: MarketType) {
  return marketType === 'metals' ? 'Metales' : marketType === 'forex' ? 'Forex' : 'Indices';
}

function getAccountLabel(accountType: AccountType) {
  return accountType === 'standard' ? 'Standard' : 'Micro';
}

export function TradingPlanWorkspace({
  currentPlan,
  currentConfig,
  onSave,
  onClose,
  onApply,
  onOpenManual,
}: TradingPlanWorkspaceProps) {
  const PLAN_BASE_CAPITAL_FLOOR = 100;
  const [plan, setPlan] = useState<TradingPlan>(currentPlan);
  const [saved, setSaved] = useState(false);
  const savedTimerRef = useRef<number | null>(null);
  const persistedPlan = sanitizePlan(plan);
  const projectedTarget = persistedPlan.baseCapital + persistedPlan.monthlyGoalUsd;
  const suggestedPlan = getSuggestedPlan(
    persistedPlan.baseCapital,
    persistedPlan.preferredMarket,
    persistedPlan.preferredAccount,
  );
  const planAssessment = assessXmPlan(persistedPlan);
  const planSnapshot = getPlanTargetSnapshot({
    plan: persistedPlan,
    capital: persistedPlan.baseCapital,
    targetEquity: projectedTarget,
    marketType: persistedPlan.preferredMarket,
    accountType: persistedPlan.preferredAccount,
  });
  const dailyLossBudget = (persistedPlan.baseCapital * persistedPlan.maxDailyLossPct) / 100;
  const comparisonRows = [
    {
      label: 'Capital',
      current: `$${currentConfig.capital.toFixed(0)}`,
      planned: `$${persistedPlan.baseCapital.toFixed(0)}`,
    },
    {
      label: 'Riesgo por trade',
      current: `${currentConfig.riesgoPct.toFixed(1)}%`,
      planned: `${persistedPlan.defaultRiskPct.toFixed(1)}%`,
    },
    {
      label: 'Mercado',
      current: getMarketLabel(currentConfig.marketType),
      planned: getMarketLabel(persistedPlan.preferredMarket),
    },
    {
      label: 'Cuenta',
      current: getAccountLabel(currentConfig.accountType),
      planned: getAccountLabel(persistedPlan.preferredAccount),
    },
    {
      label: 'Meta de equity',
      current: `$${currentConfig.targetProfit.toFixed(0)}`,
      planned: `$${projectedTarget.toFixed(0)}`,
    },
  ];
  const isPanelAligned =
    currentConfig.capital === persistedPlan.baseCapital &&
    currentConfig.riesgoPct === persistedPlan.defaultRiskPct &&
    currentConfig.marketType === persistedPlan.preferredMarket &&
    currentConfig.accountType === persistedPlan.preferredAccount &&
    currentConfig.targetProfit === projectedTarget;
  const capitalWillClamp = plan.baseCapital !== persistedPlan.baseCapital;
  const standardNeedsMicroGuardrail =
    persistedPlan.preferredAccount === 'standard' &&
    persistedPlan.baseCapital < planAssessment.requiredCapitalForMinLot;
  const assessmentTone =
    planAssessment.status === 'valid'
      ? 'border-emerald-400/25 bg-emerald-400/10'
      : planAssessment.status === 'warning'
        ? 'border-[var(--accent-primary)]/28 bg-[var(--accent-primary)]/10'
        : planAssessment.status === 'unrealistic'
          ? 'border-amber-400/25 bg-amber-400/10'
          : 'border-rose-400/25 bg-rose-400/10';
  const assessmentTextTone =
    planAssessment.status === 'valid'
      ? 'text-emerald-300'
      : planAssessment.status === 'warning'
        ? 'text-[var(--accent-primary)]'
        : planAssessment.status === 'unrealistic'
          ? 'text-amber-300'
          : 'text-rose-300';
  const suggestionDiffers =
    planAssessment.suggestedPlan.preferredAccount !== persistedPlan.preferredAccount ||
    planAssessment.suggestedPlan.defaultRiskPct !== persistedPlan.defaultRiskPct ||
    planAssessment.suggestedPlan.monthlyGoalUsd !== persistedPlan.monthlyGoalUsd ||
    planAssessment.suggestedPlan.preferredMarket !== persistedPlan.preferredMarket;

  const handleSwitchToMicro = () => {
    setPlan((prev) => ({
      ...prev,
      ...planAssessment.suggestedPlan,
      baseCapital: prev.baseCapital,
    }));
  };

  useEffect(() => {
    setPlan(currentPlan);
  }, [currentPlan]);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current !== null) {
        window.clearTimeout(savedTimerRef.current);
      }
    };
  }, []);

  const handleSave = () => {
    if (!planAssessment.canSave) {
      return;
    }

    onSave(persistedPlan);
    setSaved(true);

    if (savedTimerRef.current !== null) {
      window.clearTimeout(savedTimerRef.current);
    }

    savedTimerRef.current = window.setTimeout(() => {
      setSaved(false);
      savedTimerRef.current = null;
    }, 1800);
  };

  const handleApply = () => {
    if (!planAssessment.canApply) {
      return;
    }

    onApply(persistedPlan);
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(12,18,25,0.97),rgba(17,24,32,0.97))] shadow-[0_32px_60px_rgba(0,0,0,0.45)]">
      <div className="flex flex-col gap-5 border-b border-[var(--border-muted)] px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--accent-primary)]/12 p-3 text-[var(--accent-primary)]">
            <ClipboardList size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Plan de trading</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Configura el perfil base fuera del panel.</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              Esta ventana define el marco operativo. Guarda el perfil y luego aplicalo al panel cuando quieras recalibrar la sesion.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenManual}
            className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-black/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
          >
            <BookOpen size={14} />
            Manual operativo
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-black/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
          >
            <ArrowLeft size={14} />
            Volver al panel
          </button>
        </div>
      </div>

      <div className="space-y-8 px-6 py-6 md:px-8 md:py-8">
        <section className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[1.75rem] border border-[var(--border-muted)] bg-white/3 p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Lectura del plan</p>
            <h3 className="mt-3 text-xl font-semibold text-white">El objetivo es que el panel parta de una base coherente.</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              El plan fija capital, riesgo, cuenta, mercado y meta mensual. No reemplaza tu analisis del trade, pero evita
              abrir el panel desde una configuracion improvisada.
            </p>
            <div className={`mt-5 rounded-[1.4rem] border p-4 ${assessmentTone}`}>
              <div className="flex items-center gap-3">
                {planAssessment.status === 'valid' ? (
                  <CheckCircle2 size={18} className="text-emerald-300" />
                ) : (
                  <AlertTriangle size={18} className={assessmentTextTone} />
                )}
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${assessmentTextTone}`}>
                    {planAssessment.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{planAssessment.summary}</p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-[var(--border-muted)] bg-black/12 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Impacto sobre el panel</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Comparacion antes de aplicar</h3>
              </div>
              <span
                className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                  isPanelAligned
                    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                    : 'border-[var(--border-muted)] bg-black/12 text-[var(--accent-amber)]'
                }`}
              >
                {isPanelAligned ? 'Panel alineado' : 'Panel distinto'}
              </span>
            </div>
            <div className="mt-5 grid gap-2.5">
              {comparisonRows.map((row) => (
                <div
                  key={row.label}
                  className="grid items-center gap-2 rounded-[1.1rem] border border-[var(--border-muted)] bg-white/3 px-3.5 py-3 sm:grid-cols-[1fr_auto_auto]"
                >
                  <span className="text-[12px] text-[var(--text-secondary)]">{row.label}</span>
                  <span className="font-mono text-[12px] text-[var(--text-faint)]">{row.current}</span>
                  <span className="font-mono text-[13px] text-white">{row.planned}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-[1.75rem] border border-[var(--border-muted)] bg-white/3 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Parametros base</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Perfil operativo que se guarda en local</h3>
            </div>
            <button
              onClick={() => setPlan(currentPlan)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-black/14 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
            >
              <RotateCcw size={14} />
              Restaurar guardado
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                Capital base
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={100}
                step={25}
                value={plan.baseCapital}
                onChange={(event) => setPlan({ ...plan, baseCapital: Number(event.target.value) })}
                className="w-full rounded-2xl border border-[var(--border-muted)] bg-black/14 px-4 py-3 font-mono text-white outline-none transition-colors focus:border-[var(--accent-primary)]"
              />
              <span className="text-[11px] leading-5 text-[var(--text-faint)]">
                XM puede permitir aperturas menores, pero esta app guarda y aplica un capital base operativo minimo de ${persistedPlan.baseCapital.toFixed(0)}.
              </span>
              {capitalWillClamp && (
                <span className="block text-[11px] leading-5 text-amber-300">
                  El valor escrito (${plan.baseCapital.toFixed(0)}) se normalizara a ${persistedPlan.baseCapital.toFixed(0)} al guardar o aplicar.
                </span>
              )}
            </label>
            <label className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                Riesgo por trade
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0.1}
                max={5}
                step={0.1}
                value={plan.defaultRiskPct}
                onChange={(event) => setPlan({ ...plan, defaultRiskPct: Number(event.target.value) })}
                className="w-full rounded-2xl border border-[var(--border-muted)] bg-black/14 px-4 py-3 font-mono text-white outline-none transition-colors focus:border-[var(--accent-primary)]"
              />
              <span className="text-[11px] leading-5 text-[var(--text-faint)]">
                Recomendado para este perfil: {suggestedPlan.defaultRiskPct.toFixed(1)}%
              </span>
            </label>
            <label className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                Meta mensual en USD
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={1}
                max={100000}
                step={1}
                value={plan.monthlyGoalUsd}
                onChange={(event) => setPlan({ ...plan, monthlyGoalUsd: Number(event.target.value) })}
                className="w-full rounded-2xl border border-[var(--border-muted)] bg-black/14 px-4 py-3 font-mono text-white outline-none transition-colors focus:border-[var(--accent-primary)]"
              />
              <span className="text-[11px] leading-5 text-[var(--text-faint)]">
                Sugerencia base: ${suggestedPlan.monthlyGoalUsd.toFixed(0)} para un plan alcanzable.
              </span>
            </label>
            <label className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                Perdida maxima diaria
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={0.5}
                max={10}
                step={0.1}
                value={plan.maxDailyLossPct}
                onChange={(event) => setPlan({ ...plan, maxDailyLossPct: Number(event.target.value) })}
                className="w-full rounded-2xl border border-[var(--border-muted)] bg-black/14 px-4 py-3 font-mono text-white outline-none transition-colors focus:border-[var(--accent-primary)]"
              />
            </label>
            <label className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                Cuenta preferida
              </span>
              <select
                value={plan.preferredAccount}
                onChange={(event) => setPlan({ ...plan, preferredAccount: event.target.value as AccountType })}
                className="trading-select w-full rounded-2xl border border-[var(--border-muted)] bg-black/14 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white outline-none transition-colors focus:border-[var(--accent-primary)]"
              >
                <option value="micro">Micro</option>
                <option value="standard">Standard</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                Mercado habitual
              </span>
              <select
                value={plan.preferredMarket}
                onChange={(event) => setPlan({ ...plan, preferredMarket: event.target.value as MarketType })}
                className="trading-select w-full rounded-2xl border border-[var(--border-muted)] bg-black/14 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white outline-none transition-colors focus:border-[var(--accent-primary)]"
              >
                <option value="metals">Metales</option>
                <option value="forex">Forex</option>
                <option value="indices">Indices</option>
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[1.4rem] border border-amber-400/25 bg-amber-400/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="mt-0.5 text-amber-300" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
                    Piso operativo del plan
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    Aunque XM publique un deposito minimo desde `5 USD`, esta herramienta no considera viable construir un
                    plan base por debajo de `100 USD`. El motivo no es la apertura de cuenta, sino la viabilidad del lotaje,
                    la friccion del spread y el margen de error real para sostener el riesgo.
                  </p>
                  <p className="mt-2 text-[12px] leading-6 text-[var(--text-secondary)]">
                    Por eso cualquier valor menor a ${PLAN_BASE_CAPITAL_FLOOR} se conserva como referencia visual, pero se
                    normaliza a ${persistedPlan.baseCapital.toFixed(0)} cuando guardas o aplicas.
                  </p>
                </div>
              </div>
            </article>

            {standardNeedsMicroGuardrail ? (
              <article className="rounded-[1.4rem] border border-rose-400/25 bg-rose-400/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="mt-0.5 text-rose-300" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-300">
                      Guardrail para cuenta standard
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      Con ${persistedPlan.baseCapital.toFixed(0)} en {getMarketLabel(persistedPlan.preferredMarket)}, la
                      cuenta standard no alcanza el minimo operativo estimado por XM para este perfil.
                    </p>
                    <p className="mt-2 text-[12px] leading-6 text-[var(--text-secondary)]">
                      Para mantener esta configuracion en standard, apunta al menos a ${planAssessment.requiredCapitalForMinLot.toFixed(0)}.
                      Si quieres algo valido y alcanzable ahora, cambia a micro.
                    </p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={handleSwitchToMicro}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
                      >
                        <RefreshCcw size={14} />
                        Cambiar a micro
                      </button>
                      <span className="inline-flex items-center rounded-2xl border border-[var(--border-muted)] bg-black/12 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                        Sugerido standard: ${planAssessment.requiredCapitalForMinLot.toFixed(0)}+
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <article className="rounded-[1.4rem] border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-300" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                      Cuenta y capital coherentes
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      El capital base ya esta dentro de una zona mas util para la cuenta elegida. Aun asi, la validacion final
                      sigue dependiendo del lote minimo XM, del riesgo propuesto y de la meta mensual.
                    </p>
                  </div>
                </div>
              </article>
            )}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Mercado', value: getMarketLabel(plan.preferredMarket), hint: 'Escenario operativo base' },
            { label: 'Cuenta', value: getAccountLabel(plan.preferredAccount), hint: 'Contrato sugerido en XM' },
            { label: 'Meta de equity', value: `$${projectedTarget.toFixed(0)}`, hint: 'Capital base + meta mensual' },
            { label: 'Budget diario', value: `$${dailyLossBudget.toFixed(2)}`, hint: 'Tope de perdida por jornada' },
          ].map((item) => (
            <article key={item.label} className="rounded-[1.45rem] border border-[var(--border-muted)] bg-black/12 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">{item.label}</p>
              <p className="mt-2.5 font-mono text-[1.45rem] text-white">{item.value}</p>
              <p className="mt-2 text-[11px] leading-5 text-[var(--text-secondary)]">{item.hint}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[1.75rem] border border-[var(--border-muted)] bg-white/3 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Snapshot operativo</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Ritmo minimo que exige el plan</h3>
              </div>
              <span className="rounded-full border border-[var(--border-muted)] bg-black/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-primary)]">
                {planSnapshot.cycleLabel}
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-black/12 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Meta diaria base</p>
                <p className="mt-2 font-mono text-[1.35rem] text-white">${planSnapshot.baselineDailyGoalUsd.toFixed(2)}</p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-black/12 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Ruedas habiles</p>
                <p className="mt-2 font-mono text-[1.35rem] text-white">{planSnapshot.tradingDaysTotal}</p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-black/12 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Horario sugerido</p>
                <p className="mt-2 text-sm font-semibold text-white">{planSnapshot.recommendedWindowLabel}</p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-black/12 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Perfil sugerido</p>
                <p className="mt-2 text-sm font-semibold text-white">{planSnapshot.recommendedProfileLabel}</p>
              </div>
            </div>
          </article>

          <article className={`rounded-[1.75rem] border p-6 ${assessmentTone}`}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {planAssessment.status === 'valid' ? (
                    <CheckCircle2 size={18} className="text-emerald-300" />
                  ) : (
                    <AlertTriangle size={18} className={assessmentTextTone} />
                  )}
                  <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${assessmentTextTone}`}>
                    Validacion XM
                  </p>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                  Antes de guardar o aplicar, revisa si el lote estimado supera el minimo, si la meta sigue siendo sana y si el riesgo no rompe el budget diario.
                </p>
              </div>

              {suggestionDiffers && (
                <button
                  onClick={() => setPlan(planAssessment.suggestedPlan)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-black/14 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                >
                  <RefreshCcw size={14} />
                  Cargar sugerencia XM
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-2.5">
              {planAssessment.bullets.map((bullet) => (
                <div key={bullet} className="rounded-[1.1rem] border border-[var(--border-muted)] bg-black/12 px-3.5 py-3 text-[12px] leading-6 text-[var(--text-secondary)]">
                  {bullet}
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.1rem] border border-[var(--border-muted)] bg-black/14 px-3.5 py-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Lote estimado XM</p>
                <p className="mt-1.5 font-mono text-lg text-white">{planAssessment.estimatedLot.toFixed(4)}</p>
              </div>
              <div className="rounded-[1.1rem] border border-[var(--border-muted)] bg-black/14 px-3.5 py-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Minimo XM</p>
                <p className="mt-1.5 font-mono text-lg text-white">{planAssessment.minLot.toFixed(2)}</p>
              </div>
              <div className="rounded-[1.1rem] border border-[var(--border-muted)] bg-black/14 px-3.5 py-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">Capital para 0.01</p>
                <p className="mt-1.5 font-mono text-lg text-white">${planAssessment.requiredCapitalForMinLot.toFixed(0)}</p>
              </div>
            </div>
          </article>
        </section>

        <div className="flex flex-col gap-3 border-t border-[var(--border-muted)] pt-5 sm:flex-row">
          <button
            onClick={handleSave}
            disabled={!planAssessment.canSave}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-black/14 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)] transition-colors hover:border-[var(--accent-primary)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            {saved ? 'Plan guardado' : planAssessment.canSave ? 'Guardar perfil' : 'Bloqueado por XM'}
          </button>
          <button
            onClick={handleApply}
            disabled={!planAssessment.canApply}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Target size={14} />
            {planAssessment.canApply ? 'Aplicar al panel' : 'No aplicable en XM'}
          </button>
        </div>
      </div>
    </section>
  );
}
