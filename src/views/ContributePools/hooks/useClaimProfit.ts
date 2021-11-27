import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useContributePoolContract } from 'hooks/useContract'
import { useCallback } from 'react'

const useClaimProfit = () => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const contributePoolContract = useContributePoolContract()

  return useCallback(
    async (poolId: number) => {
      const tx = await callWithGasPrice(contributePoolContract, 'claimProfit', [poolId])
      const receipt = await tx.wait()
      return receipt.status
    },
    [contributePoolContract, callWithGasPrice],
  )
}

export default useClaimProfit
