import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { MultiCallV2 } from '@pancakeswap/multicall'
import { ChainId } from '@pancakeswap/sdk'
import { FIXED_TWO, FIXED_ZERO } from './const'
import { getFarmsPrices } from './farmPrices'
import { fetchPublicFarmsData } from './fetchPublicFarmData'
import { fetchStableFarmData } from './fetchStableFarmData'
import { isStableFarm, SerializedFarmConfig } from './types'
import { getFullDecimalMultiplier } from './getFullDecimalMultiplier'
import { keys } from 'localforage'
import { mapKeys } from 'lodash'

export const getTokenAmount = (balance: FixedNumber, decimals: number) => {
  const tokenDividerFixed = FixedNumber.from(getFullDecimalMultiplier(decimals))
  return balance.divUnsafe(tokenDividerFixed)
}

export type FetchFarmsParams = {
  farms: SerializedFarmConfig[]
  multicallv2: MultiCallV2
  isTestnet: boolean
  masterChefAddress: string
  chainId: number
}

export async function farmV2FetchFarms({
  farms,
  multicallv2,
  isTestnet,
  masterChefAddress,
  chainId,
}: FetchFarmsParams) {
  const stableFarms = farms.filter(isStableFarm)

  const [stableFarmsResults, poolInfos, lpDataResults] = await Promise.all([
    fetchStableFarmData(stableFarms, chainId, multicallv2),
    fetchMasterChefData(farms, multicallv2, masterChefAddress),
    fetchPublicFarmsData(farms, chainId, multicallv2, masterChefAddress),
  ])
  // console.log("farmV2FetchFarms", stableFarmsResults, poolInfos, lpDataResults)
  const stableFarmsData = (stableFarmsResults as StableLpData[]).map(formatStableFarm)

  const stableFarmsDataMap = stableFarms.reduce<Record<number, FormatStableFarmResponse>>((map, farm, index) => {
    return {
      ...map,
      [farm.pid]: stableFarmsData[index],
    }
  }, {})

  const lpData = lpDataResults.map(formatClassicFarmResponse)
  const farmsData = farms.map((farm, index) => {
    try {
      return {
        ...farm,
        ...getClassicFarmsDynamicData({
          ...lpData[index],
          ...stableFarmsDataMap[farm.pid],
          token0Decimals: farm.token.decimals,
          token1Decimals: farm.quoteToken.decimals,
        }),
        ...getFarmAllocation({
          rewardPerBlock: poolInfos[index]?.rewardPerBlock,
          vestingTime: poolInfos[index]?.vestingTime,
          stakedAmount: poolInfos[index]?.stakedAmount.toString(),
        }),
      }
    } catch (error) {
      console.error(error, farm, index, {
        rewardPerBlock: poolInfos[index]?.allocPoint,
        vestingTime: poolInfos[index]?.isRegular,
        token0Decimals: farm.token.decimals,
        token1Decimals: farm.quoteToken.decimals,
        stakedAmount: poolInfos[index]?.stakedAmount.toNumber(),
      })
      throw error
    }
  })
  const farmsDataWithPrices = getFarmsPrices(farmsData, chainId)
  return farmsDataWithPrices
}

const GameBlockStakingAbi = [
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'poolInfo',
    outputs: [
      {
        internalType: 'contract IERC20Upgradeable',
        name: 'lpToken',
        type: 'address',
      },
      {
        internalType: 'contract IERC20Upgradeable',
        name: 'rewardToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'lastRewardBlock',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'accRewardPerShare',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'rewardPerBlock',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'vestingTime',
        type: 'uint256',
      },
      {
        type: 'uint256',
        name: 'stakedAmount',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolLength',
    outputs: [{ internalType: 'uint256', name: 'pools', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalRegularAllocPoint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSpecialAllocPoint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bool', name: '_isRegular', type: 'bool' }],
    name: 'cakePerBlock',
    outputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const masterChefFarmCalls = (farm: SerializedFarmConfig, masterChefAddress: string) => {
  const { pid } = farm

  return pid || pid === 0
    ? {
        address: masterChefAddress,
        name: 'poolInfo',
        params: [pid],
      }
    : null
}

export const fetchMasterChefData = async (
  farms: SerializedFarmConfig[],
  multicallv2: MultiCallV2,
  masterChefAddress: string,
): Promise<any[]> => {
  try {
    const masterChefCalls = farms.map((farm) => masterChefFarmCalls(farm, masterChefAddress))
    const masterChefAggregatedCalls = masterChefCalls.filter((masterChefCall) => masterChefCall !== null)

    const masterChefMultiCallResult = await multicallv2({
      abi: GameBlockStakingAbi,
      calls: masterChefAggregatedCalls,
      chainId: ChainId.ETHEREUM,
    })

    let masterChefChunkedResultCounter = 0
    return masterChefCalls.map((masterChefCall) => {
      if (masterChefCall === null) {
        return null
      }
      const data = masterChefMultiCallResult[masterChefChunkedResultCounter]
      masterChefChunkedResultCounter++
      return data
    })
  } catch (error) {
    console.error('MasterChef Pool info data error', error)
    throw error
  }
}

export const fetchMasterChefV2Data = async ({
  isTestnet,
  multicallv2,
  masterChefAddress,
}: {
  isTestnet: boolean
  multicallv2: MultiCallV2
  masterChefAddress: string
}) => {
  try {
    const [[poolLength], [totalRegularAllocPoint], [totalSpecialAllocPoint], [cakePerBlock]] = await multicallv2<
      [[BigNumber], [BigNumber], [BigNumber], [BigNumber]]
    >({
      abi: GameBlockStakingAbi,
      calls: [
        {
          address: masterChefAddress,
          name: 'poolLength',
        },
        {
          address: masterChefAddress,
          name: 'totalRegularAllocPoint',
        },
        {
          address: masterChefAddress,
          name: 'totalSpecialAllocPoint',
        },
        {
          address: masterChefAddress,
          name: 'cakePerBlock',
          params: [true],
        },
      ],
      chainId: ChainId.BSC,
    })

    return {
      poolLength,
      totalRegularAllocPoint,
      totalSpecialAllocPoint,
      cakePerBlock,
    }
  } catch (error) {
    console.error('Get MasterChef data error', error)
    throw error
  }
}

export const fetchGameBlockStakingData = async ({
  multicallv2,
  masterChefAddress,
}: {
  multicallv2: MultiCallV2
  masterChefAddress: string
}) => {
  try {
    const [[poolLength]] = await multicallv2<[[BigNumber]]>({
      abi: GameBlockStakingAbi,
      calls: [
        {
          address: masterChefAddress,
          name: 'poolLength',
        },
      ],
      chainId: ChainId.ETHEREUM,
    })
    return {
      poolLength,
    }
  } catch (error) {
    console.error('Get MasterChef data error', error)
    throw error
  }
}

type StableLpData = [balanceResponse, balanceResponse, balanceResponse, balanceResponse]

type FormatStableFarmResponse = {
  tokenBalanceLP: FixedNumber
  quoteTokenBalanceLP: FixedNumber
  price1: BigNumber
}

const formatStableFarm = (stableFarmData: StableLpData): FormatStableFarmResponse => {
  const [balance1, balance2, _, _price1] = stableFarmData
  return {
    tokenBalanceLP: FixedNumber.from(balance1[0]),
    quoteTokenBalanceLP: FixedNumber.from(balance2[0]),
    price1: _price1[0],
  }
}

type balanceResponse = [BigNumber]
type decimalsResponse = [number]

export type ClassicLPData = [
  balanceResponse,
  balanceResponse,
  balanceResponse,
  balanceResponse,
  decimalsResponse,
  decimalsResponse,
]

type FormatClassicFarmResponse = {
  tokenBalanceLP: FixedNumber
  quoteTokenBalanceLP: FixedNumber
  lpTokenBalanceMC: FixedNumber
  lpTotalSupply: FixedNumber
}

const formatClassicFarmResponse = (farmData: ClassicLPData): FormatClassicFarmResponse => {
  const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply] = farmData
  return {
    tokenBalanceLP: FixedNumber.from(tokenBalanceLP[0]),
    quoteTokenBalanceLP: FixedNumber.from(quoteTokenBalanceLP[0]),
    lpTokenBalanceMC: FixedNumber.from(lpTokenBalanceMC[0]),
    lpTotalSupply: FixedNumber.from(lpTotalSupply[0]),
  }
}

interface FarmAllocationParams {
  rewardPerBlock?: BigNumber
  vestingTime?: BigNumber
  stakedAmount?: number
}

const getFarmAllocation = ({ rewardPerBlock, vestingTime, stakedAmount }: FarmAllocationParams) => {
  const _rewardPerBlock = rewardPerBlock ? FixedNumber.from(rewardPerBlock) : FIXED_ZERO
  const _vestingTime = vestingTime ? FixedNumber.from(vestingTime) : FIXED_ZERO
  return {
    rewardPerBlock: _rewardPerBlock.toString(),
    vestingTime: _vestingTime.toString(),
    stakedAmount: stakedAmount,
  }
}

const getClassicFarmsDynamicData = ({
  lpTokenBalanceMC,
  lpTotalSupply,
  quoteTokenBalanceLP,
  tokenBalanceLP,
  token0Decimals,
  token1Decimals,
}: FormatClassicFarmResponse & {
  token0Decimals: number
  token1Decimals: number
}) => {
  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = getTokenAmount(tokenBalanceLP, token0Decimals)
  const quoteTokenAmountTotal = getTokenAmount(quoteTokenBalanceLP, token1Decimals)

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio =
    !lpTotalSupply.isZero() && !lpTokenBalanceMC.isZero() ? lpTokenBalanceMC.divUnsafe(lpTotalSupply) : FIXED_ZERO

  // // Amount of quoteToken in the LP that are staked in the MC
  const quoteTokenAmountMcFixed = quoteTokenAmountTotal.mulUnsafe(lpTokenRatio)

  // // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMcFixed.mulUnsafe(FIXED_TWO)
  return {
    tokenAmountTotal: tokenAmountTotal.toString(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toString(),
    lpTotalSupply: lpTotalSupply.toString(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toString(),
    tokenPriceVsQuote:
      !quoteTokenAmountTotal.isZero() && !tokenAmountTotal.isZero()
        ? quoteTokenAmountTotal.divUnsafe(tokenAmountTotal).toString()
        : FIXED_ZERO.toString(),
  }
}
