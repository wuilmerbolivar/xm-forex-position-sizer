import { useCallback, useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { AppConfig, TradingPlan, TradeSession } from './types';
import { useRiskCalculator } from './hooks/useRiskCalculator';
import { Header } from './components/Header';
import { ProtocolDescription } from './components/ProtocolDescription';
import { ConfigPanel } from './components/ConfigPanel';
import { ResultsDisplay } from './components/ResultsDisplay';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { XMInfoSection } from './components/XMInfoSection';
import { AffiliateSection } from './components/AffiliateSection';
import { Footer } from './components/Footer';
import { TechnicalManual } from './components/TechnicalManual';
import { TradingPlanWorkspace } from './components/TradingPlanWorkspace';
import { HistoryPanel } from './components/HistoryPanel';
import { MARKET_PROFILES, getMarketDefaults } from './lib/marketProfiles';
import {
  getDefaultConfig,
  getDefaultPlan,
  readLocalJson,
  sanitizeConfig,
  sanitizeHistory,
  sanitizePlan,
  writeLocalJson,
} from './lib/persistence';

const STORAGE_KEY = 'xm_forex_sizer_config';
const PLAN_KEY = 'xm_forex_sizer_plan';
const HISTORY_KEY = 'xm_forex_sizer_history';

type WorkspaceView = 'dashboard' | 'manual' | 'plan';

export default function App() {
  const [activeView, setActiveView] = useState<WorkspaceView>('dashboard');

  const [history, setHistory] = useState<TradeSession[]>(() =>
    readLocalJson(HISTORY_KEY, sanitizeHistory, []),
  );

  const [plan, setPlan] = useState<TradingPlan>(() =>
    readLocalJson(PLAN_KEY, sanitizePlan, getDefaultPlan()),
  );

  const [config, setConfig] = useState<AppConfig>(() =>
    readLocalJson(STORAGE_KEY, sanitizeConfig, getDefaultConfig()),
  );

  useEffect(() => {
    writeLocalJson(STORAGE_KEY, config);
  }, [config]);

  useEffect(() => {
    writeLocalJson(PLAN_KEY, plan);
  }, [plan]);

  useEffect(() => {
    writeLocalJson(HISTORY_KEY, history);
  }, [history]);

  const updateConfig = useCallback((updates: Partial<AppConfig>) => {
    setConfig((prev) => {
      const nextMarket = updates.marketType ?? prev.marketType;
      const marketDefaults = nextMarket !== prev.marketType ? getMarketDefaults(nextMarket) : {};
      const merged = {
        ...prev,
        ...marketDefaults,
        ...updates,
      };

      if (merged.targetProfit < merged.capital) {
        merged.targetProfit = merged.capital;
      }

      return sanitizeConfig(merged);
    });
  }, []);

  const savePlan = useCallback((incomingPlan: TradingPlan) => {
    setPlan(sanitizePlan(incomingPlan));
  }, []);

  const applyPlan = useCallback((incomingPlan: TradingPlan) => {
    const nextPlan = sanitizePlan(incomingPlan);

    setPlan(nextPlan);
    setConfig((prev) =>
      sanitizeConfig({
        ...prev,
        ...getMarketDefaults(nextPlan.preferredMarket),
        capital: nextPlan.baseCapital,
        riesgoPct: nextPlan.defaultRiskPct,
        marketType: nextPlan.preferredMarket,
        accountType: nextPlan.preferredAccount,
        targetProfit: Math.round(nextPlan.baseCapital + nextPlan.monthlyGoalUsd),
      }),
    );
    setActiveView('dashboard');
  }, []);

  const results = useRiskCalculator(config);
  const currentProfile = MARKET_PROFILES[config.marketType];

  const saveToHistory = useCallback(() => {
    const session: TradeSession = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      market: config.marketType,
      instrumentLabel: results.instrumentLabel,
      lots: results.lotes,
      slPips: results.sl,
      tpPips: results.tp,
      riskUSD: results.riesgoUSD,
      rewardUSD: results.ganancia,
      rrr: results.netRRR,
    };

    setHistory((prev) => [session, ...prev].slice(0, 15));
  }, [
    config.marketType,
    results.ganancia,
    results.instrumentLabel,
    results.lotes,
    results.netRRR,
    results.riesgoUSD,
    results.sl,
    results.tp,
  ]);

  return (
    <div className="min-h-screen overflow-x-hidden font-sans text-[var(--text-primary)] selection:bg-[var(--accent-primary)] selection:text-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8 xl:px-8">
        {activeView === 'manual' ? (
          <div className="workspace-stage">
            <TechnicalManual
              config={config}
              plan={plan}
              results={results}
              profile={currentProfile}
              onClose={() => setActiveView('dashboard')}
              onOpenPlan={() => setActiveView('plan')}
            />
          </div>
        ) : activeView === 'plan' ? (
          <div className="workspace-stage">
            <TradingPlanWorkspace
              currentPlan={plan}
              currentConfig={config}
              onSave={savePlan}
              onApply={applyPlan}
              onClose={() => setActiveView('dashboard')}
              onOpenManual={() => setActiveView('manual')}
            />
          </div>
        ) : (
          <div className="space-y-5">
            <Header
              config={config}
              results={results}
              profile={currentProfile}
              onOpenManual={() => setActiveView('manual')}
              onOpenPlan={() => setActiveView('plan')}
            />

            <ProtocolDescription config={config} results={results} profile={currentProfile} />

            <main id="calculator" className="grid grid-cols-1 gap-5 xl:grid-cols-12 xl:items-start">
              <ConfigPanel
                config={config}
                updateConfig={updateConfig}
                results={results}
                plan={plan}
                profile={currentProfile}
              />

              <section className="space-y-5 xl:col-span-8">
                <ResultsDisplay
                  results={results}
                  accountType={config.accountType}
                  marketType={config.marketType}
                  winRate={config.winRate}
                  onSave={saveToHistory}
                />

                <AnalyticsPanel
                  results={results}
                  capital={config.capital}
                  config={config}
                  plan={plan}
                  profile={currentProfile}
                />

                <HistoryPanel
                  sessions={history}
                  onClear={() => setHistory([])}
                  onRemove={(id) => setHistory((prev) => prev.filter((session) => session.id !== id))}
                />

                <XMInfoSection profile={currentProfile} />
                <AffiliateSection />
              </section>
            </main>
          </div>
        )}

        <Footer profile={currentProfile} />
      </div>

      <a
        href="https://wa.me/51987435331?text=Hola,%20necesito%20ayuda%20para%20empezar%20en%20XM."
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed bottom-3 right-3 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#2bd67b]/24 bg-[#11251d]/95 text-[#7ef0af] shadow-[0_18px_45px_rgba(13,24,18,0.5)] transition-all hover:-translate-y-0.5 hover:border-[#2bd67b]/40 sm:bottom-4 sm:right-4 sm:h-14 sm:w-14"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={22} />
        <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full border border-[#2bd67b]/18 bg-[#11251d]/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7ef0af] opacity-0 transition-opacity group-hover:opacity-100 lg:block">
          Soporte
        </span>
      </a>
    </div>
  );
}
