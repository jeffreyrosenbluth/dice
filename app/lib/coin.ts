import * as d3 from "d3";

export type Face = "heads" | "tails";

export type Flip = {
  flip_num: number;
  value: number;
  value10: number;
  value20: number;
  kelly: number;
  betOn: Face;
  betSize: number;
  coinResult: Face;
};

export type FlipN = {
  flip_num: number;
  key: string;
  value: number;
};

export type Profit = {
  key: string;
  value: number;
};

export const BIAS = 0.6;
const K1 = 0.1;
const K2 = 20;
const KELLY = 0.2;

export function flip(betOn: Face, bias: number): number {
  const ht = betOn === "heads" ? 1 : 0;
  const b = ht ? bias : 1 - bias;
  return d3.randomBernoulli(b)();
}

export function addFlip(
  flips: Flip[],
  bet: number,
  flipResult: number,
  betOn: Face
): Flip[] {
  let flip = flips[flips.length - 1];
  const b = betOn === "heads" ? bet : -bet;
  const v = flip.value > 0 ? (flipResult ? flip.value + b : flip.value - b) : 0;
  const v1 = flipResult
    ? flip.value10 + flip.value10 * K1
    : flip.value10 - flip.value10 * K1;
  const v2 =
    flip.value20 > 0 ? (flipResult ? flip.value20 + K2 : flip.value20 - K2) : 0;
  const vk = flipResult
    ? flip.kelly + flip.kelly * KELLY
    : flip.kelly - flip.kelly * KELLY;
  return [
    ...flips,
    {
      flip_num: flips.length,
      value: v,
      value10: v1,
      value20: v2,
      kelly: vk,
      betOn: betOn,
      betSize: bet,
      coinResult: flipResult ? "heads" : "tails",
    },
  ];
}

export function toCoinGameTable(flips: Flip[]) {
  return flips.map((f) => {
    return {
      flip_num: f.flip_num,
      flip_result_heads: f.coinResult === "heads",
      bet_on_heads: f.betOn === "heads",
      bet_size: f.betSize,
      balance: f.value,
    };
  });
}

export function mkFlipNs(flips: Flip[], gameCompleted: boolean): FlipN[] {
  let flipN = [];
  for (let f of flips) {
    flipN.push({ flip_num: f.flip_num, key: "Player", value: f.value });
    if (gameCompleted) {
      flipN.push({
        flip_num: f.flip_num,
        key: "Constant 10%",
        value: f.value10,
      });
      flipN.push({
        flip_num: f.flip_num,
        key: "Constant $20",
        value: f.value20,
      });
      flipN.push({ flip_num: f.flip_num, key: "Kelly", value: f.kelly });
    }
  }
  return flipN;
}

function mkCoinBatch(n: number, bias: number, betFraction: number): Profit[] {
  let c10p = 1;
  let c20d = 1;
  let kelly = 1;
  const kellyFraction = bias * 2 - 1;
  const bet = Math.trunc(betFraction * 100);
  for (let i = 0; i < n; i++) {
    const toss = flip("heads", bias);
    c10p = toss ? (1 + betFraction) * c10p : c10p * (1 - betFraction);
    c20d = c20d > 0 ? (toss ? c20d + K2 / 100 : c20d - K2 / 100) : 0;
    kelly = toss ? kelly * (1 + kellyFraction) : kelly * (1 - kellyFraction);
  }
  return [
    { key: `Constant ${bet}%`, value: Math.pow(c10p, 1 / n) - 1 },
    { key: "Constant $20", value: Math.pow(Math.max(0, c20d), 1 / n) - 1 },
    { key: "Kelly", value: Math.pow(kelly, 1 / n) - 1 },
  ];
}

export function runCoinSim(
  batchSize: number,
  n: number,
  bias: number,
  betFraction: number
): Profit[] {
  let profit = [];
  for (let i = 0; i < n; i++) {
    profit.push(...mkCoinBatch(batchSize, bias, betFraction));
  }
  return profit;
}

export function toss(bias: number): Face {
  return d3.randomBernoulli(bias)() ? "heads" : "tails";
}

export function addToss(tosses: Face[], toss: Face): Face[] {
  return [...tosses, toss];
}

export function trackRecProbability(
  n: number,
  m: number,
  k: number,
  j: number,
  p: number,
  q: number = 0.5
): number {
  const a = p ** k * (1 - p) ** (n - k) * q ** j * (1 - q) ** (m - j);
  const b = p ** j * (1 - p) ** (m - j) * q ** k * (1 - q) ** (n - k);
  return a / (a + b);
}

export function entropy(p: number): number {
  return -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
}
