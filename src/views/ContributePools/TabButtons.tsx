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
    case '/pools/finished':
      activeIndex = 1
      break
    case '/pools/my-pools':
      activeIndex = 2
      break
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
        <ButtonMenuItem as={Link} to={`${url}`} style={{ textAlign: 'center' }}>
          {t('Live')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/finished`} style={{ textAlign: 'center' }}>
          {t('Finished')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/my-pools`} style={{ textAlign: 'center' }}>
          {t('Staked')}
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
