import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

export interface AprProps {
  value: string
  multiplier: string
  pid: number
  lpLabel: string
  lpSymbol: string
  rewardsApy: number
  lpTokenPrice: BigNumber
  tokenAddress?: string
  quoteTokenAddress?: string
  cakePrice: BigNumber
  originalValue: number
  liquidity: number
  hideButton?: boolean
  strikethrough?: boolean
  useTooltipText?: boolean
  boosted?: boolean
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSubtle};

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`

const AprWrapper = styled.div`
  text-align: left;
  font-size: 15px;
  font-weight: 600;
`

const Apr: React.FC<React.PropsWithChildren<AprProps>> = ({ tokenAddress, quoteTokenAddress, originalValue }) => {
  return (
    <Container>
      <AprWrapper>{originalValue === undefined ? 0 : originalValue.toFixed(2)}%</AprWrapper>
    </Container>
  )
}

export default Apr
