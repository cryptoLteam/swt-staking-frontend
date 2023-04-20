import { useModal } from '@pancakeswap/uikit'
import { Heading, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import FarmModal from './FarmModal'

const StyledCard = styled.div`
  align-self: baseline;
  max-width: 100%;
  &:hover {
    transform: translateY(-2px);
    transform: scale(1.1);
  }

  cursor: pointer;

  padding: 16px;
  border: 1px solid rgba(255, 0, 204, 0.2);
  border-radius: 16px;
  width: 100%;
  text-align: center;
`

const CardImage = styled.div`
  margin: auto;
  width: 120px;
`

const CardDetail = styled.div`
  color: green;
`

interface FarmNFTCardProps {
  id: number
  mintId: string
  cardImage: string
  cardName: string
  show?: boolean
}

const FarmNFTCard = ({ id, mintId, cardImage, cardName, show }: FarmNFTCardProps) => {
  const [onFarmModalHandler] = useModal(<FarmModal id={id} mintId={mintId} />)

  return (
    <StyledCard onClick={onFarmModalHandler} style={{ pointerEvents: show ? 'none' : 'auto' }}>
      <CardImage>
        <img src={cardImage} style={{ borderRadius: '16px' }} />
      </CardImage>
      <CardDetail>
        <Text color="white" style={{ paddingBottom: '4px', paddingTop: '4px' }}>
          #{mintId}
        </Text>
        <Heading color="white" style={{ paddingBottom: '4px', paddingTop: '4px' }}>
          {cardName}
        </Heading>
      </CardDetail>
    </StyledCard>
  )
}

export default FarmNFTCard
