import React from 'react'
import { Box } from '@dfh-finance/uikit'
import styled from 'styled-components'
import RealEstateCard from 'views/RealEstatePools/RealEstateCard'

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

const RealEstatePool: React.FC = () => {
  return (
    <Container>
      <RealEstateCard />
      <RealEstateCard />
      <RealEstateCard />
      <RealEstateCard />
      <RealEstateCard />
    </Container>
  )
}

export default RealEstatePool
