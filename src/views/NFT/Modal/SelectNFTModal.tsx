import { CardsLayout, InjectedModalProps, useToast } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'

import { Modal } from '@pancakeswap/uikit'
import { useNFTContract } from '../hook'
import FarmNFTCard from './FarmNFTCard'

const StyledModal = styled(Modal)`
  & > div:last-child {
    padding: 0;
  }
`

interface SelectNFTModalProps extends InjectedModalProps {
  id: number
  img: string
  name: string
}

const SelectNFTModal: React.FC<React.PropsWithChildren<SelectNFTModalProps>> = ({ id, img, name, onDismiss }) => {
  const { theme } = useTheme()
  const PRECISION = 1000000

  const { tokensOfHolder } = useNFTContract({ id })

  return (
    <StyledModal
      title={'Select NFT you want to stake'}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradientCardHeader}
    >
      <CardsLayout style={{ padding: '20px', maxHeight: '60vh' }}>
        {tokensOfHolder[0].map((value, index) => (
          <div key={value} style={{ display: Math.floor(value / PRECISION) == id ? 'block' : 'none' }}>
            <FarmNFTCard id={id} mintId={value.toString()} cardImage={img} cardName={name} />
          </div>
        ))}
      </CardsLayout>
    </StyledModal>
  )
}

export default SelectNFTModal
