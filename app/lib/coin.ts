import * as d3 from "d3";

export type Face = "heads" | "tails";

export type Flip = {
  flip_num: number;
  value: number;
  value10: number;
  value20: number;
  kelly: number;
  coin: Face;
};

export type FlipN = {
  flip_num: number;
  key: string;
  value: number;
};

const BIAS = 0.6;
const K1 = 0.1;
const K2 = 20;
const KELLY = 0.20833;

export function flip(betOn: string): number {
  const ht = betOn === "heads" ? 1 : 0;
  const bias = ht ? BIAS : 1 - BIAS;
  return d3.randomBernoulli(bias)();
}

export function addFlip(
  flips: Flip[],
  bet: number,
  flipResult: number
): Flip[] {
  // const ht = betOn === "heads" ? 1 : 0;
  // const bias = ht ? BIAS : 1 - BIAS;
  // let flipResult = d3.randomBernoulli(bias)();
  let flip = flips[flips.length - 1];
  const v =
    flip.value > 0 ? (flipResult ? flip.value + bet : flip.value - bet) : 0;
  const v1 = flipResult
    ? flip.value10 + flip.value10 * K1
    : flip.value10 - flip.value10 * K1;
  const v2 =
    flip.value > 0 ? (flipResult ? flip.value20 + K2 : flip.value20 - K2) : 0;
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
      coin: flipResult ? "heads" : "tails",
    },
  ];
}

export function mkFlipNs(flips: Flip[]): FlipN[] {
  let flipN = [];
  for (let f of flips) {
    flipN.push({ flip_num: f.flip_num, key: "You", value: f.value });
    flipN.push({ flip_num: f.flip_num, key: "Constant 10%", value: f.value10 });
    flipN.push({ flip_num: f.flip_num, key: "Constant $20", value: f.value20 });
    flipN.push({ flip_num: f.flip_num, key: "Kelly", value: f.kelly });
  }
  return flipN;
}
