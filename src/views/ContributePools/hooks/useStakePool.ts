import BigNumber from 'bignumber.js'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useContributePoolContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { getDecimalAmount } from 'utils/formatBalance'
import { ContributedToken } from '../useContributedToken'

const useStakePool = () => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const contributePoolContract = useContributePoolContract()

  return useCallback(
    async (poolId: number, amount: string, token: ContributedToken) => {
      const rawAmount = getDecimalAmount(new BigNumber(amount), token.decimals)
      const tx = await callWithGasPrice(contributePoolContract, 'deposit', [poolId, rawAmount.toString()])
      const receipt = await tx.wait()
      return receipt.status
    },
    [contributePoolContract, callWithGasPrice],
  )
}

export default useStakePool
