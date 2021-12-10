import { useContributePoolContract } from 'hooks/useContract'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ethers } from 'ethers'
import { useBlock } from 'state/block/hooks'

export interface UserInfo {
  amount: ethers.BigNumber
  receivedAmount: ethers.BigNumber
  isStakingDfh: boolean
}

export default function useUserInfo(poolId: number): [UserInfo | undefined, () => void] {
  const contributePoolContract = useContributePoolContract()
  const { account } = useActiveWeb3React()
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const isFetching = useRef(false)
  const [count, setCount] = useState(1)
  const { currentBlock } = useBlock()

  const refetchUserInfo = useCallback(() => {
    setCount((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (count && !isFetching.current) {
        isFetching.current = true
        if (account) {
          const newUserInfo = await contributePoolContract.userInfo(poolId, account)
          setUserInfo({
            amount: newUserInfo.amount,
            receivedAmount: newUserInfo.receivedAmount,
            isStakingDfh: newUserInfo.isStakingDfh,
          })
        }
        isFetching.current = false
      }
    }

    fetchData()
  }, [count, account, poolId, contributePoolContract, currentBlock])

  return useMemo(() => [userInfo, refetchUserInfo], [userInfo, refetchUserInfo])
}
