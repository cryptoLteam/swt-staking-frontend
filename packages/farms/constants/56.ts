import { bscTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    vaultPid: 1,
    lpSymbol: 'GBLOCK-BNB LP',
    lpAddress: '0x3E945675b40dC231630F550c7653994Fcf87B469',
    quoteToken: bscTokens.wbnb,
    token: bscTokens.gblock,
  },
  {
    pid: 1,
    vaultPid: 2,
    lpSymbol: 'GBLOCK-BNB LP',
    lpAddress: '0x3E945675b40dC231630F550c7653994Fcf87B469',
    quoteToken: bscTokens.wbnb,
    token: bscTokens.gblock,
  },
  {
    pid: 2,
    vaultPid: 3,
    lpSymbol: 'GBLOCK-BNB LP',
    lpAddress: '0x3E945675b40dC231630F550c7653994Fcf87B469',
    quoteToken: bscTokens.wbnb,
    token: bscTokens.gblock,
  },
  {
    pid: 3,
    vaultPid: 4,
    lpSymbol: 'GBLOCK - Single Token',
    lpAddress: '0x43b687c6F2f2cAAcab5E9604e37Ac662954BAC4c',
    quoteToken: bscTokens.gblock,
    token: bscTokens.gblock,
  },
  {
    pid: 4,
    vaultPid: 5,
    lpSymbol: 'GBLOCK - Single Token',
    lpAddress: '0x43b687c6F2f2cAAcab5E9604e37Ac662954BAC4c',
    quoteToken: bscTokens.gblock,
    token: bscTokens.gblock,
  },
  {
    pid: 5,
    vaultPid: 6,
    lpSymbol: 'GBLOCK - Single Token',
    lpAddress: '0x43b687c6F2f2cAAcab5E9604e37Ac662954BAC4c',
    quoteToken: bscTokens.gblock,
    token: bscTokens.gblock,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
