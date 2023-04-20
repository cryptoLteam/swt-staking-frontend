import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'

interface SwapCommitButtonPropsType {
  account: string
  showWrap: boolean
  wrapInputError: string
  onWrap: () => Promise<void>
}

export default function SwapCommitButton({ account, showWrap, wrapInputError, onWrap }: SwapCommitButtonPropsType) {
  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  if (showWrap) {
    return (
      <CommitButton width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
        Wrap
      </CommitButton>
    )
  }
}
