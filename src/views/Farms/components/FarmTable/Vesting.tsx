import styled from 'styled-components'
import { Skeleton } from '@pancakeswap/uikit'

export interface VestingProps {
  vesting: number
}

interface VestingPropsWithLoading extends VestingProps {
  userDataReady: boolean
}

const Amount = styled.span<{ vesting: number }>`
  color: ${({ vesting, theme }) => (vesting ? theme.colors.text : theme.colors.textDisabled)};
  display: flex;
  align-items: center;
`

const Vesting: React.FunctionComponent<React.PropsWithChildren<VestingPropsWithLoading>> = ({
  vesting,
  userDataReady,
}) => {
  if (userDataReady) {
    return <Amount vesting={vesting}>{vesting}</Amount>
  }
  return (
    <Amount vesting={0}>
      <Skeleton width={60} />
    </Amount>
  )
}

export default Vesting
