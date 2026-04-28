export type AccountType = 'standard' | 'micro';
export type MarketType = 'metals' | 'forex' | 'indices';
export type CalcMode = 'atr' | 'manual';

export interface AppConfig {
  capital: number;
  riesgoPct: number;
  winRate: number;
  targetProfit: number;
  atr: number;
  manualSl: number;
  manualTp: number;
  calcMode: CalcMode;
  rrr: number;
  spread: number;
  accountType: AccountType;
  marketType: MarketType;
}

export interface CalculationResults {
  riesgoUSD: number;
  sl: number;
  tp: number;
  lotes: number;
  ganancia: number;
  grossRewardUSD: number;
  rachaHistorica: number;
  perdidaRacha: number;
  pipValue: number;
  isHighRisk: boolean;
  kellySuggested: number;
  spreadCostUSD: number;
  expectativaUSD: number;
  tradesToTarget: number;
  tradesToRuin50: number;
  currentRRR: number;
  netRRR: number;
  unitLabel: string;
  instrumentLabel: string;
  contractSize: number;
  valuePerPointPerLot: number;
  positionUnits: number;
  capitalAtRiskPct: number;
  drawdownPct: number;
  marketComment: string;
}

export interface TradingPlan {
  baseCapital: number;
  defaultRiskPct: number;
  monthlyGoalUsd: number;
  maxDailyLossPct: number;
  preferredMarket: MarketType;
  preferredAccount: AccountType;
}

export interface TradeSession {
  id: string;
  timestamp: number;
  market: MarketType;
  instrumentLabel: string;
  lots: number;
  slPips: number;
  tpPips: number;
  riskUSD: number;
  rewardUSD: number;
  rrr: number;
}
