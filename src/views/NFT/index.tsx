import { useEffect, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import styled from 'styled-components'
import { Heading, Text, Button, Flex, LinkExternal, useToast, useModal } from '@pancakeswap/uikit'
import { bsc } from '@pancakeswap/wagmi/chains'
import axios from 'axios'
import { ChevronDownIcon } from '@pancakeswap/uikit'
import { NftContractInfo } from './contractInfo/nftContractABI'
import { useNFTContract, usePriceGblockBusd, useStakingContract, useRewardPercent, useTokenURI } from './hook'
import MintModal from './Modal/MintModal'
import HarvestModal from './Modal/HarvestModal'
import StakedModal from './Modal/StakedModal'
import SelectNFTModal from './Modal/SelectNFTModal'
import Footer from '../Footer'
import SwapModal from '../Farms/components/SwapModal'

const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
`

const NFTDetailConntainer = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding-top: 20px;
  color: #fff;

  h1 {
    font-size: 65px;
    line-height: 77px;
  }

  h2 {
    font-size: 30px;
    line-height: 24px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    color: #cacfdb;
    margin-bottom: 7px !important;
  }

  h5 {
    font-size: 20px;
    line-height: 24px;
    font-weight: 400;
  }
  h6 {
    font-size: 12px;
    font-weight: 400;
  }
`

const NFTMainDetail = styled(Flex)`
  border-radius: 22px;
  padding: 40px 0px;
  margin: 50px 29px;
  align-items: center;
  gap: '30px';
`

const NFTImageContainer = styled.div`
  max-width: 100%;
  width: 100%;
  padding: 0px 16px 16px 16px;
  img {
    border-radius: 16px;
  }
`

const DescriptionContainer = styled.div`
  max-width: 100%;
  width: 100%;
  padding-left: 29px;
  padding-right: 29px;
  margin-bottom: 25px !important;
`

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: space-around;
  width: 100%;
  margin-top: 44px !important;
  margin-bottom: 30px !important;
  gap: 20px;
`

const ActionButtons = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  flex-flow: row wrap;
  width: 100%;

  margin-top: 10px !important;
`

const NFTDetailInfo = styled.div`
  display: flex;
`
const NFTDrop = styled.div`
  width: 100%;
  padding-left: 29px;
  padding-right: 29px;
  margin-bottom: 30px;
`

const NFTAction = styled.div`
  width: 100%;
  padding-left: 29px;
  padding-right: 29px;
  margin-bottom: 30px;
`
const ActionContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.backgroundAlt2};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }

  * > button {
    width: 100%;
  }
`

const DetailContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.backgroundAlt2};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
`

const StyledLinkExternal = styled(LinkExternal)`
  color: rgb(202, 207, 219);
  font-weight: 500;
  margin-top: 5px;
`

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(0)' : 'rotate(-90deg)')};
  height: 20px;
`

const DropTitle = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.backgroundAlt2};
`

const DropDetailItem = styled.div``

const DropDetailDescription = styled.div`
  padding: 16px;
  a {
    color: #65ff65;
  }
  background-color: ${({ theme }) => theme.colors.backgroundAlt2};
  border: 1px solid ${({ theme }) => theme.colors.backgroundAlt};
`

const StyledClick = styled.span`
  @keyframes color-animation {
    0% {
      color: white;
    }
    50% {
      color: #ff00d1;
    }
    100% {
      color: white;
    }
  }

  cursor: pointer;
  color: red;
  animation-name: color-animation;
  animation-duration: 1s;
  animation-iteration-count: infinite;
`

export default function NFTDetail(props) {
  const { account } = useActiveWeb3React()
  const { toastWarning } = useToast()
  const PRECISION = 1000000
  const { nft_id } = props

  const [nftDetail, setNFTDetail] = useState({
    description: 'Draco',
    image: '/images/nfts/nft_' + nft_id + '.jpg',
    name: 'GameBlock NFT - Draco',
  })

  const gblockPriceUSD = Number(usePriceGblockBusd().toString())
  const { mintPrice, maxMintAmount, curMintAmount, nftName, tokensOfHolder } = useNFTContract({ id: nft_id })
  const { rewardPrice, pendingReward, stakedNftIDs, endTime, leftPoolTime } = useStakingContract({ id: nft_id })

  const [reward, setReward] = useState(pendingReward)
  const [gblockPrice, setGblockPrice] = useState(gblockPriceUSD)

  const time = new Date(endTime * 1000)
  const now = new Date()
  const timeDiff = time.getTime() - now.getTime()
  const leftMonth = Math.floor(timeDiff / 1000 / 84000 / 30)
  const leftDays = Math.floor(Math.floor(timeDiff % (1000 * 84000 * 30)) / 1000 / 84000)
  const leftDate = leftMonth ? leftMonth + 'Months ' + leftDays + 'Days' : '' + leftDays + 'Days'
  const { APR, APY } = useRewardPercent({ id: nft_id })

  const { NFTDataJson } = useTokenURI({ id: nft_id })

  const getMoviesFromApiAsync = async (imageJson) => {
    try {
      const response = await axios.get(imageJson)
      setNFTDetail(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setReward(pendingReward)
    setGblockPrice(gblockPriceUSD)
  }, [rewardPrice, pendingReward, gblockPriceUSD])

  useEffect(() => {
    if (NFTDataJson != '') {
      getMoviesFromApiAsync(NFTDataJson)
    }
  }, [NFTDataJson])

  // ----------------------------get Contract end--------------------------------

  const getStakedNFTIDs = () => {
    if (!stakedNftIDs) return []
    return stakedNftIDs[0]
  }

  const [collapse, setCollapse] = useState(0)

  const nftDropDetail = [
    {
      title: 'Detail',
      data: (
        <DropDetailDescription>
          <p>GameBlock NFTs are limited editions.</p>
          <br />
          <p>
            They can be purchased (minted) by paying one or more tokens. This will happen automatically when you confirm
            the Mint transaction.
          </p>
          <br />
          <p>
            Each GameBlock NFT can be used to farm GBLOCK rewards over a set period of time. After the end of the farm, rewards
            stop.
          </p>
          <br />
          <p>
            You can withdraw your NFT anytime and send it to other addresses or sell it. An official Liquidus
            marketplace is under development.
          </p>
          <br />
        </DropDetailDescription>
      ),
    },
    {
      title: 'Creator',
      data: (
        <DropDetailDescription>
          <Flex style={{ fontSize: '20px', alignItems: 'center' }}>
            <img src="/logo.png" />
            {/* <p style={{ marginLeft: '16px' }}>GameBlock</p> */}
          </Flex>
        </DropDetailDescription>
      ),
    },
    {
      title: 'Additional information',
      data: (
        <DropDetailDescription>
          <p>Read more here:</p>
          <br />
          <p>
            <a href="https://docs.gameblock.link">docs.gameblock.link</a>
          </p>
          <br />
          {/* <p>or see our:</p><br />
        <a href='#'>FAQs</a><br /> */}
        </DropDetailDescription>
      ),
    },
  ]

  const getOwnedNFT = () => {
    if (tokensOfHolder == undefined) return null
    if (tokensOfHolder.length == 0) return null

    for (let item of tokensOfHolder[0]) {
      if (Math.floor(item / PRECISION) === nft_id) {
        return item
      }
    }
    return null
  }

  const [open, setOpen] = useState(false)

  const onDismiss = () => {
    setOpen(false)
  }

  const [onMintModalHandler] = useModal(<MintModal id={nft_id} />)

  const [onHarvestModalHandler] = useModal(<HarvestModal id={nft_id} setReward={setReward} />)

  const [onShowStakedNFTHandler] = useModal(<StakedModal id={nft_id} img={nftDetail.image} name={nftDetail.name} />)

  const [onShowNFTSelectHandler] = useModal(<SelectNFTModal id={nft_id} img={nftDetail.image} name={nftDetail.name} />)

  const [onPresentSwapHandler] = useModal(<SwapModal />)

  const handleMintModal = () => {
    if (account === null) toastWarning('Please connect wallet!')
    else onMintModalHandler()
  }

  const handleHarvestModal = () => {
    if (account === null) toastWarning('Please connect wallet!')
    else onHarvestModalHandler()
  }

  const handleShowStakedNFT = () => {
    if (account === null) toastWarning('Please connect wallet!')
    else onShowStakedNFTHandler()
  }

  const handleShowNFTSelect = () => {
    if (account === null) toastWarning('Please connect wallet!')
    else onShowNFTSelectHandler()
  }

  const handlePresentSwap = () => {
    if (account === null) toastWarning('Please connect wallet!')
    else onPresentSwapHandler()
  }

  return (
    <>
      <NFTDetailConntainer>
        <NFTMainDetail flexDirection={['column', null, null, 'row']} mt="40px">
          <NFTImageContainer>
            <img src={nftDetail.image} width="100%" />
          </NFTImageContainer>
          <DescriptionContainer>
            <Heading scale="xl" textAlign="center">
              {nftDetail.name}
            </Heading>
            <Heading as="h4" scale="md" textAlign="center" style={{ lineHeight: '2rem', fontWeight: '500' }}>
              {curMintAmount + '/' + maxMintAmount} limited edition NFT
            </Heading>

            <PriceContainer>
              <Flex justifyContent="space-between">
                <Heading as="h4" scale="md">
                  Price to mint
                </Heading>
                <Flex flexDirection="column" alignItems="end">
                  <Heading as="h4" textAlign="right">
                    {mintPrice} GBLOCK
                  </Heading>
                  <Heading as="h6" textAlign="right" style={{ fontStyle: 'italic', color: 'gray' }}>
                    ${(gblockPriceUSD * mintPrice).toFixed(3)}
                  </Heading>
                </Flex>
              </Flex>
              <Flex justifyContent="space-between">
                <Heading as="h4" scale="md">
                  APY
                </Heading>
                <Heading as="h4" textAlign="right">
                  {APY}%
                </Heading>
              </Flex>
              <Flex justifyContent="space-between">
                <Heading as="h4" scale="md">
                  Total Rewards
                </Heading>
                <Flex flexDirection="column" alignItems="end">
                  <Heading as="h4" textAlign="right">
                    {rewardPrice} GBLOCK
                  </Heading>
                  <Heading as="h6" textAlign="right" style={{ fontStyle: 'italic', color: 'gray' }}>
                    ${(gblockPriceUSD * rewardPrice).toFixed(3)}
                  </Heading>
                </Flex>
              </Flex>
              <Flex justifyContent="center">
                <Heading as="h6" style={{ fontStyle: 'italic' }}>
                  Ends {time.toString().substring(4, 15)} ({leftDate})
                </Heading>
              </Flex>
            </PriceContainer>

            <ActionButtons>
              <Button width={220} height={50} style={{ maxWidth: '45%' }} onClick={(e) => handleMintModal()}>
                Mint artwork
              </Button>
              <Button
                width={220}
                height={50}
                style={{ maxWidth: '45%' }}
                onClick={(e) => handleShowNFTSelect()}
                disabled={getOwnedNFT() == null}
              >
                Farm NFT
              </Button>
            </ActionButtons>

            <Flex justifyContent="left" m="15px">
              <Heading as="h6" style={{ fontStyle: 'italic' }}>
                Do you want to buy GBLOCK? <StyledClick onClick={(e) => handlePresentSwap()}> Click Here </StyledClick>
              </Heading>
            </Flex>
          </DescriptionContainer>
        </NFTMainDetail>

        <Flex flexDirection={['column-reverse', null, null, 'row']}>
          <NFTDrop>
            <div>
              {nftDropDetail.map((item, index) => (
                <DropDetailItem key={item.title}>
                  <DropTitle
                    onClick={() => {
                      if (collapse === index) setCollapse(-1)
                      else setCollapse(index)
                    }}
                  >
                    <h3>{item.title}</h3>
                    <ArrowIcon
                      color="white"
                      toggled={collapse == index}
                      style={{ border: '1px solid', borderRadius: '50px', width: '26px', height: '26px' }}
                    />
                  </DropTitle>
                  {index == collapse && <>{item.data}</>}
                </DropDetailItem>
              ))}
            </div>
          </NFTDrop>
          <NFTAction>
            <ActionContainer>
              <div>
                <h5>NFT DEPOSITED</h5>
                {getStakedNFTIDs().length == 0 && <Text mt="5px">There is no deposited NFT</Text>}
                {getStakedNFTIDs().length != 0 && (
                  <Text mt="5px">There are {getStakedNFTIDs().length} deposited NFT</Text>
                )}
                <Text mt="5px">
                  Token ID range of this farm: {PRECISION * nft_id + 1} - {PRECISION * nft_id + 1 * maxMintAmount}
                </Text>

                <StyledLinkExternal
                  href={`${bsc.blockExplorers.default.url}/address/${NftContractInfo.address}`}
                  color="#cacfdb"
                >
                  View Contract
                </StyledLinkExternal>
              </div>
              <div>
                <Button onClick={(e) => handleShowStakedNFT()}>+</Button>
              </div>
            </ActionContainer>

            <ActionContainer>
              <div>
                <h5>GBLOCK EARNED</h5>
                <Text mt="5px">
                  {reward} GBLOCK | ${(reward * gblockPrice).toFixed(3)}
                </Text>
              </div>
              <div>
                <Button onClick={(e) => handleHarvestModal()}>Harvest</Button>
              </div>
            </ActionContainer>

            <DetailContainer>
              <FlexBetween>
                <Text mt="5px">Number of NFTs Deposited</Text>
                <Text mt="5px">{getStakedNFTIDs().length}</Text>
              </FlexBetween>
              <FlexBetween>
                <Text mt="5px">Yearly Rewards per NFT</Text>
                <Text mt="5px">{rewardPrice} GBLOCK</Text>
              </FlexBetween>
              <FlexBetween>
                <Text mt="5px">APR</Text>
                <Text mt="5px">{APR}%</Text>
              </FlexBetween>
              <FlexBetween>
                <Text mt="5px">End Date</Text>
                <Text mt="5px">{time.toString().substring(4, 15)}</Text>
              </FlexBetween>
            </DetailContainer>
          </NFTAction>
        </Flex>
      </NFTDetailConntainer>
      <Footer />
    </>
  )
}
