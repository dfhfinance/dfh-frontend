import { useCallback, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { useBEP20, useContributePoolContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBlock } from 'state/block/hooks'
import { mainnetTokens, testnetTokens } from 'config/constants/tokens'

const useApprovePool = (id: number, dfhAmount: ethers.BigNumber, ctbTokenAddress: string) => {
  const { currentBlock } = useBlock()
  const { chainId = +process.env.REACT_APP_CHAIN_ID } = useActiveWeb3React()
  const ctbTokenContract = useBEP20(ctbTokenAddress)
  const dfhContract = useBEP20(chainId === 97 ? testnetTokens.dfh.address : mainnetTokens.dfh.address)

  const contributePoolContract = useContributePoolContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account } = useActiveWeb3React()
  const [isApprovedCtbToken, setIsApprovedCtbToken] = useState(false)
  const [isApprovedDfh, setIsApprovedDfh] = useState(false)

  const handleApproveCtbToken = useCallback(async () => {
    console.log(`I'm here: handleApproveCtbToken`)
    await callWithGasPrice(ctbTokenContract, 'approve', [contributePoolContract.address, ethers.constants.MaxUint256])
  }, [ctbTokenContract, contributePoolContract, callWithGasPrice])

  const handleApproveDFH = useCallback(async () => {
    console.log(`I'm here: handleApproveDFH`)
    await callWithGasPrice(dfhContract, 'approve', [contributePoolContract.address, dfhAmount])
  }, [callWithGasPrice, dfhContract, contributePoolContract.address, dfhAmount])

  const handleApprove = useCallback(async () => {
    if (!isApprovedCtbToken) {
      await handleApproveCtbToken()
    }
    if (!isApprovedDfh) {
      await handleApproveDFH()
    }
  }, [handleApproveCtbToken, handleApproveDFH, isApprovedCtbToken, isApprovedDfh])

  const fetchApproveCtbToken = useCallback(async () => {
    if (!account) return
    const approvedCtbTokenAmount: ethers.BigNumber = await ctbTokenContract?.allowance(
      account,
      contributePoolContract.address,
    )
    if (approvedCtbTokenAmount.toString() === '0') {
      setIsApprovedCtbToken(false)
      return
    }
    setIsApprovedCtbToken(true)
  }, [account, contributePoolContract.address, ctbTokenContract])

  const fetchApproveDfh = useCallback(async () => {
    if (!account) return
    const approvedDfhAmount: ethers.BigNumber = await dfhContract?.allowance(account, contributePoolContract.address)
    if (approvedDfhAmount.lt(dfhAmount)) {
      setIsApprovedDfh(false)
      return
    }
    setIsApprovedDfh(true)
  }, [account, contributePoolContract.address, dfhAmount, dfhContract])

  useEffect(() => {
    fetchApproveCtbToken()
    fetchApproveDfh()
  }, [fetchApproveCtbToken, fetchApproveDfh, currentBlock])

  return useMemo(
    () => ({ onApprove: handleApprove, isApprovedCtbToken, isApprovedDfh }),
    [handleApprove, isApprovedCtbToken, isApprovedDfh],
  )
}

export default useApprovePool
