import * as d3 from "d3";

export type Assets = {
  stock: number;
  crypto: number;
  cash: number;
  portfolio: number;
};

// export type AssetsN = Assets & { period: number };

function mapAssets(assets: Assets, f: (input: number) => number): Assets {
  return {
    stock: f(assets.stock),
    crypto: f(assets.crypto),
    cash: f(assets.cash),
    portfolio: f(assets.portfolio),
  };
}

type Weights = Omit<Assets, "portfolio">;

type Asset = { key: string; value: number };
type AssetN = Asset & { period: number };

export type AssetFrame = Array<Asset>;
export type AssetFrameN = Array<AssetN>;

const outcomes = {
  stock: [0.8, 0.9, 1.02, 1.1, 1.2, 1.4],
  crypto: [0.05, 0.2, 1.0, 3.0, 3.0, 3.0],
  cash: [1.02, 1.02, 1.02, 1.02, 1.02, 1.02],
};

export const pmf = [
  { key: "stock", value: -20, prob: 1 / 6 },
  { key: "stock", value: -10, prob: 1 / 6 },
  { key: "stock", value: 2, prob: 1 / 6 },
  { key: "stock", value: 10, prob: 1 / 6 },
  { key: "stock", value: 20, prob: 1 / 6 },
  { key: "stock", value: 40, prob: 1 / 6 },
  { key: "crypto", value: -95, prob: 1 / 6 },
  { key: "crypto", value: -80, prob: 1 / 6 },
  { key: "crypto", value: 0, prob: 1 / 6 },
  { key: "crypto", value: 200, prob: 1 / 2 },
];

function mkReturn(weights: Weights): Assets {
  const dice = Array.from({ length: 3 }, d3.randomInt(0, 6));
  return {
    stock: outcomes.stock[dice[0]],
    crypto: outcomes.crypto[dice[1]],
    cash: outcomes.cash[dice[2]],
    portfolio:
      outcomes.stock[dice[0]] * weights.stock +
      outcomes.crypto[dice[1]] * weights.crypto +
      outcomes.cash[dice[2]] * weights.cash,
  };
}

function mkBatch(weights: Weights, periods: number): Assets[] {
  return Array.from({ length: periods }, () => mkReturn(weights));
}

function reduceBatch(batch: Assets[]): Assets {
  const value = batch.reduce(
    (acc, item) => ({
      stock: acc.stock * item.stock,
      crypto: acc.crypto * item.crypto,
      cash: acc.cash * item.cash,
      portfolio: acc.portfolio * item.portfolio,
    }),
    { stock: 1, crypto: 1, cash: 1, portfolio: 1 }
  );
  return mapAssets(value, (x) => Math.pow(x, 1 / batch.length) - 1.0);
}

function runSimulation(weights: Weights, periods: number, n: number): Assets[] {
  const assets = [];
  for (let i = 0; i < n; i++) {
    assets.push(reduceBatch(mkBatch(weights, periods)));
  }
  return assets;
}

export function simulate(
  weights: Weights,
  periods: number,
  n: number
): AssetFrame {
  let assets = runSimulation(weights, periods, n);
  let frame: AssetFrame = [];
  for (let a of assets) {
    frame.push({ key: "stock", value: a.stock });
    frame.push({ key: "crypto", value: a.crypto });
    frame.push({ key: "portfolio", value: a.portfolio });
  }
  return frame;
}

export function addRoll(
  weights: Weights,
  wealths: Assets[],
  returns: Assets[]
): [Assets[], Assets[]] {
  const current = wealths.slice(-1)[0];
  const newReturn = mkReturn(weights);
  const newWealth: Assets = {
    stock: current.stock * newReturn.stock,
    crypto: current.crypto * newReturn.crypto,
    cash: current.cash * newReturn.cash,
    portfolio: current.portfolio * newReturn.portfolio,
  };
  return [
    [...wealths, newWealth],
    [...returns, newReturn],
  ];
}

export function toDiceGameTable(assets: Assets[], userId?: string) {
  return assets.map((f, i) => {
    return {
      roll_num: i + 1,
      sp500_percent: f.stock,
      crypto_percent: f.crypto,
      cash_percent: f.cash,
      portfolio_percent: f.portfolio,
      user_id: userId,
    };
  });
}

export function wealthFrame(
  wealths: Assets[],
  includePortfolio: boolean
): AssetFrameN {
  let frame: AssetFrameN = [];
  for (let i = 0; i < wealths.length; i++) {
    frame.push({ key: "stock", value: wealths[i].stock, period: i });
    frame.push({ key: "crypto", value: wealths[i].crypto, period: i });
    frame.push({ key: "cash", value: wealths[i].cash, period: i });
    if (includePortfolio) {
      frame.push({ key: "portfolio", value: wealths[i].portfolio, period: i });
    }
  }
  return frame;
}

export function returnsFrame(returns: Assets[], includePortfolio: boolean) {
  const df: { key: string; value: number }[] = [];
  returns.forEach((item) => {
    df.push({ key: "stock", value: item.stock });
    df.push({ key: "crypto", value: item.crypto });
    if (includePortfolio) {
      df.push({ key: "portfolio", value: item.portfolio });
    }
  });
  return df;
}

export function countReturns(returns: Assets[], includePortfolio: boolean) {
  const counts: { key: string; value: number; count: number }[] = [];
  const totals: { key: string; count: number }[] = [
    { key: "stock", count: 0 },
    { key: "crypto", count: 0 },
    { key: "cash", count: 0 },
    { key: "portfolio", count: 0 },
  ];

  const df = returnsFrame(returns, includePortfolio).map((item) => {
    item.value = 100 * (item.value - 1);
    return item;
  });
  df.forEach((item) => {
    const existing = counts.find(
      (count) => count.key === item.key && count.value === item.value
    );
    if (existing) {
      existing.count += 1;
    } else {
      counts.push({ key: item.key, value: item.value, count: 1 });
    }
    const total = totals.find((total) => total.key === item.key);
    if (total) {
      total.count += 1;
    }
  });
  for (let c of counts) {
    const n = totals.find((total) => total.key === c.key)?.count;
    c.count = n ? c.count / n : 0;
  }
  return counts.filter((count) => count.key != "cash");
}
