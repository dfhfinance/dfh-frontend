import { useContributePoolContract } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ethers } from 'ethers'
import { useBlock } from 'state/block/hooks'

export default function usePendingProfit(poolId: number): ethers.BigNumber | undefined {
  const contributePoolContract = useContributePoolContract()
  const { account } = useActiveWeb3React()
  const [profit, setProfit] = useState<ethers.BigNumber>()
  const { currentBlock } = useBlock()

  useEffect(() => {
    const fetchData = async () => {
      if (account) {
        const newProfit = await contributePoolContract.getPendingProfit(poolId, account)
        setProfit(newProfit)
      }
    }
    fetchData()
  }, [poolId, account, contributePoolContract, currentBlock])

  return profit
}
