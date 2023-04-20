import { goerliTestnetTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 1,
    vaultPid: 1,
    lpSymbol: 'GBLOCK-WETH LP',
    lpAddress: '0x18F731ED3cF9F9b036b9611d0bac7D5A69A4B9d7',
    quoteToken: goerliTestnetTokens.weth,
    token: goerliTestnetTokens.gblock,
  },
  // {
  //   pid: 0,
  //   vaultPid: 1,
  //   lpSymbol: 'USDT-WETH LP',
  //   lpAddress: '0xfcB32e1C4A4F1C820c9304B5CFfEDfB91aE2321C',
  //   quoteToken: goerliTestnetTokens.weth,
  //   token: goerliTestnetTokens.usdt,
  // },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
