import { useRouter } from 'next/router'
import NFTDetail from '../views/NFT'

const NFT = () => {
  const router = useRouter()
  const nft_id = Number(router.asPath.split('?')[1].split('=')[1])
  if (nft_id === undefined || isNaN(nft_id) || nft_id < 1 || nft_id > 3) {
    router.push({
      pathname: '/nft?id=1',
    })
  }

  return <NFTDetail nft_id={nft_id} />
}

export default NFT
