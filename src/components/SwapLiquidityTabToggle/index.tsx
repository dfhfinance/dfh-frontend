import React from 'react'
import { Button } from '@dfh-finance/uikit'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { useTranslation } from '../../contexts/Localization'

const StyledButton = styled(Button)`
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 150px;
  }
`

const SwapLiquidityTabToggle: React.FC = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const history = useHistory()

  const activeTabIndex = pathname.startsWith('/swap')
    ? 0
    : ['/liquidity', '/add', '/remove', '/find'].findIndex((path) => pathname.startsWith(path)) !== -1
    ? 1
    : undefined

  if (activeTabIndex === undefined) {
    return null
  }

  const inactiveTabStyle = { background: 'transparent', boxShadow: 'none' }

  return (
    <div style={{ marginBottom: '20px', background: 'white', borderRadius: '16px' }}>
      <StyledButton style={activeTabIndex === 0 ? undefined : inactiveTabStyle} onClick={() => history.push('/swap')}>
        {t('Swap')}
      </StyledButton>
      <StyledButton
        style={activeTabIndex === 1 ? undefined : inactiveTabStyle}
        onClick={() => history.push('/liquidity')}
      >
        {t('Liquidity')}
      </StyledButton>
    </div>
  )
}

export default SwapLiquidityTabToggle
