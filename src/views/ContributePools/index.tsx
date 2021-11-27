import React, { memo } from 'react'
import { Box } from '@dfh-finance/uikit'
import styled from 'styled-components'
import ContributePoolCard from 'views/ContributePools/ContributePoolCard'
import useContributePoolInfos from 'views/ContributePools/hooks/useContributedPoolInfos'

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

export default function ContributePool() {
  const poolInfos = useContributePoolInfos()

  return (
    <Container>
      {poolInfos &&
        poolInfos.map((poolInfo, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <ContributePoolCard key={index} id={index} poolInfo={poolInfo} />
        ))}
    </Container>
  )
}
