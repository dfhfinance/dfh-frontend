import { useContributePoolContract } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ethers } from 'ethers'

export default function usePendingProfit(poolId: number): ethers.BigNumber | undefined {
  const contributePoolContract = useContributePoolContract()
  const { account } = useActiveWeb3React()
  const [profit, setProfit] = useState<ethers.BigNumber>()

  useEffect(() => {
    const fetchData = async () => {
      if (account) {
        const newProfit = await contributePoolContract.getPendingProfit(poolId, account)
        setProfit(newProfit)
      }
    }
    fetchData()
  }, [poolId, account, contributePoolContract])

  return profit
}
