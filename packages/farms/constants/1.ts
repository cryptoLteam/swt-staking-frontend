import { ethereumTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    vaultPid: 1,
    lpSymbol: 'ETH-SWT LP',
    lpAddress: '0xb88b6E458ebF5F6e0A3Ac8E21D8e588bCae79C17',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.gblock,
  },
  {
    pid: 1,
    vaultPid: 2,
    lpSymbol: 'ETH-SWT LP',
    lpAddress: '0xb88b6E458ebF5F6e0A3Ac8E21D8e588bCae79C17',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.gblock,
  },
  {
    pid: 2,
    vaultPid: 3,
    lpSymbol: 'ETH-SWT LP',
    lpAddress: '0xb88b6E458ebF5F6e0A3Ac8E21D8e588bCae79C17',
    quoteToken: ethereumTokens.weth,
    token: ethereumTokens.gblock,
  },
  // {
  //   pid: 125,
  //   vaultPid: 2,
  //   lpSymbol: 'ETH-USDT LP',
  //   lpAddress: '0x17C1Ae82D99379240059940093762c5e4539aba5',
  //   quoteToken: ethereumTokens.weth,
  //   token: ethereumTokens.usdt,
  // },
  // {
  //   pid: 126,
  //   vaultPid: 3,
  //   lpSymbol: 'WBTC-ETH LP',
  //   lpAddress: '0x4AB6702B3Ed3877e9b1f203f90cbEF13d663B0e8',
  //   quoteToken: ethereumTokens.weth,
  //   token: ethereumTokens.wbtc,
  // },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
