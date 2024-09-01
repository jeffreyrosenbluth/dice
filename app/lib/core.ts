// export type Config = {
//   coin_game_enabled: boolean;
//   coin_game_min_flips: number;
//   coin_game_max_flips: number;
//   coin_sim_enabled: boolean;
//   dice_game_enabled: boolean;
//   dice_game_min_rolls: number;
//   dice_game_max_rolls: number;
//   dice_sim_enabled: boolean;
// };

// const BIAS = 0.6;

// type Asset = "stock" | "venture" | "cash" | "portfolio";
// type Flip = "heads" | "tails";

// type Sample<T> = {
//   num: number;
//   investment: T;
//   amount: number;
//   randomVariable: RandomVariable;
//   grossReturn: number;
//   outcomeIndex: number;
//   balance: number;
// };

// function face(sample: Sample<Flip>): Flip {
//   if (sample.investment === "heads") {
//     return sample.outcomeIndex === 0 ? "heads" : "tails";
//   } else {
//     return sample.outcomeIndex === 0 ? "tails" : "heads";
//   }
// }

// type RandomVariable = {
//   outcomes: number[];
//   probs: number[];
// };

// type sampleResult = {
//   grossReturn: number;
//   index: number;
// };

// function sampleRV(rv: RandomVariable): sampleResult {
//   const rand = Math.random();
//   let cumulativeProb = 0;
//   for (let i = 0; i < rv.probs.length - 1; i++) {
//     cumulativeProb += rv.probs[i];
//     if (rand < cumulativeProb) {
//       return { grossReturn: rv.outcomes[i], index: i };
//     }
//   }
//   return {
//     grossReturn: rv.outcomes[rv.outcomes.length - 1],
//     index: rv.outcomes.length - 1,
//   };
// }

// function addSample<T>(
//   samples: Sample<T>[],
//   betSize: number,
//   rv: RandomVariable
// ): Sample<T>[] {
//   const prevSample = samples[samples.length - 1];
//   const { grossReturn, index } = sampleRV(rv);
//   return [
//     ...samples,
//     {
//       num: prevSample.num + 1,
//       investment: prevSample.investment,
//       amount: betSize,
//       randomVariable: rv,
//       grossReturn,
//       outcomeIndex: index,
//       balance: prevSample.balance + betSize * grossReturn,
//     },
//   ];
// }

// type Datum = {
//   num: number;
//   key: string;
//   value: number;
// };

// function prepareFlipData(
//   player: Sample<Flip>[],
//   proportional10: Sample<Flip>[],
//   constant20: Sample<Flip>[],
//   kelly: Sample<Flip>[]
// ): Datum[] {
//   let result = [];
//   let samples = [player, proportional10, constant20, kelly];
//   let keys = ["Player", "Constant 10%", "Constant 20", "Kelly"];
//   for (let i = 0; i < samples.length; i++) {
//     for (let s of samples[i]) {
//       result.push({
//         num: s.num,
//         key: keys[i],
//         value: s.balance,
//       });
//     }
//   }
//   return result;
// }

// const Stock: RandomVariable = {
//   outcomes: [0.8, 0.9, 1.02, 1.1, 1.2, 1.4],
//   probs: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
// };

// const Venture: RandomVariable = {
//   outcomes: [0.05, 0.2, 1.0, 3.0],
//   probs: [1 / 6, 1 / 6, 1 / 6, 0.5],
// };

// const Cash: RandomVariable = {
//   outcomes: [1.02],
//   probs: [1.0],
// };

// const Heads: RandomVariable = {
//   outcomes: [2.0, 0],
//   probs: [BIAS, 1 - BIAS],
// };

// const Tails: RandomVariable = {
//   outcomes: [0.0, 2.0],
//   probs: [BIAS, 1 - BIAS],
// };
