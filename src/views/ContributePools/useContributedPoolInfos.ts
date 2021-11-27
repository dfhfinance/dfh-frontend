import { useEffect, useState } from 'react'
import { useContributePoolContract } from 'hooks/useContract'
import { ethers } from 'ethers'

export interface PoolInfo {
  contributedToken: string
  expectInput: number
  expectOutput: number
  expectProfit: number
  withdrawFee: number
  stakeMin: ethers.BigNumber
  totalStakeMax: ethers.BigNumber
  totalStaked: ethers.BigNumber
  tokenPerShare: ethers.BigNumber
  withdrawnAmount: ethers.BigNumber
  totalRefund: ethers.BigNumber
  endCampaign: ethers.BigNumber
  status: number
}

export default function useContributePoolInfos(): PoolInfo[] {
  const contributePoolContract = useContributePoolContract()
  const [poolInfos, setPoolInfos] = useState<PoolInfo[]>()

  useEffect(() => {
    const fetchData = async () => {
      const numberOfPoolsBn = await contributePoolContract.poolLength()
      const numberOfPools: number = numberOfPoolsBn.toNumber()
      const promises = []
      for (let i = 0; i < numberOfPools; i++) {
        promises.push(contributePoolContract.poolInfo(i))
      }
      const responses = await Promise.all(promises)
      const newPoolInfos = responses.map(
        (response): PoolInfo => ({
          contributedToken: response.contributedToken,
          expectInput: response.expectInput,
          expectOutput: response.expectOutput,
          expectProfit: response.expectProfit,
          withdrawFee: response.withdrawFee,
          stakeMin: response.stakeMin,
          totalStakeMax: response.totalStakeMax,
          totalStaked: response.totalStaked,
          tokenPerShare: response.tokenPerShare,
          withdrawnAmount: response.withdrawnAmount,
          totalRefund: response.totalRefund,
          endCampaign: response.endCampaign,
          status: response.status,
        }),
      )
      setPoolInfos(newPoolInfos)
    }

    fetchData()
  }, [contributePoolContract])

  return poolInfos
}
