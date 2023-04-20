import { ChainId, WETH9 } from '@pancakeswap/sdk'
import { GBLOCK_ETHEREUM, USDC, USDT, WBTC_ETH } from '@pancakeswap/tokens'

export const ethereumTokens = {
  weth: WETH9[ChainId.ETHEREUM],
  usdt: USDT[ChainId.ETHEREUM],
  usdc: USDC[ChainId.ETHEREUM],
  wbtc: WBTC_ETH,
  gblock: GBLOCK_ETHEREUM
}
