import { useCallback, useEffect, useMemo, useState } from 'react'
import { ethers, Contract } from 'ethers'
import { useContributePoolContract, useERC20 } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { Token } from '@dfh-finance/sdk'

const useStakePool = () => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const contributePoolContract = useContributePoolContract()

  return useCallback(
    async (poolId: number, amount: string, token: Token) => {
      const rawAmount = getDecimalAmount(new BigNumber(amount), token.decimals)
      const tx = await callWithGasPrice(contributePoolContract, 'deposit', [poolId, rawAmount.toString()])
      const receipt = await tx.wait()
      return receipt.status
    },
    [contributePoolContract, callWithGasPrice],
  )
}

export default useStakePool
