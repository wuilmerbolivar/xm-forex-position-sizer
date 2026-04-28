import { useMemo } from 'react';
import { AppConfig, CalculationResults } from '../types';
import { MARKET_PROFILES } from '../lib/marketProfiles';

export function useRiskCalculator(config: AppConfig): CalculationResults {
  return useMemo(() => {
    const {
      capital,
      riesgoPct,
      winRate,
      atr,
      manualSl,
      manualTp,
      calcMode,
      rrr,
      spread,
      accountType,
      marketType,
      targetProfit,
    } = config;
    const profile = MARKET_PROFILES[marketType];
    const valuePerPointPerLot = profile.valuePerPointPerLot[accountType];
    const contractSize = profile.contractSize[accountType];
    const stopMultiplier = profile.slAtrMultiplier;
    const riskRate = riesgoPct / 100;
    const winRateDecimal = winRate / 100;
    const lossRate = 1 - winRateDecimal;

    const riesgoUSD = capital * riskRate;
    const sl = calcMode === 'atr' ? Math.max(1, atr * stopMultiplier) : Math.max(1, manualSl);
    const tp = calcMode === 'atr' ? Math.max(sl * rrr, 1) : Math.max(1, manualTp);
    const effectiveRiskPerLot = (sl + spread) * valuePerPointPerLot;
    const lotes = effectiveRiskPerLot > 0 ? riesgoUSD / effectiveRiskPerLot : 0;
    const spreadCostUSD = lotes * spread * valuePerPointPerLot;
    const grossRewardUSD = lotes * tp * valuePerPointPerLot;
    const gananciaNeta = grossRewardUSD - spreadCostUSD;
    const currentRRR = sl > 0 ? tp / sl : 0;
    const netRRR = riesgoUSD > 0 ? gananciaNeta / riesgoUSD : 0;
    const kelly = netRRR > 0 ? ((winRateDecimal * netRRR) - lossRate) / netRRR : 0;
    const kellySuggested = Math.max(0, kelly * 100);
    const probableLosingStreak =
      lossRate > 0 && lossRate < 1 ? Math.max(3, Math.ceil(Math.log(100) / -Math.log(lossRate))) : 0;
    const perdidaRacha = riesgoUSD * probableLosingStreak;
    const pipValue = lotes * valuePerPointPerLot;
    const expectativaUSD = (winRateDecimal * gananciaNeta) - (lossRate * riesgoUSD);
    const profitNeeded = Math.max(0, targetProfit - capital);
    const tradesToTarget = expectativaUSD > 0 ? Math.ceil(profitNeeded / expectativaUSD) : 0;
    const tradesToRuin50 = riesgoUSD > 0 ? Math.floor((capital * 0.5) / riesgoUSD) : 0;
    const positionUnits = lotes * contractSize;
    const drawdownPct = capital > 0 ? (perdidaRacha / capital) * 100 : 0;

    return {
      riesgoUSD,
      sl,
      tp,
      lotes,
      ganancia: gananciaNeta,
      grossRewardUSD,
      rachaHistorica: probableLosingStreak,
      perdidaRacha,
      pipValue,
      isHighRisk: riesgoPct > profile.maxRecommendedRisk || netRRR < 1,
      kellySuggested,
      spreadCostUSD,
      expectativaUSD,
      tradesToTarget,
      tradesToRuin50,
      currentRRR,
      netRRR,
      unitLabel: profile.unitLabel,
      instrumentLabel: profile.instrumentLabel,
      contractSize,
      valuePerPointPerLot,
      positionUnits,
      capitalAtRiskPct: riskRate * 100,
      drawdownPct,
      marketComment: profile.marketComment,
    };
  }, [config]);
}
