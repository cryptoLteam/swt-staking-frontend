import { useEffect, useState, createElement, useRef } from 'react'
import styled from 'styled-components'
import { Box, Flex, useMatchBreakpoints, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useFarmUser } from 'state/farms/hooks'

import { FarmAuctionTag, CoreTag } from 'components/Tags'
import Apr, { AprProps } from './Apr'
import Farm, { FarmProps } from './Farm'

import Earned, { EarnedProps } from './Earned'
import Details from './Details'
import Vesting, { VestingProps } from './Vesting'
import ActionPanel from './Actions/ActionPanel'
import CellLayout from './CellLayout'
import { DesktopColumnSchema, MobileColumnSchema, FarmWithStakedValue } from '../types'

export interface RowProps {
  apr: AprProps
  farm: FarmProps
  earned: EarnedProps
  vesting: VestingProps
  details: FarmWithStakedValue
  type: 'core' | 'community'
  initialActivity?: boolean
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean
}

const cells = {
  apr: Apr,
  farm: Farm,
  earned: Earned,
  details: Details,
  vesting: Vesting,
}

const CellInner = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 24px 0px;
`

const StyledTr = styled.tr`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.backgroundAlt2};
  }
  & > td:first-child {
    min-width: 200px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const MobileDivCell = styled.div`
  padding: 5px 16px;
`

const FarmMobileCell = styled.td`
  padding: 16px;
`

const Row: React.FunctionComponent<React.PropsWithChildren<RowPropsWithLoading>> = (props) => {
  const { details, initialActivity, userDataReady } = props
  const hasSetInitialValue = useRef(false)
  const hasStakedAmount = !!useFarmUser(details.pid).stakedBalance.toNumber()
  const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount)
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300)
  const { t } = useTranslation()

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded)
  }

  useEffect(() => {
    setActionPanelExpanded(hasStakedAmount)
  }, [hasStakedAmount])
  useEffect(() => {
    if (initialActivity && hasSetInitialValue.current === false) {
      setActionPanelExpanded(initialActivity)
      hasSetInitialValue.current = true
    }
  }, [initialActivity])

  const { isDesktop, isMobile } = useMatchBreakpoints()

  const isSmallerScreen = !isDesktop
  const tableSchema = isSmallerScreen ? MobileColumnSchema : DesktopColumnSchema
  const columnNames = tableSchema.map((column) => column.name)

  const handleRenderRow = () => {
    if (!isMobile) {
      return (
        <StyledTr onClick={toggleActionPanel}>
          {Object.keys(props).map((key) => {
            const columnIndex = columnNames.indexOf(key)
            if (columnIndex === -1) {
              return null
            }
            switch (key) {
              case 'apr':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('APY')}>
                        <Apr
                          {...props.apr}
                          hideButton={isSmallerScreen}
                          strikethrough={props?.details?.boosted}
                          boosted={props?.details?.boosted}
                          originalValue={props?.details?.rewardsApy}
                        />
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              case 'vesting':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t('Vesting')}>
                        {isNaN(props.vesting.vesting) ? 'None' : (props.vesting.vesting / 2592000).toFixed(0) + ' Months'}
                      </CellLayout>
                    </CellInner>
                  </td>
                )
              default:
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout label={t(tableSchema[columnIndex].label)}>
                        {createElement(cells[key], { ...props[key], userDataReady })}
                      </CellLayout>
                    </CellInner>
                  </td>
                )
            }
          })}
        </StyledTr>
      )
    }

    return (
      <>
        <tr style={{ cursor: 'pointer' }} onClick={toggleActionPanel}>
          <FarmMobileCell colSpan={3}>
            <Flex justifyContent="space-between" alignItems="center">
              <Farm {...props.farm} />
            </Flex>
          </FarmMobileCell>
        </tr>
        <StyledTr onClick={toggleActionPanel}>
          <td width="100%">
            <MobileDivCell>
              <CellLayout label={t('Earned')}>
                <Earned {...props.earned} userDataReady={userDataReady} />
              </CellLayout>
            </MobileDivCell>
          </td>
          <td width="100%">
            <MobileDivCell>
              <CellLayout label={t('APR')}>
                <Apr
                  {...props.apr}
                  hideButton
                  strikethrough={props?.details?.boosted}
                  boosted={props?.details?.boosted}
                  originalValue={props?.details?.rewardsApy}
                />
              </CellLayout>
            </MobileDivCell>
          </td>
          <td width="100%">
            <MobileDivCell>
              <CellLayout label={t('Vesting')}>
                {isNaN(props.vesting.vesting) ? 'None' : (props.vesting.vesting / 2592000).toFixed(0) + 'Hours'}
              </CellLayout>
            </MobileDivCell>
          </td>
          <td width="100%">
            <CellInner>
              <Details actionPanelToggled={actionPanelExpanded} />
            </CellInner>
          </td>
        </StyledTr>
      </>
    )
  }

  return (
    <>
      {handleRenderRow()}
      {shouldRenderChild && (
        <tr>
          <td colSpan={7}>
            <ActionPanel {...props} expanded={actionPanelExpanded} />
          </td>
        </tr>
      )}
    </>
  )
}

export default Row
