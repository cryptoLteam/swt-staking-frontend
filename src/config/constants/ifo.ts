import { Token, ChainId } from '@pancakeswap/sdk'
import { GBLOCK_BNB_LP_MAINNET } from './lp'
import { Ifo } from './types'

export const cakeBnbLpToken = new Token(ChainId.BSC, GBLOCK_BNB_LP_MAINNET, 18, 'GBLOCK-BNB LP')

const ifos: Ifo[] = []

export default ifos
