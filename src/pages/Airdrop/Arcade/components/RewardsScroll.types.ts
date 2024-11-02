export enum Reward {
  Empty,
  Tokens,
  Car
}

export const TOKENS_WINNING_INDEXS = [3, 7, 11]
export const CAR_WINNING_INDEX = 3

export const getRandomRewardIndex = () =>
  Math.floor(Math.random() * REWARDS_NO_CAR.length)

export const getRandomTokensWinningIndex = () =>
  TOKENS_WINNING_INDEXS[`${Math.floor(Math.random() * 3)}`]

export const REWARDS_NO_CAR = [
  Reward.Empty,
  Reward.Empty,
  Reward.Empty,
  Reward.Tokens,
  Reward.Empty,
  Reward.Empty,
  Reward.Empty,
  Reward.Tokens,
  Reward.Empty,
  Reward.Empty,
  Reward.Empty,
  Reward.Tokens,
  Reward.Empty
]

export const REWARDS_WITH_CAR = [
  Reward.Empty,
  Reward.Empty,
  Reward.Empty,
  Reward.Car,
  Reward.Empty,
  Reward.Empty,
  Reward.Empty,
  Reward.Tokens,
  Reward.Empty,
  Reward.Empty,
  Reward.Empty,
  Reward.Tokens,
  Reward.Empty
]
