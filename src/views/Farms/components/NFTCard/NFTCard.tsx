import NextLink from 'next/link'
import { Heading } from '@pancakeswap/uikit'
import { useRewardPercent, useNFTContract } from '../../../NFT/hook'
import styled from 'styled-components'

const StyledCard = styled.div`
  align-self: baseline;
  max-width: 100%;
  margin: 0 0 24px 0;
  cursor: pointer;
  padding: 0px;
  background: ${({ theme }) => theme.card.background};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  width: 100%;

  &:hover {
    transform: scale(1.05);
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 350px;
  }
`

const CardImage = styled.div`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const CardDetail = styled.div`
  color: green;
  padding: 0px 16px 16px 16px;
`

const CardDetailContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
`

const APRContainer = styled.div`
  border-radius: 4px;
  padding 10px 10px;
  color: black;
  font-size: 12px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.primary};
`

interface NFTCardProps {
  id: number
  cardImage: string
  cardName: string
}

const NFTCard: React.FC<React.PropsWithChildren<NFTCardProps>> = ({ id, cardImage, cardName }) => {
  const { APR } = useRewardPercent({ id })
  const { mintPrice, maxMintAmount, curMintAmount } = useNFTContract({ id })

  return (
    <NextLink href={`/nft?id=${id}`}>
      <StyledCard>
        <CardImage>
          <img src={cardImage} />
        </CardImage>
        <CardDetail>
          <Heading color="primary" style={{ paddingBottom: '8px', paddingTop: '16px' }}>
            {cardName}
          </Heading>

          <CardDetailContainer>
            <div>
              <p style={{ color: '#fff' }}>{mintPrice} GBLOCK</p>
              <p style={{ paddingTop: '15px', color: 'grey' }}>
                {curMintAmount}/{maxMintAmount} editions
              </p>
            </div>
            <div>
              <APRContainer>{APR}% APR</APRContainer>
            </div>
          </CardDetailContainer>
        </CardDetail>
      </StyledCard>
    </NextLink>
  )
}

export default NFTCard
