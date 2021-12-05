import { useCallback, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { useBEP20, useContributePoolContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBlock } from 'state/block/hooks'
import { mainnetTokens, testnetTokens } from 'config/constants/tokens'
import useUserInfo from 'views/ContributePools/hooks/useUserInfo'

const useApprovePool = (poolId: number, dfhAmount: ethers.BigNumber, ctbTokenAddress: string) => {
  const { currentBlock } = useBlock()
  const { chainId = +process.env.REACT_APP_CHAIN_ID } = useActiveWeb3React()
  const ctbTokenContract = useBEP20(ctbTokenAddress)
  const dfhContract = useBEP20(chainId === 97 ? testnetTokens.dfh.address : mainnetTokens.dfh.address)

  const contributePoolContract = useContributePoolContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account } = useActiveWeb3React()
  const [isApprovedCtbToken, setIsApprovedCtbToken] = useState(false)
  const [isApprovedDfh, setIsApprovedDfh] = useState(false)

  const userInfo = useUserInfo(poolId)
  const { isStakingDfh = false } = userInfo[0] ?? {}
  const refreshUserInfo = userInfo[1]

  const handleApproveCtbToken = useCallback(async () => {
    console.log(`I'm here: handleApproveCtbToken`)
    await callWithGasPrice(ctbTokenContract, 'approve', [contributePoolContract.address, ethers.constants.MaxUint256])
  }, [ctbTokenContract, contributePoolContract, callWithGasPrice])

  const handleApproveDFH = useCallback(async () => {
    console.log(`I'm here: handleApproveDFH`)
    await callWithGasPrice(dfhContract, 'approve', [contributePoolContract.address, ethers.constants.MaxUint256])
  }, [callWithGasPrice, dfhContract, contributePoolContract.address])

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
    if (isStakingDfh) {
      setIsApprovedDfh(true)
      return
    }
    const approvedDfhAmount: ethers.BigNumber = await dfhContract?.allowance(account, contributePoolContract.address)
    if (approvedDfhAmount.lt(dfhAmount)) {
      setIsApprovedDfh(false)
      return
    }
    setIsApprovedDfh(true)
  }, [account, contributePoolContract.address, dfhAmount, dfhContract, isStakingDfh])

  useEffect(() => {
    fetchApproveCtbToken()
    fetchApproveDfh()
    refreshUserInfo()
  }, [fetchApproveCtbToken, fetchApproveDfh, currentBlock, refreshUserInfo])

  return useMemo(
    () => ({ onApprove: handleApprove, isApprovedCtbToken, isApprovedDfh }),
    [handleApprove, isApprovedCtbToken, isApprovedDfh],
  )
}

export default useApprovePool
