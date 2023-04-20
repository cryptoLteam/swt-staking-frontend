import { infoClient, infoClientETH, infoStableSwapClient } from 'utils/graphql'
import { INFO_CLIENT, INFO_CLIENT_ETH, BLOCKS_CLIENT, BLOCKS_CLIENT_ETH } from 'config/constants/endpoints'
import { ChainId } from '@pancakeswap/sdk'
import { PCS_V2_START, PCS_ETH_START, ETH_TOKEN_BLACKLIST, TOKEN_BLACKLIST } from 'config/constants/info'

export type MultiChainName = 'BSC'

export const multiChainQueryMainToken = {
  BSC: 'BNB',
}

export const multiChainBlocksClient = {
  BSC: BLOCKS_CLIENT,
}

export const multiChainStartTime = {
  BSC: PCS_V2_START,
}

export const multiChainId = {
  BSC: ChainId.BSC,
}

export const multiChainPaths = {
  [ChainId.BSC]: '',
}

export const multiChainQueryClient = {
  BSC: infoClient,
}

export const multiChainQueryEndPoint = {
  BSC: INFO_CLIENT,
}

export const multiChainScan = {
  BSC: 'BscScan',
}

export const multiChainTokenBlackList = {
  BSC: TOKEN_BLACKLIST,
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainName) => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
