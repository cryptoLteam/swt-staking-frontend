import { Duration, getUnixTime, startOfHour, sub } from 'date-fns'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'

import fetchPoolChartData from 'state/info/queries/pools/chartData'
import fetchPoolTransactions from 'state/info/queries/pools/transactions'
import { fetchGlobalChartData } from 'state/info/queries/protocol/chart'
import fetchTopTransactions from 'state/info/queries/protocol/transactions'
import fetchTokenChartData from 'state/info/queries/tokens/chartData'
import fetchPoolsForToken from 'state/info/queries/tokens/poolsForToken'
import fetchTokenPriceData from 'state/info/queries/tokens/priceData'
import fetchTokenTransactions from 'state/info/queries/tokens/transactions'
import { Transaction } from 'state/info/types'
import useSWRImmutable from 'swr/immutable'
import { MultiChainName, checkIsStableSwap } from './constant'
import { ChartEntry, PoolData, PriceChartEntry, ProtocolData, TokenData } from './types'
// Protocol hooks

const refreshIntervalForInfo = 15000 // 10s
const SWR_SETTINGS = { refreshInterval: refreshIntervalForInfo }

export const useProtocolChartDataSWR = (): ChartEntry[] | undefined => {
  const chainName = useGetChainName()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data: chartData } = useSWRImmutable(
    [`info/protocol/updateProtocolChartData/${type}`, chainName],
    () => fetchGlobalChartData(chainName),
    SWR_SETTINGS,
  )
  return chartData ?? undefined
}

export const useProtocolTransactionsSWR = (): Transaction[] | undefined => {
  const chainName = useGetChainName()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data: transactions } = useSWRImmutable(
    [`info/protocol/updateProtocolTransactionsData/${type}`, chainName],
    () => fetchTopTransactions(chainName),
    SWR_SETTINGS,
  )
  return transactions ?? undefined
}

export const usePoolChartDataSWR = (address: string): ChartEntry[] | undefined => {
  const chainName = useGetChainName()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useSWRImmutable([`info/pool/chartData/${address}/${type}`, chainName], () =>
    fetchPoolChartData(chainName, address),
  )
  return data?.data ?? undefined
}

export const usePoolTransactionsSWR = (address: string): Transaction[] | undefined => {
  const chainName = useGetChainName()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useSWRImmutable(
    [`info/pool/transactionsData/${address}/${type}`, chainName],
    () => fetchPoolTransactions(chainName, address),
    SWR_SETTINGS,
  )
  return data?.data ?? undefined
}

export const usePoolsForTokenSWR = (address: string): string[] | undefined => {
  const chainName = useGetChainName()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useSWRImmutable(
    [`info/token/poolAddress/${address}/${type}`, chainName],
    () => fetchPoolsForToken(chainName, address),
    SWR_SETTINGS,
  )

  return data?.addresses ?? undefined
}

export const useTokenChartDataSWR = (address: string): ChartEntry[] | undefined => {
  const chainName = useGetChainName()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useSWRImmutable(
    address && chainName && [`info/token/chartData/${address}/${type}`, chainName],
    () => fetchTokenChartData(chainName, address),
    SWR_SETTINGS,
  )

  return data?.data ?? undefined
}

export const useTokenPriceDataSWR = (
  address: string,
  interval: number,
  timeWindow: Duration,
): PriceChartEntry[] | undefined => {
  const utcCurrentTime = getUnixTime(new Date()) * 1000
  const startTimestamp = getUnixTime(startOfHour(sub(utcCurrentTime, timeWindow)))
  const chainName = useGetChainName()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useSWRImmutable(
    [`info/token/priceData/${address}/${type}`, chainName],
    () => fetchTokenPriceData(chainName, address, interval, startTimestamp),
    SWR_SETTINGS,
  )
  return data?.data ?? undefined
}

export const useTokenTransactionsSWR = (address: string): Transaction[] | undefined => {
  const chainName = useGetChainName()
  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'
  const { data } = useSWRImmutable(
    [`info/token/transactionsData/${address}/${type}`, chainName],
    () => fetchTokenTransactions(chainName, address),
    SWR_SETTINGS,
  )
  return data?.data ?? undefined
}

export const useGetChainName = () => {
  const path = window.location.href

  const getChain = useCallback(() => {
    return 'BSC'
  }, [path])
  const [name, setName] = useState<MultiChainName | null>(getChain())
  const result = useMemo(() => name, [name])

  useEffect(() => {
    setName(getChain())
  }, [getChain])

  return result
}

export const useMultiChainPath = () => {
  const router = useRouter()
  const { chainName } = router.query
  return chainName ? `/${chainName}` : ''
}

export const useStableSwapPath = () => {
  return checkIsStableSwap() ? '?type=stableSwap' : ''
}
