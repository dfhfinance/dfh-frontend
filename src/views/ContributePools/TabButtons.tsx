import React from 'react'
import styled from 'styled-components'
import { Link, useLocation, useRouteMatch } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@dfh-finance/uikit'
import { useTranslation } from 'contexts/Localization'

const TabButtons: React.FC = () => {
  const { url } = useRouteMatch()
  const location = useLocation()
  const { t } = useTranslation()

  let activeIndex
  switch (location.pathname) {
    case '/pools':
      activeIndex = 0
      break
    case '/pools/end-contribution':
      activeIndex = 1
      break
    case '/pools/closed':
      activeIndex = 2
      break
    case '/pools/my-pools':
      activeIndex = 3
      break
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
        <ButtonMenuItem as={Link} to={`${url}`}>
          {t('Live')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/end-contribution`}>
          {t('Finished')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/closed`}>
          {t('Closed')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
  )
}

export default TabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`
