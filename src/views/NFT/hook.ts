import BigNumber from 'bignumber.js'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import { useContract, useTokenContract } from 'hooks/useContract'
import { useEffect, useMemo } from 'react'
import { useSingleCallResult } from 'state/multicall/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { NftContractInfo, StakingContractInfo } from './contractInfo/nftContractABI'
import { formatUnits } from '@ethersproject/units'
import { useAccount } from 'wagmi'
import { ChainId, WBNB } from '@pancakeswap/sdk'
import { GBLOCK } from '@pancakeswap/tokens'

export const usePriceGblockBusd = ({ forceMainnet } = { forceMainnet: false }): BigNumber => {
  const price = useCakeBusdPrice({ forceMainnet })
  return useMemo(() => (price ? new BigNumber(price.toSignificant(6)) : BIG_ZERO), [price])
}

export const useNFTContract = ({ id } = { id: 1 }): any => {
  const { address: account } = useAccount()

  const nftContract = useContract(NftContractInfo.address, NftContractInfo.abi, true)
  const NftInfo = useSingleCallResult(nftContract, 'NftInfo', [id]).result
  const nftName = useSingleCallResult(nftContract, 'name').result
  const tokensOfHolder = useSingleCallResult(nftContract, 'tokensOfHolder', [account]).result

  const gBlockContract = useTokenContract(GBLOCK[ChainId.BSC].address, true)
  const allowance = useSingleCallResult(gBlockContract, 'allowance', [account, NftContractInfo.address]).result

  const ApprovedForAll = useSingleCallResult(nftContract, 'isApprovedForAll', [
    account,
    StakingContractInfo.address[Number(id)],
  ]).result

  const mintPrice = NftInfo ? Number(formatUnits(NftInfo[4].toString())) : 0
  const maxMintAmount = NftInfo ? Number(NftInfo[1].toString()) : 0
  const curMintAmount = NftInfo ? Number(NftInfo[2].toString()) : 0
  const isApprovedForAll = ApprovedForAll ? ApprovedForAll[0] : false

  return useMemo(
    () => ({ mintPrice, maxMintAmount, curMintAmount, nftName, tokensOfHolder, allowance, isApprovedForAll }),
    [NftInfo, isApprovedForAll, allowance],
  )
}

export const useStakingContract = ({ id } = { id: 1 }): any => {
  const { address: account } = useAccount()

  const stakingContract = useContract(StakingContractInfo.address[Number(id)], StakingContractInfo.abi, true)

  const rewardPriceWei = useSingleCallResult(stakingContract, 'annualReward', undefined).result
  const pendingRewardWei = useSingleCallResult(stakingContract, 'pendingReward', [account]).result
  const stakedNftIDs = useSingleCallResult(stakingContract, 'getStakedNftIDs', [account]).result

  const rawEndTime = useSingleCallResult(stakingContract, 'endTime').result
  const rawLeftPoolTime = useSingleCallResult(stakingContract, 'getLeftPoolTime').result

  const rewardPrice = rewardPriceWei ? Number(formatUnits(rewardPriceWei.toString())) : 0
  const pendingReward = pendingRewardWei ? Number(formatUnits(pendingRewardWei.toString())).toFixed(3) : 0
  const endTime = rawEndTime ? rawEndTime : 0
  const leftPoolTime = rawLeftPoolTime ? rawLeftPoolTime : 0

  return useMemo(
    () => ({ rewardPrice, pendingReward, stakedNftIDs, endTime, leftPoolTime }),
    [rewardPrice, account, Date.now()],
  )
}

export const useRewardPercent = ({ id } = { id: 1 }): any => {
  const { mintPrice } = useNFTContract({ id })
  const { rewardPrice } = useStakingContract({ id })

  const APR = mintPrice != 0 ? ((rewardPrice / mintPrice) * 100).toFixed(2) : 0
  const APY = mintPrice != 0 ? ((1 + rewardPrice / mintPrice / 365) ** 365 - 1).toFixed(2) : 0

  return useMemo(() => ({ APR, APY }), [mintPrice, rewardPrice])
}

export const useTokenURI = ({ id } = { id: 1 }): any => {
  const PRECISION = 1000000
  const input = id ? id * PRECISION + 1 : 1
  const nftContract = useContract(NftContractInfo.address, NftContractInfo.abi, true)
  const tokenURI = useSingleCallResult(nftContract, 'tokenURI', [input]).result
  const NFTDataJson = tokenURI ? tokenURI[0] : ''
  return useMemo(() => ({ NFTDataJson }), [tokenURI])
}
