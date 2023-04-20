import { useState } from 'react'
import { Modal, ModalBody } from '@pancakeswap/uikit'
import { InjectedModalProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import SwapForm from '../../Swap/components/SwapForm'

interface SwapModalProps extends InjectedModalProps {}

const SwapModal: React.FC<React.PropsWithChildren<SwapModalProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Buy GBLOCK')} onDismiss={onDismiss}>
      <ModalBody width={['100%', '100%', '100%', '420px']}>
        <SwapForm onDismiss={onDismiss} />
      </ModalBody>
    </Modal>
  )
}

export default SwapModal
