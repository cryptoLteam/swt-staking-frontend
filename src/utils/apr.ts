import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR } from 'config'

/**
 * Get farm APR value in %
 * @param gblockPrice Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
export const getFarmApr = (
  gblockPrice: BigNumber,
  poolLiquidityUsd: BigNumber,
  rewardPerBlock: number,
): { rewardsApr: number; rewardsApy: number } => {
  const yearlyRewardAllocation = new BigNumber(BLOCKS_PER_YEAR * rewardPerBlock).div(10 ** 18)
  const rewardsApr = yearlyRewardAllocation.times(gblockPrice).div(poolLiquidityUsd).times(100)
  let rewardsAprAsNumber = null
  if (!rewardsApr.isNaN() && rewardsApr.isFinite()) {
    rewardsAprAsNumber = rewardsApr.toNumber()
  }

  let rewardsApy = null
  if (rewardsApr !== null) {
    rewardsApy = ((1 + rewardsAprAsNumber / 100 / 365) ** 365 - 1) * 100
  }
  return { rewardsApr: rewardsAprAsNumber, rewardsApy }
}

export default null
