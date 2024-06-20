import * as d3 from "d3";

export type Flip = {
  flip_num: number;
  value: number;
  value10: number;
  value20: number;
  kelly: number;
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

export function addFlip(
  flips: Flip[],
  bet: number,
  headsOrTails: string
): Flip[] {
  const ht = headsOrTails === "heads" ? 1 : 0;
  const bias = ht ? BIAS : 1 - BIAS;
  let b = d3.randomBernoulli(bias)();
  let flip = flips[flips.length - 1];
  const v = b ? flip.value + bet : flip.value - bet;
  const v1 = b
    ? flip.value10 + flip.value10 * K1
    : flip.value10 - flip.value10 * K1;
  const v2 = b ? flip.value20 + K2 : flip.value20 - K2;
  const vk = b
    ? flip.kelly + flip.kelly * KELLY
    : flip.kelly - flip.kelly * KELLY;
  return [
    ...flips,
    { flip_num: flips.length, value: v, value10: v1, value20: v2, kelly: vk },
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
