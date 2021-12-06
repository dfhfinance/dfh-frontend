import React, { memo, useEffect, useState } from 'react'
import { Box, Flex, Text } from '@dfh-finance/uikit'
import styled from 'styled-components'
import ContributePoolCard from 'views/ContributePools/ContributePoolCard'
import useContributePoolInfos, { PoolInfo, PoolStatus } from 'views/ContributePools/hooks/useContributedPoolInfos'
import TabButtons from 'views/ContributePools/TabButtons'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import useMyPoolIds from 'views/ContributePools/hooks/useMyPoolIds'

const CardWrapper = styled(Box)`
  grid-gap: 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 0 auto;
  padding: 36px 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 36px;
    grid-gap: 36px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 48px 64px;
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
  border-bottom: ${({ theme }) => `2px solid ${theme.colors.primary}`};

  ${({ theme }) => theme.mediaQueries.xs} {
    background-image: url('/images/contribute-background-tablet.png');
  }

  ${({ theme }) => theme.mediaQueries.md} {
    background-image: url('/images/contribute-background-desktop.png');
    height: 128px;
    font-size: 36px;
  }
`

const Filters = styled(Flex)`
  margin-top: 16px;
  justify-content: center;
`

export default function ContributePool() {
  const { t } = useTranslation()
  const poolInfos = useContributePoolInfos()
  const myPoolIds = useMyPoolIds()
  const location = useLocation()
  const [filteredPoolInfos, setFilteredPoolInfos] = useState<PoolInfo[]>()

  useEffect(() => {
    switch (location.pathname) {
      case '/pools':
        setFilteredPoolInfos(poolInfos ? poolInfos.filter((pool) => pool.status === PoolStatus.CONTRIBUTING) : [])
        break
      case '/pools/end-contribution':
        setFilteredPoolInfos(poolInfos ? poolInfos.filter((pool) => pool.status === PoolStatus.END_CONTRIBUTION) : [])
        break
      case '/pools/closed':
        setFilteredPoolInfos(poolInfos ? poolInfos.filter((pool) => pool.status === PoolStatus.CLOSED) : [])
        break
      case '/pools/my-pools':
        setFilteredPoolInfos(poolInfos && myPoolIds ? poolInfos.filter((pool) => myPoolIds.includes(pool.id)) : [])
        break
      default:
        setFilteredPoolInfos(poolInfos ? poolInfos.filter((pool) => pool.status === PoolStatus.CONTRIBUTING) : [])
        break
    }
  }, [location.pathname, poolInfos, myPoolIds])

  return (
    <Box>
      <Banner>
        <Box>{t('Real estate')}</Box>
      </Banner>
      <Filters>
        <TabButtons />
      </Filters>
      <CardWrapper>
        {filteredPoolInfos &&
          filteredPoolInfos.map((poolInfo, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <ContributePoolCard key={index} id={index} poolInfo={poolInfo} />
          ))}
      </CardWrapper>
    </Box>
  )
}
