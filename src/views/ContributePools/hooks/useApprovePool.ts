import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useBEP20, useContributePoolContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBlock } from 'state/block/hooks'

const useApprovePool = (bep20Address: string) => {
  const { currentBlock } = useBlock()
  const bep20Contract = useBEP20(bep20Address)
  const contributePoolContract = useContributePoolContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account } = useActiveWeb3React()
  const [isApprove, setIsApprove] = useState(false)
  const handleApprove = useCallback(async () => {
    const tx = await callWithGasPrice(bep20Contract, 'approve', [
      contributePoolContract.address,
      ethers.constants.MaxUint256,
    ])
    const receipt = await tx.wait()
    return receipt.status
  }, [bep20Contract, contributePoolContract, callWithGasPrice])

  const fetchApproveBEP20 = useCallback(async () => {
    const approve = await bep20Contract?.allowance(account, contributePoolContract.address)
    if (approve.toString() === '0') {
      setIsApprove(false)
      return
    }
    setIsApprove(true)
  }, [account, contributePoolContract.address, bep20Contract])

  useEffect(() => {
    fetchApproveBEP20()
  }, [fetchApproveBEP20, currentBlock])

  return { onApprove: handleApprove, isApproved: isApprove }
}

export default useApprovePool
