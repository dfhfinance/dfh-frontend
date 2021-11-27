import { useContributePoolContract } from 'hooks/useContract'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const fetchData = async () => {
      if (account) {
        const newUserInfo = await contributePoolContract.userInfo(poolId, account)
        setUserInfo({
          amount: newUserInfo.amount,
          receivedAmount: newUserInfo.receivedAmount,
        })
      }
    }
    fetchData()
  }, [poolId, account, contributePoolContract])

  return userInfo
}
