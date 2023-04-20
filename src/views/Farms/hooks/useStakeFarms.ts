import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'

const useStakeFarms = (pid: number, account?: string) => {
  const gblockStakingContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      return stakeFarm(gblockStakingContract, pid, amount, account)
    },
    [gblockStakingContract, pid],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
