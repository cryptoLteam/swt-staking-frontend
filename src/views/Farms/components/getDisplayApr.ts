export const getDisplayApr = (cakeRewardsApr?: number, rewardsApy?: number) => {
  if (cakeRewardsApr && rewardsApy) {
    return (cakeRewardsApr + rewardsApy).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}
