import { ArrowLeft, BookOpen, ClipboardList, ExternalLink, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { MarketProfile } from '../lib/marketProfiles';
import { getPlanTargetSnapshot } from '../lib/tradingPlan';
import { XM_ASSOCIATE_CODE, XM_AFFILIATE_LINKS } from '../lib/xmAffiliate';
import type { AppConfig, CalculationResults, TradingPlan } from '../types';

interface TechnicalManualProps {
  config: AppConfig;
  plan: TradingPlan;
  results: CalculationResults;
  profile: MarketProfile;
  onClose: () => void;
  onOpenPlan: () => void;
  onOpenDirectory: () => void;
}

const INPUT_GUIDE = [
  {
    title: 'Capital',
    text: 'Es la base de la cuenta que estas dispuesto a usar para esa sesion. Si inflas este numero, el lote sugerido deja de representar tu realidad.',
  },
  {
    title: 'Riesgo por trade',
    text: 'Define cuanto dinero aceptas perder si el stop es alcanzado. Para cuentas pequenas conviene moverse entre 0.5% y 1.0%.',
  },
  {
    title: 'Win rate',
    text: 'Debe salir de tus estadisticas, no de intuicion. Afecta expectativa, Kelly sugerido y proyeccion de trades hacia la meta.',
  },
  {
    title: 'Spread',
    text: 'No es decorativo. En este proyecto el spread entra al riesgo por lote, por eso puede reducir el lote sugerido si la ejecucion es cara.',
  },
  {
    title: 'ATR o modo manual',
    text: 'ATR sirve para adaptar el stop a la volatilidad. El modo manual sirve cuando ya tienes una estructura tecnica definida por tu analisis.',
  },
  {
    title: 'Meta de equity',
    text: 'No cambia el lote. Sirve para proyectar cuantas operaciones harian falta si mantuvieras la expectativa actual.',
  },
] as const;

const CHECKLIST = [
  'Confirma que el tipo de cuenta XM coincida con micro o standard en la herramienta.',
  'Revisa el spread real del simbolo antes de enviar la orden.',
  'Valida que el ATR o la distancia manual reflejen el mercado de este momento.',
  'No modifiques el lote en MetaTrader si no recalculaste primero en la app.',
  'Si el ratio neto sale flojo o el drawdown se dispara, descarta el escenario.',
] as const;

const BEGINNER_RULES = [
  'Usa cuenta micro para que el valor por punto no te obligue a sobreapalancarte.',
  'Si aun no tienes bitacora, deja el win rate en un rango prudente y no agresivo.',
  'No persigas la meta mensual subiendo el riesgo por encima de lo que tolera la cuenta.',
] as const;

const ADVANCED_RULES = [
  'Ajusta el win rate a tu set-up real y compara expectativa entre ATR y manual antes de operar.',
  'Mide el spread drag: si la friccion se come demasiado reward, cambia de sesion o descarta la entrada.',
  'Usa el ratio neto y la racha probable como filtro, no solo como lectura posterior.',
] as const;

const EXECUTION_ERRORS = [
  'Cambiar el lote en MetaTrader sin recalcular en la app.',
  'Mantener el mismo ATR o spread aunque el mercado ya cambio de sesion.',
  'Usar un win rate inventado para forzar expectativa positiva.',
  'Confundir progreso a meta con aumento de lotaje y no con consistencia.',
] as const;

export function TechnicalManual({ config, plan, results, profile, onClose, onOpenPlan, onOpenDirectory }: TechnicalManualProps) {
  const modeLabel = config.calcMode === 'atr' ? 'ATR adaptativo' : 'Manual';
  const riskTone = results.isHighRisk ? 'border-rose-400/25 bg-rose-400/10' : 'border-emerald-400/20 bg-emerald-400/10';
  const riskText = results.isHighRisk
    ? 'El escenario actual exige ajuste antes de ejecutar. Reduce riesgo, mejora el spread o exige un objetivo mas limpio.'
    : 'El escenario actual se mantiene dentro de un rango mas sano para ejecutar con disciplina.';
  const planSnapshot = getPlanTargetSnapshot({
    plan,
    capital: config.capital,
    targetEquity: config.targetProfit,
    marketType: config.marketType,
    accountType: config.accountType,
    expectancyUsd: results.expectativaUSD,
  });
  const dailyLossBudget = (config.capital * plan.maxDailyLossPct) / 100;
  const maxTradesByPlan = results.riesgoUSD > 0 ? Math.floor(dailyLossBudget / results.riesgoUSD) : 0;
  const isPlanAligned =
    config.capital === plan.baseCapital &&
    config.riesgoPct === plan.defaultRiskPct &&
    config.marketType === plan.preferredMarket &&
    config.accountType === plan.preferredAccount;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(12,18,25,0.97),rgba(17,24,32,0.97))] shadow-[0_32px_60px_rgba(0,0,0,0.45)]">
      <div className="flex flex-col gap-5 border-b border-[var(--border-muted)] px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-[var(--border-muted)] bg-[var(--accent-primary)]/12 p-3 text-[var(--accent-primary)]">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Manual operativo</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">XM Forex Position Sizer</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              Guia ampliada para entender el calculo, leer el ticket y evitar errores comunes de ejecucion.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenPlan}
            className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-black/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
          >
            <ClipboardList size={14} />
            Plan de trading
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
        <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[1.75rem] border border-[var(--border-muted)] bg-white/3 p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Que hace realmente esta herramienta</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Convierte un escenario en una posicion medible.</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              El objetivo no es adivinar el mercado. El objetivo es tomar tu idea y responder cinco preguntas antes de
              abrir MetaTrader: cuanto arriesgas, cuanto debes lotear, cuanto cuesta el spread, cuanto deberias ganar si
              sale bien y cuanto drawdown puedes sufrir si encadenas errores.
            </p>
            <div className={`mt-5 rounded-[1.4rem] border p-4 ${riskTone}`}>
              <div className="flex items-center gap-3">
                {results.isHighRisk ? <ShieldAlert className="text-rose-300" size={18} /> : <ShieldCheck className="text-emerald-300" size={18} />}
                <h4 className="text-sm font-semibold text-white">Lectura del escenario actual</h4>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{riskText}</p>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-[var(--accent-amber)]/25 bg-[linear-gradient(135deg,rgba(247,185,85,0.14),rgba(247,185,85,0.05))] p-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--accent-amber)]">Ruta XM con asociado</p>
              <span className="rounded-full border border-[var(--accent-amber)]/20 bg-black/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                {XM_ASSOCIATE_CODE}
              </span>
            </div>
            <h3 className="mt-3 text-xl font-semibold text-white">Cuenta real, soporte y recursos oficiales sin salir del referido.</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              La cuenta real sigue accesible desde aqui, pero el directorio completo de XM vive ahora en un panel
              dedicado para no repetir enlaces por toda la experiencia.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={XM_AFFILIATE_LINKS.realAccount.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent-amber)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
              >
                Abrir cuenta real
                <ExternalLink size={14} />
              </a>
              <button
                onClick={onOpenDirectory}
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-black/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
              >
                Abrir directorio XM
                <BookOpen size={14} />
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                'Cuenta real, demo, plataformas y acceso de usuario desde un solo panel.',
                'Promociones, formacion, copy trading y soporte oficial sin duplicar tarjetas en la pagina.',
              ].map((text) => (
                <div key={text} className="rounded-[1.3rem] border border-[var(--border-muted)] bg-black/12 p-4">
                  <p className="text-sm leading-7 text-[var(--text-secondary)]">{text}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[1.75rem] border border-[var(--border-muted)] bg-white/3 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Ruta recomendada</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Orden correcto para usar la herramienta</h3>
              </div>
              <span
                className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                  isPlanAligned
                    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                    : 'border-[var(--border-muted)] bg-black/12 text-[var(--accent-amber)]'
                }`}
              >
                {isPlanAligned ? 'Panel alineado' : 'Revisar plan'}
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                'Configura o revisa el plan de trading antes de tocar el ticket de la sesion.',
                'Aplica el plan al panel para fijar capital, riesgo, cuenta y mercado desde una base consistente.',
                'Ajusta ATR, spread y modo de calculo con datos del mercado actual.',
                'Ejecuta solo si el ratio neto, el drawdown y el budget diario siguen sanos.',
              ].map((step, index) => (
                <div key={step} className="rounded-2xl border border-[var(--border-muted)] bg-black/12 p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-amber)]">
                    Paso {index + 1}
                  </span>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{step}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-[var(--border-muted)] bg-black/12 p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Plan activo</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Como se traduce hoy tu perfil operativo</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Meta diaria requerida</p>
                <p className="mt-2 font-mono text-[1.4rem] text-white">+${planSnapshot.requiredDailyGoalUsd.toFixed(2)}</p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Budget diario</p>
                <p className="mt-2 font-mono text-[1.4rem] text-white">${dailyLossBudget.toFixed(2)}</p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Ruedas restantes</p>
                <p className="mt-2 font-mono text-[1.4rem] text-white">{planSnapshot.tradingDaysRemaining}</p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border-muted)] bg-white/3 p-3.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Trades maximos por dia</p>
                <p className="mt-2 font-mono text-[1.4rem] text-white">{maxTradesByPlan}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              Ventana sugerida: {planSnapshot.recommendedWindowLabel}. Estado actual: {planSnapshot.marketStatusLabel}.
            </p>
          </article>
        </section>

        <section className="rounded-[1.75rem] border border-[var(--border-muted)] bg-white/3 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Lectura del escenario actual</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Valores activos en este momento</h3>
            </div>
            <span className="rounded-full border border-[var(--border-muted)] bg-black/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-primary)]">
              {profile.instrumentLabel} · {modeLabel}
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Capital', value: `$${config.capital.toFixed(2)}` },
              { label: 'Riesgo', value: `${config.riesgoPct.toFixed(2)}% / $${results.riesgoUSD.toFixed(2)}` },
              { label: 'Lote sugerido', value: `${results.lotes.toFixed(2)} ${config.accountType}` },
              { label: 'Ratio neto', value: `1:${results.netRRR.toFixed(2)}` },
              { label: 'Stop Loss', value: `${results.sl.toFixed(1)} ${results.unitLabel}` },
              { label: 'Take Profit', value: `${results.tp.toFixed(1)} ${results.unitLabel}` },
              { label: 'Spread estimado', value: `$${results.spreadCostUSD.toFixed(2)}` },
              { label: 'Expectativa', value: `${results.expectativaUSD >= 0 ? '+' : ''}$${results.expectativaUSD.toFixed(2)}` },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-[var(--border-muted)] bg-black/12 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-faint)]">{item.label}</p>
                <p className="mt-2 font-mono text-lg text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[var(--border-muted)] bg-white/3 p-6">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Como calcula el motor</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Formulas que usa el panel</h3>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {[
              {
                title: 'Riesgo monetario',
                formula: 'riesgoUSD = capital x (riesgoPct / 100)',
                text: 'Traduce el porcentaje de riesgo a dolares reales antes de calcular el lote.',
              },
              {
                title: 'Stop y objetivo',
                formula: 'SL = ATR x multiplicador o SL manual | TP = SL x RRR o TP manual',
                text: 'El modo ATR adapta la distancia al movimiento del mercado. El modo manual usa tu estructura tecnica.',
              },
              {
                title: 'Riesgo efectivo por lote',
                formula: 'effectiveRiskPerLot = (SL + spread) x valuePerPointPerLot',
                text: 'El spread no se ignora. Se suma a la distancia de riesgo por lote para no subestimar el costo de entrada.',
              },
              {
                title: 'Lote sugerido',
                formula: 'lotes = riesgoUSD / effectiveRiskPerLot',
                text: 'Esta es la formula central del position sizing en la app.',
              },
              {
                title: 'Reward neto',
                formula: 'grossRewardUSD = lotes x TP x valuePerPointPerLot | gananciaNeta = grossRewardUSD - spreadCostUSD',
                text: 'La recompensa final se descuenta del spread estimado, por eso el ratio neto puede ser menor al tecnico.',
              },
              {
                title: 'Expectativa',
                formula: 'expectativaUSD = (winRate x gananciaNeta) - ((1 - winRate) x riesgoUSD)',
                text: 'Sirve para proyectar si tu modelo produce valor esperado positivo con los parametros elegidos.',
              },
            ].map((item) => (
              <article key={item.title} className="rounded-2xl border border-[var(--border-muted)] bg-black/12 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--accent-amber)]">{item.title}</p>
                <p className="mt-3 font-mono text-sm text-white">{item.formula}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-[var(--border-muted)] bg-white/3 p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Que significa cada control</p>
            <div className="mt-4 space-y-3">
              {INPUT_GUIDE.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[var(--border-muted)] bg-black/12 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{item.text}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-[var(--border-muted)] bg-white/3 p-6">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Recomendaciones de uso</p>
            <div className="mt-4 grid gap-4">
              <div className="rounded-2xl border border-[var(--border-muted)] bg-black/12 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--accent-primary)]">Trader principiante</p>
                <div className="mt-3 space-y-2">
                  {BEGINNER_RULES.map((item) => (
                    <p key={item} className="text-sm leading-7 text-[var(--text-secondary)]">{item}</p>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border-muted)] bg-black/12 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--accent-primary)]">Trader con experiencia</p>
                <div className="mt-3 space-y-2">
                  {ADVANCED_RULES.map((item) => (
                    <p key={item} className="text-sm leading-7 text-[var(--text-secondary)]">{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="rounded-[1.75rem] border border-[var(--border-muted)] bg-white/3 p-6">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Errores que invalidan el ticket</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {EXECUTION_ERRORS.map((item, index) => (
              <div key={item} className="rounded-2xl border border-[var(--border-muted)] bg-black/12 p-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-amber)]">
                  Error {index + 1}
                </span>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[var(--border-muted)] bg-white/3 p-6">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-faint)]">Checklist antes de ejecutar</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {CHECKLIST.map((item, index) => (
              <div key={item} className="rounded-2xl border border-[var(--border-muted)] bg-black/12 p-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-amber)]">Paso {index + 1}</span>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
