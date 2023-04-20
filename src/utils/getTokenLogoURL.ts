import { ChainId, Token } from '@pancakeswap/sdk'

const mapping = {
  [ChainId.BSC]: 'smartchain',
}

const getTokenLogoURL = (token?: Token) => {
  if (token && token.chainId) {
    return `/images/tokens/${token.chainId}/${token.address}.png`
  }
  return null
}

export default getTokenLogoURL
