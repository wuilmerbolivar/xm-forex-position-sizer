import { sanitizePlan } from '../src/lib/persistence';
import { assessXmPlan, getSuggestedPlan } from '../src/lib/tradingPlan';

const capitals = [10, 50, 100, 1000, 5000] as const;
const accounts = ['micro', 'standard'] as const;
const markets = ['forex', 'metals', 'indices'] as const;

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const market of markets) {
  console.log(`\n${market.toUpperCase()}`);

  for (const account of accounts) {
    console.log(`  ${account.toUpperCase()}`);

    for (const capital of capitals) {
      const rawPlan = {
        ...getSuggestedPlan(capital, market, account),
        baseCapital: capital,
      };
      const persistedPlan = sanitizePlan(rawPlan);
      const assessment = assessXmPlan(persistedPlan);

      console.log(
        [
          `capital=${capital}`,
          `persisted=${persistedPlan.baseCapital}`,
          `status=${assessment.status}`,
          `apply=${assessment.canApply}`,
          `lot=${assessment.estimatedLot.toFixed(4)}`,
          `minCapital=${assessment.requiredCapitalForMinLot.toFixed(2)}`,
        ].join(' | '),
      );

      assert(persistedPlan.baseCapital >= 100, `${market}/${account}/${capital}: persisted capital should be >= 100`);
    }
  }
}

for (const market of markets) {
  const standardPlan = sanitizePlan(getSuggestedPlan(100, market, 'standard'));
  const standardAssessment = assessXmPlan(standardPlan);
  assert(!standardAssessment.canApply, `${market}/standard/100: expected standard account to remain non-applicable`);

  const largerMicroPlan = sanitizePlan(getSuggestedPlan(1000, market, 'micro'));
  const largerMicroAssessment = assessXmPlan(largerMicroPlan);
  assert(largerMicroAssessment.canApply, `${market}/micro/1000: expected plan to be applicable`);
}

console.log('\nLogic smoke tests passed.');
