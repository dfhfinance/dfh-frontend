import { useEffect, useRef, useState } from 'react'
import { useContributePoolContract } from 'hooks/useContract'
import { ethers } from 'ethers'
import { useBlock } from 'state/block/hooks'

export enum PoolStatus {
  CONTRIBUTING,
  END_CONTRIBUTION,
  CLOSED,
}

export interface PoolInfo {
  id: number

  ctbToken: string
  withdrawFee: number
  ctbMin: ethers.BigNumber
  totalCtbMax: ethers.BigNumber
  totalCtb: ethers.BigNumber
  tokenPerShare: ethers.BigNumber
  withdrawnAmount: ethers.BigNumber
  totalRefund: ethers.BigNumber
  endCtbTime: ethers.BigNumber
  dfhAmount: ethers.BigNumber
  status: number

  purchasePrice: number
  expectedPrice: number
  expectProfit: number
  link: string
  image: string
}

export default function useContributePoolInfos() {
  const contributePoolContract = useContributePoolContract()
  const [poolInfos, setPoolInfos] = useState<PoolInfo[]>()
  const { currentBlock } = useBlock()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const numberOfPoolsBn = await contributePoolContract.poolLength()
      const numberOfPools: number = numberOfPoolsBn.toNumber()
      const promises = []
      for (let i = 0; i < numberOfPools; i++) {
        promises.push(contributePoolContract.getPoolInfo(i))
      }
      const responses = await Promise.all(promises)
      const newPoolInfos = responses.map((response, index): PoolInfo => {
        const res = { ...response[0], ...response[1] }
        return {
          id: index,

          ctbToken: res.ctbToken,
          withdrawFee: res.withdrawFee,
          ctbMin: res.ctbMin,
          totalCtbMax: res.totalCtbMax,
          totalCtb: res.totalCtb,
          tokenPerShare: res.tokenPerShare,
          withdrawnAmount: res.withdrawnAmount,
          totalRefund: res.totalRefund,
          endCtbTime: res.endCtbTime,
          dfhAmount: res.dfhAmount,
          status: res.status,

          purchasePrice: res.purchasePrice,
          expectedPrice: res.expectedPrice,
          expectProfit: res.expectProfit,
          link: res.link,
          image: res.image,
        }
      })
      setPoolInfos(newPoolInfos)
      setIsInitializing(false)
    }

    fetchData()
  }, [contributePoolContract, currentBlock])

  return [isInitializing, poolInfos] as const
}
