import { useCallback, useEffect, useMemo, useState } from 'react'
import { ethers, Contract } from 'ethers'
import { useContributePoolContract, useERC20 } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBlock } from 'state/block/hooks'

const useApprovePool = (erc20Address: string) => {
  const { currentBlock } = useBlock()
  const erc20Contract = useERC20(erc20Address)
  const contributePoolContract = useContributePoolContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account } = useActiveWeb3React()
  const [isApprove, setIsApprove] = useState(false)
  const handleApprove = useCallback(async () => {
    const tx = await callWithGasPrice(erc20Contract, 'approve', [
      contributePoolContract.address,
      ethers.constants.MaxUint256,
    ])
    const receipt = await tx.wait()
    return receipt.status
  }, [erc20Contract, contributePoolContract, callWithGasPrice])

  const fetchApproveERC20 = useCallback(async () => {
    const approve = await erc20Contract?.allowance(account, contributePoolContract.address)
    if (approve.toString() === '0') {
      setIsApprove(false)
      return
    }
    setIsApprove(true)
  }, [account, contributePoolContract.address, erc20Contract])

  useEffect(() => {
    fetchApproveERC20()
  }, [fetchApproveERC20, currentBlock])

  return { onApprove: handleApprove, isApproved: isApprove }
}

export default useApprovePool
