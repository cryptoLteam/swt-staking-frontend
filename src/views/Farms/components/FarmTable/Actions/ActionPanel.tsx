import { useEffect, useState } from 'react'
import { SWAP_URL } from '../../../../../config'
import { useTranslation } from '@pancakeswap/localization'
import { LinkExternal, Text } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import styled, { css, keyframes } from 'styled-components'
import { BigNumber } from 'bignumber.js'
import { getBlockExploreLink } from 'utils'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getLpContract } from 'utils/contractHelpers'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useMasterchef } from 'hooks/useContract'
import { FarmWithStakedValue } from '../../types'
import Balance from 'components/Balance'

import { AprProps } from '../Apr'
import { HarvestAction, HarvestActionContainer } from './HarvestAction'
import StakedAction, { StakedContainer } from './StakedAction'

export interface ActionPanelProps {
  apr: AprProps
  details: FarmWithStakedValue
  userDataReady: boolean
  expanded: boolean
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 0px;
  }
`

const Container = styled.div<{ expanded }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  // background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  padding: 24px;
  gap: 20px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    align-items: center;
    padding: 16px 32px;
  }
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textDisabled};
`

const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 13px;
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
    flex-wrap: wrap;
  }
`

const InfoContainer = styled.div`
  min-width: 100px;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 200px;
  }
`

const ValueContainer = styled.div``

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
`

const ActionPanel: React.FunctionComponent<React.PropsWithChildren<ActionPanelProps>> = ({
  details,
  apr,
  userDataReady,
  expanded,
}) => {
  const { chainId, account } = useActiveWeb3React()

  const farm = details

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const isActive = farm.multiplier !== '0X'
  const { quoteToken, token } = farm
  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
    chainId,
  })

  const { lpAddress } = farm
  const scanUrl = getBlockExploreLink(lpAddress, 'address', chainId)

  const stakedAmount = new BigNumber(farm.stakedAmount)

  const totalLiquidity = stakedAmount
    .times(farm.lpTokenPrice)
    .div(10 ** 18)
    .toString()

  const tokenStaked = stakedAmount.div(farm.lpTotalSupply).times(farm.tokenAmountTotal).toString()
  const quotedTokenStaked = stakedAmount.div(farm.lpTotalSupply).times(farm.quoteTokenAmountTotal).toString()

  return (
    <Container expanded={expanded}>
      <ActionContainer>
        <StakedContainer {...farm} userDataReady={userDataReady} lpLabel={lpLabel} displayApr={apr.value}>
          {(props) => <StakedAction {...props} />}
        </StakedContainer>
        <HarvestActionContainer {...farm} userDataReady={userDataReady}>
          {(props) => <HarvestAction {...props} />}
        </HarvestActionContainer>
      </ActionContainer>
      <InfoContainer>
        <ValueContainer>
          <ValueWrapper>
            <StyledText>{t('Liquidity')}</StyledText>
            <Balance fontSize="12px" color="white" decimals={3} value={totalLiquidity} unit={` $`} />
          </ValueWrapper>
          <ValueWrapper>
            <StyledText>{`${farm.quoteToken.symbol} Staked`}</StyledText>
            <Balance
              fontSize="12px"
              color="white"
              decimals={3}
              value={farm.quoteToken.address !== farm.token.address ? quotedTokenStaked : stakedAmount.div(10 ** 18)}
              unit={` ${farm.quoteToken.symbol}`}
            />
          </ValueWrapper>
          {farm.quoteToken.address !== farm.token.address && (
            <ValueWrapper>
              <StyledText>{`${farm.token.symbol} Staked`}</StyledText>
              <Balance fontSize="12px" color="white" decimals={3} value={tokenStaked} unit={` ${farm.token.symbol}`} />
            </ValueWrapper>
          )}
          <ValueWrapper>
            <StyledText>{t('APR')}</StyledText>
            <Balance fontSize="12px" color="white" decimals={2} value={details.apr} unit={` %`} />
          </ValueWrapper>
        </ValueContainer>
        {isActive && farm.quoteToken.address !== farm.token.address && (
          <StakeContainer>
            <StyledLinkExternal href={SWAP_URL + `add/${liquidityUrlPathParts}`}>
              {t('Get %symbol%', { symbol: lpLabel })}
            </StyledLinkExternal>
          </StakeContainer>
        )}
        <StyledLinkExternal href={scanUrl}>{t('View Contract')}</StyledLinkExternal>
      </InfoContainer>
    </Container>
  )
}

export default ActionPanel
