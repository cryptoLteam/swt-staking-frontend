import { Flex, Text, Button, Spinner, Input } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

interface ConfirmStageProps {
  isConfirming: boolean
  handleConfirm: () => void
  mintAmount?: number
  setMint?: any
  mintType?: boolean
}

// Buy Flow:
// Shown in case user wants to pay with BNB
// or if user wants to pay with WBNB and it is already approved
// Sell Flow:
// Shown if user adjusts the price or removes NFT from the market
const ConfirmStage: React.FC<React.PropsWithChildren<ConfirmStageProps>> = ({
  isConfirming,
  handleConfirm,
  mintAmount,
  setMint,
  mintType,
}) => {
  const { t } = useTranslation()

  return (
    <Flex p="30px" flexDirection="column">
      {mintType && (
        <Flex flexDirection="column" marginBottom={'20px'}>
          <Text fontSize="20px" bold color="secondary" mb="10px">
            Mint Amount
          </Text>
          <Input
            type={'number'}
            max={5}
            value={mintAmount}
            isSuccess
            style={{ textAlign: 'right', borderRadius: '4px' }}
            onChange={(e) => {
              setMint(e.target.value)
            }}
          ></Input>
        </Flex>
      )}
      <Flex alignItems="center">
        <Flex flexDirection="column">
          <Flex alignItems="center">
            <Text fontSize="20px" bold color="secondary">
              {t('Confirm')}
            </Text>
          </Flex>
          <Text small color="textSubtle">
            {t('Please confirm the transaction in your wallet')}
          </Text>
        </Flex>
        <Flex flex="0 0 64px" height="72px" width="64px">
          {isConfirming && <Spinner size={64} />}
        </Flex>
      </Flex>
      <Button mt="24px" disabled={isConfirming} onClick={handleConfirm} variant="secondary">
        {isConfirming ? `${t('Confirming')}...` : t('Confirm')}
      </Button>
    </Flex>
  )
}

export default ConfirmStage
