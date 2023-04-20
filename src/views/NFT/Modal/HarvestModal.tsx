import { useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import useTheme from 'hooks/useTheme'
import { useContract } from 'hooks/useContract'
import ConfirmStage from '../components/BuySellModals/shared/ConfirmStage'
import styled from 'styled-components'

import { Modal } from '@pancakeswap/uikit'
import { StakingContractInfo } from '../contractInfo/nftContractABI'

const StyledModal = styled(Modal)`
  & > div:last-child {
    padding: 0;
  }
`

interface HarvestModalProps extends InjectedModalProps {
  id: number
  setReward: any
}

const HarvestModal: React.FC<React.PropsWithChildren<HarvestModalProps>> = ({ id, setReward, onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const { account, chainId } = useActiveWeb3React()

  const { toastSuccess } = useToast()

  const stakingContract = useContract(StakingContractInfo.address[Number(id)], StakingContractInfo.abi, true)
  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return true
    },
    onApprove: () => {
      return null
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        'Contract approved - you can now buy NFT with GBLOCK!',
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: async () => {
      return await stakingContract.harvest(account, { gasLimit: 500000 })
    },
    onSuccess: async ({ receipt }) => {
      setReward(0)
      toastSuccess(
        t('Your NFT has been sent to your wallet'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
      onDismiss()
    },
  })

  const goBack = () => {}

  return (
    <StyledModal title={'Harvest'} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
      <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />
    </StyledModal>
  )
}

export default HarvestModal
