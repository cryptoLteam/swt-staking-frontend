import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import ApproveAndConfirmStage from '../components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from '../components/BuySellModals/shared/ConfirmStage'
import styled from 'styled-components'

import { Modal } from '@pancakeswap/uikit'
import { NftContractInfo, StakingContractInfo } from '../contractInfo/nftContractABI'
import { useNFTContract } from '../hook'
import { useAccount } from 'wagmi'

const StyledModal = styled(Modal)`
  & > div:last-child {
    padding: 0;
  }
`

interface FarmModalProps extends InjectedModalProps {
  id: number
  mintId: string
}

// NFT WBNB in testnet contract is different
const TESTNET_WBNB_NFT_ADDRESS = '0x094616f0bdfb0b526bd735bf66eca0ad254ca81f'

const FarmModal: React.FC<React.PropsWithChildren<FarmModalProps>> = ({ id, mintId, onDismiss }) => {
  const { address: account } = useAccount()
  const { theme } = useTheme()
  const { toastSuccess } = useToast()

  const nftContract = useContract(NftContractInfo.address, NftContractInfo.abi, true)
  const stakingContract = useContract(StakingContractInfo.address[Number(id)], StakingContractInfo.abi, true)

  //   const id = 1;

  const { isApprovedForAll } = useNFTContract({ id })

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return true
    },
    onApprove: () => {
      return nftContract.setApprovalForAll(StakingContractInfo.address[Number(id)], true, { gasLimit: 500000 })
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        'Contract approved - you can now stake NFT!',
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: async () => {
      return stakingContract.deposit(mintId, account, { gasLimit: 500000 })
    },
    onSuccess: async ({ receipt }) => {
      toastSuccess('You staked NFT successfully', <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDismiss()
    },
  })

  return (
    <StyledModal title={'Farm NFT'} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
      {!isApprovedForAll && (
        <ApproveAndConfirmStage
          variant="sell"
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
        />
      )}
      {isApprovedForAll && <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />}
    </StyledModal>
  )
}

export default FarmModal
