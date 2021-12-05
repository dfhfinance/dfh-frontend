import React, { memo } from 'react'
import { Box, Flex, Text } from '@dfh-finance/uikit'
import styled from 'styled-components'
import ContributePoolCard from 'views/ContributePools/ContributePoolCard'
import useContributePoolInfos from 'views/ContributePools/hooks/useContributedPoolInfos'

const CardWrapper = styled(Box)`
  grid-gap: 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 0 auto;
  padding: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 16px 36px;
    grid-gap: 36px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 16px 64px;
  }
`

const Banner = styled(Flex)`
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.backgroundAlt};
  height: 96px;
  background-image: url('/images/contribute-background-mobile.png');
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  font-size: 30px;
  font-weight: 700;

  ${({ theme }) => theme.mediaQueries.xs} {
    background-image: url('/images/contribute-background-tablet.png');
  }

  ${({ theme }) => theme.mediaQueries.md} {
    background-image: url('/images/contribute-background-desktop.png');
    height: 128px;
    font-size: 36px;
  }
`

export default function ContributePool() {
  const poolInfos = useContributePoolInfos()

  return (
    <Box>
      <Banner>
        <Box>Bất động sản</Box>
      </Banner>
      <CardWrapper>
        {poolInfos &&
          poolInfos.map((poolInfo, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <ContributePoolCard key={index} id={index} poolInfo={poolInfo} />
          ))}
      </CardWrapper>
    </Box>
  )
}
