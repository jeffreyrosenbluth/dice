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

interface Roll {
  green: number;
  red: number;
  white: number;
}

interface Return {
  ret: { green: number; red: number; white: number; pink: number };
}

interface Wealth {
  roll_num: number;
  green: number;
  red: number;
  white: number;
  pink: number;
}

interface Weights {
  green: number;
  red: number;
  white: number;
}

export function roll(
  outcomes: Outcomes,
  weights: Weights,
  rolls: Roll[],
  returns: Return[],
  wealth: Wealth[]
) {
  const current = wealth.slice(-1)[0];
  const dice = Array.from({ length: 3 }, d3.randomInt(0, 6));
  rolls.push({
    green: dice[0],
    red: dice[1],
    white: dice[2],
  });

  const ret = {
    green: outcomes.green[dice[0]],
    red: outcomes.red[dice[1]],
    white: outcomes.white[dice[2]],
    pink:
      outcomes.green[dice[0]] * weights.green +
      outcomes.red[dice[1]] * weights.red +
      outcomes.white[dice[2]] * weights.white,
  };

  returns.push({
    ret,
  });

  wealth.push({
    roll_num: current.roll_num + 1,
    green: current.green * ret.green,
    red: current.red * ret.red,
    white: current.white * ret.white,
    pink: current.pink * ret.pink,
  });
}

export function to_df(wealth: Wealth[], pink: boolean) {
  const df: { roll_num: number; symbol: string; value: number }[] = [];
  wealth.forEach((item) => {
    df.push({ roll_num: item.roll_num, symbol: "green", value: item.green });
    df.push({ roll_num: item.roll_num, symbol: "red", value: item.red });
    df.push({ roll_num: item.roll_num, symbol: "white", value: item.white });
    if (pink) {
      df.push({ roll_num: item.roll_num, symbol: "pink", value: item.pink });
    }
  });
  return df;
}
