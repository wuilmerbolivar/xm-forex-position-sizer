import type { AppConfig, TradeSession, TradingPlan } from '../types';
import { getMarketDefaults, MARKET_PROFILES } from './marketProfiles';
import { getSuggestedPlan } from './tradingPlan';

const DEFAULT_PLAN: TradingPlan = getSuggestedPlan(100, 'forex', 'micro');

const DEFAULT_CONFIG: AppConfig = {
  capital: DEFAULT_PLAN.baseCapital,
  riesgoPct: DEFAULT_PLAN.defaultRiskPct,
  winRate: 47,
  targetProfit: DEFAULT_PLAN.baseCapital + DEFAULT_PLAN.monthlyGoalUsd,
  ...getMarketDefaults(DEFAULT_PLAN.preferredMarket),
  calcMode: 'atr',
  accountType: DEFAULT_PLAN.preferredAccount,
  marketType: DEFAULT_PLAN.preferredMarket,
};

function matchesLegacyDefaultPlan(plan: TradingPlan) {
  return (
    plan.baseCapital === 100 &&
    plan.defaultRiskPct === 1 &&
    plan.monthlyGoalUsd === 25 &&
    plan.maxDailyLossPct === 3 &&
    plan.preferredMarket === 'forex' &&
    plan.preferredAccount === 'standard'
  );
}

function matchesLegacyDefaultConfig(config: AppConfig) {
  return (
    config.capital === 100 &&
    config.riesgoPct === 1 &&
    config.winRate === 47 &&
    config.targetProfit === 125 &&
    config.atr === 28 &&
    config.spread === 1.2 &&
    config.calcMode === 'atr' &&
    config.accountType === 'standard' &&
    config.marketType === 'forex'
  );
}

function matchesPreviousGeneratedPlan(plan: TradingPlan) {
  return (
    plan.baseCapital === 100 &&
    plan.defaultRiskPct === 0.8 &&
    plan.monthlyGoalUsd === 12 &&
    plan.maxDailyLossPct === 3 &&
    plan.preferredMarket === 'forex' &&
    plan.preferredAccount === 'standard'
  );
}

function matchesPreviousGeneratedConfig(config: AppConfig) {
  return (
    config.capital === 100 &&
    config.riesgoPct === 0.8 &&
    config.winRate === 47 &&
    config.targetProfit === 112 &&
    config.atr === 28 &&
    config.spread === 1.2 &&
    config.calcMode === 'atr' &&
    config.accountType === 'standard' &&
    config.marketType === 'forex'
  );
}

function clampNumber(value: unknown, fallback: number, min: number, max: number) {
  const parsed = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

export function getDefaultPlan() {
  return DEFAULT_PLAN;
}

export function getDefaultConfig() {
  return DEFAULT_CONFIG;
}

export function sanitizePlan(input: unknown): TradingPlan {
  const value = (typeof input === 'object' && input !== null ? input : {}) as Partial<TradingPlan>;
  const preferredMarket = value.preferredMarket && value.preferredMarket in MARKET_PROFILES ? value.preferredMarket : DEFAULT_PLAN.preferredMarket;
  const preferredAccount = value.preferredAccount === 'standard' ? 'standard' : 'micro';
  const legacyMonthlyGoalPct = clampNumber(
    (value as { monthlyGoalPct?: unknown }).monthlyGoalPct,
    DEFAULT_PLAN.monthlyGoalUsd,
    1,
    200,
  );
  const legacyGoalUsd = clampNumber(
    clampNumber(value.baseCapital, DEFAULT_PLAN.baseCapital, 100, 500000) * (legacyMonthlyGoalPct / 100),
    DEFAULT_PLAN.monthlyGoalUsd,
    1,
    1000000,
  );

  const sanitized: TradingPlan = {
    baseCapital: clampNumber(value.baseCapital, DEFAULT_PLAN.baseCapital, 100, 500000),
    defaultRiskPct: clampNumber(value.defaultRiskPct, DEFAULT_PLAN.defaultRiskPct, 0.1, 5),
    monthlyGoalUsd: clampNumber(value.monthlyGoalUsd, legacyGoalUsd, 1, 1000000),
    maxDailyLossPct: clampNumber(value.maxDailyLossPct, DEFAULT_PLAN.maxDailyLossPct, 0.5, 10),
    preferredMarket,
    preferredAccount,
  };

  return matchesLegacyDefaultPlan(sanitized) || matchesPreviousGeneratedPlan(sanitized) ? DEFAULT_PLAN : sanitized;
}

export function sanitizeConfig(input: unknown): AppConfig {
  const value = (typeof input === 'object' && input !== null ? input : {}) as Partial<AppConfig>;
  const marketType = value.marketType && value.marketType in MARKET_PROFILES ? value.marketType : DEFAULT_CONFIG.marketType;
  const defaults = getMarketDefaults(marketType);

  const sanitized: AppConfig = {
    capital: clampNumber(value.capital, DEFAULT_CONFIG.capital, 100, 1000000),
    riesgoPct: clampNumber(value.riesgoPct, DEFAULT_CONFIG.riesgoPct, 0.1, 5),
    winRate: clampNumber(value.winRate, DEFAULT_CONFIG.winRate, 20, 90),
    targetProfit: Math.max(
      clampNumber(value.capital, DEFAULT_CONFIG.capital, 100, 1000000),
      clampNumber(value.targetProfit, DEFAULT_CONFIG.targetProfit, 100, 5000000),
    ),
    atr: clampNumber(value.atr, defaults.atr, 1, 1000),
    manualSl: clampNumber(value.manualSl, defaults.manualSl, 1, 5000),
    manualTp: clampNumber(value.manualTp, defaults.manualTp, 1, 10000),
    calcMode: value.calcMode === 'manual' ? 'manual' : 'atr',
    rrr: clampNumber(value.rrr, defaults.rrr, 0.5, 10),
    spread: clampNumber(value.spread, defaults.spread, 0, 500),
    accountType: value.accountType === 'standard' ? 'standard' : 'micro',
    marketType,
  };

  return matchesLegacyDefaultConfig(sanitized) || matchesPreviousGeneratedConfig(sanitized)
    ? {
        ...DEFAULT_CONFIG,
        ...getMarketDefaults(DEFAULT_CONFIG.marketType),
      }
    : sanitized;
}

export function sanitizeHistory(input: unknown): TradeSession[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      const value = (typeof item === 'object' && item !== null ? item : {}) as Partial<TradeSession>;
      const market = value.market && value.market in MARKET_PROFILES ? value.market : 'metals';

      return {
        id: typeof value.id === 'string' ? value.id : crypto.randomUUID(),
        timestamp: clampNumber(value.timestamp, Date.now(), 0, Number.MAX_SAFE_INTEGER),
        market,
        instrumentLabel: typeof value.instrumentLabel === 'string' ? value.instrumentLabel : MARKET_PROFILES[market].instrumentLabel,
        lots: clampNumber(value.lots, 0, 0, 1000),
        slPips: clampNumber(value.slPips, 0, 0, 10000),
        tpPips: clampNumber(value.tpPips, 0, 0, 10000),
        riskUSD: clampNumber(value.riskUSD, 0, 0, 1000000),
        rewardUSD: clampNumber(value.rewardUSD, 0, -1000000, 1000000),
        rrr: clampNumber(value.rrr, 0, 0, 20),
      };
    })
    .slice(0, 15);
}

export function readLocalJson<T>(key: string, sanitize: (value: unknown) => T, fallback: T) {
  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return sanitize(JSON.parse(raw));
  } catch (error) {
    console.error(`Error reading storage key "${key}"`, error);
    return fallback;
  }
}

export function writeLocalJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing storage key "${key}"`, error);
  }
}
