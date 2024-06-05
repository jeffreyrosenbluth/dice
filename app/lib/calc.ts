import * as d3 from "d3";

interface Outcomes {
  green: number[];
  red: number[];
  white: number[];
}

export const outcomes: Outcomes = {
  green: [0.8, 0.9, 1.1, 1.1, 1.2, 1.4],
  red: [0.05, 0.2, 1.0, 3.0, 3.0, 3.0],
  white: [0.95, 1.0, 1.0, 1.0, 1.0, 1.1],
};

export const pmf = [
  { symbol: "Green Die", value: -20, prob: 1 / 6 },
  { symbol: "Green Die", value: -10, prob: 1 / 6 },
  { symbol: "Green Die", value: 10, prob: 1 / 3 },
  { symbol: "Green Die", value: 20, prob: 1 / 6 },
  { symbol: "Green Die", value: 40, prob: 1 / 6 },
  { symbol: "Red Die", value: -95, prob: 1 / 6 },
  { symbol: "Red Die", value: -80, prob: 1 / 6 },
  { symbol: "Red Die", value: 0, prob: 1 / 6 },
  { symbol: "Red Die", value: 200, prob: 1 / 2 },
  { symbol: "White Die", value: -5, prob: 1 / 6 },
  { symbol: "White Die", value: 0, prob: 2 / 3 },
  { symbol: "White Die", value: 10, prob: 1 / 6 },
];
export interface Return {
  green: number;
  red: number;
  white: number;
  pink: number;
}

export interface Wealth {
  roll_num: number;
  green: number;
  red: number;
  white: number;
  pink: number;
}

export interface Weights {
  green: number;
  red: number;
  white: number;
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
    pink:
      outcomes.green[dice[0]] * weights.green +
      outcomes.red[dice[1]] * weights.red +
      outcomes.white[dice[2]] * weights.white,
  };

  const newWealth: Wealth = {
    roll_num: current.roll_num + 1,
    green: current.green * newReturn.green,
    red: current.red * newReturn.red,
    white: current.white * newReturn.white,
    pink: current.pink * newReturn.pink,
  };

  return [newWealth, newReturn];
}

export function to_df(wealth: Wealth[], pink: boolean) {
  const df: { roll_num: number; symbol: string; value: number }[] = [];
  wealth.forEach((item) => {
    df.push({ roll_num: item.roll_num, symbol: "_green", value: item.green });
    df.push({ roll_num: item.roll_num, symbol: "_red", value: item.red });
    df.push({ roll_num: item.roll_num, symbol: "_white", value: item.white });
    if (pink) {
      df.push({ roll_num: item.roll_num, symbol: "_pink", value: item.pink });
    }
  });
  return df;
}

export function toReturnsDf(returns: Return[], pink: boolean) {
  const df: { symbol: string; value: number }[] = [];
  returns.forEach((item) => {
    df.push({ symbol: "Green Die", value: item.green });
    df.push({ symbol: "Red Die", value: item.red });
    df.push({ symbol: "White Die", value: item.white });
    if (pink) {
      df.push({ symbol: "pink Die", value: item.pink });
    }
  });
  return df;
}

// Count the number times each value appeaars for each color in Returns
export function countReturns(returns: Return[], pink: boolean) {
  const counts: { symbol: string; value: number; count: number }[] = [];
  const totals: { symbol: string; count: number }[] = [
    { symbol: "Green Die", count: 0 },
    { symbol: "Red Die", count: 0 },
    { symbol: "White Die", count: 0 },
    { symbol: "pink Die", count: 0 },
  ];
  const df = toReturnsDf(returns, pink).map((item) => {
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
    total.count += 1;
  });
  for (let c of counts) {
    const n = totals.find((total) => total.symbol === c.symbol)?.count;
    c.count = c.count / n;
  }
  return counts;
}
