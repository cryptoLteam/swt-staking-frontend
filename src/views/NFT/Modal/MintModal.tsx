import { parseUnits } from '@ethersproject/units'
import { ChainId } from '@pancakeswap/sdk'
import { GBLOCK } from '@pancakeswap/tokens'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useContract, useTokenContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import styled from 'styled-components'
import { InjectedModalProps, useToast, Modal } from '@pancakeswap/uikit'
import ApproveAndConfirmStage from '../components/BuySellModals/shared/ApproveAndConfirmStage'
import ConfirmStage from '../components/BuySellModals/shared/ConfirmStage'

import { NftContractInfo } from '../contractInfo/nftContractABI'
import { useNFTContract } from '../hook'

const StyledModal = styled(Modal)`
  & > div:last-child {
    padding: 0;
  }
`

interface MintModalProps extends InjectedModalProps {
  id: number
}

const MintModal: React.FC<React.PropsWithChildren<MintModalProps>> = ({ id, onDismiss }) => {
  const { toastSuccess, toastWarning } = useToast()
  const gblockContract = useTokenContract(GBLOCK[ChainId.BSC].address, true)
  const [mintAmount, setMintAmount] = useState(1)
  const { theme } = useTheme()

  const { mintPrice, allowance } = useNFTContract({ id })
  const numberAllowance = allowance === undefined ? 0 : Number(allowance[0].toString())

  const mintType = true

  const nftContract = useContract(NftContractInfo.address, NftContractInfo.abi, true)

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return true
    },
    onApprove: () => {
      return gblockContract.approve(NftContractInfo.address, parseUnits('2000000000', 18), { gasLimit: 500000 })
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        'Contract approved - you can now buy NFT with GBLOCK!',
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => {
      return nftContract.mint(mintAmount, id, {
        gasLimit: 500000,
        value: 0,
      })
    },
    onSuccess: ({ receipt }) => {
      toastSuccess('Your NFT has been sent to your wallet', <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDismiss()
    },
  })

  const handleMint = () => {
    if (mintAmount < 1 || mintAmount > 5) {
      toastWarning('Input mint amount correctly. Mint amount must be between 1 and 5.')
      return true
    }

    return handleConfirm()
  }

  return (
    <StyledModal title={'Mint NFT'} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
      {numberAllowance === 0 && (
        <ApproveAndConfirmStage
          variant="Mint"
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
          mintAmount={mintAmount}
          setMint={setMintAmount}
        />
      )}
      {numberAllowance !== 0 && (
        <ConfirmStage
          isConfirming={isConfirming}
          handleConfirm={handleMint}
          mintAmount={mintAmount}
          setMint={setMintAmount}
          mintType={mintType}
        />
      )}
    </StyledModal>
  )
}

export default MintModal
