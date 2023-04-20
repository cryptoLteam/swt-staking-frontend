import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'

const useHarvestFarm = (farmPid: number, account: string) => {
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    return harvestFarm(masterChefContract, farmPid, account)
  }, [farmPid, masterChefContract, account])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
