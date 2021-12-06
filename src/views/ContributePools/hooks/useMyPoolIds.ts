import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useEffect, useRef, useState } from 'react'
import { useContributePoolContract } from 'hooks/useContract'
import { useBlock } from 'state/block/hooks'

export default function useMyPoolIds(): number[] {
  const { account } = useActiveWeb3React()
  const [myPoolIds, setMyPoolIds] = useState<number[]>([])
  const contributePoolContract = useContributePoolContract()
  const { currentBlock } = useBlock()
  const isFetching = useRef(false)

  useEffect(() => {
    const fetchData = async () => {
      if (isFetching.current || !account) return

      isFetching.current = true
      const numberOfPoolsBn = await contributePoolContract.poolLength()
      const numberOfPools: number = numberOfPoolsBn.toNumber()
      const promises = []
      for (let i = 0; i < numberOfPools; i++) {
        promises.push(contributePoolContract.userInfo(i, account))
      }
      const responses = await Promise.all(promises)
      setMyPoolIds(
        responses
          .map((response, index) => ({ ...response, poolId: index }))
          .filter((userInfo) => userInfo.isStakingDfh)
          .map((response) => response.poolId),
      )
    }

    fetchData()
  }, [account, contributePoolContract, currentBlock])

  return myPoolIds
}
