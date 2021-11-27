import React, { memo, useEffect, useMemo, useState } from 'react'
import { Box } from '@dfh-finance/uikit'
import styled from 'styled-components'
import ContributePoolCard from 'views/ContributePools/ContributePoolCard'
import { ethersToBigNumber } from 'utils/bigNumber'
import { useContributePoolContract } from 'hooks/useContract'
import { BigNumber } from 'bignumber.js'
import { ethers } from 'ethers'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript'

const Container = styled(Box)`
  grid-gap: 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 0 auto;
  padding: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 36px;
    grid-gap: 36px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 64px;
  }
`

export interface PoolInfo {
  contributedToken: string
  expectInput: number
  expectOutput: number
  expectProfit: number
  withdrawFee: number
  stakeMin: BigNumber
  totalStakeMax: BigNumber
  totalStaked: BigNumber
  tokenPerShare: BigNumber
  withdrawnAmount: BigNumber
  totalRefund: BigNumber
  endCampaign: BigNumber
  status: number
}

export interface Pool {
  poolInfo: PoolInfo
}

export function useContributePoolInfos(): PoolInfo[] {
  const contributePoolContract = useContributePoolContract()
  const [poolInfos, setPoolInfos] = useState<PoolInfo[]>()

  useEffect(() => {
    const fetchData = async () => {
      const numberOfPoolsBn = await contributePoolContract.poolLength()
      const numberOfPools: number = numberOfPoolsBn.toNumber()
      const promises = []
      for (let i = 0; i < numberOfPools; i++) {
        promises.push(contributePoolContract.poolInfo(i))
      }
      const responses = await Promise.all(promises)
      const newPoolInfos = responses.map(
        (response): PoolInfo => ({
          contributedToken: response.contributedToken,
          expectInput: response.expectInput,
          expectOutput: response.expectOutput,
          expectProfit: response.expectProfit,
          withdrawFee: response.withdrawFee,
          stakeMin: ethersToBigNumber(response.stakeMin),
          totalStakeMax: ethersToBigNumber(response.totalStakeMax),
          totalStaked: ethersToBigNumber(response.totalStaked),
          tokenPerShare: ethersToBigNumber(response.tokenPerShare),
          withdrawnAmount: ethersToBigNumber(response.withdrawnAmount),
          totalRefund: ethersToBigNumber(response.totalRefund),
          endCampaign: ethersToBigNumber(response.endCampaign),
          status: response.status,
        }),
      )
      setPoolInfos(newPoolInfos)
    }

    fetchData()
  }, [contributePoolContract])

  return poolInfos
}

export default memo(function ContributePool() {
  const poolInfos = useContributePoolInfos()
  console.log(`poolInfos`, poolInfos && poolInfos[0])
  return (
    <Container>
      {poolInfos &&
        poolInfos.map((poolInfo, index) => (
          <ContributePoolCard key={poolInfo.contributedToken} id={index} poolInfo={poolInfo} />
        ))}
    </Container>
  )
})
