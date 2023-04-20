import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'

const StyledFlex = styled(Flex)`
  flex-direction: row;
  align-items: end;
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: column;
    align-items: start;
  }
`

const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
  text-align: left;
`

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 15px;
  font-weight: 600;
`

interface CellLayoutProps {
  label?: string
}

const CellLayout: React.FC<React.PropsWithChildren<CellLayoutProps>> = ({ label = '', children }) => {
  return (
    <StyledFlex>
      {label && <Label>{label}</Label>}
      <ContentContainer>{children}</ContentContainer>
    </StyledFlex>
  )
}

export default CellLayout
