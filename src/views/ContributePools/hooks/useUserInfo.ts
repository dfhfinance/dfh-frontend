import { useContributePoolContract } from 'hooks/useContract'
import { useRef, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ethers } from 'ethers'

export interface UserInfo {
  amount: ethers.BigNumber
  receivedAmount: ethers.BigNumber
}

export default function useUserInfo(poolId: number): UserInfo | undefined {
  const contributePoolContract = useContributePoolContract()
  const { account } = useActiveWeb3React()
  const [userInfo, setUserInfo] = useState<UserInfo>()
  const isFetching = useRef(false)

  const fetchData = async () => {
    if (!isFetching.current) {
      isFetching.current = true
      if (account) {
        const newUserInfo = await contributePoolContract.userInfo(poolId, account)
        setUserInfo({
          amount: newUserInfo.amount,
          receivedAmount: newUserInfo.receivedAmount,
        })
      }
      isFetching.current = false
    }
  }

  fetchData()

  return userInfo
}
