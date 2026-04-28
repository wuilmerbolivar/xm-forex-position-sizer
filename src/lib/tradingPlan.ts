import { getMarketDefaults, MARKET_PROFILES } from './marketProfiles';
import type { AccountType, MarketType, TradingPlan } from '../types';

interface PlanPreset {
  riskPct: number;
  monthlyGoalFactor: number;
  monthlyGoalFloor: number;
  profileLabel: string;
}

interface MarketCadence {
  cycleLabel: string;
  availabilityLabel: string;
  recommendedWindowLabel: string;
  weekendStatusLabel: string;
  weekdayStatusLabel: string;
  note: string;
}

export type PlanAssessmentStatus = 'valid' | 'warning' | 'unrealistic' | 'impossible';

export interface PlanAssessment {
  status: PlanAssessmentStatus;
  title: string;
  summary: string;
  bullets: string[];
  canSave: boolean;
  canApply: boolean;
  estimatedLot: number;
  minLot: number;
  requiredCapitalForMinLot: number;
  requiredRiskPctForMinLot: number;
  suggestedPlan: TradingPlan;
}

export interface PlanTargetSnapshot {
  targetEquity: number;
  monthlyGoalUsd: number;
  monthlyGoalPct: number;
  currentProgressUsd: number;
  progressPct: number;
  remainingGoalUsd: number;
  baselineDailyGoalUsd: number;
  requiredDailyGoalUsd: number;
  requiredDailyGoalPct: number;
  equityCheckpointToday: number;
  tradingDaysTotal: number;
  tradingDaysElapsed: number;
  tradingDaysRemaining: number;
  tradesPerDayNeeded: number | null;
  timezone: string;
  cycleLabel: string;
  availabilityLabel: string;
  recommendedWindowLabel: string;
  marketStatusLabel: string;
  cadenceNote: string;
  recommendedRiskPct: number;
  recommendedProfileLabel: string;
  isWeekend: boolean;
}

const PLAN_PRESETS: Record<MarketType, Record<AccountType, PlanPreset>> = {
  forex: {
    standard: {
      riskPct: 0.8,
      monthlyGoalFactor: 0.1,
      monthlyGoalFloor: 10,
      profileLabel: 'Sobrio para forex mayor en standard',
    },
    micro: {
      riskPct: 1,
      monthlyGoalFactor: 0.12,
      monthlyGoalFloor: 12,
      profileLabel: 'Realista para empezar en XM con capital pequeno',
    },
  },
  metals: {
    standard: {
      riskPct: 0.5,
      monthlyGoalFactor: 0.08,
      monthlyGoalFloor: 8,
      profileLabel: 'Mas lento por volatilidad de metales',
    },
    micro: {
      riskPct: 0.7,
      monthlyGoalFactor: 0.1,
      monthlyGoalFloor: 10,
      profileLabel: 'Conservador para XAUUSD en micro',
    },
  },
  indices: {
    standard: {
      riskPct: 0.4,
      monthlyGoalFactor: 0.06,
      monthlyGoalFloor: 6,
      profileLabel: 'Muy selectivo por sesion',
    },
    micro: {
      riskPct: 0.6,
      monthlyGoalFactor: 0.08,
      monthlyGoalFloor: 8,
      profileLabel: 'Mas adecuado para cuentas pequenas en indices',
    },
  },
};

const XM_MIN_ORDER_LOT = 0.01;

const MARKET_CADENCE: Record<MarketType, MarketCadence> = {
  forex: {
    cycleLabel: '24/5',
    availabilityLabel: 'Lunes a viernes',
    recommendedWindowLabel: 'Solape Londres y Nueva York',
    weekendStatusLabel: 'Forex cerrado por fin de semana',
    weekdayStatusLabel: 'Forex activo 24/5 en dia habil',
    note: 'No opera 24/7. El objetivo diario se reparte solo sobre ruedas habiles.',
  },
  metals: {
    cycleLabel: '23/5',
    availabilityLabel: 'Lunes a viernes',
    recommendedWindowLabel: 'Londres y primera mitad de Nueva York',
    weekendStatusLabel: 'Metales cerrados por fin de semana',
    weekdayStatusLabel: 'Metales activos con pausas cortas entre sesiones',
    note: 'No opera 24/7. La referencia diaria usa solo jornadas habiles.',
  },
  indices: {
    cycleLabel: 'Sesiones',
    availabilityLabel: 'Lunes a viernes',
    recommendedWindowLabel: 'Apertura y tramo medio de Nueva York',
    weekendStatusLabel: 'Indices cerrados por fin de semana',
    weekdayStatusLabel: 'Indices en jornada habil por ventanas de sesion',
    note: 'No es 24/7. El plan se prorratea sobre dias habiles y ventanas de sesion.',
  },
};

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function roundLot(value: number) {
  return Math.round(value * 10000) / 10000;
}

function isWeekday(date: Date) {
  const day = date.getDay();

  return day >= 1 && day <= 5;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function countTradingDays(year: number, month: number, startDay: number, endDay: number) {
  let count = 0;

  for (let day = startDay; day <= endDay; day += 1) {
    const current = new Date(year, month, day);

    if (isWeekday(current)) {
      count += 1;
    }
  }

  return count;
}

export function getSuggestedPlan(
  baseCapital = 100,
  marketType: MarketType = 'forex',
  accountType: AccountType = 'micro',
): TradingPlan {
  const preset = PLAN_PRESETS[marketType][accountType];
  const normalizedCapital = Math.max(100, baseCapital);
  const monthlyGoalUsd = Math.max(
    preset.monthlyGoalFloor,
    roundCurrency(normalizedCapital * preset.monthlyGoalFactor),
  );

  return {
    baseCapital: normalizedCapital,
    defaultRiskPct: preset.riskPct,
    monthlyGoalUsd,
    maxDailyLossPct: 3,
    preferredMarket: marketType,
    preferredAccount: accountType,
  };
}

export function getPlanPreset(marketType: MarketType, accountType: AccountType) {
  return PLAN_PRESETS[marketType][accountType];
}

function estimatePlanTrade(plan: TradingPlan) {
  const profile = MARKET_PROFILES[plan.preferredMarket];
  const defaults = getMarketDefaults(plan.preferredMarket);
  const valuePerPointPerLot = profile.valuePerPointPerLot[plan.preferredAccount];
  const stopLoss = defaults.atr * profile.slAtrMultiplier;
  const takeProfit = stopLoss * defaults.rrr;
  const riskUsd = plan.baseCapital * (plan.defaultRiskPct / 100);
  const effectiveRiskPerLot = (stopLoss + defaults.spread) * valuePerPointPerLot;
  const estimatedLot = effectiveRiskPerLot > 0 ? riskUsd / effectiveRiskPerLot : 0;
  const netRewardUsd = (estimatedLot * takeProfit * valuePerPointPerLot) - (estimatedLot * defaults.spread * valuePerPointPerLot);
  const requiredCapitalForMinLot =
    plan.defaultRiskPct > 0
      ? (XM_MIN_ORDER_LOT * effectiveRiskPerLot) / (plan.defaultRiskPct / 100)
      : Number.POSITIVE_INFINITY;
  const requiredRiskPctForMinLot =
    plan.baseCapital > 0 ? ((XM_MIN_ORDER_LOT * effectiveRiskPerLot) / plan.baseCapital) * 100 : Number.POSITIVE_INFINITY;

  return {
    stopLoss,
    takeProfit,
    riskUsd,
    effectiveRiskPerLot,
    estimatedLot,
    netRewardUsd,
    requiredCapitalForMinLot,
    requiredRiskPctForMinLot,
  };
}

function getSuggestedPlanForXm(plan: TradingPlan) {
  const currentSuggestion = getSuggestedPlan(plan.baseCapital, plan.preferredMarket, plan.preferredAccount);
  const currentEstimate = estimatePlanTrade(currentSuggestion);

  if (currentEstimate.estimatedLot >= XM_MIN_ORDER_LOT) {
    return currentSuggestion;
  }

  if (plan.preferredAccount === 'standard') {
    const microSuggestion = getSuggestedPlan(plan.baseCapital, plan.preferredMarket, 'micro');
    const microEstimate = estimatePlanTrade(microSuggestion);

    if (microEstimate.estimatedLot >= XM_MIN_ORDER_LOT) {
      return microSuggestion;
    }
  }

  return currentSuggestion;
}

export function getPlanTargetSnapshot({
  plan,
  capital,
  targetEquity,
  marketType,
  accountType,
  expectancyUsd,
  now = new Date(),
}: {
  plan: TradingPlan;
  capital: number;
  targetEquity: number;
  marketType: MarketType;
  accountType: AccountType;
  expectancyUsd?: number | null;
  now?: Date;
}): PlanTargetSnapshot {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const cadence = MARKET_CADENCE[marketType];
  const preset = PLAN_PRESETS[marketType][accountType];
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const lastDayOfMonth = getDaysInMonth(year, month);
  const tradingDaysTotal = countTradingDays(year, month, 1, lastDayOfMonth);
  const tradingDaysRemaining = countTradingDays(year, month, today, lastDayOfMonth);
  const tradingDaysElapsed = Math.max(0, tradingDaysTotal - tradingDaysRemaining);
  const monthlyGoalUsd = roundCurrency(Math.max(0, targetEquity - plan.baseCapital));
  const currentProgressUsd = roundCurrency(capital - plan.baseCapital);
  const remainingGoalUsd = roundCurrency(Math.max(0, targetEquity - capital));
  const baselineDailyGoalUsd = roundCurrency(
    tradingDaysTotal > 0 ? monthlyGoalUsd / tradingDaysTotal : monthlyGoalUsd,
  );
  const requiredDailyGoalUsd = roundCurrency(
    tradingDaysRemaining > 0 ? remainingGoalUsd / tradingDaysRemaining : remainingGoalUsd,
  );
  const requiredDailyGoalPct = capital > 0 ? (requiredDailyGoalUsd / capital) * 100 : 0;
  const monthlyGoalPct = plan.baseCapital > 0 ? (monthlyGoalUsd / plan.baseCapital) * 100 : 0;
  const progressPct = monthlyGoalUsd > 0 ? (currentProgressUsd / monthlyGoalUsd) * 100 : 0;
  const checkpointDays = tradingDaysElapsed + (isWeekday(now) ? 1 : 0);
  const equityCheckpointToday = roundCurrency(plan.baseCapital + (baselineDailyGoalUsd * checkpointDays));
  const tradesPerDayNeeded =
    expectancyUsd && expectancyUsd > 0 ? roundCurrency(requiredDailyGoalUsd / expectancyUsd) : null;

  return {
    targetEquity: roundCurrency(targetEquity),
    monthlyGoalUsd,
    monthlyGoalPct,
    currentProgressUsd,
    progressPct,
    remainingGoalUsd,
    baselineDailyGoalUsd,
    requiredDailyGoalUsd,
    requiredDailyGoalPct,
    equityCheckpointToday,
    tradingDaysTotal,
    tradingDaysElapsed,
    tradingDaysRemaining,
    tradesPerDayNeeded,
    timezone,
    cycleLabel: cadence.cycleLabel,
    availabilityLabel: cadence.availabilityLabel,
    recommendedWindowLabel: cadence.recommendedWindowLabel,
    marketStatusLabel: isWeekday(now) ? cadence.weekdayStatusLabel : cadence.weekendStatusLabel,
    cadenceNote: cadence.note,
    recommendedRiskPct: preset.riskPct,
    recommendedProfileLabel: preset.profileLabel,
    isWeekend: !isWeekday(now),
  };
}

export function assessXmPlan(plan: TradingPlan): PlanAssessment {
  const suggestedPlan = getSuggestedPlanForXm(plan);
  const selectedPreset = getPlanPreset(plan.preferredMarket, plan.preferredAccount);
  const estimate = estimatePlanTrade(plan);
  const snapshot = getPlanTargetSnapshot({
    plan,
    capital: plan.baseCapital,
    targetEquity: plan.baseCapital + plan.monthlyGoalUsd,
    marketType: plan.preferredMarket,
    accountType: plan.preferredAccount,
    expectancyUsd: estimate.netRewardUsd,
  });
  const monthlyGoalPct = snapshot.monthlyGoalPct;
  const dailyLossBudget = roundCurrency(plan.baseCapital * (plan.maxDailyLossPct / 100));
  const dailyGoalVsLossBudget = dailyLossBudget > 0 ? snapshot.requiredDailyGoalUsd / dailyLossBudget : Number.POSITIVE_INFINITY;
  const tradesPerDayNeeded = snapshot.tradesPerDayNeeded ?? Number.POSITIVE_INFINITY;
  const bullets: string[] = [];
  let severity = 0;

  if (estimate.estimatedLot < XM_MIN_ORDER_LOT) {
    severity = 3;
    bullets.push(
      `XM exige un minimo de ${XM_MIN_ORDER_LOT.toFixed(2)} lotes. Con este plan el lote estimado es ${roundLot(estimate.estimatedLot).toFixed(4)}.`,
    );

    if (plan.preferredAccount === 'standard') {
      bullets.push(
        `Con ${plan.baseCapital} USD en standard, XM no aceptaria este perfil. Para mantener ${plan.defaultRiskPct.toFixed(1)}% de riesgo, el capital tendria que subir hacia ${roundCurrency(estimate.requiredCapitalForMinLot)} USD o deberias pasar a micro.`,
      );
    } else {
      bullets.push(
        `Ni siquiera en micro llegas al minimo de XM con este riesgo. Para mantener esta cuenta necesitas al menos ${roundCurrency(estimate.requiredCapitalForMinLot)} USD o subir el riesgo a ${estimate.requiredRiskPctForMinLot.toFixed(2)}%.`,
      );
    }
  }

  if (plan.defaultRiskPct > plan.maxDailyLossPct) {
    severity = 3;
    bullets.push(
      `El riesgo por trade (${plan.defaultRiskPct.toFixed(1)}%) supera la perdida maxima diaria (${plan.maxDailyLossPct.toFixed(1)}%). Una sola perdida romperia el plan.`,
    );
  }

  if (plan.preferredAccount === 'standard' && plan.baseCapital <= 150) {
    severity = Math.max(severity, 1);
    bullets.push('Con capitales pequenos, XM standard pierde mucha precision. Micro suele ser la cuenta mas operable para 100 a 150 USD.');
  }

  if (plan.defaultRiskPct > selectedPreset.riskPct + 0.4 || plan.defaultRiskPct > MARKET_PROFILES[plan.preferredMarket].maxRecommendedRisk) {
    severity = Math.max(severity, 2);
    bullets.push(
      `El riesgo propuesto (${plan.defaultRiskPct.toFixed(1)}%) queda por encima del rango recomendado para ${plan.preferredMarket} ${plan.preferredAccount}.`,
    );
  } else if (plan.defaultRiskPct > selectedPreset.riskPct + 0.15) {
    severity = Math.max(severity, 1);
    bullets.push(
      `La configuracion sigue siendo aplicable, pero va mas agresiva que el perfil sugerido por XM para este capital (${selectedPreset.riskPct.toFixed(1)}%).`,
    );
  }

  if (monthlyGoalPct > 300 || dailyGoalVsLossBudget > 6 || tradesPerDayNeeded > 8) {
    severity = Math.max(severity, 3);
    bullets.push(
      `La meta mensual exige ${snapshot.requiredDailyGoalUsd.toFixed(2)} USD por dia habil con un budget diario de solo ${dailyLossBudget.toFixed(2)} USD. Para este capital ya entra en terreno imposible.`,
    );
  } else if (monthlyGoalPct > 80 || dailyGoalVsLossBudget > 2.5 || tradesPerDayNeeded > 4) {
    severity = Math.max(severity, 2);
    bullets.push(
      `La meta es muy agresiva: pide ${snapshot.requiredDailyGoalUsd.toFixed(2)} USD al dia y alrededor de ${tradesPerDayNeeded.toFixed(1)} trades de expectativa positiva por rueda.`,
    );
  } else if (monthlyGoalPct > 25 || dailyGoalVsLossBudget > 1.2 || tradesPerDayNeeded > 2.5) {
    severity = Math.max(severity, 1);
    bullets.push(
      `La meta es exigente para este cierre de mes. Necesita ${snapshot.requiredDailyGoalUsd.toFixed(2)} USD por dia habil y disciplina alta de ejecucion.`,
    );
  }

  if (severity === 0) {
    bullets.push(
      `El plan es compatible con XM: el lote estimado (${roundLot(estimate.estimatedLot).toFixed(4)}) supera el minimo de ${XM_MIN_ORDER_LOT.toFixed(2)} lotes.`,
    );
    bullets.push(
      `La meta mensual (${snapshot.monthlyGoalUsd.toFixed(2)} USD) mantiene un ritmo alcanzable de ${snapshot.baselineDailyGoalUsd.toFixed(2)} USD por rueda habil.`,
    );
    bullets.push(
      `El riesgo por trade (${plan.defaultRiskPct.toFixed(1)}%) encaja con el capital y con el perfil sugerido para ${plan.preferredMarket} ${plan.preferredAccount}.`,
    );
  } else if (severity < 3 && suggestedPlan.preferredAccount !== plan.preferredAccount) {
    bullets.push(
      `La alternativa mas limpia para XM es ${suggestedPlan.preferredAccount} con riesgo ${suggestedPlan.defaultRiskPct.toFixed(1)}% y meta mensual ${suggestedPlan.monthlyGoalUsd.toFixed(0)} USD.`,
    );
  }

  const statusMap: Record<number, Pick<PlanAssessment, 'status' | 'title' | 'summary' | 'canSave' | 'canApply'>> = {
    0: {
      status: 'valid',
      title: 'Configuracion valida y aplicable',
      summary: 'El perfil es coherente para XM, mantiene un riesgo razonable y la meta se ve alcanzable con disciplina.',
      canSave: true,
      canApply: true,
    },
    1: {
      status: 'warning',
      title: 'Configuracion aplicable, pero exigente',
      summary: 'XM podria ejecutarla, aunque el capital, la cuenta o la meta ya piden una operativa mas fina de lo recomendable.',
      canSave: true,
      canApply: true,
    },
    2: {
      status: 'unrealistic',
      title: 'Configuracion poco realista',
      summary: 'El perfil se puede guardar y aplicar, pero la relacion entre capital, riesgo y meta no se ve sana para sostenerla con constancia.',
      canSave: true,
      canApply: true,
    },
    3: {
      status: 'impossible',
      title: 'Configuracion no aplicable en XM',
      summary: 'XM no aceptaria esta operativa tal como esta o el plan rompe una restriccion minima de lote o de perdida diaria.',
      canSave: false,
      canApply: false,
    },
  };

  const selected: Pick<PlanAssessment, 'status' | 'title' | 'summary' | 'canSave' | 'canApply'> =
    statusMap[Math.min(3, Math.max(0, severity)) as 0 | 1 | 2 | 3]!;

  return {
    status: selected.status,
    title: selected.title,
    summary: selected.summary,
    canSave: selected.canSave,
    canApply: selected.canApply,
    bullets,
    estimatedLot: estimate.estimatedLot,
    minLot: XM_MIN_ORDER_LOT,
    requiredCapitalForMinLot: roundCurrency(estimate.requiredCapitalForMinLot),
    requiredRiskPctForMinLot: estimate.requiredRiskPctForMinLot,
    suggestedPlan,
  };
}
