import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useContributePoolContract } from 'hooks/useContract'
import { useCallback, useState } from 'react'

const useClaimProfit = () => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const contributePoolContract = useContributePoolContract()
  const [isClaiming, setIsClaiming] = useState(false)

  const onClaim = useCallback(
    async (poolId: number) => {
      setIsClaiming(true)
      try {
        const tx = await callWithGasPrice(contributePoolContract, 'claimProfit', [poolId])
        await tx.wait()
        setIsClaiming(false)
      } catch {
        setIsClaiming(false)
      }
    },
    [contributePoolContract, callWithGasPrice],
  )

  return [isClaiming, onClaim] as const
}

export default useClaimProfit
