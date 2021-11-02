import { Flex } from '@dfh-finance/uikit'
import { PageMeta } from 'components/Layout/Page'
import React from 'react'
import styled from 'styled-components'

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 16px 16px 0 16px;
  min-height: calc(100vh - 56px - 66px);

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px 24px 0 24px;
    min-height: calc(100vh - 56px);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
  }
`

const Page: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>
        {children}
        <Flex flexGrow={1} />
      </StyledPage>
    </>
  )
}

export default Page
