import { useTranslation } from '@pancakeswap/localization'
import { CardsLayout, InjectedModalProps, Text } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'

import { Modal } from '@pancakeswap/uikit'
import { useStakingContract } from '../hook'
import FarmNFTCard from './FarmNFTCard'

const StyledModal = styled(Modal)`
  & > div:last-child {
    padding: 0;
  }
`

interface StakedModalProps extends InjectedModalProps {
  id: number
  img: string
  name: string
}

const StakedModal: React.FC<React.PropsWithChildren<StakedModalProps>> = ({ id, img, name, onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const { stakedNftIDs } = useStakingContract({ id })

  return (
    <StyledModal title={'Staked NFTs'} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
      {stakedNftIDs[0].length > 0 ? (
        <CardsLayout style={{ padding: '8px', maxHeight: '60vh' }}>
          {stakedNftIDs[0].map((value, index) => (
            <div key={value}>
              <FarmNFTCard id={id} mintId={value.toString()} cardImage={img} cardName={name} show={true} />
            </div>
          ))}
        </CardsLayout>
      ) : (
        <Text my="30px" style={{ textAlign: 'center', width: '100%' }}>
          There is no staked NFT.
        </Text>
      )}
    </StyledModal>
  )
}

export default StakedModal
