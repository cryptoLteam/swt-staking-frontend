import { useCallback } from 'react'
import { MaxUint256 } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { useCallWithMarketGasPrice } from 'hooks/useCallWithMarketGasPrice'

const useApproveFarm = (lpContract: Contract, chainId: number) => {
  const contractAddress = getMasterChefAddress(chainId)

  const { callWithMarketGasPrice } = useCallWithMarketGasPrice()
  const handleApprove = useCallback(async () => {
    return callWithMarketGasPrice(lpContract, 'approve', [contractAddress, MaxUint256])
  }, [lpContract, contractAddress, callWithMarketGasPrice])

  return { onApprove: handleApprove }
}

export default useApproveFarm

export const useApproveBoostProxyFarm = (lpContract: Contract, proxyAddress?: string) => {
  const { callWithMarketGasPrice } = useCallWithMarketGasPrice()
  const handleApprove = useCallback(async () => {
    return proxyAddress && callWithMarketGasPrice(lpContract, 'approve', [proxyAddress, MaxUint256])
  }, [lpContract, proxyAddress, callWithMarketGasPrice])

  return { onApprove: handleApprove }
}
