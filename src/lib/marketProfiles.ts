import type { AccountType, MarketType } from '../types';

export interface MarketProfile {
  label: string;
  instrumentLabel: string;
  unitLabel: string;
  description: string;
  contractDescription: string;
  defaultAtr: number;
  defaultSpread: number;
  defaultManualSl: number;
  defaultManualTp: number;
  defaultRrr: number;
  slAtrMultiplier: number;
  tpAtrMultiplier: number;
  maxRecommendedRisk: number;
  marketComment: string;
  valuePerPointPerLot: Record<AccountType, number>;
  contractSize: Record<AccountType, number>;
}

export const MARKET_PROFILES: Record<MarketType, MarketProfile> = {
  metals: {
    label: 'Metales',
    instrumentLabel: 'XAUUSD',
    unitLabel: 'points',
    description: 'Modelo de oro spot orientado a cuentas XM con ejecucion sobre XAUUSD.',
    contractDescription: '1 lote standard = 100 oz. 1 lote micro = 1 oz.',
    defaultAtr: 180,
    defaultSpread: 28,
    defaultManualSl: 220,
    defaultManualTp: 440,
    defaultRrr: 2,
    slAtrMultiplier: 1.1,
    tpAtrMultiplier: 2.0,
    maxRecommendedRisk: 1.5,
    marketComment: 'Estimacion para XAUUSD usando 1 point = movimiento de 0.01 USD.',
    valuePerPointPerLot: {
      standard: 1,
      micro: 0.01,
    },
    contractSize: {
      standard: 100,
      micro: 1,
    },
  },
  forex: {
    label: 'Forex',
    instrumentLabel: 'EURUSD',
    unitLabel: 'pips',
    description: 'Modelo para pares principales cotizados en USD con estructura XM standard y micro.',
    contractDescription: '1 lote standard = 100,000 unidades. 1 lote micro = 1,000 unidades.',
    defaultAtr: 28,
    defaultSpread: 1.2,
    defaultManualSl: 20,
    defaultManualTp: 40,
    defaultRrr: 2.1,
    slAtrMultiplier: 1.4,
    tpAtrMultiplier: 2.1,
    maxRecommendedRisk: 2,
    marketComment: 'Estimacion precisa para pares mayores con USD como divisa cotizada.',
    valuePerPointPerLot: {
      standard: 10,
      micro: 0.1,
    },
    contractSize: {
      standard: 100000,
      micro: 1000,
    },
  },
  indices: {
    label: 'Indices',
    instrumentLabel: 'US30',
    unitLabel: 'points',
    description: 'Modelo de indices CFD para traders que buscan posiciones tacticas y control de drawdown.',
    contractDescription: 'Modelo orientativo. Revisa la ficha del simbolo XM antes de ejecutar.',
    defaultAtr: 250,
    defaultSpread: 35,
    defaultManualSl: 180,
    defaultManualTp: 360,
    defaultRrr: 2,
    slAtrMultiplier: 0.9,
    tpAtrMultiplier: 2.0,
    maxRecommendedRisk: 1,
    marketComment: 'Estimacion conservadora para indices. Verifica el valor por punto de tu simbolo.',
    valuePerPointPerLot: {
      standard: 1,
      micro: 0.1,
    },
    contractSize: {
      standard: 1,
      micro: 0.1,
    },
  },
};

export function getMarketDefaults(marketType: MarketType) {
  const profile = MARKET_PROFILES[marketType];

  return {
    atr: profile.defaultAtr,
    spread: profile.defaultSpread,
    manualSl: profile.defaultManualSl,
    manualTp: profile.defaultManualTp,
    rrr: profile.defaultRrr,
  };
}
