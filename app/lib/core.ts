import * as d3 from "d3";

interface Outcomes {
  green: number[];
  red: number[];
  white: number[];
}

export const outcomes: Outcomes = {
  green: [0.8, 0.9, 1.02, 1.1, 1.2, 1.4],
  red: [0.05, 0.2, 1.0, 3.0, 3.0, 3.0],
  white: [1.02, 1.02, 1.02, 1.02, 1.02, 1.02],
};

export const pmf = [
  { symbol: "Green Die", value: -20, prob: 1 / 6 },
  { symbol: "Green Die", value: -10, prob: 1 / 6 },
  { symbol: "Green Die", value: 2, prob: 1 / 6 },
  { symbol: "Green Die", value: 10, prob: 1 / 6 },
  { symbol: "Green Die", value: 20, prob: 1 / 6 },
  { symbol: "Green Die", value: 40, prob: 1 / 6 },
  { symbol: "Red Die", value: -95, prob: 1 / 6 },
  { symbol: "Red Die", value: -80, prob: 1 / 6 },
  { symbol: "Red Die", value: 0, prob: 1 / 6 },
  { symbol: "Red Die", value: 200, prob: 1 / 2 },
];
export interface Return {
  green: number;
  red: number;
  white: number;
  violet: number;
}

export interface Wealth {
  roll_num: number;
  green: number;
  red: number;
  white: number;
  violet: number;
}

export interface Weights {
  green: number;
  red: number;
  white: number;
}
export interface Item {
  num: number;
  green: number;
  red: number;
  white: number;
  violet: number;
}

export interface Batch {
  batchNum: number;
  symbol: string;
  cummReturn: number;
}

export interface Batches {
  batches: Batch[];
  currentReturn: Item;
}

function mkRoll(outcomes: Outcomes, weights: Weights): Return {
  const dice = Array.from({ length: 3 }, d3.randomInt(0, 6));
  return {
    green: outcomes.green[dice[0]],
    red: outcomes.red[dice[1]],
    white: outcomes.white[dice[2]],
    violet:
      outcomes.green[dice[0]] * weights.green +
      outcomes.red[dice[1]] * weights.red +
      outcomes.white[dice[2]] * weights.white,
  };
}

function mkItem(
  outcomes: Outcomes,
  weights: Weights,
  batchSize: number,
  batchNum: number
): Item {
  const item: Item = {
    num: batchNum,
    green: 1,
    red: 1,
    white: 1,
    violet: 1,
  } as Item;
  for (let i = 0; i < batchSize; i++) {
    let roll = mkRoll(outcomes, weights);
    item.green *= roll.green;
    item.red *= roll.red;
    item.white *= roll.white;
    item.violet *= roll.violet;
  }
  item.green = item.green ** (1 / batchSize) - 1;
  item.red = item.red ** (1 / batchSize) - 1;
  item.white = item.white ** (1 / batchSize) - 1;
  item.violet = item.violet ** (1 / batchSize) - 1;
  return item;
}

function addBatch(
  outcomes: Outcomes,
  weights: Weights,
  batches: Batches,
  batchSize: number
): Batches {
  const currentReturn = mkItem(
    outcomes,
    weights,
    batchSize,
    batches.batches.length
  );
  return {
    batches: [
      ...batches.batches,
      {
        batchNum: currentReturn.num,
        symbol: "green",
        cummReturn: currentReturn.green,
      },
      {
        batchNum: currentReturn.num,
        symbol: "red",
        cummReturn: currentReturn.red,
      },
      {
        batchNum: currentReturn.num,
        symbol: "violet",
        cummReturn: currentReturn.violet,
      },
    ],
    currentReturn: currentReturn,
  };
}

export function runSim(
  outcomes: Outcomes,
  weights: Weights,
  batchSize: number,
  numBatches: number
): Batches {
  let batches: Batches = {
    batches: [],
    currentReturn: { num: 0, green: 1, red: 1, white: 1, violet: 1 },
  };
  for (let i = 0; i < numBatches; i++) {
    batches = addBatch(outcomes, weights, batches, batchSize);
  }
  return batches;
}

export function roll(
  outcomes: Outcomes,
  weights: Weights,
  wealth: Wealth[]
): [Wealth, Return] {
  const current = wealth.slice(-1)[0];
  const dice = Array.from({ length: 3 }, d3.randomInt(0, 6));

  const newReturn: Return = {
    green: outcomes.green[dice[0]],
    red: outcomes.red[dice[1]],
    white: outcomes.white[dice[2]],
    violet:
      outcomes.green[dice[0]] * weights.green +
      outcomes.red[dice[1]] * weights.red +
      outcomes.white[dice[2]] * weights.white,
  };

  const newWealth: Wealth = {
    roll_num: current.roll_num + 1,
    green: current.green * newReturn.green,
    red: current.red * newReturn.red,
    white: current.white * newReturn.white,
    violet: current.violet * newReturn.violet,
  };

  return [newWealth, newReturn];
}

export function to_df(wealth: Wealth[], violet: boolean) {
  const df: { roll_num: number; symbol: string; value: number }[] = [];
  wealth.forEach((item) => {
    df.push({ roll_num: item.roll_num, symbol: "_green", value: item.green });
    df.push({ roll_num: item.roll_num, symbol: "_red", value: item.red });
    df.push({ roll_num: item.roll_num, symbol: "_white", value: item.white });
    if (violet) {
      df.push({
        roll_num: item.roll_num,
        symbol: "_violet",
        value: item.violet,
      });
    }
  });
  return df;
}

export function toReturnsDf(returns: Return[], violet: boolean) {
  const df: { symbol: string; value: number }[] = [];
  returns.forEach((item) => {
    df.push({ symbol: "Green Die", value: item.green });
    df.push({ symbol: "Red Die", value: item.red });
    if (violet) {
      df.push({ symbol: "portfolio", value: item.violet });
    }
  });
  return df;
}

// Count the number times each value appeaars for each color in Returns
export function countReturns(returns: Return[], violet: boolean) {
  const counts: { symbol: string; value: number; count: number }[] = [];
  const totals: { symbol: string; count: number }[] = [
    { symbol: "Green Die", count: 0 },
    { symbol: "Red Die", count: 0 },
    { symbol: "White Die", count: 0 },
    { symbol: "portfolio", count: 0 },
  ];
  const df = toReturnsDf(returns, violet).map((item) => {
    item.value = 100 * (item.value - 1);
    return item;
  });
  df.forEach((item) => {
    const existing = counts.find(
      (count) => count.symbol === item.symbol && count.value === item.value
    );
    if (existing) {
      existing.count += 1;
    } else {
      counts.push({ symbol: item.symbol, value: item.value, count: 1 });
    }
    const total = totals.find((total) => total.symbol === item.symbol);
    if (total) {
      total.count += 1;
    }
  });
  for (let c of counts) {
    const n = totals.find((total) => total.symbol === c.symbol)?.count;
    c.count = n ? c.count / n : 0;
  }
  return counts.filter((count) => count.symbol != "White Die");
}
